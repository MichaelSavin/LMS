import React, { Component, PropTypes } from 'react';

import Markdown from 'react-remarkable';

import styles from './styles.css';

class View extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.view}>
        <Markdown source={this.props.content} />
      </div>
    );
  }
}

View.propTypes = {
  content: PropTypes.string, // http://stackoverflow.com/a/33427304
};

export default View;
