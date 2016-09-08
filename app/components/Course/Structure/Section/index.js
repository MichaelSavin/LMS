import React, { PropTypes } from 'react';

import Subsection from './Subsection';

import Add from 'components/UI/Icons/plus';
import Edit from 'components/UI/Icons/pencil';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Section = ({ data: { id, name, subsections = [] }, actions }) => ( // eslint-disable-line no-unused-vars
  <div className={styles.section}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit action={() => alert('edit section')} size={17.5} />
      </div>
      <div className={styles.actions}>
        <Add action={() => alert('add section')} size={17.5} />
        <Remove action={() => alert('remove section')} size={20} />
      </div>
    </div>
    {subsections.map((data, index) =>
      <Subsection
        key={index}
        data={{ ...data, id: index }}
        actions={actions}
      />
    )}
  </div>
);

Section.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    subsections: PropTypes.array,
  }).isRequired,
  actions: PropTypes.object.isRequired,
};

export default Section;
