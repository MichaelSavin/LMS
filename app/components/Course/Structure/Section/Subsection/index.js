import React, { PropTypes } from 'react';

import Unit from './Unit';

import Add from 'components/UI/Icons/plus';
import Edit from 'components/UI/Icons/pencil';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Subsection = ({ data: { id, name, units = [] }, parent: parentId, actions }) => ( // eslint-disable-line no-unused-vars
  <div className={styles.subsection}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit
          size={15}
          action={() =>
            actions.renameSubsection({
              sectionId: parentId,
              subsectionId: id,
              name: prompt('Название подсекции', name) || 'Подсекция',
            })
          }
        />
      </div>
      <div className={styles.actions}>
        <Add
          size={16}
          action={() =>
            actions.addSubsection({
              sectionId: parentId,
              subsection: { name: 'Новая секция' },
            })
          }
        />
        <Remove
          size={17.5}
          action={() =>
            actions.removeSubsection({
              sectionId: parentId,
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
  parent: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
};

export default Subsection;
