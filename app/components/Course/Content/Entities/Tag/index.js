import React, {
  Component,
  PropTypes,
} from 'react';
import {
  set,
  update,
  remove,
  random,
} from 'lodash/fp';
import {
  Entity,
  EditorState,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';
import {
  arrayMove,
} from 'react-sortable-hoc';
import { message } from 'antd';
import Preview from './Preview';
import Editor from './Editor';
import {
  entitiesDecorator,
} from '../../Entities';
import './styles.css';

const createDraftEditorStateFromText = (text) =>
  EditorState.createWithContent(
    ContentState.createFromText(text),
    entitiesDecorator,
  );

const convertTextToDraftEditorState = (object, key) =>
  object && ({
    [key]: object[key].map((row) => ({
      ...row,
      content: EditorState
        .createWithContent(
          convertFromRaw(row.content),
          entitiesDecorator,
        ),
    })),
  });

const convertDraftEditorStateToText = (object, key) => ({
  [key]: object[key].map((row) => ({
    ...row,
    content: convertToRaw(
      row.content
        .getCurrentContent()
    ),
  })),
});

class Tag extends Component {

  constructor(props) {
    super(props);
    const content = convertTextToDraftEditorState(
      Entity
      .get(this.props.entityKey)
      .getData()
      .content,
      'tags'
    ) || {
      tags: [{
        id: `${random(0, 999)}`,
        color: 'green',
        content: createDraftEditorStateFromText('Тэг'),
      }],
    };
    this.state = {
      drag: null,
      temp: content,
      modal: false,
      content,
    };
  }

  openModal = () => {
    this.setState({
      modal: true,
      temp: this
        .state
        .content,
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    });
    Entity.replaceData(
      this.props.entityKey, {
        content: convertDraftEditorStateToText(
          content,
          'tags'
        ),
      }
    );
  }

  closeModal = () => {
    this.setState({
      modal: false,
    });
  }

  changeTagColor = (index) => (value) => {
    this.setState({
      temp: set([
        'tags',
        index,
        'color',
      ],
        value,
        this.state.temp,
      ),
    });
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

  addTag = () => {
    this.setState({
      temp: update(
        'tags',
        (tags) => tags.concat([{
          id: `${random(0, 999)}`,
          color: 'blue',
          content: createDraftEditorStateFromText('Тэг'),
        }]),
        this.state.temp,
      ),
    });
  }

  removeTag = (index) => () => {
    if (this.state.temp.tags.length > 1) {
      this.setState({
        temp: update(
          'tags',
          (tags) => remove(
            (tag) => tags.indexOf(
              tag
            ) === index,
            tags,
          ),
          this.state.temp,
        ),
      });
    } else {
      message.error('Нельзя удалить единственный элемент');
    }
  }

  dragTag = ({ oldIndex, newIndex }) => {
    this.setState({
      temp: {
        tags: arrayMove(
          this.state.temp.tags,
          oldIndex,
          newIndex,
        ),
      },
    });
  };

  render() {
    const {
      temp,
      modal,
      content,
    } = this.state;
    return (
      <span>
        <Preview
          data={content}
          openModal={this.openModal}
        />
        <Editor
          data={temp}
          isOpen={modal}
          addTag={this.addTag}
          dragTag={this.dragTag}
          removeTag={this.removeTag}
          closeModal={this.closeModal}
          saveSettings={this.saveSettings}
          changeTagText={this.changeTagText}
          changeTagColor={this.changeTagColor}
        />
      </span>
    );
  }
}

Tag.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Tag;
