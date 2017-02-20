import React, { Component, PropTypes } from 'react';
import { set, isEqual } from 'lodash/fp';
import localForage from 'localforage';
import { Entity } from 'draft-js';
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Crop extends Component {

  constructor(props) {
    super(props);
    const {
      content,
      dimensions,
    } = props;
    this.state = {
      content: {
        editor: content,
        component: content,
      },
      dimensions,
      isEditing: false,
    };
    this.storage = {
      image: {},
      crop: {
        editor: {},
        component: {},
      },
    };
  }

  componentDidMount() {
    const {
      image,
    } = this
      .state
      .content
      .component;
    if (image) {
      localForage
        .getItem(image.source)
        .then((binary) => {
          const { crop } = this.state
            .content
            .component
            .image;
          this.storage.image[
            image.source
          ] = binary;
          if (crop) {
            this.createCrop(
              crop,
              crop.pixels,
              'mountComponent',
            );
          } else {
            this.forceUpdate();
          }
        });
    }
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

  createCrop = (crop, pixelCrop, event = 'changeCrop') => {
    const { content: { editor: { image } } } = this.state;
    // Создание уникального канваса для кропа каждого изображения
    // Нужно для параллельного вычисления нескольких кропов одновременно
    const canvas = document.createElement('canvas');
    /* eslint-disable fp/no-mutation */
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const context = canvas.getContext('2d');
    const imageObj = new Image();
    context.clearRect(0, 0, canvas.width, canvas.height);
    imageObj.src = this.storage.image[image.source];
    imageObj.onload = () => {
    /* eslint-enable fp/no-mutation */
      context.drawImage(
        imageObj,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0, 0,
        pixelCrop.width,
        pixelCrop.height,
      );
      const binary = canvas.toDataURL('image/jpeg', 1);
      this.storage.crop.editor[image.source] = binary;
      // Срабатывает при подмонтировании компонента
      if (event === 'mountComponent') {
        this.storage.crop.component[image.source] = binary;
        this.forceUpdate();
      }
      // Срабатывает при изменении кропа в редакторе
      if (event === 'changeCrop') {
        this.setState({
          content: set([
            'editor',
            'image',
            'crop',
          ], {
            ...crop,
            pixels: pixelCrop,
          },
            this.state.content,
          ),
        });
      }
    };
  }

  openModal = () => {
    this.setState({
      isEditing: true,
      content: {
        ...this.state.content,
        editor: this.state
          .content
          .component,
      },
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

  saveContent = () => {
    const {
      content: {
        editor,
      },
    } = this.state;
    Entity.mergeData(
      this.props.entityKey, {
        content: editor,
      }
    );
    // Глубокое копирование Base64 строк изображений
    this.storage.crop.component = JSON.parse(
      JSON.stringify(
        this.storage.crop.editor
      )
    );
    this.setState({
      content: {
        ...this.state.content,
        component: editor,
      },
      isEditing: false,
    });
  }

  closeEditor = () => {
    this.setState({
      isEditing: false,
    });
  }

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

  uploadImage = ({ file }) => {
    if (file.status === 'error') {
      const imageName = [
        file.lastModified,
        file.size,
        file.name,
      ].join('');
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      // eslint-disable-next-line fp/no-mutation
      reader.onloadend = () => {
        localForage.setItem(
          imageName,
          reader.result,
        ).then(() => {
          this.storage.image[imageName] = reader.result;
          this.setState({
            content: set([
              'editor',
              'image',
            ], {
              source: imageName,
            },
              this.state.content,
            ),
          });
        });
      };
    }
  }

  removeImage = (event) => {
    event.stopPropagation();
    this.setState({
      content: set([
        'editor',
        'image',
      ],
        undefined,
        this.state.content,
      ),
    });
  }

  render() {
    const {
      content: {
        editor,
        component,
      },
      isEditing,
      dimensions,
    } = this.state;
    return (
      <div onDoubleClick={!this.context.isPlayer && this.openModal}>
        <Preview
          content={component}
          storage={this.storage}
          placement="component"
          dimensions={dimensions}
          toggleFullscreen={this.toggleFullscreen}
        />
        <Editor
          isOpen={isEditing}
          content={editor}
          storage={this.storage}
          createCrop={this.createCrop}
          closeEditor={this.closeEditor}
          uploadImage={this.uploadImage}
          removeImage={this.removeImage}
          saveContent={this.saveContent}
          changeContent={this.changeContent}
        />
      </div>
    );
  }
}

Crop.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    title: PropTypes.string,
    image: PropTypes.shape({
      source: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      crop: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        pixels: PropTypes.shape({
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
          width: PropTypes.number.isRequired,
          height: PropTypes.number.isRequired,
        }).isRequired,
        aspect: PropTypes.oneOf([
          false,
          16 / 9,
          4 / 3,
          1,
          3 / 4,
          9 / 16,
        ]),
      }),
    }),
  }).isRequired,
  dimensions: PropTypes.shape({
    fullscreen: PropTypes.bool.isRequired,
    width: PropTypes.number,
  }).isRequired,
};

Crop.defaultProps = {
  content: {
    text: 'Текст',
    title: 'Заголовок',
    image: undefined,
  },
  dimensions: {
    fullscreen: false,
    width: undefined,
  },
};

Crop.contextTypes = {
  isPlayer: PropTypes.bool,
};

export default Crop;
