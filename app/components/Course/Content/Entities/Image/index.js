import React, { PropTypes, Component } from 'react';
import AntPromt from 'components/UI/Promt';
import { Card as AntCard } from 'antd';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Image extends Component {

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

  editContent = () => {
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
          text: this
            .state
            .text,
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
      text,
      source,
      promt,
    } = this.state;
    return (
      <div>
        <AntCard
          className={styles.card}
          bodyStyle={{ padding: 0 }}
          onDoubleClick={this.editContent}
        >
          <img
            alt="example"
            src={source}
          />
          <div className={styles.text}>
            <p>{text}</p>
          </div>
        </AntCard>
        <AntPromt
          type="textarea"
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

Image.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    text: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
  }).isRequired,
};

Image.defaultProps = {
  content: {
    text: 'Изображение',
    source: 'https://img3.goodfon.ru/original/1440x900/c/d3/uluru-ayers-rock-sandstone.jpg',
  },
};

export default Image;
