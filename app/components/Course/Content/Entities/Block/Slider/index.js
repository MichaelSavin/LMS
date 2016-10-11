import { isEqual, uniq, min, max, inRange } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Slider as AntSlider } from 'antd';
import AntPromt from 'components/UI/Promt';
import { Entity } from 'draft-js';
// import styles from './styles.css';

class Slider extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props.content,
      promt: {
        open: false,
        value: null,
      },
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

  editScale = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .scale
          .join(';'),
      },
    });
  }

  changeValue = (value) => {
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          scale: this
            .state
            .scale,
          value,
        },
      },
    );
    this.setState({ value });
  }

  modifyScale = () => {
    const scale = uniq(
      this
      .state
      .promt
      .value
      .split(';')
      .map(step => parseInt(step, 10))
      .filter(step => !isNaN(step))
    );
    const value = inRange(
      parseInt(this.state.value, 10),
      min(scale),
      max(scale),
    )
      ? parseInt(this.state.value, 10)
      : min(scale);
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          value,
          scale,
        },
      }
    );
    this.setState({
      value,
      scale,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
      value,
      scale,
    } = this.state;
    return (
      <div onContextMenu={this.editScale}>
        <AntSlider
          marks={scale.reduce((marks, step) =>
            ({ ...marks, [step]: `${step}` }), {}
          )}
          onChange={this.changeValue}
          min={min(scale)}
          max={max(scale)}
          value={value}
          step={1}
          included
        />
        <AntPromt
          value={promt.value}
          onSave={this.modifyScale}
          visible={promt.open}
          onChange={(event) => {
            this.setState({
              promt: {
                ...promt,
                value: event
                  .target
                  .value,
              },
            });
          }}
          onCancel={() => {
            this.setState({
              promt: {
                ...promt,
                open: false,
              },
            });
          }}
        />
      </div>
    );
  }
}

Slider.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    value: PropTypes.number.isRequired,
    scale: PropTypes.array.isRequired,
  }).isRequired,
};

export default Slider;
