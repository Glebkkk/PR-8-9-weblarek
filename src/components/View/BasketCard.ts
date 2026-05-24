import { Card, TCard } from './Card';
import { ensureElement } from '../../utils/utils';

type TBasketCard = TCard & {
  index?: number;
};

type TBasketCardActions = {
  onRemove: () => void;
};

export class BasketCard extends Card<TBasketCard> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: TBasketCardActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

    this.deleteButton.addEventListener('click', () => {
      actions.onRemove();
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
