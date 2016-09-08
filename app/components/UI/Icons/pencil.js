import React, { PropTypes } from 'react';

const Pencil = ({ action, size }) => (
  <span onClick={action}>
    <svg
      width={size + 7.5}
      height={size}
      viewBox="0 0 40 40"
    >
      <path d="m30 2.5l-5 5 7.5 7.5 5-5-7.5-7.5z m-27.5 27.5l0 7.5 7.5 0 20-20-7.5-7.5-20 20z m7.5 5h-5v-5h2.5v2.5h2.5v2.5z" />
    </svg>
  </span>
);

Pencil.propTypes = {
  action: PropTypes.func,
  size: PropTypes.number.isRequired,
};

export default Pencil;
