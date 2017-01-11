import React, {
  PropTypes,
} from 'react';
import {
  EditorState,
} from 'draft-js';
import styles from './styles.css';
import Dropdown from '../Dropdown';
import { Input as DraftInput } from '../../../Editor';

const Cell = ({
  value,
  index,
  addRow,
  onChange,
  deleteRow,
  className,
  columnKey,
  addColumn,
  isReadOnly,
  deleteColumn,
}) => (
  <div className="cell">
    <div className="input">
      <DraftInput
        value={value}
        onChange={onChange}
        className={className}
        isReadOnly={isReadOnly}
      />
    </div>
    {
      !isReadOnly
        && <Dropdown
          index={index}
          addRow={addRow}
          deleteRow={deleteRow}
          addColumn={addColumn}
          deleteColumn={deleteColumn}
          columnKey={columnKey}
        />
    }
  </div>);

Cell.propTypes = {
  value: PropTypes.instanceOf(EditorState).isRequired,
  index: PropTypes.number,
  addRow: PropTypes.func,
  deleteRow: PropTypes.func,
  onChange: PropTypes.func,
  addColumn: PropTypes.func,
  deleteColumn: PropTypes.func,
  // editTable: PropTypes.func,
  isReadOnly: PropTypes.bool,
  className: PropTypes.string,
  columnKey: PropTypes.number,
};

Cell.defaultProps = {
  className: styles.cell,
};

export default Cell;
