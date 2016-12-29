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
  delRow,
  onChange,
  className,
  columnKey,
  addColumn,
  delColumn,
  isReadOnly,
}) => (
  <div className="editable-cell">
    <div className="editable-cell-input-wrapper">
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
          delRow={delRow}
          addColumn={addColumn}
          delColumn={delColumn}
          columnKey={columnKey}
        />
    }
  </div>);

Cell.propTypes = {
  addRow: PropTypes.func,
  delRow: PropTypes.func,
  index: PropTypes.number,
  onChange: PropTypes.func,
  addColumn: PropTypes.func,
  delColumn: PropTypes.func,
  editTable: PropTypes.func,
  isReadOnly: PropTypes.bool,
  className: PropTypes.string,
  columnKey: PropTypes.number,
  value: PropTypes.instanceOf(EditorState).isRequired,
};

Cell.defaultProps = {
  className: styles.cell,
};

export default Cell;
