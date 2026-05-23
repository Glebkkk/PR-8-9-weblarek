import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export type TForm = {
  valid?: boolean;
  errors?: string;
};

export abstract class Form<T extends TForm> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', container);

    container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.onSubmit();
    });

    container.addEventListener('input', (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.name) {
        this.onInputChange(target.name, target.value);
      }
    });
  }

  protected onSubmit(): void {
    this.events.emit('form:submit');
  }

  onInputChange(field: string, value: string): void {
    this.events.emit('form:change', { field, value });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
