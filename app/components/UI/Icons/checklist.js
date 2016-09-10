import React, { PropTypes } from 'react';

const Video = ({ action, size }) => (
  <span onClick={action}>
    <svg
      width={size + 7.5}
      height={size}
      viewBox="0 0 40 40"
    >
      <path d="m23.6 10c1.5 0 2.6 1.1 2.6 2.6v14.7c0 1.5-1.1 2.7-2.6 2.7h-17.3c-1.5 0-2.8-1.2-2.8-2.7v-14.7c0-1.5 1.3-2.6 2.8-2.6h17.3z m4.9 6.6l7.7-4.1v15l-7.7-4.1v-6.8z" />
    </svg>
  </span>
);

Video.propTypes = {
  action: PropTypes.func,
  size: PropTypes.number.isRequired,
};

export default Video;

