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

import Dropdown from '../Dropdown';
import styles from './styles.css';
import { Input as DraftInput } from '../../../Editor';

class Cell extends React.Component {
  render() {
    const {
      value,
      isReadOnly,
      onChange,
      className,
      editTable,
      index,
      columnKey,
    } = this.props;
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
      {
        !isReadOnly
          && <Dropdown
            editTable={editTable}
            index={index}
            columnKey={columnKey}
          />
      }
    </div>);
  }
}

Cell.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  editTable: PropTypes.func,
  isReadOnly: PropTypes.bool,
  className: PropTypes.string,
  columnKey: PropTypes.number,
  index: PropTypes.number,
};

Cell.defaultProps = {
  className: styles.cell,
};

export default Cell;
