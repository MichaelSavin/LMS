import React, { Component, PropTypes } from 'react';
import { Button as AntButton } from 'antd';
import Immutable, { fromJS } from 'immutable';
import localForage from 'localforage';
import classNames from 'classnames';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import styles from './styles.css';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      drag: null,
      editing: false,
      content: fromJS({
        editor: content,
        component: content,
      }),
    };
    this.storage = {
      images: {},
      crops: {},
    };
  }

  componentDidMount() {
    this.state.content.getIn([
      'editor',
      'options',
    ]).forEach(({ image }) => {
      if (image) {
        localForage
          .getItem(image.get('name'))
          .then((data) => {
            this.storage.images[
              image.get('name')
            ] = data;
            this.forceUpdate();
          });
      }
    });
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !Immutable.is(
      this.state.content,
      nextState.content
    ) || (
      this.state.editing !==
      nextState.editing
    );
  }

  uploadOptionImage = (index) => (files) => {
    const image = {
      data: files[0].slice(0),
      name: [
        files[0].lastModified,
        files[0].size,
        files[0].name,
      ].join(''),
    };
    const reader = new FileReader();
    reader.readAsDataURL(image.data);
    // eslint-disable-next-line
    reader.onloadend = () => {
      this.storage.images[
        image.name
      ] = reader.result;
      this.setState(
        ({ content }) => ({
          content: content.setIn([
            'editor',
            'options',
            index,
            'image',
            'name',
          ],
            image.name,
          ),
        })
      );
    };
  }

  removeOptionImage = (index) => (event) => {
    event.stopPropagation();
    this.setState(
      ({ content }) => ({
        content: content.setIn([
          'editor',
          'options',
          index,
          'image',
        ],
          undefined
        ),
      })
    );
  }

  addOption = () => {
    this.setState(
      ({ content }) => ({
        content: content.updateIn([
          'editor',
          'options',
        ],
          Immutable.List.of(),
          // eslint-disable-next-line
          (options) => options.push(
            fromJS({
              text: 'Новый вариант',
              image: undefined,
              checked: false,
              correct: false,
            }),
          ),
        ),
      })
    );
  }

  removeOption = (index) => () => {
    this.setState(
      ({ content }) => ({
        content: content.removeIn([
          'editor',
          'options',
          index,
        ]),
      })
    );
  }

  dragOption = ({ oldIndex, newIndex }) => {
    this.setState(
      ({ content }) => ({
        content: content.setIn([
          'editor',
          'options',
        ],
          content.getIn([
            'editor',
            'options',
          ]).withMutations(
            (options) => options
              .set(
                oldIndex,
                options.get(newIndex)
              )
              .set(
                newIndex,
                options.get(oldIndex)
              )
          )
        ),
      })
    );
  };

  changeContent = (location) => (event) => {
    this.setState({
      content: this.state
        .content
        .setIn([
          'editor',
          ...location,
        ],
        event.target.value
      ),
    });
  }

  openEditor = () => {
    this.setState(({
      content,
    }) => ({
      content: content.set(
        'editor',
        content.get('component'),
      ),
      editing: true,
    }), this.context.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      editing: false,
    }, this.context.toggleReadOnly);
  }

  saveContent = () => {
    const { content } = this.state;
    const newContent = content.set(
      'component',
      content.get('editor'),
    );
    Entity.replaceData(
      this.props.entityKey, {
        content: newContent.toJS(),
      }
    );
    this.setState({
      editing: false,
      content: newContent,
    }, this.context.toggleReadOnly);
  }

  render() {
    const {
      content: {
        editor,
        component,
      },
      editing,
    } = this.state;
    return (
      <div
        className={classNames(
          styles.checkbox,
          { [styles.editing]: editing },
        )}
      >
        <div className={styles.preview}>
          <Preview
            content={editing ? editor : component}
            storage={this.storage}
            changeContent={this.changeContent}
          />
        </div>
        {editing &&
          <div className={styles.editor}>
            <Editor
              content={editor}
              storage={this.storage}
              addOption={this.addOption}
              dragOption={this.dragOption}
              closeEditor={this.closeEditor}
              saveContent={this.saveContent}
              removeOption={this.removeOption}
              changeContent={this.changeContent}
              uploadOptionImage={this.uploadOptionImage}
              removeOptionImage={this.removeOptionImage}
            />
          </div>
        }
        <div className={styles.actions}>
          {!editing &&
            <AntButton
              type="primary"
              icon="edit"
              onClick={this.openEditor}
              className={styles.edit}
            />
          }
        </div>
      </div>
    );
  }
}

Checkbox.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.shape({
          name: PropTypes.string.isRequired,
          text: PropTypes.string.isRequired,
          crop: {
            size: PropTypes.object.isRequired,
            name: PropTypes.string.isRequired,
          },
        }),
        checked: PropTypes.bool.isRequired,
        correct: PropTypes.bool.isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Checkbox.defaultProps = {
  content: {
    question: 'Где могут жить утки?',
    options: [{
      text: 'Здесь',
      image: undefined,
      checked: false,
      correct: false,
    }, {
      text: 'Тут',
      image: undefined,
      checked: false,
      correct: false,
    }, {
      text: 'Вот же',
      image: undefined,
      checked: false,
      correct: false,
    }, {
      text: 'Ага, вот отличное место',
      image: undefined,
      checked: false,
      correct: false,
    }],
  },
};

Checkbox.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default Checkbox;
