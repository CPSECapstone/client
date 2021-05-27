import { createElement } from 'preact';
import { Canvas } from './canvas';
import propTypes from 'prop-types';
/**
 * @typedef DisplayCanvasProps
 * @prop {HTMLElement} container - Which element the DisplayCanvas should cover.
 * @prop {Array<import('../types/api').Doodle>} doodles - An array of Doodles to render
 * @prop {Boolean} showDoodles - An array of Doodles to render
 * @prop {(String) => any} handleDoodleClick - What to do when a doodle is clicked? Accepts the Doodle's `tag` as a prop
 */

/**
 * Component that renders saved Doodle annotations
 *
 * @param {DisplayCanvasProps} props
 */
const DisplayCanvas = ({
  container,
  doodles,
  handleDoodleClick,
  showDoodles,
}) => {
  const boundingRect = container.getBoundingClientRect();
  return (
    <div
      style={{
        position: 'absolute',
        top: boundingRect.top + window.scrollY,
        left: boundingRect.left + window.scrollX,
        zIndex: 9998,
        pointerEvents: 'none',
        display: showDoodles ? undefined : 'none',
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
        handleDoodleClick={handleDoodleClick}
      />
    </div>
  );
};

DisplayCanvas.propTypes = {
  doodles: propTypes.array.isRequired,
  container: propTypes.object.isRequired,
  handleDoodleClick: propTypes.func.isRequired,
  showDoodles: propTypes.bool.isRequired,
};

export { DisplayCanvas };
