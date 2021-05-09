import { render, createElement, Fragment } from 'preact';
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
    render(
      <Fragment>
        <DoodleCanvas
          attachedElement={this._container}
          size={this._size}
          tool={this._tool}
          active={this._doodleable}
          lines={this.newLines}
          setLines={setLines}
        />
        <DisplayCanvas lines={this.savedLines} container={this._container} />
      </Fragment>,
      this.target
    );
  }
}
