import React, { Component, PropTypes } from 'react';
import { Timeline as AntTimeline } from 'antd';
import AntPromt from 'components/UI/Promt';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
// import styles from './styles.css';

class Timeline extends Component {

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

  editTimeline = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .steps
          .join('\n'),
      },
    });
  }

  modifyTimeline = () => {
    const steps = this
      .state
      .promt
      .value
      .split('\n');
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          steps,
        },
      }
    );
    this.setState({
      steps,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
      steps,
    } = this.state;
    return (
      <div onDoubleClick={this.editTimeline}>
        <AntTimeline>
          {steps.map((step, index) =>
            <AntTimeline.Item key={index}>
              {step}
            </AntTimeline.Item>
          )}
        </AntTimeline>
        <AntPromt
          type="textarea"
          value={promt.value}
          onSave={this.modifyTimeline}
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

Timeline.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    steps: PropTypes.array.isRequired,
  }).isRequired,
};

Timeline.defaultProps = {
  content: {
    steps: [
      'Первое событие',
      'Второе событие',
      'Третье событие',
      'Четвертое событие',
      'Пятое событие',
    ],
  },
};

export default Timeline;
