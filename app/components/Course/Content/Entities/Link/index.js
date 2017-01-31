import React, { PropTypes } from 'react';
import { Entity } from 'draft-js';
import { Link as RouterLink } from 'react-router';

import styles from './styles.css';

const Link = ({
  children,
  entityKey,
}) => {
  const { url } = Entity.get(entityKey).getData();
  return url.charAt(0) === '/' ? (<RouterLink
    rel="noopener noreferrer"
    to={url}
    className={styles.link}
  >
    {children}
  </RouterLink>) : (<a
    target="_blank"
    rel="noopener noreferrer"
    href={url}
    className={styles.link}
  >
    {children}
  </a>);
};

Link.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default Link;
