import React, { Component, PropTypes } from 'react';
import { getVisibleSelectionRect } from 'draft-js';
import Style from '../Toolbar/Formats/Style';

/* eslint better/no-ifs:0 */
/* eslint react/no-set-state:0 */
/* eslint react/no-string-refs:0 */

const getSelectionCoords = (editor, toolbar) => {
  const editorBounds = editor.getBoundingClientRect();
  const rangeBounds = getVisibleSelectionRect(window);

  if (!rangeBounds || !toolbar) {
    return null;
  }

  const rangeWidth = rangeBounds.right - rangeBounds.left;

  const toolbarHeight = toolbar.offsetHeight;
  // const rangeHeight = rangeBounds.bottom - rangeBounds.top;
  const offsetLeft = (rangeBounds.left - editorBounds.left)
    + (rangeWidth / 2);
  const offsetTop = rangeBounds.top - editorBounds.top - (toolbarHeight + 14);
  return { offsetLeft, offsetTop };
};


export default class PopupToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.editorState.getSelection().isCollapsed()) {
      console.log(1);
      this.setBarPosition(nextProps);
    } else if (this.state.show) {
      console.log(2);
      this.setState({
        show: false,
      });
    }
  }


  setBarPosition = (props = this.props) => {
    const editor = props.editor.refs.editor;
    const toolbar = this.refs.toolbar;
    const selectionCoords = getSelectionCoords(editor, toolbar);

    if (!selectionCoords) {
      return null;
    }

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
    return null;
  }

  renderToolList() {
    return (
      <ul className="toolbar__list" onMouseDown={(x) => { x.preventDefault(); }}>
        <Style {...this.props} />
      </ul>
    );
  }

  render() {
    if (this.props.readOnly) {
      return null;
    }
    const toolbarClass = `ant-tooltip ant-tooltip-placement-top ${this.state.show ? '' : 'ant-tooltip-hidden'}`;

    return (
      <div
        className={toolbarClass}
        style={this.state.position}
      >
        <div className="toolbar__wrapper" ref="toolbar">
          {this.renderToolList()}
          <span className="toolbar__arrow" />
        </div>
      </div>
    );
  }
}
PopupToolbar.propTypes = {
  actions: PropTypes.array,
  // unit: PropTypes.shape({
  //   sectionId: PropTypes.string.isRequired,
  //   subsectionId: PropTypes.string.isRequired,
  //   unitId: PropTypes.string.isRequired,
  // }),
  editor: PropTypes.object,
  editorState: PropTypes.object,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};
