import { convertToRaw, ContentState } from 'draft-js';
import React, { PropTypes } from 'react';
import Icon from 'components/UI/Icon';
import styles from './styles.css';

const Subsection = ({
  id,
  name,
  units,
  sectionId,
  actions: {
    addUnit,
    addSubsection,
    renameSubsection,
    removeSubsection,
  },
}) =>
  <span className={styles.subsection}>
    <span className={styles.name}>
      {name}
    </span>
    <span className={styles.actions}>
      <Icon
        size={15}
        type="add"
        action={() =>
          addUnit({
            sectionId,
            subsectionId: id,
            unit: {
              name: 'Новый блок',
              content: convertToRaw(
                ContentState.createFromText('')
              ),
            },
          })
        }
      />
      <Icon
        size={15}
        type="edit"
        action={() =>
          renameSubsection({
            sectionId,
            subsectionId: id,
            name: prompt('Название подсекции', name) || name,
          })
        }
      />
      <Icon
        size={15}
        type="clone"
        action={() =>
          addSubsection({
            sectionId,
            subsection: {
              name: `${name} Копия`,
              units,
            },
          })
        }
      />
      <Icon
        size={15}
        type="remove"
        action={() =>
          removeSubsection({
            sectionId,
            subsectionId: id,
          })
        }
      />
    </span>
  </span>;

Subsection.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  units: PropTypes.object.isRequired,
  sectionId: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    addUnit: PropTypes.func.isRequired,
    addSubsection: PropTypes.func.isRequired,
    renameSubsection: PropTypes.func.isRequired,
    removeSubsection: PropTypes.func.isRequired,
  }).isRequired,
};

export default Subsection;
