import React, {
  Component,
  PropTypes,
} from 'react';
import {
  set,
  update,
  remove,
  isEqual,
  random,
} from 'lodash/fp';
import {
  Entity,
  convertToRaw,
  ContentState,
} from 'draft-js';
import {
  arrayMove,
} from 'react-sortable-hoc';
import { message } from 'antd';
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Tag extends Component {

  constructor(props) {
    super(props);
    const data = {
      default: {
        tags: [{
          id: `${random(0, 999)}`,
          color: 'green',
          content: convertToRaw(
            ContentState.createFromText('Тэг')
          ),
        }],
      },
      entity: Entity
        .get(this.props.entityKey)
        .getData()
        .content,
    };
    const content =
      data.entity || data.default;
    this.state = {
      drag: null,
      temp: content,
      modal: false,
      content,
    };
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !isEqual(
      this.state,
      nextState
    );
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
        content,
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
          content: convertToRaw(
            ContentState.createFromText('Тэг')
          ),
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
      <span onDoubleClick={this.openModal}>
        <Preview data={content} />
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
