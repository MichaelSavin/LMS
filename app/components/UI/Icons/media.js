import React, { PropTypes } from 'react';

const Media = ({ action, size }) => (
  <span onClick={action}>
    <svg
      width={size + 7.5}
      height={size}
      viewBox="0 0 40 40"
    >
      <path d="m27.5 2.5h-22.5v35h30v-27.5l-7.5-7.5z m5 32.5h-25v-30h17.5l7.5 7.5v22.5z m-22.5-25v20h5c0-2.8 2.2-5 5-5-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5c2.8 0 5 2.2 5 5h5v-15l-5-5h-15z" />
    </svg>
  </span>
);

Media.propTypes = {
  action: PropTypes.func,
  size: PropTypes.number.isRequired,
};

export default Media;

