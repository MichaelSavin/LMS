import React, {
  Component,
  PropTypes,
} from 'react';
import localForage from 'localforage';
import { isEqual } from 'lodash/fp';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Card extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      temp: content,
      modal: false,
      content,
    };
    this.storage = {};
  }

  componentDidMount() {
    this.receiveImage(
      this.state.content.image
    );
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

  changeData = (field) => (event) => {
    this.setState({
      temp: {
        ...this.state.temp,
        [field]: event.target.value,
      },
    });
  }

  uploadImage = ({ file }) => {
    if (file.status === 'error') { // Загрузка на сервер
      const name = [
        file.lastModified,
        file.size,
        file.name,
      ].join('');
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onloadend = () => { // eslint-disable-line
        localForage.setItem(
          name,
          reader.result,
        ).then(() => {
          this.setState({
            temp: {
              ...this.state.temp,
              image: name,
            },
          });
          this.storage[name] = reader.result;
          this.forceUpdate();
        });
      };
    }
  }

  receiveImage = (image) => {
    if (image) {
      localForage
        .getItem(image)
        .then((value) => {
          this.storage[image] = value;
          this.forceUpdate();
        });
    }
  }

  removeImage = (event) => {
    event.stopPropagation();
    this.storage[
      this.state
        .temp
        .image
    ] = undefined;
    this.setState({
      temp: {
        ...this.state.temp,
        image: undefined,
      },
    });
  }

  render() {
    const {
      temp,
      modal,
      content,
    } = this.state;
    return (
      <div onDoubleClick={this.openModal}>
        <Preview
          data={content}
          storage={this.storage}
        />
        <Editor
          data={temp}
          isOpen={modal}
          storage={this.storage}
          closeModal={this.closeModal}
          changeText={this.changeData('text')}
          changeTitle={this.changeData('title')}
          uploadImage={this.uploadImage}
          removeImage={this.removeImage}
          saveSettings={this.saveSettings}
        />
      </div>
    );
  }
}

Card.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    image: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
};

Card.defaultProps = {
  content: {
    text: 'Текст',
    image: null,
    title: 'Заголовок',
  },
};

export default Card;
