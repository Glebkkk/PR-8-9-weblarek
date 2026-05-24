import { IBuyer, TPayment, IBuyerErrors } from '../../types';
import { IEvents } from '../base/Events';

// Класс отвечает за хранение данных покупателя, которые пользователь указывает при оформлении заказа, и за их валидацию.

export class OrderModel {
  private payment: TPayment | null = null;
  private address: string = '';
  private email: string = '';
  private phone: string = '';

  constructor(protected events: IEvents) {}

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    this.events.emit('buyer:change');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';

    this.events.emit('buyer:change');
  }

  validate(): IBuyerErrors {
    const errors: IBuyerErrors = {};

    if (!this.payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this.address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    if (!this.email.trim()) {
      errors.email = 'Поле email не заполнено';
    }

    if (!this.phone.trim()) {
      errors.phone = 'Поле телефон не заполнено';
    }

    return errors;
  }
}
