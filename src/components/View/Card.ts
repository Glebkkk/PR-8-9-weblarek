import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export type TCard = {
  id?: string;
  title?: string;
  price?: number | null;
}

export abstract class Card<T extends TCard> extends Component<T> {
  protected _id: string = '';
  protected titleElement: HTMLElement;
  protected pricElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container)

    this.titleElement = ensureElement<HTMLElement>('.card__title', container);
    this.pricElement = ensureElement<HTMLElement>('.card__price', container);
  }

  set id(value: string) {
    this._id = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.pricElement.textContent = value === null ? 'Бесценно' : `${value} синапсов`
  }
}