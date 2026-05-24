import { Component } from '../base/Component';

type TGallery = {
  items?: HTMLElement[];
};

export class Gallery extends Component<TGallery> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}
