import { Form, TForm } from './Form';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type TContactsForm = TForm & {
  email?: string;
  phone?: string;
};

export class ContactsForm extends Form<TContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, 'contacts');

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
