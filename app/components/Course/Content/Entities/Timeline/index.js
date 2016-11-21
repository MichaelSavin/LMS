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
import Preview from './Preview';
import Editor from './Editor';
import './styles.css';

class Timeline extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      drag: null,
      temp: content,
      modal: false,
      content,
    };
    this.images = {};
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
        .steps
        .map((step) =>
          step.image
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

  changeColor = (index) => (value) => {
    this.setState({
      temp: set([
        'steps',
        index,
        'color',
      ],
        value,
        this.state.temp,
      ),
    });
  }

  changeText = (index) => (event) => {
    this.setState({
      temp: set([
        'steps',
        index,
        'text',
      ],
        event.target.value,
        this.state.temp,
      ),
    });
  }

  addStep = () => {
    this.setState({
      temp: update(
        'steps',
        (steps) => steps.concat([{
          text: 'Новое событие',
          color: 'blue',
        }]),
        this.state.temp,
      ),
    });
  }

  removeStep = (index) => () => {
    this.setState({
      temp: update(
        'steps',
        (steps) => remove(
          (step) => steps.indexOf(
            step
          ) === index,
          steps,
        ),
        this.state.temp,
      ),
    });
  }

  dragStep = ({ oldIndex, newIndex }) => {
    this.setState({
      temp: {
        steps: arrayMove(
          this.state.temp.steps,
          oldIndex,
          newIndex,
        ),
      },
    });
  };

  receiveImages = (state) => {
    state.temp.steps.forEach(({
      image,
    }) => {
      if (image) {
        localForage
          .getItem(image)
          .then((value) => {
            this.images[image] = value;
            this.forceUpdate();
          });
      }
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
        this.setState({
          temp: set([
            'steps',
            index,
            'image',
          ],
            name,
            this.state.temp,
          ),
        });
        this.images[name] = reader.result;
        this.forceUpdate();
      });
    };
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
          images={this.images}
        />
        <Editor
          data={temp}
          isOpen={modal}
          images={this.images}
          addStep={this.addStep}
          dragStep={this.dragStep}
          closeModal={this.closeModal}
          removeStep={this.removeStep}
          changeText={this.changeText}
          uploadImage={this.uploadImage}
          changeColor={this.changeColor}
          saveSettings={this.saveSettings}
        />
      </div>
    );
  }
}

Timeline.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.string,
        color: PropTypes.oneOf([
          'blue',
          'red',
          'green',
        ]).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

Timeline.defaultProps = {
  content: {
    steps: [
      { text: 'Первое событие', color: 'blue', image: null },
      { text: 'Второе событие', color: 'blue', image: null },
      { text: 'Третье событие', color: 'blue', image: null },
      { text: 'Четвертое событие', color: 'blue', image: null },
    ],
  },
};

export default Timeline;
