import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';


interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;
  
  constructor(container: HTMLElement, onClose: () => void) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton.addEventListener('click', () => {
      this.close();
      onClose();
    });
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  render(data?: Partial<IModal>): HTMLElement {
  super.render(data);
  this.open();
  return this.container;
  }

}
  