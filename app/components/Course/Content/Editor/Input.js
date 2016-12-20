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
      readOnly: false,
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
      readOnly: true,
    });
  }

  unlockDraft = () => {
    this.setState({
      readOnly: false,
    }, this.focusEditor);
  }

  focusEditor = () => this.refs.editor.focus();

  render() {
    const {
      readOnly,
      popupIsOpen,
    } = this.state;
    const { isReadOnly } = this.props;
    const {
      value: editorState,
    } = this.props;
    return (
      <div className={styles.input}>
        <Draft
          ref="editor"
          onBlur={this.setFocusStatus}
          onFocus={this.setFocusStatus}
          readOnly={readOnly || isReadOnly}
          onChange={this.onChange}
          editorState={editorState}
          customStyleMap={customStyleMap}
          handleKeyCommand={this.handleKeyCommand}
        />
        <div className={styles.icon}>
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
        </div>
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
  onChange: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
};

export default DraftInput;
