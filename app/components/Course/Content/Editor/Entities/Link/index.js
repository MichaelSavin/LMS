import React, { PropTypes } from 'react';
import { Entity } from 'draft-js';
import styles from './styles.css';

const Link = ({
  children,
  entityKey,
}) =>
  <a href={Entity.get(entityKey).getData().url} className={styles.link}>
    {children}
  </a>;

const findLinkEntities = (contentBlock, callback) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

Link.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export { Link as default, findLinkEntities };