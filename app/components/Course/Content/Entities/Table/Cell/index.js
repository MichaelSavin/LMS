import React, {
  PropTypes,
} from 'react';
import {
  EditorState,
  convertFromRaw,
} from 'draft-js';
import {
  entitiesDecorator,
} from '../../../Entities';

import { Input as DraftInput } from '../../../Editor';

class EditableCell extends React.Component {

  render() {
    const { value, isReadOnly, onChange } = this.props;
    return (<div className="editable-cell">
      <div className="editable-cell-input-wrapper">
        <DraftInput
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
};

export default EditableCell;
