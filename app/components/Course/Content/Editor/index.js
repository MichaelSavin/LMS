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

import TeX from '../Entities/TeX';
import Link from '../Entities/Link';
import Select from '../Entities/Select';
import { insertEntity, findEntities } from '../Entities';

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
  strategy: findEntities('LINK'),
  component: Link,
}, {
  strategy: findEntities('TEX'),
  component: TeX,
}, {
  strategy: findEntities('SELECT'),
  component: Select,
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
    if (
      editorState.getCurrentContent() !==
      this.state.editorState.getCurrentContent()
    ) {
      editUnit({
        sectionId,
        subsectionId,
        unitId,
        content: convertToRaw(editorState.getCurrentContent()),
      });
    }
    this.setState({
      editorState: EditorState.set(editorState, { decorator }),
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
                editorState,
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
                editorState,
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
            blockRendererFn={this.blockRenderer}
            onChange={this.onChange}
            spellCheck={false}
            plugins={plugins}
          />
        </div>
        <div className={styles.buttons}>
          <Button
            action={() =>
              insertEntity(
                'TEX',
                'a^n+b^n = c^n',
                editorState,
                this.onChange
            )}
            name="Формула"
            icon="formula"
          />
          <Button
            action={() => {
              const url = prompt('URL изображения', 'http://www.google.com/logos/doodles/2016/mid-autumn-festival-2016-vietnam-5715224209391616-hp2x.jpg');
              this.onChange(
                AtomicBlockUtils.insertAtomicBlock(
                  editorState,
                  Entity.create(
                    'block-image',
                    'IMMUTABLE', {
                      src: url,
                      progress: -1,
                      alt: '',
                      width: 300,
                      height: 300,
                    }
                  ),
                  'Картинка'
                ),
              );
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
            action={() =>
              insertEntity(
                'SELECT',
                'Один,Два,Три,Четыре',
                editorState,
                this.onChange
            )}
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
