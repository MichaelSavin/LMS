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
          delRow={delRow}
          addColumn={addColumn}
          delColumn={delColumn}
          columnKey={columnKey}
        />
    }
  </div>);

Cell.propTypes = {
  value: PropTypes.instanceOf(EditorState).isRequired,
  index: PropTypes.number,
  addRow: PropTypes.func,
  delRow: PropTypes.func,
  onChange: PropTypes.func,
  addColumn: PropTypes.func,
  delColumn: PropTypes.func,
  editTable: PropTypes.func,
  isReadOnly: PropTypes.bool,
  className: PropTypes.string,
  columnKey: PropTypes.number,
};

Cell.defaultProps = {
  className: styles.cell,
};

export default Cell;
