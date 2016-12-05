import React, {
  Component,
  PropTypes,
} from 'react';
import {
  getVisibleSelectionRect,
} from 'draft-js';
import classNames from 'classnames';

class Popup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      position: {
        top: undefined,
        left: undefined,
      },
    };
  }

  componentDidUpdate() {
    if (!this.props.editorState
      .getSelection()
      .isCollapsed()
    ) {
      this.setBarPosition();
    } else if (this.state.isOpen) {
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        isOpen: false,
      });
    }
  }

  setBarPosition = () => {
    const { editor } = this.props.editorRef.refs;
    const { toolbar } = this.refs;
    const selectionCoords = this
      .getSelectionCoords(editor, toolbar);
    if (selectionCoords && (
      !this.state.position ||
      this.state.position.top !==
      selectionCoords.offsetTop ||
      this.state.position.left !==
      selectionCoords.offsetLeft
    )) {
      this.setState({
        isOpen: true,
        position: {
          top: selectionCoords.offsetTop,
          left: selectionCoords.offsetLeft,
        },
      });
    }
  }

  getSelectionCoords = (editor, toolbar) => {
    const editorBounds = editor.getBoundingClientRect();
    const rangeBounds = getVisibleSelectionRect(window);
    if (rangeBounds && toolbar) {
      const rangeWidth =
        rangeBounds.right -
        rangeBounds.left;
      const toolbarHeight = toolbar.offsetHeight;
      const toolbarWidth = toolbar.offsetWidth;
      const offsetLeft =
        (rangeBounds.left - editorBounds.left) +
        ((rangeWidth - toolbarWidth) / 2) + 10;
      const offsetTop =
        rangeBounds.top -
        editorBounds.top -
        (toolbarHeight + 6);
      return { offsetLeft, offsetTop };
    } else {
      return false;
    }
  };

  render() {
    const {
      isPopped,
      editorState,
      changeEditorState,
    } = this.props;
    const {
      isOpen,
      position,
    } = this.state;
    return isPopped ? (
      <div
        className={classNames(
          'ant-tooltip',
          'ant-tooltip-placement-top',
          !isOpen ? 'ant-tooltip-hidden' : ''
        )}
        style={position}
      >
        <div className="ant-tooltip-content">
          <div className="ant-tooltip-arrow" />
          <div
            ref="toolbar"
            className="ant-tooltip-inner"
            onMouseDown={(event) =>
              event.preventDefault()
            }
          >
            <input
              placeholder="Basic usage"
              inPopup
              editorState={editorState}
              onChange={(e, val) => { console.log(e, val); }}
              changeEditorState={changeEditorState}
            />
          </div>
        </div>
      </div>
    ) : null;
  }
}

Popup.propTypes = {
  isPopped: PropTypes.bool,
  editorRef: PropTypes.object,
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

export default Popup;
