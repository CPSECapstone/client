import { render, createElement } from 'preact';
import { DisplayCanvas } from './displayCanvas';
import { DoodleCanvas } from './doodleCanvas';

export class DoodleController {
  /**
   * @param {HTMLElement | null} container - Element into which the toolbar is rendered
   * @param {any} options
   */
  constructor(container, options) {
    const { tool, size } = options;
    this._lines = [];
    this._savedLines = [];
    this._newLines = [];

    this._container = container === null ? document.body : container;
    this._tool = tool;
    this._size = size;

    this._doodleable = false;
    this._canDisplay = false;

    // create a new element to render into, to avoid overwriting the main page content.
    this.target = document.body.appendChild(document.createElement('div'));

    this.render();
  }

  /**
   * Update the toolbar to reflect whether the sidebar is open or not.
   */
  set tool(toolType) {
    this._tool = toolType;
    this.render();
  }

  get tool() {
    return this._tool;
  }

  /**
   * canDisplay starts as false in order to prevent the weird canvas rendering issues that happen when canvasses are rendered right at the beginning
   */

  set canDisplay(cd) {
    this._canDisplay = cd;
    this.render();
  }

  get canDisplay() {
    return this._canDisplay;
  }

  /**
   * Update the lines and re-render on change
   */
  set savedLines(lines) {
    this._savedLines = lines;
    this.render();
  }

  get savedLines() {
    return this._savedLines;
  }

  set newLines(lines) {
    this._newLines = lines;
    this.render();
  }

  get newLines() {
    return this._newLines;
  }

  /**
   * Update the toolbar to reflect whether the "Create annotation" button will
   * create a page note (if there is no selection) or an annotation (if there is
   * a selection).
   */
  set size(newSize) {
    this._size = newSize;
    this.render();
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
    const setLines = lines => {
      this.newLines = lines;
    };
    // if doodleable, render a doodleCanvas with only the newLines
    if (this._doodleable) {
      render(
        <DoodleCanvas
          attachedElement={this._container}
          size={this._size}
          tool={this._tool}
          active={this._doodleable}
          lines={this.newLines}
          setLines={setLines}
        />,
        this.target
      );
    }
    // if not doodleable, render a regular canvas with BOTH the newLines and the savedLines
    else if (this._canDisplay) {
      const combinedLines = [...this._newLines, ...this._savedLines];
      render(
        <DisplayCanvas lines={combinedLines} container={this._container} />,
        this.target
      );
    }
  }
}
