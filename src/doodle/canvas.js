import { createElement, Fragment } from 'preact';
import { useRef, useEffect } from 'preact/hooks';
import propTypes from 'prop-types';

const Canvas = ({
  width,
  height,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  handleMouseLeave,
  doodles,
  handleDoodleClick,
}) => {
  const canvasRef = useRef(null);
  const hitCanvasRef = useRef(null);

  const drawLine = (ctx, hitctx, line, colorHash) => {
    if (line.points.length <= 1) {
      return;
    }
    const [[startX, startY], ...rest] = line.points;
    // Draw each line twice, once on the visible canvas, once on the 'hit' canvas
    // Move to the first point, begin the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineWidth = line.size;

    if (line.tool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = line.color;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    // Draw the rest of the lines
    for (let [x, y] of rest) {
      ctx.lineTo(x, y);
    }

    ctx.stroke();
    ctx.closePath();

    // now draw the same line, but on our hit canvas
    hitctx.beginPath();
    hitctx.moveTo(startX, startY);
    hitctx.lineWidth = line.size;

    if (line.tool === 'pen') {
      hitctx.globalCompositeOperation = 'source-over';
      hitctx.strokeStyle = colorHash;
    } else {
      hitctx.globalCompositeOperation = 'destination-out';
    }

    // Draw the rest of the lines
    for (let [x, y] of rest) {
      hitctx.lineTo(x, y);
    }

    hitctx.stroke();
    hitctx.closePath();
  };

  const colorToTag = (r, g, b) => {
    const tagNum = ((r << 16) | (g << 8) | b) - 1;
    return `t${tagNum}`;
  };

  const tagToColor = tag => {
    if (tag === 'none') {
      // this is an untagged (in progress) doodle
      return '#000000';
    }
    const tagNum = parseInt(tag.substring(1), 10) + 1;
    return `#${tagNum.toString(16).padStart(6, '0')}`;
  };

  // have to add event listener this way because the canvas has pointerEvents = None
  useEffect(() => {
    const handleClick = e => {
      const canvas = canvasRef.current;
      const hitCanvas = hitCanvasRef.current;
      const hitCtx = hitCanvas.getContext('2d');

      // get the click coordinates
      const boundingBox = canvas.getBoundingClientRect();
      const xPos = e.clientX - boundingBox.left;
      const yPos = e.clientY - boundingBox.top;

      // make sure that this click happened inside the canvas
      if (
        xPos > 0 &&
        xPos < boundingBox.width &&
        yPos > 0 &&
        yPos > boundingBox.height
      ) {
        // get the color of the pixel clicked ony
        const hitColor = hitCtx.getImageData(xPos, yPos, 1, 1).data;
        // convert the color to a tag
        const tag = colorToTag(hitColor[0], hitColor[1], hitColor[2]);
        // call the click function with that tag. We offset tags to colors by 1 so that t-1 means there is no tag.
        if (tag !== 't-1') {
          handleDoodleClick(tag);
        }
      }
    };

    document.addEventListener('click', function (e) {
      handleClick(e);
    });
  }, [handleDoodleClick]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const hitCanvas = hitCanvasRef.current;
    const hitctx = hitCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw all of the doodles
    for (let d = 0; d < doodles.length; d++) {
      const doodle = doodles[d];
      let colorHash = tagToColor(doodle.$tag);
      // Draw all of the lines (reverse order so that erasing works)
      for (let i = doodle.lines.length - 1; i >= 0; i--) {
        drawLine(ctx, hitctx, doodle.lines[i], colorHash);
      }
    }
  }, [doodles]);

  return (
    <Fragment>
      <canvas
        width={width}
        height={height}
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <canvas
        width={width}
        height={height}
        ref={hitCanvasRef}
        style={{ visibility: 'hidden' }}
      />
    </Fragment>
  );
};

Canvas.propTypes = {
  width: propTypes.number.isRequired,
  height: propTypes.number.isRequired,
  handleMouseDown: propTypes.func.isRequired,
  handleMouseUp: propTypes.func.isRequired,
  handleMouseMove: propTypes.func.isRequired,
  handleMouseLeave: propTypes.func.isRequired,
  handleDoodleClick: propTypes.func.isRequired,
  doodles: propTypes.array.isRequired,
};

export { Canvas };
