import { Card, TCard } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

type TPreviewCard = TCard & {
  category?: string;
  image?: string;
  description?: string;
};

type TPreviewCardActions = {
  onAddToBasket: () => void;
};

export class PreviewCard extends Card<TPreviewCard> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, actions: TPreviewCardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', container);
    this.button = ensureElement<HTMLButtonElement>('.card__button', container);

    this.button.addEventListener('click', () => {
      actions.onAddToBasket();
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

  set price(value: number | null) {
    super.price = value;
    this.button.disabled = value === null;
  }
}
