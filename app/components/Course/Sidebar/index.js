import React, { PropTypes, Component } from 'react';

import Section from './Section';

import styles from './styles.css';

class Sidebar extends Component {
  shouldComponentUpdate(nextProps) {
    if (Object.keys(this.props.editing).length === 0) {
      return true;
    }
    const {
      sectionId,
      subsectionId,
      unitId,
    } = this.props.editing;
    const [
      content,
      newContent,
    ] = [
      this.props.data,
      nextProps.data,
    ].map(data =>
      data
      .sections[sectionId]
      .subsections[subsectionId]
      .units[unitId]
      .content
    );
    return content === newContent;
  }
  render() {
    const {
      data: {
        name,
        info,
        sections = [],
      },
      actions,
    } = this.props;
    return (
      <div className={styles.sidebar}>
        <div className={styles.name}>{name}</div>
        <div className={styles.info}>{info}</div>
        {sections.map((data, index) =>
          <Section
            key={index}
            data={{ ...data, id: index }}
            actions={actions}
          />
        )}
      </div>
    );
  }
}

Sidebar.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    sections: PropTypes.array,
  }).isRequired,
  editing: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};

export default Sidebar;
