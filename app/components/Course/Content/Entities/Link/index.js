import React, { PropTypes } from 'react';
import { Entity } from 'draft-js';
import { Link as RouterLink } from 'react-router';

import styles from './styles.css';

const Link = ({
  children,
  entityKey,
}) => (
  <RouterLink
    rel="noopener noreferrer"
    to={Entity.get(entityKey).getData().url}
    className={styles.link}
  >
    {children}
  </RouterLink>
);

Link.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Link;
