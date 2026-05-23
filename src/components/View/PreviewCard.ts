import { Card, TCard } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type TPreviewCard = TCard & {
  category?: string;
  image?: string;
  description?: string;
  inBasket?: boolean;
};

export class PreviewCard extends Card<TPreviewCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', container);

    this.button.addEventListener('click', () => {
      this.events.emit('basket:add', { id: this._id });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach((className) => {
      this.categoryElement.classList.remove(className);
    });

    const modifier = categoryMap[value as keyof typeof categoryMap];
    if (modifier) {
      this.categoryElement.classList.add(modifier);
    }
  }

  set image(src: string) {
    const alt = this.titleElement.textContent ?? '';
    this.setImage(this.imageElement, `${CDN_URL}${src}`, alt);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    if (value) {
      this.button.textContent = 'В корзине';
      this.button.disabled = true;
    } else {
      this.button.textContent = 'В корзину';
      this.button.disabled = false;
    }
  }
}
