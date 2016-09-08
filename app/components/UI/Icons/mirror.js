import React, { PropTypes } from 'react';

const Mirror = ({ action, size }) => (
  <span onClick={action}>
    <svg
      width={size + 7.5}
      height={size}
      viewBox="0 0 40 40"
    >
      <path d="m12.5 12.5l-7.5 7.5 7.5 7.5v-5h15v5l7.5-7.5-7.5-7.5v5h-15v-5z m7.5-12.5l-20 12.5v27.5l20-10 20 10v-27.5l-20-12.5z m17.5 35l-15-7.5v-2.5h-5v2.5l-15 7.5v-20l15-10v10h5v-10l15 10v20z" />
    </svg>
  </span>
);

Mirror.propTypes = {
  action: PropTypes.func,
  size: PropTypes.number.isRequired,
};

export default Mirror;

