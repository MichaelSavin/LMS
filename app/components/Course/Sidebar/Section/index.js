import React, { PropTypes } from 'react';
import Icon from 'components/UI/Icon';
import styles from './styles.css';

const Section = ({
  id,
  name,
  subsections,
  actions: {
    addSection,
    renameSection,
    removeSection,
    addSubsection,
  },
}) =>
  <span className={styles.section}>
    <span className={styles.name}>
      {name}
    </span>
    <span className={styles.actions}>
      <Icon
        size={15}
        type="add"
        action={() =>
          addSubsection({
            sectionId: id,
            subsection: {
              name: 'Новый подраздел',
            },
          })
        }
      />
      <Icon
        size={15}
        type="edit"
        action={() =>
          renameSection({
            sectionId: id,
            name: prompt('Название раздела', name) || name,
          })
        }
      />
      <Icon
        size={15}
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
        size={15}
        type="remove"
        action={() =>
          removeSection({
            sectionId: id,
          })
        }
      />
    </span>
  </span>;

Section.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  subsections: PropTypes.object.isRequired,
  actions: PropTypes.shape({
    addSection: PropTypes.func.isRequired,
    renameSection: PropTypes.func.isRequired,
    removeSection: PropTypes.func.isRequired,
    addSubsection: PropTypes.func.isRequired,
  }).isRequired,
};

export default Section;
