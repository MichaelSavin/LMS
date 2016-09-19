import React, { PropTypes } from 'react';
import Icon from 'components/UI/Icon';
import Subsection from '../Subsection';
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
        <Icon
          size={17.5}
          type="edit"
          action={() =>
            renameSection({
              sectionId: id,
              name: prompt('Название секции', name) || name })
            }
        />
      </div>
      <div className={styles.actions}>
        <Icon
          size={22.5}
          type="add"
          action={() =>
            addSubsection({
              sectionId: id,
              subsection: {
                name: 'Новая подсекция',
              },
            })
          }
        />
        <Icon
          size={17.5}
          type="clone"
          action={() =>
            addSection({
              section: {
                name: `${name} Копия`,
                subsections,
              },
            })
          }
        />
        <Icon
          size={20}
          type="remove"
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
        data={{
          ...data,
          id: index,
          sectionId: id,
        }}
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
  actions: PropTypes.shape({
    addSection: PropTypes.func.isRequired,
    renameSection: PropTypes.func.isRequired,
    removeSection: PropTypes.func.isRequired,
    addSubsection: PropTypes.func.isRequired,
  }).isRequired,
};

export default Section;
