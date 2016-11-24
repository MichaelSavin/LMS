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
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import {
  Icon as AntIcon,
  Input as AntInput,
  Modal as AntModal,
  Select as AntSelect,
  Button as AntButton,
  Timeline as AntTimeline,
  Popconfirm as AntPopconfirm,
} from 'antd';
import Icon from 'components/UI/Icon';
import Dropzone from 'react-dropzone';
import { Entity } from 'draft-js';
import styles from './styles.css';

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

  uploadImage = (index) => (files) => {
    const file = files[0].slice(0);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => { // eslint-disable-line
      this.setState({
        temp: set([
          'steps',
          index,
          'image',
        ],
          reader.result,
          this.state.temp,
        ),
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
        <Components.Timeline data={content} />
        <AntModal
          onOk={this.saveSettings}
          title={
            <div className={styles.title}>
              <span>Шкала времени</span>
              <AntButton
                type="default"
                icon="plus"
                size="small"
                onClick={this.addStep}
              >
                Добавить новое событие
              </AntButton>
            </div>
          }
          okText="Сохранить"
          visible={modal}
          onCancel={this.closeModal}
          cancelText="Отмена"
        >
          <Sortable.List
            onSortEnd={this.dragStep}
            useDragHandle
          >
            <div className={styles.steps}>
              {temp.steps.map((
                step,
                index
              ) =>
                <Sortable.Item
                  key={index}
                  index={index}
                >
                  <div className={styles.step}>
                    <Sortable.Handler />
                    <AntSelect
                      value={step.color}
                      className={styles.color}
                      onChange={this.changeColor(index)}
                    >
                      {['blue',
                        'red',
                        'green',
                        ].map((color, _index) =>
                          <AntSelect.Option
                            key={_index}
                            value={color}
                          >
                            <div
                              className={styles[color]}
                            />
                          </AntSelect.Option>
                      )}
                    </AntSelect>
                    <div className={styles.text}>
                      <AntInput
                        value={step.text}
                        onChange={this.changeText(index)}
                      />
                    </div>
                    <div className={styles.image}>
                      <Dropzone
                        multiple={false}
                        onDrop={this.uploadImage(index)}
                        className={styles.upload}
                      >
                        {step.image
                          ?
                            <img
                              src={step.image}
                              role="presentation"
                              height={25}
                              width={25}
                            />
                          :
                            <Icon
                              size={20}
                              type="photo"

                            />
                        }
                      </Dropzone>
                    </div>
                    <AntPopconfirm
                      title="Удалить событие?"
                      okText="Да"
                      onConfirm={this.removeStep(index)}
                      cancelText="Нет"
                    >
                      <AntIcon
                        type="close"
                        className={styles.remove}
                      />
                    </AntPopconfirm>
                  </div>
                </Sortable.Item>
              )}
              <div className={styles.preview}>
                <span className={styles.title}>
                  Предосмотр
                </span>
                <Components.Timeline data={temp} />
              </div>
            </div>
          </Sortable.List>
        </AntModal>
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
      }).isRequired
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

const Components = {
  Timeline: ({ data }) => // eslint-disable-line
    <AntTimeline>
      {data.steps.map(({
        text,
        color,
        image,
      }, index) =>
        <AntTimeline.Item
          key={index}
          color={color}
        >
          <div>{text}</div>
          <div>
            {image &&
              <img
                src={image}
                width={250}
                role="presentation"
              />
            }
          </div>
        </AntTimeline.Item>
      )}
    </AntTimeline>,
};

const Sortable = {
  List: SortableContainer(
    (props) => <ul>{props.children}</ul>
  ),
  Item: SortableElement(
    (props) => <li>{props.children}</li>
  ),
  Handler: SortableHandle(() =>
    <AntIcon
      type="appstore-o"
      className={styles.drag}
    />
  ),
};

export default Timeline;
