import React, { PropTypes } from 'react';
import { Entity } from 'draft-js';
import styles from './styles.css';

const Link = ({
  children,
  entityKey,
}) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={Entity.get(entityKey).getData().url}
    className={styles.link}
  >
    {children}
  </a>
);

Link.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Link;
