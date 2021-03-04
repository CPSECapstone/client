import { render, createElement } from 'preact';
import { DoodleCanvas } from './doodleCanvas';

export class DoodleController {
  /**
   * @param {HTMLElement} container - Element into which the toolbar is rendered
   * @param {any} options
   */
  constructor(container, options) {
    const { tool, size } = options;

    this._container = container;
    this._tool = tool;
    this._size = size;

    this._doodleable = false;

    this.render();
  }

  /**
   * Update the toolbar to reflect whether the sidebar is open or not.
   */
  set tool(toolType) {
    this._tool = toolType;
  }

  get tool() {
    return this._tool;
  }

  /**
   * Update the toolbar to reflect whether the "Create annotation" button will
   * create a page note (if there is no selection) or an annotation (if there is
   * a selection).
   */
  set size(newSize) {
    this._size = newSize;
  }

  get size() {
    return this._size;
  }

  /**
   * Update the toolbar to reflect whether highlights are currently visible.
   */
  set doodleable(visible) {
    this._doodleable = visible;
    this.render();
  }

  get doodleable() {
    return this._doodleable;
  }

  render() {
    render(
      <DoodleCanvas
        attachedElement={this._container}
        size={this._size}
        tool={this._tool}
        active={this._doodleable}
      />,
      document.body
    );
  }
}
