import { createElement } from 'preact';
import { Canvas } from './canvas';
import propTypes from 'prop-types';
/**
 * @typedef DisplayCanvasProps
 * @prop {HTMLElement} container - Which element the DisplayCanvas should cover.
 * @prop {Array<import('../types/api').Doodle>} doodles - An array of Doodles to render
 */

/**
 * Component that renders saved Doodle annotations
 *
 * @param {DisplayCanvasProps} props
 */
const DisplayCanvas = ({ container, doodles }) => {
  const boundingRect = container.getBoundingClientRect();
  return (
    <div
      style={{
        position: 'absolute',
        top: boundingRect.top + window.scrollY,
        left: boundingRect.left + window.scrollX,
        zIndex: 9998,
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
        doodles={doodles}
      />
    </div>
  );
};

DisplayCanvas.propTypes = {
  doodles: propTypes.array.isRequired,
  container: propTypes.object.isRequired,
};

export { DisplayCanvas };
