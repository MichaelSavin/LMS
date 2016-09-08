import React, { PropTypes } from 'react';

import Unit from './Unit';

import Add from 'components/UI/Icons/plus';
import Edit from 'components/UI/Icons/pencil';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Subsection = ({ data: { id, name, units = [] }, actions }) => ( // eslint-disable-line no-unused-vars
  <div className={styles.subsection}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit action={() => alert('edit subsection')} size={15} />
      </div>
      <div className={styles.actions}>
        <Add action={() => alert('add subsection')} size={16} />
        <Remove action={() => alert('remove subsection')} size={17.5} />
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
  actions: PropTypes.object.isRequired,
};

export default Subsection;
