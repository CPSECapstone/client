import { createElement } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

//TODO not sure how to enforce this type...
/**
 * @typedef Line
 * @property {string} tool - The tool used to draw this line.
 * @property {any} points
 */

const Canvas = ({
  width,
  height,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  handleMouseLeave,
  lines,
}) => {
  const canvasRef = useRef(null);

  const drawLine = (ctx, line) => {
    if (line.points.length <= 1) {
      return;
    }
    const [[startX, startY], ...rest] = line.points;
    // Move to the first point, begin the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);

    if (line.tool == 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 5;
      ctx.strokeStyle = line.color;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 25;
    }

    // Draw the rest of the lines
    for (let [x, y] of rest) {
      ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.closePath();
  };

  useEffect(() => {
    // for testing
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draw all of the lines (reverse order so that erasing works)
    for (let i = lines.length - 1; i >= 0; i--) {
      drawLine(ctx, lines[i]);
    }
  }, [lines]);

  return (
    <canvas
      /*style={{width: width, height: height}}*/
      width={width}
      height={height}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export { Canvas };
