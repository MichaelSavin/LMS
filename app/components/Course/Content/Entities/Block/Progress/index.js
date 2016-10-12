import React, { Component, PropTypes } from 'react';
import { Progress as AntProgress } from 'antd';
import AntPromt from 'components/UI/Promt';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
// import styles from './styles.css';

class Progress extends Component {

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

  editPercent = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .percent,
      },
    });
  }

  modifyPercent = () => {
    const value = parseInt(
      this.state.promt.value, 10
    );
    const percent =
      isNaN(value) || value > 100
        ? 100
        : value;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          percent,
        },
      }
    );
    this.setState({
      percent,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
      percent,
    } = this.state;
    console.log(this.state);
    return (
      <div onDoubleClick={this.editPercent}>
        <AntProgress percent={percent} />
        <AntPromt
          value={promt.value}
          onSave={this.modifyPercent}
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

Progress.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    percent: PropTypes.number.isRequired,
  }).isRequired,
};

export default Progress;
