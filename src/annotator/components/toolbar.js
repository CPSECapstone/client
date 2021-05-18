import { SvgIcon } from '@hypothesis/frontend-shared';
import propTypes from 'prop-types';
import { createElement } from 'preact';
import { useState, useEffect } from 'preact/hooks';

/**
 * @param {Object} props
 *  @param {import("preact").Ref<HTMLButtonElement>} [props.buttonRef]
 *  @param {boolean} [props.expanded]
 *  @param {string} [props.className]
 *  @param {string} props.label
 *  @param {string} props.icon
 *  @param {() => any} props.onClick
 *  @param {boolean} [props.selected]
 */
function ToolbarButton({
  buttonRef,
  expanded,
  className = 'annotator-toolbar-button',
  label,
  icon,
  onClick,
  selected = false,
}) {
  const handleClick = event => {
    // Stop event from propagating up to the document and being treated as a
    // click on document content, causing the sidebar to close.
    event.stopPropagation();
    onClick();
  };

  return (
    <button
      className={className}
      aria-label={label}
      aria-expanded={expanded}
      aria-pressed={selected}
      onClick={handleClick}
      ref={buttonRef}
      title={label}
    >
      <SvgIcon name={icon} />
    </button>
  );
}

ToolbarButton.propTypes = {
  buttonRef: propTypes.any,
  expanded: propTypes.bool,
  className: propTypes.string,
  label: propTypes.string.isRequired,
  icon: propTypes.string.isRequired,
  onClick: propTypes.func.isRequired,
  selected: propTypes.bool,
};

/**
 * @typedef ToolbarProps
 *
 * @prop {() => any} closeSidebar -
 *   Callback for the "Close sidebar" button. This button is only shown when
 *   `useMinimalControls` is true and the sidebar is open.
 * @prop {() => any} createAnnotation -
 *   Callback for the "Create annotation" / "Create page note" button. The type
 *   of annotation depends on whether there is a text selection and is decided
 *   by the caller.
 * @prop {boolean} isSidebarOpen - Is the sidebar currently visible?
 * @prop {'annotation'|'note'} newAnnotationType -
 *   Icon to show on the "Create annotation" button indicating what kind of annotation
 *   will be created.
 * @prop {boolean} showHighlights - Are highlights currently visible in the document?
 * @prop {() => any} toggleHighlights -
 *   Callback to toggle visibility of highlights in the document.
 * @prop {() => any} toggleSidebar -
 *   Callback to toggle the visibility of the sidebar.
 * @prop {(object) => any} setDoodleOptions
 *   Callback to set the options of the doodle canvas
 * @prop {() => any} saveDoodle
 *   Callback to set the options of the doodle canvas
 * @prop {import("preact").Ref<HTMLButtonElement>} [toggleSidebarRef] -
 *   Ref that gets set to the toolbar button for toggling the sidebar.
 *   This is exposed to enable the drag-to-resize functionality of this
 *   button.
 * @prop {boolean} [useMinimalControls] -
 *   If true, all controls are hidden except for the "Close sidebar" button
 *   when the sidebar is open.
 * @prop {boolean} [drawingToolbarActivated]
 *
 * @prop {() => any} drawingToolbarToggle
 */

/**
 * Controls on the edge of the sidebar for opening/closing the sidebar,
 * controlling highlight visibility and creating new page notes.
 *
 * @param {ToolbarProps} props
 */
