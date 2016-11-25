import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { Icon as AntIcon, Popconfirm as AntPopconfirm } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import FlagOptions from './FlagOptions';
import styles from './styles.css';

class Flag extends Component {

  constructor(props) {
    super(props);
    const { content } = props;
    this.state = {
      content,
      temp: content,
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
    const content =
      this.state.temp;
    form.validateFields((err) => {
      if (!err) {
        Entity.replaceData(
          this.props.entityKey, {
            content,
          }
        );
        this.setState({
          content,
          modal: false,
        });
      }
    });
  }

  chooseColor = (color) => {
    this.setState({
      temp: {
        ...this.state.temp,
        color,
      },
    });
  }

  chooseIcon = (icon) => {
    this.setState({
      temp: {
        ...this.state.temp,
        icon,
      },
    });
  }

  saveFormRef = (form) => {
    this.form = form;
  }

  openFlagOptions = () => {
    this.setState({
      modal: true,
      temp: this.state.content,
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
      temp,
      content,
    } = this.state;
    return (
      <div className={styles.modal}>
        <div
          className={classNames(
            styles.flag,
            styles[content.color],
          )}
        >
          <i
            className={classNames(
              { [`anticon ${content.icon}`]: true },
              styles.anticonflag,
              styles[content.icon],
            )}
          />
          <span className={styles.message}>{content.message}</span>
          <FlagOptions
            ref={this.saveFormRef}
            data={temp}
            modal={modal}
            onCancel={this.closeFlagOptions}
            onCreate={this.saveOptions}
            onChooseIcon={this.chooseIcon}
            onChooseColor={this.chooseColor}
            onEditMessage={this.editMessage}
          />
        </div>
        <AntIcon
          type="edit"
          className={styles.button}
          onClick={this.openFlagOptions}
        />
        <AntPopconfirm title="Вы уверены?" okText="Да" cancelText="Нет">
          <AntIcon
            type="close"
            className={styles.button}
          />
        </AntPopconfirm>
      </div>
    );
  }
}

Flag.defaultProps = {
  content: {
    message: 'Это Флаг',
    icon: 'anticon-check-circle',
    color: 'info-color',
  },
};

Flag.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    message: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
};

export default Flag;
