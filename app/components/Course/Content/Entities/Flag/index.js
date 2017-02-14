import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import { Icon as AntIcon, Popconfirm as AntPopconfirm } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import rgb from 'color-space/rgb';
import hsl from 'color-space/hsl';
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

  componentToHex = (c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }

  convertRGBtoHSL = (c) => {
    const hex = c.replace('#', '');
    const RGB = {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16),
    };
    const HSL = rgb.hsl([RGB.r, RGB.g, RGB.b]);
    return HSL;
  }

  convertHex = (hex) => {
    const HSL = this.convertRGBtoHSL(hex);
    const color = HSL[0];
    const saturation = HSL[1] - 3;
    const lightness = HSL[2] + 35;
    const RGB = hsl.rgb([color, saturation, lightness]);
    const RGBr = this.componentToHex(Math.round(RGB[0]));
    const RGBg = this.componentToHex(Math.round(RGB[1]));
    const RGBb = this.componentToHex(Math.round(RGB[2]));
    return `#${RGBr}${RGBg}${RGBb}`;
  }

  chooseColor = (color) => {
    const bgcolor = this.convertHex(color);
    this.setState({
      temp: {
        ...this.state.temp,
        color,
        bgcolor,
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
    console.log(temp.bgcolor);
    return (
      <div className={styles.modal}>
        <div
          style={{ backgroundColor: temp.bgcolor }}
          className={classNames(
            styles.flag,
          )}
        >
          <i
            style={{ color: temp.color }}
            className={classNames(
              { [`anticon ${temp.icon}`]: true },
              styles.anticonflag,
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
        {!this.context.isPlayer && <div>
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
        </div>}
      </div>
    );
  }
}

Flag.defaultProps = {
  content: {
    message: 'Это Флаг',
    icon: 'anticon-info-circle',
    color: '#87D068',
    bgcolor: '#F3FAF0',
  },
};

Flag.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    message: PropTypes.string,
    icon: PropTypes.string,
    color: PropTypes.string,
    bgcolor: PropTypes.string,
  }).isRequired,
};

Flag.contextTypes = {
  isPlayer: PropTypes.bool,
};

export default Flag;
