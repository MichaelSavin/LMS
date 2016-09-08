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
        <Edit
          size={17.5}
          action={() =>
            actions.renameSection({
              sectionId: id,
              name: prompt('Название секции', name) || 'Секция' })
            }
        />
      </div>
      <div className={styles.actions}>
        <Add
          size={17.5}
          action={() =>
            actions.addSection({
              section: { name: 'Новая секция' },
            })
          }
        />
        <Remove
          size={20}
          action={() =>
            actions.removeSection({
              sectionId: id,
            })
          }
        />
      </div>
    </div>
    {subsections.map((data, index) =>
      <Subsection
        key={index}
        data={{ ...data, id: index }}
        parent={id}
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
