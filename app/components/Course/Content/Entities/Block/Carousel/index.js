import React, { Component, PropTypes } from 'react';
import { Carousel as AntCarousel } from 'antd';
import AntPromt from 'components/UI/Promt';
import { Entity } from 'draft-js';
import { isEqual } from 'lodash';
import styles from './styles.css';

class Carousel extends Component {

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

  editContent = (event) => {
    event.preventDefault();
    this.setState({
      promt: {
        open: true,
        value: this
          .state
          .images
          .join('\n'),
      },
    });
  }

  modifyContent = () => {
    const images = this
      .state
      .promt
      .value
      .split('\n');
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          images,
        },
      }
    );
    this.setState({
      images,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
      images,
    } = this.state;
    return (
      <div onDoubleClick={this.editContent}>
          <AntCarousel className={styles.carousel}>
            {images.map((image, index) =>
              <div key={index}>
                <img
                  alt=""
                  src={image}
                  className={styles.image}
                />
              </div>
            )}
          </AntCarousel>
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

Carousel.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    images: PropTypes.array.isRequired,
  }).isRequired,
};

export default Carousel;
