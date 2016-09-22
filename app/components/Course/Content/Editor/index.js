import React, {
  Component,
  PropTypes,
} from 'react';
import {
  // Editor,
  Entity,
  RichUtils,
  EditorState,
  convertToRaw,
  convertFromRaw,
  AtomicBlockUtils,
  CompositeDecorator,
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
import Link, { findLinkEntities } from './Entities/Link';

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

const decorator = new CompositeDecorator([{
  strategy: findLinkEntities,
  component: Link,
}]);

class Draft extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.moveFocusToEnd(
        EditorState.createWithContent(
          convertFromRaw(this.props.content),
          decorator,
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
    if (editorState.getCurrentContent() !==
        this.state.editorState.getCurrentContent()) {
      editUnit({
        sectionId,
        subsectionId,
        unitId,
        content: convertToRaw(editorState.getCurrentContent()),
      });
    }
    this.setState({ editorState:
      EditorState.set(editorState, { decorator }),
    });
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.editor}>
        <Toolbar
          isButtonActive={button =>
            button.style ===
            editorState
              .getCurrentContent()
              .getBlockForKey(
                editorState
                  .getSelection()
                  .getStartKey()
              )
              .getType()
          }
          onButtonClick={(blockType) => {
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
          isButtonActive={button =>
            editorState.getCurrentInlineStyle().has(button.style)
          }
          onButtonClick={(inlineStyle) => {
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
          onClick={() => { this.refs.editor.focus(); }}
        >
          <Editor
            ref="editor"
            editorState={editorState}
            onChange={this.onChange}
            spellCheck={false}
            plugins={plugins}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            action={() => alert('Формула')}
            name="Формула"
            icon="formula"
          />
          <Button
            action={() => {
              const url = prompt('URL изображения', '');
              const entityKey = Entity.create('block-image', 'IMMUTABLE', {
                src: url,
                progress: -1,
                alt: '',
                width: 300,
                height: 300,
              });
              this.setState({
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
          <Button
            action={() => {
              editorState.getSelection().isCollapsed() // eslint-disable-line no-unused-expressions
                ? alert('Выделите текст')
                : this.onChange(
                    RichUtils.toggleLink(
                      editorState,
                      editorState.getSelection(),
                      Entity.create('LINK', 'IMMUTABLE', {
                        url: prompt('Ссылка', 'http://www.ya.ru'),
                      })
                    )
                  );
            }}
            name="Ссылка"
            icon="link"
          />
          <Button
            action={() => alert('Вопрос')}
            name="Вопрос"
            icon="question"
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
