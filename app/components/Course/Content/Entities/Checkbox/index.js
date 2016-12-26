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
    const {
      content: {
        editor,
        initial,
        component,
      },
    } = props;
    this.state = {
      drag: null,
      editing: false,
      content: fromJS({
        editor: editor || initial,
        component: component || initial,
      }),
    };
    this.storage = {
      crops: {},
      images: {},
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

  addContent = (location, content) => () => {
    this.setState({
      content: this.state.content.updateIn([
        'editor',
        ...location,
      ],
        Immutable.List.of(),
        // eslint-disable-next-line
        (data) => data.push(
          fromJS(content)
        ),
      ),
    });
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
                content.getIn([
                  'editor',
                  'options',
                ]).get(newIndex)
              )
              .set(
                newIndex,
                content.getIn([
                  'editor',
                  'options',
                ]).get(oldIndex)
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
        ||
        event.target.checked
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
              addContent={this.addContent}
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
        {editing
          /* eslint-disable */
          ? <div className={styles.actions}>
              <AntButton
                type="primary"
                icon="check"
                onClick={this.saveContent}
                className={styles.save}
              >
                Сохранить
              </AntButton>
              <AntButton
                type="default"
                icon="rollback"
                onClick={this.closeEditor}
                className={styles.cancel}
              >
                Отменить
              </AntButton>
            </div>
          : <div className={styles.actions}>
              <AntButton
                type="primary"
                icon="edit"
                onClick={this.openEditor}
                className={styles.edit}
              >
                Редактировать
              </AntButton>
            </div>
          /* eslint-enable */
        }
      </div>
    );
  }
}

Checkbox.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    points: PropTypes.object.isRequired,
    variations: PropTypes.arrayOf(
      PropTypes.shape({
        question: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(
          PropTypes.shape({
            text: PropTypes.string.isRequired,
            image: PropTypes.shape({
              name: PropTypes.string.isRequired,
              text: PropTypes.string.isRequired,
              crop: PropTypes.shape({
                size: PropTypes.object.isRequired,
                name: PropTypes.string.isRequired,
              }),
            }),
            checked: PropTypes.bool.isRequired,
            correct: PropTypes.bool.isRequired,
          }).isRequired,
        ).isRequired,
        hints: PropTypes.arrayOf(
          PropTypes.shape({ text: PropTypes.string.isRequired })
        ).isRequired,
        competences: PropTypes.arrayOf(
          PropTypes.shape({ text: PropTypes.string.isRequired })
        ).isRequired,
        explanations: PropTypes.arrayOf(
          PropTypes.shape({ text: PropTypes.string.isRequired })
        ).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Checkbox.defaultProps = {
  content: {
    initial: {
      points: {},
      variations: [{
        question: 'Где могут жить утки?',
        hints: [],
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
        competences: [],
        explanations: [],
      }],
    },
  },
};

Checkbox.contextTypes = {
  toggleReadOnly: PropTypes.func.isRequired,
};

export default Checkbox;
