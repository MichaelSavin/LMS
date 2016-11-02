import React, { PropTypes } from 'react';
import Icon from 'components/UI/Icon';
import styles from './styles.css';

const Unit = ({
  id,
  name,
  content,
  sectionId,
  subsectionId,
  actions: {
    addUnit,
    removeUnit,
  },
}) =>
  <span className={styles.unit}>
    <span className={styles.name}>
      {name}
    </span>
    <span className={styles.actions}>
      <Icon
        size={15}
        type="clone"
        action={(event) => {
          event.stopPropagation();
          return addUnit({
            sectionId,
            subsectionId,
            unit: {
              name: `${name} Копия`,
              content,
            },
          });
        }}
      />
      <Icon
        size={15}
        type="remove"
        action={(event) => {
          event.stopPropagation();
          removeUnit({
            unitId: id,
            sectionId,
            subsectionId,
          });
        }}
      />
    </span>
  </span>;

Unit.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  sectionId: PropTypes.number.isRequired,
  subsectionId: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    addUnit: PropTypes.func.isRequired,
    removeUnit: PropTypes.func.isRequired,
  }).isRequired,
};

export default Unit;
