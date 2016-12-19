import React, {
  PropTypes,
} from 'react';
import {
  Icon,
  Form as AntForm,
  Modal as AntModal,
  Select as AntSelect,
  Button as AntButton,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  EditorState,
  convertFromRaw,
} from 'draft-js';
import {
  entitiesDecorator,
} from '../../../Entities';

import { Input as DraftInput } from '../../../Editor';

class EditableCell extends React.Component {
  state = {
    value: this.props.content,
    editable: false,
    editorState: this.props.content ? EditorState.moveFocusToEnd(
      EditorState.createWithContent(
        convertFromRaw(this.props.content),
        entitiesDecorator,
      ),
    ) : EditorState.createEmpty(),
  }
  handleChange = (editorState) => {
    this.setState({ editorState });
    this.props.onChange(editorState);
  }
  check = () => {
    this.setState({ editable: false });
    if (this.props.onChange) {
      this.props.onChange(this.state.value);
    }
  }
  edit = () => {
    this.setState({ editable: true });
  }
  changeTagText = (index) => (content) => {
    this.setState({
      temp: set([
        'tags',
        index,
        'content',
      ],
        content,
        this.state.temp,
      ),
    });
  }
  render() {
    const { value, editable } = this.state;
    const { editorState } = this.state;
    return (<div className="editable-cell">
      {
        editable ?
          <div className="editable-cell-input-wrapper">
            <DraftInput
              value={editorState}
              onChange={this.handleChange}
            />
            <Icon
              type="check"
              className="editable-cell-icon-check"
              onClick={this.check}
            />
          </div>
          :
          <div className="editable-cell-text-wrapper">
            {value || ' '}
            <Icon
              type="edit"
              className="editable-cell-icon"
              onClick={this.edit}
            />
          </div>
      }
    </div>);
  }
}

export default EditableCell;
