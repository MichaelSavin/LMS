import React, { PropTypes } from 'react';

import Button from './Button';

const Toolbar = ({ type, buttons, editorState, onToggle }) => {
  switch (type) {
    case 'BLOCK':
      return (
        <div className="toolbar">
          {buttons.map((button) =>
            <Button
              key={button.label}
              active={button.style === editorState
                .getCurrentContent()
                .getBlockForKey(
                  editorState
                    .getSelection()
                    .getStartKey()
                ).getType()
              }
              label={button.label}
              onToggle={onToggle}
              style={button.style}
            />
          )}
        </div>
      );

    case 'INLINE':
      return (
        <div className="toolbar">
          {buttons.map(button =>
            <Button
              key={button.label}
              active={editorState
                .getCurrentInlineStyle()
                .has(button.style)
              }
              label={button.label}
              onToggle={onToggle}
              style={button.style}
            />
          )}
        </div>
      );
    default:
      return undefined;
  }
};

Toolbar.propTypes = {
  type: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      style: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  editorState: PropTypes.object.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Toolbar;
