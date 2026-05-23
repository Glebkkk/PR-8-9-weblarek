import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekApi } from './components/Communication/LarekApi';
import { EventEmitter } from './components/base/Events';
import { Page } from './components/View/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/View/Modal';
import { CatalogCard } from './components/View/CatalogCard';
import { PreviewCard } from './components/View/PreviewCard';
import { Basket } from './components/View/Basket';
import { BasketCard } from './components/View/BasketCard';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';
import { IOrder, IProduct, TPayment } from './types';

type ModalScreen = 'none' | 'preview' | 'basket' | 'order' | 'contacts' | 'success';

const events = new EventEmitter();
const catalog = new ProductCatalog(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

let modalScreen: ModalScreen = 'none';

function renderCatalog() {
  const cards = catalog.getItems().map((item) => {
    const card = new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), events);
    return card.render({
      id: item.id,
      title: item.title,
      category: item.category,
      image: item.image,
      price: item.price,
    });
  });

  page.render({ catalog: cards, counter: basket.getCount() });
}

function renderPreview(product: IProduct) {
  modalScreen = 'preview';

  const preview = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), events);
  const content = preview.render({
    id: product.id,
    title: product.title,
    category: product.category,
    image: product.image,
    description: product.description,
    price: product.price,
    inBasket: basket.hasItem(product.id),
  });

  modal.render({ content });
}

function renderBasket() {
  modalScreen = 'basket';

  const items = basket.getItems();
  const cards = items.map((item, index) => {
    const card = new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), events);
    return card.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
  const content = basketView.render({
    items: cards,
    total: basket.getTotal(),
    valid: items.length > 0,
  });

  modal.render({ content });
}

function getOrderStepErrors(): string {
  const errors = order.validate();
  return [errors.payment, errors.address].filter(Boolean).join('. ');
}

function isOrderStepValid(): boolean {
  const errors = order.validate();
  return !errors.payment && !errors.address;
}

function getContactsStepErrors(): string {
  const errors = order.validate();
  return [errors.email, errors.phone].filter(Boolean).join('. ');
}

function isContactsStepValid(): boolean {
  const errors = order.validate();
  return !errors.email && !errors.phone;
}

function renderOrderForm() {
  modalScreen = 'order';

  const data = order.getData();
  const form = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
  const content = form.render({
    payment: data?.payment ?? null,
    address: data?.address ?? '',
    valid: isOrderStepValid(),
    errors: getOrderStepErrors(),
  });

  modal.render({ content });
}

function renderContactsForm() {
  modalScreen = 'contacts';

  const data = order.getData();
  const form = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
  const content = form.render({
    email: data?.email ?? '',
    phone: data?.phone ?? '',
    valid: isContactsStepValid(),
    errors: getContactsStepErrors(),
  });

  modal.render({ content });
}

function renderSuccess(total: number) {
  modalScreen = 'success';

  const success = new Success(cloneTemplate<HTMLElement>('#success'), events);
  const content = success.render({ total });
  modal.render({ content });
}

// --- Презентер: обработчики событий моделей ---

events.on('items:change', () => {
  renderCatalog();
});

events.on('preview:change', ({ preview }: { preview: IProduct | null }) => {
  if (preview) {
    renderPreview(preview);
  }
});

events.on('basket:change', () => {
  page.render({ counter: basket.getCount() });

  if (modalScreen === 'basket') {
    renderBasket();
  }

  if (modalScreen === 'preview') {
    const preview = catalog.getPreview();
    if (preview) {
      renderPreview(preview);
    }
  }
});

events.on('buyer:change', () => {
  if (modalScreen === 'order') {
    renderOrderForm();
  }

  if (modalScreen === 'contacts') {
    renderContactsForm();
  }
});

// --- Презентер: обработчики событий представления ---

events.on('card:select', ({ id }: { id: string }) => {
  const product = catalog.getProduct(id);
  if (product) {
    catalog.setPreview(product);
  }
});

events.on('basket:add', ({ id }: { id: string }) => {
  const product = catalog.getProduct(id);
  if (!product || product.price === null) return;

  basket.addItem(product);
});

events.on('basket:remove', ({ id }: { id: string }) => {
  basket.removeItem(id);
});

events.on('basket:open', () => {
  renderBasket();
});

events.on('order:open', () => {
  renderOrderForm();
});

events.on('order:change', ({ field, value }: { field: string; value: string }) => {
  if (field === 'payment') {
    order.setData({ payment: value as TPayment });
  } else {
    order.setData({ [field]: value });
  }
});

events.on('order:submit', () => {
  if (!isOrderStepValid()) {
    renderOrderForm();
    return;
  }

  renderContactsForm();
});

events.on('contacts:change', ({ field, value }: { field: string; value: string }) => {
  order.setData({ [field]: value });
});

events.on('contacts:submit', () => {
  const errors = order.validate();
  if (Object.keys(errors).length > 0) {
    renderContactsForm();
    return;
  }

  const buyer = order.getData();
  if (!buyer?.payment) return;

  const orderData: IOrder = {
    payment: buyer.payment,
    email: buyer.email,
    phone: buyer.phone,
    address: buyer.address,
    total: basket.getTotal(),
    items: basket.getItems().map((item) => item.id),
  };

  larekApi
    .createOrder(orderData)
    .then((result) => {
      basket.clear();
      order.clear();
      renderSuccess(result.total);
    })
    .catch((error) => {
      console.error('Ошибка оформления заказа:', error);
    });
});

events.on('success:close', () => {
  modal.close();
});

// --- Презентер: события модального окна ---

events.on('modal:open', () => {
  page.render({ locked: true });
});

events.on('modal:close', () => {
  modalScreen = 'none';
  page.render({ locked: false });
});

// --- Загрузка данных ---

larekApi
  .getProducts()
  .then((data) => {
    catalog.setItems(data.items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });
