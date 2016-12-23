import React, {
  PropTypes,
} from 'react';
import {
  EditorState,
  // convertFromRaw,
} from 'draft-js';
// import {
//   entitiesDecorator,
// } from '../../../Entities';
import styles from './styles.css';


import { Input as DraftInput } from '../../../Editor';

class EditableCell extends React.Component {

  render() {
    const { value, isReadOnly, onChange, className } = this.props;
    return (<div className="editable-cell">
      <div className="editable-cell-input-wrapper">
        <DraftInput
          className={className}
          value={
            value instanceof EditorState
            ? value
            : EditorState.createEmpty()
          }
          onChange={onChange}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>);
  }
}

EditableCell.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  isReadOnly: PropTypes.bool,
  className: PropTypes.string,
  columnKey: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

EditableCell.defaultProps = {
  className: styles.cell,
};

export default EditableCell;
