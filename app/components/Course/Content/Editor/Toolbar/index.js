import React, { PropTypes } from 'react';

import Button from './Button';

const Toolbar = ({
  buttons,
  onButtonClick: onClick,
  isButtonActive: isActive,
}) => 
  <div className="toolbar">
    {buttons.map(button =>
      <Button
        key={button.label}
        label={button.label}
        style={button.style}
        onClick={onClick}
        isActive={isActive(button)}
      />
    )}
  </div>;

Toolbar.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      style: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  onButtonClick: PropTypes.func.isRequired,
  isButtonActive: PropTypes.func.isRequired,
};

export default Toolbar;
