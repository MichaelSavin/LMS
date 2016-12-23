import React, {
  Component,
  PropTypes,
} from 'react';
import {
  set,
  update,
  remove,
  isEqual,
} from 'lodash/fp';
import {
  arrayMove,
} from 'react-sortable-hoc';
import {
  Button as AntButton,
} from 'antd';
import { Entity } from 'draft-js';
import localForage from 'localforage';
import Preview from './Preview';
import Editor from './Editor';
import styles from './styles.css';

class Checkbox extends Component {

  constructor(props) {
    super(props);
    const {
      content: {
        editor,
        component,
      },
    } = props;
    this.state = {
      drag: null,
      editing: false,
      content: {
        editor,
        component,
      },
    };
    this.storage = {
      crops: {},
      images: {},
    };
  }

  componentDidMount() {
    this.receiveImages(this.state);
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    if (!isEqual(
    ...[this.state, nextState]
      .map((state) => state
        .content
        .component
        .options
        .map((answer) =>
          answer.image
        )
      )
    )) {
      this.receiveImages(this.state);
      return false;
    }
    return !isEqual(
      this.state,
      nextState
    );
  }

  receiveImages = (state) => {
    state
      .content
      .editor
      .options
      .forEach(({
        image,
      }) => {
        if (image) {
          localForage
            .getItem(image.source)
            .then((value) => {
              this.storage.images[
                image.source
              ] = value;
              this.forceUpdate();
            });
        }
      });
  }

  // Заменить на ChangeData
  removeOptionImage = (index) => (event) => {
    event.stopPropagation();
    this.setState({
      content: set([
        'editor',
        'options',
        index,
        'image',
      ],
        undefined,
        this.state.content,
      ),
    });
  }

  uploadImage = (index) => (files) => {
    const file = files[0].slice(0);
    const name = [
      files[0].lastModified,
      files[0].size,
      files[0].name,
    ].join('');
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { // eslint-disable-line
      localForage.setItem(
        name,
        reader.result,
      ).then(() => {
        this.storage.images[name] = reader.result;
        this.setState({
          content: set([
            'editor',
            'options',
            index,
            'image',
            'source',
          ],
            name,
            this.state.temp,
          ),
        });
      });
    };
  }

  addOption = () => {
    this.setState({
      content: update([
        'editor',
        'options',
      ],
        (options) => options.concat([{
          text: 'Новый вариант',
          image: undefined,
          checked: false,
          correct: false,
        }]),
        this.state.content,
      ),
    }, this.forceUpdate);
  }

  removeOption = (index) => () => {
    this.setState({
      content: update([
        'editor',
        'options',
      ],
        (options) => remove(
          (option) => options.indexOf(option) === index,
          options,
        ),
        this.state.content,
      ),
    }, this.forceUpdate);
  }

  dragOption = ({ oldIndex, newIndex }) => {
    this.setState({
      content: set([
        'editor',
        'options',
      ],
        arrayMove(
          this.state
            .content
            .editor
            .options,
          oldIndex,
          newIndex,
        ),
        this.state.content,
      ),
    });
  };

  changeContent = (path) => (event) => {
    this.setState({
      content: set([
        'editor',
        ...path,
      ],
        event.target.value,
        this.state.content,
      ),
    });
  }

  openEditor = () => {
    this.setState({
      content: {
        ...this.state.content,
        editor: this.state
          .content
          .component,
      },
      editing: true,
    }, this.context.toggleReadOnly);
  }

  closeEditor = () => {
    this.setState({
      editing: false,
    }, this.context.toggleReadOnly);
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
    this.setState({
      editing: false,
      content,
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
      <div className={styles.checkbox}>
        <div className={styles.preview}>
          <Preview
          storage={this.storage}
          content={editing ? editor : component}
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
            removeOption={this.removeOption}
            saveSettings={this.saveSettings}
            changeContent={this.changeContent}
            uploadOptionImage={this.uploadImage}
            removeOptionImage={this.removeImage}
          />
          </div>
        }
        <div className={styles.actions}>
          {editing /* eslint react/jsx-indent-props: 0, react/jsx-closing-bracket-location: 0 */
            ? <AntButton
                type="primary"
                icon="check-circle"
                className={styles.edit}
              />
            : <AntButton
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
  question: PropTypes.string.isRequired,
  content: PropTypes.shape({
    options: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.shape({
          text: PropTypes.string.isRequired,
          source: PropTypes.string.isRequired,
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
