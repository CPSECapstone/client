import { render, createElement } from 'preact';
import { useState, useEffect} from 'preact/hooks';
import {Canvas} from './konvaFuncs';


const DoodleCanvas = ({tool, size, active, attachedElement}) => {
    //TODO: set up lines so that they scroll into and out of view using window scroll and offset coordinates

    const [lines, setLines] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);


    const handleMouseDown = e => {
        setIsDrawing(true);
        // TODO remove below line, just for testing without adding a button.
        const curTool = lines.length % 2 == 0 ? 'eraser' : 'pen';
        // TODO why is it ignoring color?
        setLines([{
            tool: curTool, 
            color: 'red', 
            points: [[e.offsetX, e.offsetY]]
        }, ...lines]);
    }

    const handleMouseUp = e => {
        setIsDrawing(false);
    }

    const handleMouseLeave = e => {
        setIsDrawing(false);
    }

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
            color: curLine.color
        }

        setLines([newLine, ...rest]);
    }



    if (!active) {
        return null;
    }

    return (
        <div style={{
            position: "absolute",
            top: attachedElement.getBoundingClientRect().top + window.scrollY,
            left: attachedElement.getBoundingClientRect().left + window.scrollX,
            backgroundColor: active ? "rgba(0, 0, 0, 0.2)" : undefined,
            pointerEvents: active ? undefined : "none"
        }}>
            <Canvas 
            width={attachedElement.getBoundingClientRect().width}
            height={10000}//{attachedElement.getBoundingClientRect().height}
            handleMouseDown={handleMouseDown}
            handleMouseUp={handleMouseUp}
            handleMouseLeave={handleMouseLeave}
            handleMouseMove={handleMouseMove}
            lines={lines}
            ></Canvas>
        </div>
    );
};



export {DoodleCanvas}