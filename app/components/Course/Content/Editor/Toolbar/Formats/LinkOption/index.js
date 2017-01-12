import React, {
  Component,
  PropTypes,
} from 'react';
import { Icon as AntIcon } from 'antd';
import {
  RichUtils,
  Entity,
} from 'draft-js';
import Icon from 'components/UI/Icon';
import { getSelectionEntityKey } from 'utils';

import styles from './styles.css';
import Option from '../Option';

class LinkOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
      linkValue: this.getLinkValue(
        props.editorState
      ),
      selection: null,
      isShowInput: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.editorState !== this.props.editorState) {
      this.setState({
        linkValue: this.getLinkValue(
          nextProps.editorState
        ),
      });
    }
  }

  getLinkValue = (editorState) => {
    const entityKey = getSelectionEntityKey(editorState);
    return entityKey ? Entity.get(entityKey).getData().url : '';
  }

  showInput = () => {
    this.context.toggleReadOnly(true);
    this.setState({
      isShowInput: true,
      selection: this.props.editorState.getSelection(),
    });
  }

  cancelClick = () => {
    this.context.toggleReadOnly(false);
    this.setState({
      linkValue: '',
      isShowInput: false,
    });
  }

  confirmLink = () => {
    this.context.toggleReadOnly(false);
    const { editorState, changeEditorState } = this.props;
    const { linkValue, selection } = this.state;
    console.log(linkValue);
    const entityKey = Entity.create('LINK', 'MUTABLE', { url: linkValue });
    changeEditorState(
      RichUtils.toggleLink(
        editorState,
        selection,
        entityKey
      )
    );
    this.setState({
      isShowInput: false,
    });
  }

  inputChange = (e) => {
    console.log(e.target.value);
    this.setState({
      linkValue: e.target.value,
    });
  }

  inputClick = (e) => {
    console.log(e);
    this.input.focus();
    this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
  }

  selectInputValue = () => this.input.setSelectionRange(0, this.input.value.length)

  _removeLink = (e) => {
    e.preventDefault();
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  render() {
    const {
      isShowInput,
      linkValue,
    } = this.state;
    const {
      inPopup,
    } = this.props;
    return (
      isShowInput ?
        <div className={styles.input}>
          <input
            ref={(input) => { this.input = input; }}
            onDoubleClick={this.selectInputValue}
            onClick={this.inputClick}
            value={linkValue}
            type="text"
            autoFocus
            onChange={this.inputChange}
          />
          <div>
            <AntIcon
              type="check"
              onClick={this.confirmLink}
              className={styles.confirm}
            />
            <AntIcon
              type="close"
              onClick={this.cancelClick}
              className={styles.confirm}
            />
          </div>
        </div>
          :
        <Option
          value="LINK"
          active={!!linkValue}
          onClick={this.showInput}
          inPopup={inPopup}
        >
          <span className={styles.icon}>
            <Icon type="link" size={16} />
          </span>
        </Option>
    );
  }
}

LinkOption.propTypes = {
  inPopup: PropTypes.bool,
  editorState: PropTypes.object.isRequired,
  changeEditorState: PropTypes.func.isRequired,
};

LinkOption.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default LinkOption;
