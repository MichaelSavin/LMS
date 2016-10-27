import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import ReactPlayer from 'react-player';
import { Icon as AntIcon } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...props.content,
      settings: false,
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

  editContent = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .source,
      },
    });
  }

  modifyContent = () => {
    const {
      value: source,
    } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          source,
        },
      }
    );
    this.setState({
      source,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      source,
      promt,
    } = this.state;
    return (
      <div
        className={styles.video}
      >
        <ReactPlayer
          url={source}
          controls
        />
        <AntIcon
          type="setting"
          className={styles.icon}
          onClick={this.editContent}
        />
        <AntPromt
          value={promt.value}
          onSave={this.modifyContent}
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

Video.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    source: PropTypes.string.isRequired,
  }).isRequired,
};

Video.defaultProps = {
  content: {
    source: 'https://www.youtube.com/watch?v=XFF2ECZ8m1A',
  },
};

export default Video;
