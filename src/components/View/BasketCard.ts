import { Card, TCard } from './Card';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type TBasketCard = TCard & {
  index?: number;
};

export class BasketCard extends Card<TBasketCard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this._id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
