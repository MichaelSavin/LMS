import React, { PropTypes } from 'react';

import Unit from '../Unit';

import Icon from 'components/UI/Icon';

import styles from './styles.css';

const Subsection = ({
  data: {
    id,
    name,
    units = [],
  },
  actions: {
    addUnit,
    addSubsection,
    renameSubsection,
    removeSubsection,
  },
  sectionId,
  actions,
}) => (
  <div className={styles.subsection}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Icon
          size={15}
          type="edit"
          action={() =>
            renameSubsection({
              sectionId,
              subsectionId: id,
              name: prompt('Название подсекции', name) || 'Подсекция',
            })
          }
        />
      </div>
      <div className={styles.actions}>
        <Icon
          size={20}
          type="add"
          action={() =>
            addUnit({
              sectionId,
              subsectionId: id,
              unit: {
                name: 'Новый блок',
                content: '',
              },
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
          size={17.5}
          type="remove"
          action={() =>
            removeSubsection({
              sectionId,
              subsectionId: id,
            })
          }
        />
      </div>
    </div>
    {units.map((data, index) =>
      <Unit
        key={index}
        data={{ ...data, id: index }}
        actions={actions}
        sectionId={sectionId}
        subsectionId={id}
      />
    )}
  </div>
);

Subsection.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    units: PropTypes.array,
  }).isRequired,
  actions: PropTypes.shape({
    addUnit: PropTypes.func.isRequired,
    addSubsection: PropTypes.func.isRequired,
    renameSubsection: PropTypes.func.isRequired,
    removeSubsection: PropTypes.func.isRequired,
  }).isRequired,
  sectionId: PropTypes.number.isRequired,
};

export default Subsection;