export default function Toolbar({
  closeSidebar,
  createAnnotation,
  isSidebarOpen,
  newAnnotationType,
  showHighlights,
  toggleHighlights,
  toggleSidebar,
  setDoodleOptions,
  saveDoodle,
  toggleSidebarRef,
  useMinimalControls = false,
  drawingToolbarActivated,
  drawingToolbarToggle,
}) {
  const small = 1;
  const medium = 5;
  const large = 10;

  const [toolSize, setToolSize] = useState(medium);

  const [color, setColor] = useState('red');

  useEffect(() => {
    setDoodleOptions({ tool: 'pen', size: toolSize, color: color });
  }, [toolSize, color, setDoodleOptions]);

  const eraserSmall = 10;
  const eraserMedium = 30;
  const eraserLarge = 60;

  const [eraserSize, setEraserSize] = useState(eraserMedium);

  useEffect(() => {
    setDoodleOptions({ tool: 'eraser', size: eraserSize });
  }, [eraserSize, setDoodleOptions]);

  function setSelected(e, optionalClass = '') {
    let elems = e.target?.parentElement.querySelectorAll(
      '.annotator-toolbar-button' + optionalClass
    );
    [].forEach.call(elems, function (el) {
      //@ts-ignore
      el.classList.remove('selected');
    });
    e.target?.classList.toggle('selected');
  }

  function setPen() {
    setDoodleOptions({ tool: 'pen', size: toolSize, color: color });
  }

  function setEraser() {
    setDoodleOptions({ tool: 'eraser', size: eraserSize, color: color });
  }

  if (!drawingToolbarActivated) {
    return (
      <div>
        {useMinimalControls && isSidebarOpen && (
          <ToolbarButton
            className="annotator-toolbar__sidebar-close"
            label="Close annotation sidebar"
            icon="cancel"
            onClick={closeSidebar}
          />
        )}
        {!useMinimalControls && (
          <ToolbarButton
            className="annotator-toolbar__sidebar-toggle"
            buttonRef={toggleSidebarRef}
            label="Annotation sidebar"
            icon={isSidebarOpen ? 'caret-right' : 'caret-left'}
            expanded={isSidebarOpen}
            onClick={toggleSidebar}
          />
        )}
        {!useMinimalControls && (
          <div className="annotator-toolbar-buttonbar">
            <ToolbarButton
              label="Show highlights"
              icon={showHighlights ? 'show' : 'hide'}
              selected={showHighlights}
              onClick={toggleHighlights}
            />
            <ToolbarButton
              label={
                newAnnotationType === 'note'
                  ? 'New page note'
                  : 'New annotation'
              }
              icon={newAnnotationType === 'note' ? 'note' : 'annotate'}
              onClick={createAnnotation}
            />
            <ToolbarButton
              label="New Doodle"
              icon="doodle"
              onClick={drawingToolbarToggle}
            />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        {useMinimalControls && isSidebarOpen && (
          <ToolbarButton
            className="annotator-toolbar__sidebar-close"
            label="Close annotation sidebar"
            icon="cancel"
            onClick={closeSidebar}
          />
        )}
        {!useMinimalControls && (
          <ToolbarButton
            className="annotator-toolbar__sidebar-toggle"
            buttonRef={toggleSidebarRef}
            label="Annotation sidebar"
            icon={isSidebarOpen ? 'caret-right' : 'caret-left'}
            expanded={isSidebarOpen}
            onClick={toggleSidebar}
          />
        )}
        {!useMinimalControls && (
          <div className="annotator-toolbar-buttonbar">
            <ToolbarButton
              label="Stop doodle"
              icon="close"
              onClick={drawingToolbarToggle}
            />
            <button
              className="popup annotator-toolbar-button 
                toolbar pen selected"
              onClick={e => {
                setPen();
                //@ts-ignore
                e.target?.querySelector('#penPopup').classList.toggle('show');
                //@ts-ignore
                e.target?.parentElement
                  .querySelector('.eraser')
                  .querySelector('#eraserPopup')
                  .classList.remove('show');
                setSelected(e, '.toolbar');
              }}
              aria-label="Brush Size"
            >
              <SvgIcon name="pen" className="svgicon" />
              <span className="popuptext show" id="penPopup">
                <div className="popup-child">
                  <button
                    className="popup annotator-toolbar-button"
                    onClick={e => {
                      setToolSize(large);
                      setSelected(e);
                    }}
                    aria-label="Large"
                  >
                    <SvgIcon name="circle-large" className="svgicon" />
                  </button>
                  <button
                    className="popup annotator-toolbar-button selected"
                    onClick={e => {
                      setToolSize(medium);
                      setSelected(e);
                    }}
                    aria-label="Medium"
                  >
                    <SvgIcon name="circle-medium" className="svgicon" />
                  </button>
                  <button
                    className="popup annotator-toolbar-button"
                    onClick={e => {
                      setToolSize(small);
                      setSelected(e);
                    }}
                    aria-label="Small"
                  >
                    <SvgIcon name="circle-small" className="svgicon" />
                  </button>
                </div>
                <div className="popup-child">
                  <button
                    className="popup annotator-toolbar-button selected"
                    onClick={e => {
                      setColor('red');
                      setSelected(e);
                    }}
                    aria-label="Red"
                  >
                    <SvgIcon name="red-icon" className="svgicon" />
                  </button>
                  <button
                    className="popup annotator-toolbar-button"
                    onClick={e => {
                      setColor('green');
                      setSelected(e);
                    }}
                    aria-label="Green"
                  >
                    <SvgIcon name="green-icon" className="svgicon" />
                  </button>
                  <button
                    className="popup annotator-toolbar-button"
                    onClick={e => {
                      setColor('blue');
                      setSelected(e);
                    }}
                    aria-label="Blue"
                  >
                    <SvgIcon name="blue-icon" className="svgicon" />
                  </button>
                </div>
              </span>
            </button>
            <button
              className="popup annotator-toolbar-button 
                toolbar eraser"
              onClick={e => {
                setEraser();
                //@ts-ignore
                e.target
                  ?.querySelector('#eraserPopup')
                  .classList.toggle('show');
                //@ts-ignore
                e.target?.parentElement
                  .querySelector('.pen')
                  .querySelector('#penPopup')
                  .classList.remove('show');
                setSelected(e, '.toolbar');
              }}
              aria-label="Brush Size"
            >
              <SvgIcon name="erase" className="svgicon" />
              <span className="popuptext erase" id="eraserPopup">
                <div className="popup-child">
                  <button
                    className="popup annotator-toolbar-button"
                    onClick={e => {
                      setEraserSize(eraserLarge);
                      setSelected(e);
                    }}
                    aria-label="Large"
                  >
                    <SvgIcon name="circle-large" className="svgicon" />
                  </button>
                  <button
                    className="popup annotator-toolbar-button selected"
                    onClick={e => {
                      setEraserSize(eraserMedium);
                      setSelected(e);
                    }}
                    aria-label="Medium"
                  >
                    <SvgIcon name="circle-medium" className="svgicon" />
                  </button>
                  <button
                    className="popup annotator-toolbar-button"
                    onClick={e => {
                      setEraserSize(eraserSmall);
                      setSelected(e);
                    }}
                    aria-label="Small"
                  >
                    <SvgIcon name="circle-small" className="svgicon" />
                  </button>
                </div>
              </span>
            </button>
            <ToolbarButton
              label="Save"
              icon="save"
              onClick={() => saveDoodle()}
            />
          </div>
        )}
      </div>
    );
  }
}

Toolbar.propTypes = {
  closeSidebar: propTypes.func.isRequired,
  createAnnotation: propTypes.func.isRequired,
  isSidebarOpen: propTypes.bool.isRequired,
  newAnnotationType: propTypes.oneOf(['annotation', 'note']).isRequired,
  showHighlights: propTypes.bool.isRequired,
  toggleHighlights: propTypes.func.isRequired,
  toggleSidebar: propTypes.func.isRequired,
  toggleDoodleability: propTypes.func.isRequired,
  toggleSidebarRef: propTypes.any,
  useMinimalControls: propTypes.bool,
  drawingToolbarActivated: propTypes.bool,
  drawingToolbarToggle: propTypes.func.isRequired,
  setDoodleOptions: propTypes.func.isRequired,
  saveDoodle: propTypes.func.isRequired,
};
