import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Editor,
  RichUtils,
  EditorState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import Toolbar from './Toolbar';
import Button from 'components/UI/Button';
import styles from './styles.css';

class Draft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createWithContent(
        convertFromRaw(this.props.content)
      ),
    };
  }

  onChange = (editorState) => {
    const {
      actions: {
        editUnit,
      },
      unit: {
        sectionId,
        subsectionId,
        unitId,
      },
    } = this.props;
    if (editorState.getCurrentContent() !== this.state.editorState.getCurrentContent()) {
      editUnit({
        sectionId,
        subsectionId,
        unitId,
        content: convertToRaw(editorState.getCurrentContent()),
      });
    }
    this.setState({ editorState });
  }

  handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(
      this.state.editorState, command
    );
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    );
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.editor}>
        <Toolbar
          type="BLOCK"
          editorState={editorState}
          onToggle={this.toggleBlockType}
          buttons={[
            { label: 'Заголовок', style: 'header-three' },
            { label: 'Простой список', style: 'unordered-list-item' },
            { label: 'Нумерованный список', style: 'ordered-list-item' },
          ]}
        />
        <Toolbar
          type="INLINE"
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
          buttons={[
            { label: 'Жирный текст', style: 'BOLD' },
            { label: 'Наклонный текст', style: 'ITALIC' },
            { label: 'Подчеркнутый текст', style: 'UNDERLINE' },
          ]}
        />
        <div
          className={styles.draft}
          onClick={() => { this.refs.editor.focus(); }} // eslint-disable-line react/no-string-refs
        >
          <Editor
            ref="editor"              // eslint-disable-line react/no-string-refs
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            spellCheck={false}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            action={() => alert('Тест')}
            name="Тест"
            icon="quiz"
          />
          <Button
            action={() => alert('Картинка')}
            name="Картинка"
            icon="image"
          />
          <Button
            action={() => alert('Видео')}
            name="Видео"
            icon="video"
          />
        </div>
      </div>
    );
  }
}

Draft.propTypes = {
  actions: PropTypes.object, // http://stackoverflow.com/a/33427304
  unit: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }),
  content: PropTypes.object,
};

export default Draft;
