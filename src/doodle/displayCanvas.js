import { createElement } from 'preact';
import { Canvas } from './canvas';
import propTypes from 'prop-types';

const DisplayCanvas = ({ container, lines }) => {
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
        lines={lines}
      />
    </div>
  );
};

DisplayCanvas.propTypes = {
  lines: propTypes.array.isRequired,
  container: propTypes.object.isRequired,
};

export { DisplayCanvas };
