import './scss/styles.scss';

import { apiProducts } from './utils/data';
import { ProductCatalog } from './components/Models/ProductCatalog';
import { BasketModel } from './components/Models/BasketModel';
import { OrderModel } from './components/Models/OrderModel';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekApi } from './components/Communication/LarekApi';


const catalog = new ProductCatalog();

catalog.setItems(apiProducts.items);

console.log("Массив товаров из каталога", catalog.getItems());
console.log("Поиск товара по id:", catalog.getProduct(apiProducts.items[0].id));

catalog.setPreview(apiProducts.items[0]);

console.log("Товар для подробного просмотра:", catalog.getPreview());


const basket = new BasketModel();

basket.addItem(apiProducts.items[0]);
basket.addItem(apiProducts.items[1]);

console.log("Товары в корзине:", basket.getItems());
console.log("Количество товаров в корзине", basket.getCount());
console.log("Общая стоимость корзины", basket.getTotal());
console.log("Есть ли первый товар в корзине", basket.hasItem(apiProducts.items[0].id));

basket.removeItem(apiProducts.items[0].id);

console.log("Есть ли первый товар после удаления:", basket.hasItem(apiProducts.items[0].id));


console.log("Корзина после удаления первого товара:", basket.getItems());

basket.clear();

console.log("Корзина после очистки:", basket.getItems());


const order = new OrderModel();

console.log("Ошибки пустой формы", order.validate());

order.setData({
  payment: 'card',
  address: 'Санкт-Петербург, пр-кт Большевиков, 1'
});

console.log("Ошибки после заполнения первого шага", order.validate());
console.log("Данные покупателя:", order.getData());

order.setData({
  email: 'test@example.com',
  phone: '+79990000000',
});

console.log("Ошибки после заполнения всех данных:", order.validate());
console.log("Данные покупателя:", order.getData());


order.clear();

console.log("Данные покупателя после очистки:", order.getData());
console.log("Ошибки после очистки:", order.validate());

const api = new Api(API_URL);

const larekApi = new LarekApi(api);


larekApi.getProducts()
  .then((data) => {
    catalog.setItems(data.items);
    console.log("Каталог с сервера:", catalog.getItems());
  })
  .catch((error) => {
    console.error('Ошибка загрузки товаров:', error);
  });