import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

// Класс отвечает за хранение товаров, которые пользователь добавил в корзину, и за вычисление данных, связанных с корзиной.

export class BasketModel {
  private items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (this.hasItem(product.id)) {
      return;
    }

    this.items.push(product);
    this.events.emit('basket:change');
  }

  removeItem(id: string): void {
    this.items = this.items.filter((item) => item.id !== id);
    this.events.emit('basket:change');
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:change');
  }

  getTotal(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price ?? 0);
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
