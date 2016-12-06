import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor as Draft,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  customStyleMap,
} from 'draftjs-utils';
import { Button } from 'antd';
import Icon from 'components/UI/Icon';
import {
  entitiesDecorator,
  insertEntity,
  addEOLtoInlineEntity,
} from '../Entities';
import Popup from './Popup';
import styles from './styles.css';

class DraftInput extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      readOnly: false,
      isFocused: true,
      editorState: content
        ? EditorState.createWithContent(
            convertFromRaw(content),
            entitiesDecorator,
          )
        : EditorState.createEmpty(),
    };
  }

  getChildContext() {
    return {
      addReadOnlyFlag: this.addReadOnlyFlag,
      removeReadOnlyFlag: this.removeReadOnlyFlag,
    };
  }

  componentDidMount() {
    this.props.onChange(
      convertToRaw(
        this.state
          .editorState
          .getCurrentContent()
      )
    );
  }

  onChange = (editorState) => {
    this.setState({
      editorState: editorState.getCurrentContent()
        .blockMap.reduce(
          addEOLtoInlineEntity,
          editorState
        ),
    }, () => {
      this.props.onChange(
      convertToRaw(
        this.state.editorState
          .getCurrentContent()
        )
      );
    });
  }

  setFocusStatus = (event) => {
    this.setState({
      isFocused: event.type === 'focus',
    });
  }

  addReadOnlyFlag = () => {
    this.setState({
      readOnly: true,
    });
  }

  removeReadOnlyFlag = () => {
    this.setState({
      readOnly: false,
    });
  }


  render() {
    const {
      isFocused,
      editorState,
      readOnly,
    } = this.state;
    return (
      <div className={styles.input}>
        <Draft
          ref="editor"
          readOnly={readOnly}
          onBlur={this.setFocusStatus}
          onFocus={this.setFocusStatus}
          onChange={this.onChange}
          editorState={editorState}
          customStyleMap={customStyleMap}
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
          isFocused={isFocused}
          editorRef={this.refs.editor}
          editorState={editorState}
          changeEditorState={this.onChange}
        />
      </div>
    );
  }
}

DraftInput.childContextTypes = { // eslint-disable-line fp/no-mutation
  addReadOnlyFlag: PropTypes.func.isRequired,
  removeReadOnlyFlag: PropTypes.func.isRequired,
};

DraftInput.propTypes = {
  content: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};

export default DraftInput;
