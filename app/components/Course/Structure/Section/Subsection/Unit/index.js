import React, { PropTypes } from 'react';

import Edit from 'components/UI/Icons/pencil';
import Clone from 'components/UI/Icons/branch';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Unit = ({
  data: {
    id,
    name,
    content,
  },
  actions: {
    addUnit,
    renameUnit,
    removeUnit,
  },
  sectionId,
  subsectionId,
}) => (
  <div className={styles.unit}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit
          size={15}
          action={() =>
            renameUnit({
              sectionId,
              subsectionId,
              unitId: id,
              name: prompt('Название блока', name) || 'Блок',
            })
          }
        />
      </div>
      <div className={styles.actions}>
        <Clone
          size={12.5}
          action={() =>
            addUnit({
              sectionId,
              subsectionId,
              unit: {
                name: `${name} Копия`,
                content,
              },
            })
          }
        />
        <Remove
          size={15}
          action={() =>
            removeUnit({
              sectionId,
              subsectionId,
              unitId: id,
            })
          }
        />
      </div>
    </div>
  </div>
);

Unit.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.object,
  }).isRequired,
  actions: PropTypes.shape({
    addUnit: PropTypes.func.isRequired,
    renameUnit: PropTypes.func.isRequired,
    removeUnit: PropTypes.func.isRequired,
  }).isRequired,
  sectionId: PropTypes.number.isRequired,
  subsectionId: PropTypes.number.isRequired,
};

export default Unit;
