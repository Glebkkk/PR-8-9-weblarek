import { Form, TForm } from './Form';
import { TPayment } from '../../types';
import { IEvents } from '../base/Events';
import { ensureAllElements, ensureElement } from '../../utils/utils';

type TOrderForm = TForm & {
  payment?: TPayment | null;
  address?: string;
};

export class OrderForm extends Form<TOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);

    this.paymentButtons.forEach((button) => {
      button.addEventListener('click', () => {
        this.events.emit('order:change', { field: 'payment', value: button.name });
      });
    });
  }

  protected onSubmit(): void {
    this.events.emit('order:submit');
  }

  onInputChange(field: string, value: string): void {
    this.events.emit('order:change', { field, value });
  }

  set payment(value: TPayment | null) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle('button_alt-active', button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
