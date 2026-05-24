import './scss/styles.scss';

import { ProductCatalog } from './components/Models/ProductCatalog';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekApi } from './components/Communication/LarekApi';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
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


const events = new EventEmitter();
const catalog = new ProductCatalog(events);
const basket = new BasketModel(events);
const order = new OrderModel(events);

const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const header = new Header(ensureElement<HTMLElement>('.header'), {
  onBasketOpen: () => events.emit('basket:open'),
});
const gallery = new Gallery(ensureElement<HTMLElement>('.gallery'));
const pageWrapper = ensureElement<HTMLElement>('.page__wrapper');
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), handleModalClose);
const preview = new PreviewCard(cloneTemplate<HTMLElement>('#card-preview'), {
  onAddToBasket: () => {
    const product = catalog.getPreview();
    if (product) {
      events.emit('basket:add', { id: product.id });
    }
  },
});
const basketView = new Basket(cloneTemplate<HTMLElement>('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const success = new Success(cloneTemplate<HTMLElement>('#success'), events);

function handleModalClose() {
  pageWrapper.classList.remove('page__wrapper_locked');
}

function renderModal(content: HTMLElement) {
  modal.render({ content });
  pageWrapper.classList.add('page__wrapper_locked');
}

function closeModal() {
  modal.close();
  handleModalClose();
}

function renderCatalog() {
  const cards = catalog.getItems().map((item) => {
    const card = new CatalogCard(cloneTemplate<HTMLElement>('#card-catalog'), {
      onSelect: () => events.emit('card:select', { id: item.id }),
    });
    return card.render({
      title: item.title,
      category: item.category,
      image: item.image,
      price: item.price,
    });
  });

  gallery.render({ items: cards });
  header.render({ counter: basket.getCount() });
}

function renderPreview(product: IProduct) {
  const content = preview.render({
    title: product.title,
    category: product.category,
    image: product.image,
    description: product.description,
    price: product.price,
  });

  renderModal(content);
}

function renderBasket() {
  const items = basket.getItems();
  const cards = items.map((item, index) => {
    const card = new BasketCard(cloneTemplate<HTMLElement>('#card-basket'), {
      onRemove: () => events.emit('basket:remove', { id: item.id }),
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  return basketView.render({
    items: cards,
    total: basket.getTotal(),
    valid: items.length > 0,
  });
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
  const data = order.getData();
  return orderForm.render({
    payment: data.payment,
    address: data.address,
    valid: isOrderStepValid(),
    errors: getOrderStepErrors(),
  });
}

function renderContactsForm() {
  const data = order.getData();
  return contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: isContactsStepValid(),
    errors: getContactsStepErrors(),
  });
}

function renderSuccess(total: number) {
  const content = success.render({ total });
  renderModal(content);
}

// --- Презентер: обработчики событий моделей ---

events.on('items:change', () => {
  renderCatalog();
});

events.on('preview:change', () => {
  const preview = catalog.getPreview();
  if (preview) {
    renderPreview(preview);
  }
});

events.on('basket:change', () => {
  header.render({ counter: basket.getCount() });
  renderBasket();
});

events.on('buyer:change', () => {
  renderOrderForm();
  renderContactsForm();
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
  renderModal(basketView.render());
});

events.on('order:open', () => {
  renderModal(renderOrderForm());
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

  renderModal(renderContactsForm());
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
  if (!buyer.payment) return;

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
  closeModal();
});

renderBasket();

// --- Загрузка данных ---

larekApi
  .getProducts()
  .then((data) => {
    catalog.setItems(data.items);
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });
