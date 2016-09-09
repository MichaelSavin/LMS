import React, { PropTypes } from 'react';

import Subsection from './Subsection';

import Add from 'components/UI/Icons/plus';
import Edit from 'components/UI/Icons/pencil';
import Clone from 'components/UI/Icons/branch';
import Remove from 'components/UI/Icons/trash';

import styles from './styles.css';

const Section = ({
  data: {
    id,
    name,
    subsections = [],
  },
  actions: {
    addSection,
    renameSection,
    removeSection,
    addSubsection,
  },
  actions,
}) => (
  <div className={styles.section}>
    <div className={styles.title}>
      <div className={styles.name}>
        {name}
        <Edit
          size={17.5}
          action={() =>
            renameSection({
              sectionId: id,
              name: prompt('Название секции', name) || 'Секция' })
            }
        />
      </div>
      <div className={styles.actions}>
        <Add
          size={22.5}
          action={() =>
            addSubsection({
              sectionId: id,
              subsection: {
                name: 'Новая подсекция',
              },
            })
          }
        />
        <Clone
          size={17.5}
          action={() =>
            addSection({
              section: {
                name: `${name} Копия`,
                subsections,
              },
            })
          }
        />
        <Remove
          size={20}
          action={() =>
            removeSection({
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
        actions={actions}
        sectionId={id}
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
  actions: PropTypes.shape({
    addSection: PropTypes.func.isRequired,
    renameSection: PropTypes.func.isRequired,
    removeSection: PropTypes.func.isRequired,
    addSubsection: PropTypes.func.isRequired,
  }).isRequired,
};

export default Section;
