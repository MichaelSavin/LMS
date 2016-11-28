import React, { Component, PropTypes } from 'react';
import { getVisibleSelectionRect } from 'draft-js';
import Style from '../Toolbar/Formats/Style';

/* eslint react/no-set-state:0 */
/* eslint react/no-string-refs:0 */
/* eslint react/no-did-update-set-state:0 */

export default class PopupToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidUpdate() {
    if (!this.props.editorState.getSelection().isCollapsed()) {
      this.setBarPosition();
    } else if (this.state.show) {
      this.setState({
        show: false,
      });
    }
  }

  setBarPosition = () => {
    const editor = this.props.editor.refs.editor;
    const toolbar = this.refs.toolbar;
    const selectionCoords = this.getSelectionCoords(editor, toolbar);
    if (selectionCoords &&
        (!this.state.position ||
        this.state.position.top !== selectionCoords.offsetTop ||
        this.state.position.left !== selectionCoords.offsetLeft)) {
      this.setState({
        show: true,
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
      const rangeWidth = rangeBounds.right - rangeBounds.left;
      const toolbarHeight = toolbar.offsetHeight;
      const toolbarWidth = toolbar.offsetWidth;
      const offsetLeft = (rangeBounds.left - editorBounds.left)
        + ((rangeWidth - toolbarWidth) / 2) + 10;
      const offsetTop = rangeBounds.top - editorBounds.top - (toolbarHeight + 6);
      return { offsetLeft, offsetTop };
    }
    return false;
  };

  render() {
    const { isFocused } = this.props;
    const { show, position } = this.state;

    return isFocused ? (
      <div
        className={`ant-tooltip ant-tooltip-placement-top ${show ? '' : 'ant-tooltip-hidden'}`}
        style={position}
      >
        <div className="ant-tooltip-content">
          <div className="ant-tooltip-arrow" />
          <div className="ant-tooltip-inner" ref="toolbar" onMouseDown={(e) => { e.preventDefault(); }}>
            <Style
              editorState={this.props.editorState}
              changeEditorState={this.props.changeEditorState}
              isPopup
            />
          </div>
        </div>
      </div>
    ) : null;
  }
}

PopupToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
  isFocused: PropTypes.bool,
};
