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
        size={20}
        type="add"
        action={(event) => {
          event.stopPropagation();
          addSubsection({
            sectionId: id,
            subsection: {
              name: 'Новый подраздел',
            },
          });
        }}
      />
      <Icon
        size={17.5}
        type="edit"
        action={(event) => {
          event.stopPropagation();
          renameSection({
            sectionId: id,
            name: prompt('Название раздела', name) || name,
          });
        }}
      />
      <Icon
        size={17.5}
        type="clone"
        action={(event) => {
          event.stopPropagation();
          addSection({
            section: {
              name: `${name} Копия`,
              subsections,
            },
          });
        }}
      />
      <Icon
        size={17.5}
        type="remove"
        action={(event) => {
          event.stopPropagation();
          removeSection({
            sectionId: id,
          });
        }}
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
