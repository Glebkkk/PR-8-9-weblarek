import { Card, TCard } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

type TCatalogCard = TCard & {
  category?: string;
  image?: string;
};

export class CatalogCard extends Card<TCatalogCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this._id });
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
}
