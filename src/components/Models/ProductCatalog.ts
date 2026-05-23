import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

// Класс отвечает за хранение товаров, полученных с сервера, и за хранение товара, выбранного пользователем для подробного просмотра.

export class ProductCatalog {
  private items: IProduct[] = [];
  private preview: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('items:change', { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProduct(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

  setPreview(product: IProduct): void {
    this.preview = product;
    this.events.emit('preview:change', { preview: this.preview });
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}
