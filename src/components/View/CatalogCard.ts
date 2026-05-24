import { Card, TCard } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

type TCatalogCard = TCard & {
  category?: string;
  image?: string;
};

type TCatalogCardActions = {
  onSelect: () => void;
};

export class CatalogCard extends Card<TCatalogCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: TCatalogCardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);

    this.container.addEventListener('click', () => {
      actions.onSelect();
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
