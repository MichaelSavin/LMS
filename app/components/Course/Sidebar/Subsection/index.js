import { convertToRaw, ContentState } from 'draft-js';
import React, { PropTypes } from 'react';
import Icon from 'components/UI/Icon';
import styles from './styles.css';
import Unit from '../Unit';

const Subsection = ({
  data: {
    id,
    name,
    sectionId,
    units = [],
  },
  actions: {
    addUnit,
    addSubsection,
    renameSubsection,
    removeSubsection,
  },
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
              name: prompt('Название подсекции', name) || name,
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
                content: convertToRaw(
                  ContentState.createFromText('')
                ),
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
        data={{
          ...data,
          id: index,
          sectionId,
          subsectionId: id,
        }}
        actions={actions}
      />
    )}
  </div>
);

Subsection.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    units: PropTypes.array,
    sectionId: PropTypes.number.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    addUnit: PropTypes.func.isRequired,
    addSubsection: PropTypes.func.isRequired,
    renameSubsection: PropTypes.func.isRequired,
    removeSubsection: PropTypes.func.isRequired,
  }).isRequired,
};

export default Subsection;
