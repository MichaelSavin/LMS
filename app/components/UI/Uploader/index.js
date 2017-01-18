import React, { Component, PropTypes } from 'react';
import { set, isEqual } from 'lodash/fp';
import localForage from 'localforage';
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Uploader extends Component {

  constructor(props) {
    super(props);
    const {
      content,
      preload,
    } = props;
    this.state = {
      content: {
        editor: {
          ...content,
          image: preload,
        },
        component: {
          ...content,
          image: preload,
        },
      },
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

  saveContent = () => {
    const {
      content: {
        editor,
      },
    } = this.state;
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
    },
      // Передача данных в основной компонент
      () => {
        this.props.onChange(
          this.state.content.component.image,
          this.storage.image,
          this.storage.crop.component
        );
      }
    );
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
    } = this.state;
    const {
      size,
    } = this.props;
    return (
      <div onClick={this.openModal}>
        <Preview
          size={size}
          content={component}
          storage={this.storage}
          placement="component"
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

const ImagePropType = PropTypes.shape({
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
});

Uploader.propTypes = {
  size: PropTypes.oneOf(['small', 'auto']).isRequired,
  preload: ImagePropType,
  content: PropTypes.shape({
    image: ImagePropType,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

Uploader.defaultProps = {
  content: {
    text: 'Текст',
    title: 'Заголовок',
    image: undefined,
  },
};

export default Uploader;
