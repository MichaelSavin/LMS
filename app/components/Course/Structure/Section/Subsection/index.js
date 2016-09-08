import React, { PropTypes } from 'react';

import Unit from './Unit';

import Add from 'components/UI/Icons/plus';
import Edit from 'components/UI/Icons/pencil';
import Clone from 'components/UI/Icons/mirror';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Subsection = ({ data: { id, name, units = [] }, sectionId, actions }) => (
  <div className={styles.subsection}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit
          size={15}
          action={() =>
            actions.renameSubsection({
              sectionId,
              subsectionId: id,
              name: prompt('Название подсекции', name) || 'Подсекция',
            })
          }
        />
      </div>
      <div className={styles.actions}>
        <Add
          size={20}
          action={() =>
            actions.addUnit({
              sectionId,
              subsectionId: id,
              unit: {
                name: 'Новый блок',
              },
            })
          }
        />
        <Clone
          size={12.5}
          action={() =>
            actions.addSubsection({
              sectionId,
              subsection: {
                name: `${name} Копия`,
                units,
              },
            })
          }
        />
        <Remove
          size={17.5}
          action={() =>
            actions.removeSubsection({
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
  actions: PropTypes.object.isRequired,
  sectionId: PropTypes.number.isRequired,
};

export default Subsection;
