import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Entity,
  RichUtils,
  EditorState,
  convertToRaw,
  convertFromRaw,
  AtomicBlockUtils,
} from 'draft-js';
import createImagePlugin, {
  // imageStyles,
  // imageCreator,
} from 'draft-js-image-plugin';
import createEntityPropsPlugin from 'draft-js-entity-props-plugin';
import createVideoPlugin from 'draft-js-video-plugin';
import Editor from 'draft-js-plugins-editor';
import Button from 'components/UI/Button';
import Toolbar from './Toolbar';
import styles from './styles.css';

const imageTheme = {
  imageLoader: 'imageLoader',
  imageWrapper: 'imageWrapper',
  image: 'image',
};

const plugins = [
  createImagePlugin({
    theme: imageTheme,
    type: 'atomic',
  }),
  createVideoPlugin(),
  createEntityPropsPlugin(),
];

class Draft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.moveFocusToEnd(
        EditorState.createWithContent(
          convertFromRaw(this.props.content)
        ),
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

  // handleKeyCommand = (command) => {
  //   const newState = RichUtils.handleKeyCommand(
  //     this.state.editorState, command
  //   );
  //   if (newState) {
  //     this.onChange(newState);
  //     return true;
  //   }
  //   return false;
  // }

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.editor}>
        <Toolbar
          type="BLOCK"
          editorState={editorState}
          onToggle={(blockType) => {
            this.onChange(
              RichUtils.toggleBlockType(
                this.state.editorState,
                blockType
              )
            );
          }}
          buttons={[
            { label: 'Заголовок', style: 'header-three' },
            { label: 'Простой список', style: 'unordered-list-item' },
            { label: 'Нумерованный список', style: 'ordered-list-item' },
          ]}
        />
        <Toolbar
          type="INLINE"
          editorState={editorState}
          onToggle={(inlineStyle) => {
            this.onChange(
              RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
              )
            );
          }}
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
            ref="editor" // eslint-disable-line react/no-string-refs
            editorState={editorState}
            // handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            spellCheck={false}
            plugins={plugins}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            action={() => alert('Тест')}
            name="Тест"
            icon="quiz"
          />
          <Button
            action={() => {
              const url = prompt('URL изображения', '');
              const entityKey = Entity.create('block-image', 'IMMUTABLE', {
                src: url,
                progress: -1,
                alt: '',
                // width: 300,
                // height: 300,
              });
              this.setState({ // eslint-disable-line react/no-set-state
                editorState: AtomicBlockUtils.insertAtomicBlock(
                  this.state.editorState,
                  entityKey,
                  ' '
                ),
              });
            }}
            name="Изображение"
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
