import { render, createElement } from 'preact';
import { Canvas } from './canvas';

export class DisplayController {
  /**
   * @param {HTMLElement | null} container - Element into which the toolbar is rendered
   */
  constructor(container) {
    this._lines = [];

    this._container = container === null ? document.body : container;
    this.render();
  }

  /**
   * Update the lines and re-render on change
   */
  set lines(newLines) {
    this._lines = newLines;
    this.render();
  }

  get lines() {
    return this._lines;
  }

  render() {
    const boundingRect = this._container.getBoundingClientRect();
    render(
      <div
        className="displayController"
        style={{
          position: 'absolute',
          top: boundingRect.top + window.scrollY,
          left: boundingRect.left + window.scrollX,
          zIndex: 9998, // on top of everything except the DoodleCanvas
          backgroundColor: 'rgba(0, 255, 255, 0.2)',
          pointerEvents: 'none',
        }}
      >
        <Canvas
          width={boundingRect.width}
          height={
            Math.min(
              boundingRect.height,
              10000
            ) /*Canvas starts to lag over 10k, doesnt work over 32k*/
          }
          handleMouseDown={() => {}}
          handleMouseUp={() => {}}
          handleMouseLeave={() => {}}
          handleMouseMove={() => {}}
          lines={this._lines}
        />
      </div>,
      document.body
      //NOTE: Left off here. having two nodes render into document.body is overwriting the existing nodes.
      //This means that the static display canvas is being overwritten by the doodlevancas, and isn't recoverable.
      //IDEAS:
      // * refactor doodleController and displayController into 1 controller class that either displays the doodle canvas or the display canvas, depending
      //   on what the user has selected.
      // * inject 2 elements into the html - one for the doodleCanvas and one for the displayCanvas
      // * ORRRR we could have 2 lists of lines in the doodleController, one for display and one for actively doodling. Then we could switch between combinations of them!
    );
  }
}

//   <DoodleCanvas
//     attachedElement={this._container}
//     size={this._size}
//     tool={this._tool}
//     active={this._doodleable}
//     lines={this._lines}
//     setLines={setLines}
//   />,
//   document.body
