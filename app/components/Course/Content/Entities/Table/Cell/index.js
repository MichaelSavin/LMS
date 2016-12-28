import React, {
  PropTypes,
} from 'react';
import {
  EditorState,
} from 'draft-js';

import Dropdown from '../Dropdown';
import styles from './styles.css';
import { Input as DraftInput } from '../../../Editor';

const Cell = ({
  value,
  isReadOnly,
  onChange,
  className,
  index,
  columnKey,
  addRow,
  delRow,
  addColumn,
  delColumn,
}) => (
  <div className="editable-cell">
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
          addRow={addRow}
          delRow={delRow}
          addColumn={addColumn}
          delColumn={delColumn}
          index={index}
          columnKey={columnKey}
        />
    }
  </div>);

Cell.propTypes = {
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  addRow: PropTypes.func,
  delRow: PropTypes.func,
  addColumn: PropTypes.func,
  delColumn: PropTypes.func,
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
