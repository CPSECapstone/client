import { render, createElement } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { Canvas } from './canvas';

const DoodleCanvas = ({ tool, size, active, attachedElement }) => {
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = e => {
    setIsDrawing(true);
    setLines([
      {
        tool: 'pen',
        color: 'red',
        points: [[e.offsetX, e.offsetY]],
      },
      ...lines,
    ]);
  };

  const handleMouseUp = e => {
    setIsDrawing(false);
  };

  const handleMouseLeave = e => {
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

    const newLine = {
      tool: curLine.tool,
      points: [[xPos, yPos], ...curLine.points],
      color: curLine.color,
    };

    setLines([newLine, ...rest]);
  };

  if (!active) {
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
        lines={lines}
      ></Canvas>
    </div>
  );
};

export { DoodleCanvas };
