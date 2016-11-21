import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import { Icon as AntIcon, Popconfirm as AntPopconfirm } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import FlagOptions from './FlagOptions';
import styles from './styles.css';

class Flag extends Component {

  constructor(props) {
    super(props);
    const {
      icons,
      colors,
      message,
    } = Entity
      .get(this.props.entityKey)
      .getData()
      .content;
    this.state = {
      colors,
      icons,
      message,
      temp: {
        colors,
        icons,
        message,
      },
      modal: false,
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

  editMessage = (e) => {
    this.setState({
      temp: {
        ...this.state.temp,
        message: e.target.value,
      },
    });
  }

  saveOptions = (e) => {
    e.preventDefault();
    const form = this.form;
    form.validateFields((err) => {
      if (err) {
        return;
      }
      Entity.replaceData(
        this.props.entityKey, {
          content: {
            message: form.getFieldValue('message'),
            icons: form.getFieldValue('icons'),
            colors: form.getFieldValue('colors'),
          },
        }
      );
      this.setState({
        message: form.getFieldValue('message'),
        colors: form.getFieldValue('colors'),
        icons: form.getFieldValue('icons'),
        modal: false,
      });
    });
  }

  chooseColor = (colors) => {
    this.setState({
      temp: {
        ...this.state.temp,
        colors,
      },
    });
  }

  chooseIcon = (icons) => {
    this.setState({
      temp: {
        ...this.state.temp,
        icons,
      },
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  openFlagOptions = () => {
    this.setState({
      modal: true,
      temp: {
        message: this.state.message,
      },
    });
  }

  closeFlagOptions = () => {
    this.setState({
      modal: false,
    });
  }

  render() {
    const {
      modal,
      icons,
      colors,
      message,
      temp,
    } = this.state;
    return (
      <div className={styles.modal}>
        <div
          className={cx(
            styles.flag,
            styles[colors],
          )}
        >
          <i
            className={cx(
              { [`anticon ${icons}`]: true },
              styles.anticonflag,
              styles[icons],
            )}
          />
          <span className={styles.message}>{message}</span>
          <FlagOptions
            ref={this.saveFormRef}
            modal={modal}
            message={temp.message}
            colors={colors}
            icons={icons}
            onCancel={this.closeFlagOptions}
            onCreate={this.saveOptions}
            onChooseIcon={this.chooseIcon}
            onChooseColor={this.chooseColor}
            onEditMessage={this.editMessage}
          />
        </div>
        <AntIcon
          type="edit"
          className={styles.btn}
          onClick={this.openFlagOptions}
        />
        <AntPopconfirm title="Вы уверены?" okText="Да" cancelText="Нет">
          <AntIcon
            type="close"
            className={styles.btn}
          />
        </AntPopconfirm>
      </div>
    );
  }
}

Flag.defaultProps = {
  message: 'flag',
  icons: 'anticon-check-circle',
  colors: 'info-color',
};

Flag.propTypes = {
  entityKey: PropTypes.string.isRequired,
};

export default Flag;
