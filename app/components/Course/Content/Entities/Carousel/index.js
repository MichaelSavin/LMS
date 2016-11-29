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
import localForage from 'localforage';
import { Entity } from 'draft-js';
import { message } from 'antd';
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Carousel extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      drag: null,
      temp: content,
      modal: false,
      content,
    };
    this.cache = {};
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
        .temp
        .slides
        .map((slide) =>
          slide.image.source
        )
      )
    )) {
      this.receiveImages(this.state);
      return false;
    } else {
      return !isEqual(
        this.state,
        nextState
      );
    }
  }

  openModal = () => {
    this.setState({
      modal: true,
      temp: this
        .state
        .content,
    });
  }

  closeModal = () => {
    this.setState({
      modal: false,
    });
  }

  changeSlideText = (index) => (event) => {
    this.setState({
      temp: set([
        'slides',
        index,
        'text',
      ],
        event.target.value,
        this.state.temp,
      ),
    });
  }

  changeSlideType = (index) => (checked) => {
    this.setState({
      temp: set([
        'slides',
        index,
        'type',
      ], {
        true: 'text',
        false: 'image',
      }[
        checked
      ],
        this.state.temp,
      ),
    });
  }

  addSlide = () => {
    this.setState({
      temp: update(
        'slides',
        (slides) => slides.concat([{
          type: 'image',
          text: 'Текстовый слайд',
          image: {
            source: undefined,
            text: undefined,
          },
        }]),
        this.state.temp,
      ),
    }, () => this.forceUpdate()); // Странный баг - не вызывается render()
  }

  removeSlide = (index) => () => {
    if (this.state.temp.slides.length > 1) {
      this.setState({
        temp: update(
          'slides',
          (slides) => remove(
            (slide) => slides.indexOf(
              slide
            ) === index,
            slides,
          ),
          this.state.temp,
        ),
      }, () => this.forceUpdate()); // Странный баг - не вызывается render()
    } else {
      message.error('Нельзя удалить единственный элемент');
    }
  }

  dragSlide = ({ oldIndex, newIndex }) => {
    this.setState({
      temp: {
        slides: arrayMove(
          this.state.temp.slides,
          oldIndex,
          newIndex,
        ),
      },
    });
  };

  uploadSlideImage = (index) => ({ file }) => {
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
            temp: set([
              'slides',
              index,
              'image',
              'source',
            ],
              name,
              this.state.temp,
            ),
          });
          this.cache[name] = reader.result;
          this.forceUpdate();
        });
      };
    }
  }

  removeSlideImage = (index) => (event) => {
    event.stopPropagation();
    this.setState({
      temp: set([
        'slides',
        index,
        'image',
      ], {
        source: undefined,
        text: undefined,
      },
        this.state.temp,
      ),
    });
  }

  receiveImages = (state) => {
    state.temp.slides.forEach(({
      image: { source: image },
    }) => {
      if (image) {
        localForage
          .getItem(image)
          .then((value) => {
            this.cache[image] = value;
            this.forceUpdate();
          });
      }
    });
  }

  saveSettings = () => {
    const content =
      this.state.temp;
    this.setState({
      modal: false,
      content,
    }, () => this.forceUpdate()); // Странный баг - не вызывается render()
    Entity.replaceData(
      this.props.entityKey, {
        content,
      }
    );
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
          cache={this.cache}
        />
        <Editor
          data={temp}
          cache={this.cache}
          isOpen={modal}
          addSlide={this.addSlide}
          dragSlide={this.dragSlide}
          closeModal={this.closeModal}
          removeSlide={this.removeSlide}
          saveSettings={this.saveSettings}
          changeSlideText={this.changeSlideText}
          changeSlideType={this.changeSlideType}
          uploadSlideImage={this.uploadSlideImage}
          removeSlideImage={this.removeSlideImage}
        />
      </div>
    );
  }
}

Carousel.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf([
          'text',
          'image',
        ]).isRequired,
        text: PropTypes.string,
        image: PropTypes.shape({
          source: PropTypes.string,
          text: PropTypes.string,
        }),
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Carousel.defaultProps = {
  content: {
    slides: [{
      type: 'image',
      text: 'Текстовый слайд',
      image: {
        source: undefined,
        text: undefined,
      },
    }],
  },
};

export default Carousel;
