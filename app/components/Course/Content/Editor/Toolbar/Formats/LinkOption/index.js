import React, {
  Component,
  PropTypes,
} from 'react';
import { Icon as AntIcon } from 'antd';
import {
  Entity,
  RichUtils,
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

  removeLink = (e) => {
    e.preventDefault();
    const { editorState, changeEditorState } = this.props;
    const { selection } = this.state;
    changeEditorState(
      RichUtils.toggleLink(
        editorState,
        selection,
        null
      )
    );
    this.setState({
      linkValue: '',
      isShowInput: false,
    }, this.context.toggleReadOnly);
  }

  inputChange = (e) => {
    this.setState({
      linkValue: e.target.value,
    });
  }

  inputClick = () => {
    this.input.focus();
    // Ставит курсор в конец строки, без этого курсора вообще нет
    this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
  }

  selectInputValue = () => this.input.setSelectionRange(0, this.input.value.length)

  refInput = (input) => { this.input = input; }

  inputKeyDown = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      this.confirmLink();
    }
  }

  render() {
    const {
      linkValue,
      isShowInput,
    } = this.state;
    const {
      inPopup,
    } = this.props;
    return (
      isShowInput ?
        <div className={styles.input}>
          <input
            ref={this.refInput}
            type="text"
            value={linkValue}
            onBlur={this.cancelClick}
            onClick={this.inputClick}
            onChange={this.inputChange}
            autoFocus
            onKeyDown={this.inputKeyDown}
            onDoubleClick={this.selectInputValue}
          />
          <div>
            {linkValue &&
              <AntIcon
                type="delete"
                onClick={this.removeLink}
                className={styles.confirm}
              />
            }
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
