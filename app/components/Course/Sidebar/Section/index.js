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
    // removeSection,
    addSubsection,
  },
}) =>
  <span className={styles.section}>
    <span className={styles.name}>
      {name}
    </span>
    <span className={styles.actions}>
      <Icon
        size={17.5}
        type="add"
        action={(event) => {
          event.stopPropagation();
          if (confirm('Создать новый подраздел?')) {
            addSubsection({
              sectionId: id,
              subsection: {
                name: 'Новый подраздел',
              },
            });
          }
        }}
      />
      <Icon
        size={15}
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
        size={15}
        type="clone"
        action={(event) => {
          event.stopPropagation();
          if (confirm('Клонировать раздел?')) {
            addSection({
              section: {
                name: `${name} Копия`,
                subsections,
              },
            });
          }
        }}
      />
      { /*
      <Icon
        size={15}
        type="remove"
        action={(event) => {
          event.stopPropagation();
          if (confirm('Удалить раздел?')) {
            removeSection({
              sectionId: id,
            });
          }
        }}
      />
      */ }
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
