import { render, createElement, Fragment } from 'preact';
import { DisplayCanvas } from './displayCanvas';
import { DoodleCanvas } from './doodleCanvas';

export class DoodleController {
  /**
   * @param {HTMLElement | null} container - Element into which the toolbar is rendered
   * @param {any} options
   */
  constructor(container, options, handleDoodleClick) {
    const { tool, size, color } = options;
    /** @type {import('../types/api').DoodleLine[]} */

    this._lines = [];
    /** @type {import('../types/api').Doodle[]} */

    this._savedDoodles = [];
    /** @type {import('../types/api').DoodleLine[]} */
    this._newLines = [];
    /** @type {import('../types/api').DoodleLine[]} */

    this._redoLines = [];

    this.container = container === null ? document.body : container;
    this._tool = tool;
    this._size = size;
    this._color = color;

    this._doodleable = false;
    this._handleDoodleClick = handleDoodleClick;
    this._showDoodles = false;

    // create a new element to render into, to avoid overwriting the main page content.
    this.target = document.body.appendChild(document.createElement('div'));

    this.render();
  }

  /**
   * Re-render whenver doodle visibility changes
   */
  set showDoodles(shouldShowDoodles) {
    this._showDoodles = shouldShowDoodles;
    this.render();
  }
  get showDoodles() {
    return this._showDoodles;
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
  set savedDoodles(lines) {
    this._savedDoodles = lines;
    this.render();
  }

  get savedDoodles() {
    return this._savedDoodles;
  }

  set newLines(lines) {
    this._newLines = lines;
    this._redoLines = []; // Clear redo queue when doodle changes
    this.render();
  }

  get newLines() {
    return this._newLines;
  }

  set size(newSize) {
    this._size = newSize;
    this.render();
  }

  set color(newColor) {
    this._color = newColor;
    this.render();
  }

  get color() {
    return this._color;
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

  undo() {
    if (this._newLines.length) {
      // @ts-ignore shift won't return undefined due to length check
      this._redoLines.push(this._newLines.shift());
      this.render();
    }
  }
  redo() {
    if (this._redoLines.length) {
      // @ts-ignore pop won't return undefined due to length check
      this._newLines = [this._redoLines.pop(), ...this._newLines];
      this.render();
    }
  }

  render() {
    const setLines = lines => {
      this.newLines = lines;
    };
    render(
      <Fragment>
        <DoodleCanvas
          attachedElement={this.container}
          size={this._size}
          tool={this._tool}
          active={this._doodleable}
          lines={this.newLines}
          setLines={setLines}
          color={this._color}
          onUndo={this.undo.bind(this)}
          onRedo={this.redo.bind(this)}
        />
        <DisplayCanvas
          handleDoodleClick={this._handleDoodleClick}
          doodles={this.savedDoodles}
          container={this.container}
          showDoodles={this._showDoodles}
        />
      </Fragment>,
      this.target
    );
  }
}
