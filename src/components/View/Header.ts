import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

type THeader = {
  counter?: number;
};

type THeaderActions = {
  onBasketOpen: () => void;
};

export class Header extends Component<THeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, actions: THeaderActions) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
    this.counterElement = ensureElement<HTMLElement>('.header__basket-counter', container);

    this.basketButton.addEventListener('click', () => {
      actions.onBasketOpen();
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }
}
