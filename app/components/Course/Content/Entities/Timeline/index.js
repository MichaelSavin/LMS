import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Input as AntInput,
  Modal as AntModal,
  Select as AntSelect,
  Button as AntButton,
  Timeline as AntTimeline,
  Popconfirm as AntPopconfirm,
} from 'antd';
import { Entity } from 'draft-js';
import { fromJS, List } from 'immutable';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Timeline extends Component {

  constructor(props) {
    super(props);
    const data = fromJS(
      props.content
    );
    this.state = {
      content: data,
      modal: false,
      temp: data,
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
        content: content.toJS(),
      }
    );
  }

  closeModal = () => {
    this.setState({
      modal: false,
    });
  }

  changeColor = index => (value) => {
    this.setState({
      temp: this.state
        .temp.setIn([
          'steps',
          index,
          'color',
        ],
          value
        ),
    });
  }

  changeText = index => (event) => {
    this.setState({
      temp: this.state
        .temp.setIn([
          'steps',
          index,
          'text',
        ],
          event
            .target
            .value,
        ),
    });
  }

  addStep = () => {
    this.setState({
      temp: this.state
        .temp.updateIn([
          'steps',
        ],
          List.of(),
          list => list.push(fromJS({
            text: 'Новое событие',
            color: 'blue',
          }))
        ),
    });
  }

  removeStep = index => () => {
    this.setState({
      temp: this.state
        .temp.deleteIn([
          'steps',
          index,
        ]),
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
        <Element data={content} />
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
          <div className={styles.steps}>
            {temp.get('steps').map((
              step,
              index
            ) =>
              <div
                key={index}
                className={styles.step}
              >
                <div>
                  <AntSelect
                    value={step.get('color')}
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
                </div>
                <div className={styles.text}>
                  <AntInput
                    value={step.get('text')}
                    onChange={this.changeText(index)}
                  />
                </div>
                { /* <div className={styles.image}>
                  Картинка
                </div> */ }
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
            )}
            <div className={styles.preview}>
              <span className={styles.title}>
                Предосмотр
              </span>
              <Element data={temp} />
            </div>
          </div>
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
      { text: 'Первое событие', color: 'blue', image: '' },
      { text: 'Второе событие', color: 'blue', image: '' },
      { text: 'Третье событие', color: 'blue', image: '' },
      { text: 'Четвертое событие', color: 'blue', image: '' },
    ],
  },
};

const Element = ({ data }) => // eslint-disable-line
  <AntTimeline>
    {data.toJS().steps.map(({
      text,
      color,
      image,
      }, index) =>
        <AntTimeline.Item
          key={index}
          color={color}
        >
          {text}
          {image &&
            <img
              src={image}
              role="presentation"
            />
          }
        </AntTimeline.Item>
    )}
  </AntTimeline>;

export default Timeline;
