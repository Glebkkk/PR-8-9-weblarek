import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';


interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}


export class Page extends Component<IPage> {
  protected wrapper: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;
  protected gallery: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.wrapper = ensureElement<HTMLElement>('.page__wrapper', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', this.container);
    this.gallery = ensureElement<HTMLElement>('.gallery', this.container);
    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }

  set catalog(items: HTMLElement[]) {
    this.gallery.replaceChildren(...items);
  }

  set locked(value: boolean) {
    this.wrapper.classList.toggle('page__wrapper_locked', value);
  }
}