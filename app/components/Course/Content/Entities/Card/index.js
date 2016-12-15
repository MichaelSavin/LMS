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

const canvas = document.createElement('canvas');

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
      storage: {},
      storageFromBD: {},
      content,
      dimensions,
      aspect: 0,
      crop: {},
    };
    this.storage = {};
    this.rawStorage = {};
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

  onCropComplete = (crop, pixelCrop) => {
    const { temp: { image }, temp } = this.state;

    canvas.width = pixelCrop.width; // eslint-disable-line fp/no-mutation
    canvas.height = pixelCrop.height; // eslint-disable-line fp/no-mutation

    const context = canvas.getContext('2d');
    const imageObj = new Image();

    context.clearRect(0, 0, canvas.width, canvas.height);

    imageObj.onload = () => { // eslint-disable-line fp/no-mutation
      context.drawImage(
        imageObj,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0, 0,
        pixelCrop.width, pixelCrop.height,
      );
      this.storage[`crop${image}`] = canvas.toDataURL('image/jpeg', 1);
      this.setState({
        temp: {
          ...temp,
          crop,
        },
      });
    };
    imageObj.src = this.storage[image]; // eslint-disable-line fp/no-mutation
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
    const {
      temp: {
        image,
      },
      temp,
    } = this.state;
    localForage.setItem(
      `crop${image}`,
      this.storage[`crop${image}`],
    ).then(() => {
      Entity.mergeData(
        this.props.entityKey, {
          content: temp,
        }
      );
      this.rawStorage[`crop${image}`] = this.storage[`crop${image}`];
      this.setState({
        modal: false,
        content: temp,
      });
      // this.forceUpdate();
    });
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
          this.storage[name] = reader.result;
          this.storage[`crop${name}`] = reader.result;
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
      const imgPromise = localForage
        .getItem(image);
      const cropImgPromise = localForage
        .getItem(`crop${image}`);

      Promise.all([imgPromise, cropImgPromise])
        .then((values) => {
          this.storage[image] = values[0];
          this.storage[`crop${image}`] = values[1] || values[0];
          this.rawStorage[`crop${image}`] = values[1] || values[0];
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
        crop: {},
        aspect: 0,
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
      <div onDoubleClick={this.openModal}>
        <Preview
          data={content}
          storage={this.rawStorage}
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
          onCropComplete={this.onCropComplete}
          changeData={this.changeData}
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
    crop: PropTypes.object,
    aspect: PropTypes.number,
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
    crop: {},
    aspect: 0,
  },
  dimensions: {
    width: undefined,
    fullscreen: true,
  },
};

export default Card;
