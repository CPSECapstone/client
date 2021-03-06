import { createElement } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Canvas } from './canvas';
import propTypes from 'prop-types';

/**
 * @typedef DoodleCanvasProps
 * @prop {string} tool - The name of the tool that is being used. One of {'pen'|'eraser'}.
 * @prop {number} size - The size of the brush.
 * @prop {boolean} active - Whether the canvas can be doodled on at this time
 * @prop {string} color - The color of the brush
 * @prop {HTMLElement} attachedElement - Which element the DoodleCanvas should cover.
 * @prop {Array<import('../types/api').DoodleLine>} lines - An array of lines that compose this doodle.
 * @prop {(lines: import('../types/api').DoodleLine[]) => void} setLines - A function to set the lines
 * @prop {() => void} onUndo - a function called when undo key commands pressed
 * @prop {() => void} onRedo - a function called when redo key commands pressed
 */

/**
 * Component that renders a canvas for users to draw Doodles on.
 *
 * @param {DoodleCanvasProps} props
 */
const DoodleCanvas = ({
  tool,
  size,
  active,
  color,
  attachedElement,
  lines,
  setLines,
  onUndo,
  onRedo,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [everActive, setEverActive] = useState(false);

  if (active && !everActive) {
    setEverActive(true);
  }

  useEffect(() => {
    const KEY_UNDO = 90; // Code for "Z" key
    const KEY_REDO = 89; // Code for "Y" key
    if (!active) {
      return () => {};
    }
    const listener = e => {
      const key = e.charCode || e.keyCode;
      if (e.ctrlKey) {
        if (key === KEY_UNDO) {
          onUndo();
        } else if (key === KEY_REDO) {
          onRedo();
        }
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [active, onUndo, onRedo]);
  useEffect(() => {
    if (lines.length === 0) {
      return () => {};
    }
    const warn = e => {
      e = e || window.event;

      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', warn);
    return () => {
      window.removeEventListener('beforeunload', warn);
    };
  }, [lines.length]);

  const handleMouseDown = e => {
    setIsDrawing(true);
    setLines([
      {
        tool: tool,
        color: color,
        size: size,
        elem: {
          path: '',
          height: 0,
          width: 0,
        },
        points: [[e.offsetX, e.offsetY]],
      },
      ...lines,
    ]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  const handleMouseMove = e => {
    //if not drawing, do nothing
    if (!isDrawing) {
      return;
    }

    //add to the first line
    const [curLine, ...rest] = lines;
    const xPos = e.offsetX;
    const yPos = e.offsetY;

    /** @type {import('../types/annotator').DoodleLine} */
    const newLine = {
      ...curLine,
      points: [[xPos, yPos], ...curLine.points],
    };

    setLines([newLine, ...rest]);
  };

  if (!everActive) {
    return null;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: attachedElement.getBoundingClientRect().top + window.scrollY,
        left: attachedElement.getBoundingClientRect().left + window.scrollX,
        zIndex: 9999, //Need the doodle canvas to be on top of any website content
        backgroundColor: active ? 'rgba(0, 0, 0, 0.2)' : undefined,
        pointerEvents: active ? undefined : 'none',
      }}
    >
      <Canvas
        width={attachedElement.getBoundingClientRect().width}
        height={
          Math.min(
            attachedElement.getBoundingClientRect().height,
            10000
          ) /*Canvas starts to lag over 10k, doesnt work over 32k*/
        }
        handleMouseDown={handleMouseDown}
        handleMouseUp={handleMouseUp}
        handleMouseLeave={handleMouseLeave}
        handleMouseMove={handleMouseMove}
        className={'size' + size}
        doodles={[{ $tag: 'none', lines: lines }]}
        handleDoodleClick={() => {}}
      />
    </div>
  );
};

DoodleCanvas.propTypes = {
  tool: propTypes.string.isRequired,
  size: propTypes.number.isRequired,
  active: propTypes.bool.isRequired,
  color: propTypes.string.isRequired,
  lines: propTypes.array.isRequired,
  setLines: propTypes.func.isRequired,
  attachedElement: propTypes.any.isRequired,
  onUndo: propTypes.func.isRequired,
  onRedo: propTypes.func.isRequired,
};

export { DoodleCanvas };
