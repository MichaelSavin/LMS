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
    const {
      content,
      dimensions,
    } = props;
    this.state = {
      temp: content,
      modal: false,
      content,
      dimensions,
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

  toggleFullscreen = () => {
    const dimensions = {
      ...this.state.dimensions,
      fullscreen: !this.state
        .dimensions
        .fullscreen,
    };
    this.setState({ dimensions });
    Entity.mergeData(
      this.props.entityKey, {
        dimensions,
      }
    );
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    });
    Entity.mergeData(
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
    // Так как мы не загружаем на сервер
    // "error" в нашем случае это "success"
    if (file.status === 'error') {
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
          this.storage[name] = reader.result;
          this.setState({
            temp: {
              ...this.state.temp,
              image: name,
            },
          });
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
      dimensions,
    } = this.state;
    return (
      <div onDoubleClick={!this.context.isPlayer && this.openModal}>
        <Preview
          data={content}
          storage={this.storage}
          placement="editor"
          dimensions={dimensions}
          toggleFullscreen={this.toggleFullscreen}
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
  dimensions: PropTypes.shape({
    width: PropTypes.number,
    fullscreen: PropTypes.bool.isRequired,
  }).isRequired,
};

Card.defaultProps = {
  content: {
    text: 'Текст',
    image: null,
    title: 'Заголовок',
  },
  dimensions: {
    width: undefined,
    fullscreen: true,
  },
};

Card.contextTypes = {
  isPlayer: PropTypes.bool,
};

export default Card;
