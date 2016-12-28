import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor as Draft,
} from 'draft-js';
import {
  customStyleMap,
} from 'draftjs-utils';
import { Button } from 'antd';
import Icon from 'components/UI/Icon';
import {
  insertEntity,
  addEOLtoInlineEntity,
} from '../Entities';
import Popup from './Popup';
import styles from './styles.css';

class DraftInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isReadOnly: false,
      popupOpen: true,
    };
  }

  getChildContext = () => ({
    lockDraft: this.lockDraft,
    unlockDraft: this.unlockDraft,
  });

  onChange = (editorState) => {
    this.props.onChange(
      editorState
        .getCurrentContent()
        .blockMap
        .reduce(
          addEOLtoInlineEntity,
          editorState
        ),
    );
  }

  setFocusStatus = (event) => {
    this.setState({
      popupIsOpen: event.type === 'focus',
    });
  }

  lockDraft = () => {
    this.setState({
      isReadOnly: true,
    });
  }

  unlockDraft = () => {
    this.setState({
      isReadOnly: false,
    }, this.focusEditor);
  }

  focusEditor = () => this.refs.editor.focus();

  render() {
    const {
      isReadOnly,
      popupIsOpen,
    } = this.state;
    const {
      value: editorState,
      className,
    } = this.props;
    return (
      <div className={className || styles.input}>
        <Draft
          ref="editor"
          onBlur={this.setFocusStatus}
          onFocus={this.setFocusStatus}
          readOnly={isReadOnly || this.props.isReadOnly}
          onChange={this.onChange}
          editorState={editorState}
          customStyleMap={customStyleMap}
          handleKeyCommand={this.handleKeyCommand}
        />
        {!className && <div className={styles.icon}>
          <Button
            size="small"
            onClick={() => {
              insertEntity(
                'TEX',
                editorState,
                this.onChange,
                'INPUT'
              );
            }}
          >
            <Icon type="function" />
          </Button>
        </div>}
        <Popup
          isFocused={popupIsOpen}
          editorRef={this.refs.editor}
          editorState={editorState}
          changeEditorState={this.onChange}
        />
      </div>
    );
  }
}

DraftInput.childContextTypes = {
  lockDraft: PropTypes.func.isRequired,
  unlockDraft: PropTypes.func.isRequired,
};

DraftInput.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  className: PropTypes.string,
};

export default DraftInput;
