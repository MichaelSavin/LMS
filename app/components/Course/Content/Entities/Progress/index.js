import React, {
  Component,
  PropTypes,
} from 'react';
import {
  Form as AntForm,
  Modal as AntModal,
  Radio as AntRadio,
  Slider as AntSlider,
  Progress as AntProgress,
 } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Progress extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: props.content,
      modal: false,
      temp: props.content,
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

  changeType = (event) => {
    this.setState({
      temp: {
        ...this
          .state
          .temp,
        type: event
          .target
          .value,
      },
    });
  }

  changeStatus = (event) => {
    this.setState({
      temp: {
        ...this
          .state
          .temp,
        status: event
          .target
          .value,
      },
    });
  }

  changePercent = (value) => {
    this.setState({
      temp: {
        ...this
          .state
          .temp,
        percent: value,
      },
    });
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

  render() {
    const {
      temp,
      modal,
      content,
    } = this.state;
    return (
      <div onDoubleClick={this.openModal}>
        <AntProgress
          type={content.type}
          status={content.status}
          percent={content.percent}
          format={() => `${content.percent}%`}
        />
        <AntModal
          title="Прогресс"
          visible={modal}
          okText="Сохранить"
          cancelText="Отмена"
          onCancel={this.closeModal}
          onOk={this.saveSettings}
        >
          <div className={styles.form}>
            <AntForm horizontal>
              <AntForm.Item label="Вид">
                <AntRadio.Group
                  value={temp.type}
                  onChange={this.changeType}
                >
                  {[{ type: 'line', name: 'Линейный' },
                    { type: 'circle', name: 'Радиальный' },
                  ].map(({ type, name }, index) =>
                    <AntRadio.Button
                      key={index}
                      value={type}
                    > {name}
                    </AntRadio.Button>
                  )}
                </AntRadio.Group>
              </AntForm.Item>
              <AntForm.Item label="Цвет">
                <AntRadio.Group
                  value={temp.status}
                  onChange={this.changeStatus}
                >
                  {[{ type: 'normal', name: 'Синий' },
                    { type: 'success', name: 'Зеленый' },
                    { type: 'exception', name: 'Красный' },
                  ].map(({ type, name }, index) =>
                    <AntRadio.Button
                      key={index}
                      value={type}
                      className={styles[type]}
                    > {name}
                    </AntRadio.Button>
                  )}
                </AntRadio.Group>
              </AntForm.Item>
              <AntForm.Item label="Процент">
                <AntSlider
                  onChange={this.changePercent}
                  value={temp.percent}
                />
              </AntForm.Item>
            </AntForm>
            <div className={styles.preview}>
              <span className={styles.title}>
                Предосмотр
              </span>
              <AntProgress
                type={temp.type}
                status={temp.status}
                percent={temp.percent}
                format={() => `${temp.percent}%`}
              />
            </div>
          </div>
        </AntModal>
      </div>
    );
  }
}

Progress.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    percent: PropTypes.number.isRequired,
    type: PropTypes.oneOf([
      'line',
      'circle',
    ]).isRequired,
    status: PropTypes.oneOf([
      'normal',
      'success',
      'exception',
    ]).isRequired,
  }).isRequired,
};

Progress.defaultProps = {
  content: {
    type: 'line',
    status: 'normal',
    percent: 50,
  },
};

export default Progress;
