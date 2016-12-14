import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Icon from 'components/UI/Icon';
import styles from './styles.css';

class Content extends Component {

  render() {
    const {
      actions: {
        renameUnit,
      },
      params: {
        sectionId,
        subsectionId,
        unitId,
      },
      location: {
        key,
      },
      actions,
      children,
    } = this.props;
    const {
      name,
      content,
    } = this.props.data
      .sections[sectionId]
      .subsections[subsectionId]
      .units[unitId] || {};
    const route = `${sectionId}-${subsectionId}-${unitId}`;
    return (name) ? (
      <div className={styles.content}>
        <div className={styles.title}>
          <div className={styles.name}>
            {name}
            <Icon
              size={15}
              type="edit"
              action={() =>
                renameUnit({
                  sectionId,
                  subsectionId,
                  unitId,
                  name: prompt('Название блока', name) || name,
                })
              }
            />
          </div>
          <div className={styles.selectors}>
            <Link
              to={`/${route}/editor`}
              className="ant-btn"
              activeClassName="ant-btn-primary"
            >
              Редактор
            </Link>
            <Link
              to={`/${route}/view`}
              className="ant-btn"
              activeClassName="ant-btn-primary"
            >
              Просмотр
            </Link>
          </div>
        </div>
        {React.cloneElement(children, {
          key, // Автоматическое отмонтирование компонента при роутинге
          unit: {
            sectionId,
            subsectionId,
            unitId,
          },
          content,
          actions,
        })}
      </div>
    )
    : null;
  }
}

Content.propTypes = {
  data: PropTypes.object,    // http://stackoverflow.com/a/33427304
  actions: PropTypes.shape({ // http://stackoverflow.com/a/33427304
    renameUnit: PropTypes.func.isRequired,
  }),
  params: PropTypes.shape({
    sectionId: PropTypes.string.isRequired,
    subsectionId: PropTypes.string.isRequired,
    unitId: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }),
  children: PropTypes.element,
};

export default Content;
