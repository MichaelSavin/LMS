import React, { PropTypes } from 'react';

const Plus = ({ action, size }) => (
  <span onClick={action}>
    <svg
      width={size + 7.5}
      height={size}
      viewBox="0 0 40 40"
    >
      <path d="m22.5 17.5v-10h-5v10h-10v5h10v10h5v-10h10v-5h-10z" />
    </svg>
  </span>
);

Plus.propTypes = {
  action: PropTypes.func,
  size: PropTypes.number.isRequired,
};

export default Plus;

