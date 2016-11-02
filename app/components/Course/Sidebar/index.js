import React, {
  Component,
  PropTypes,
} from 'react';
import { List } from 'immutable';
import { Menu as AntMenu } from 'antd';
import ImmutablePropTypes from
  'react-immutable-proptypes';
import styles from './styles.css';

import Unit from './Unit';
import Section from './Section';
import Subsection from './Subsection';

const AntSubMenu = AntMenu.SubMenu;
const AntItem = AntMenu.Item;

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      path: props.route,
    };
  }

  onClick = ({ key }) => {
    if (key.split('-').length === 3) {
      this.context // eslint-disable-line
        .router
        .push(`/${key}`);
    }
    this.setState({
      path: key,
    });
  }

  render() {
    const {
      data: {
        sections = List(),
      },
      actions,
    } = this.props;
    return (
      <AntMenu
        mode="inline"
        theme="light"
        onClick={this.onClick}
        defaultOpenKeys={
          this.state.path
            .split('-')
            .reduce((
              previousValue,
              currentValue,
              index,
            ) => [
              ...previousValue, [
                previousValue[index - 1],
                currentValue,
              ].join('-'),
            ])
        }
        className={styles.sidebar}
        selectedKeys={[this.state.path]}
      >
        {sections.map(({
          name: sectionName,
          subsections = List(),
        }, sectionId) =>
          subsections.isEmpty()
            ?
              <AntItem key={sectionId}>
                <Section
                  id={sectionId}
                  name={sectionName}
                  subsections={subsections}
                  actions={actions}
                />
              </AntItem>
            :
              <AntSubMenu
                key={sectionId}
                title={
                  <span>
                    { /* <AntIcon type="folder" /> */ }
                    <Section
                      id={sectionId}
                      name={sectionName}
                      subsections={subsections}
                      actions={actions}
                    />
                  </span>
                }
              >
                {subsections.map(({
                  name: subsectionName,
                  units = List(),
                }, subsectionId) =>
                  units.isEmpty()
                    ?
                      <AntItem
                        key={[
                          sectionId,
                          subsectionId,
                        ].join('-')}
                      >
                        <Subsection
                          id={subsectionId}
                          name={subsectionName}
                          units={units}
                          actions={actions}
                          sectionId={sectionId}
                        />
                      </AntItem>
                    :
                      <AntSubMenu
                        key={[
                          sectionId,
                          subsectionId,
                        ].join('-')}
                        title={
                          <span>
                            { /* <AntIcon type="file-text" /> */ }
                            <Subsection
                              id={subsectionId}
                              name={subsectionName}
                              units={units}
                              actions={actions}
                              sectionId={sectionId}
                            />
                          </span>
                        }
                      >
                        {units.map(({
                          name: unitName,
                          content: unitContent,
                        }, unitId) =>
                          <AntItem
                            key={[
                              sectionId,
                              subsectionId,
                              unitId,
                            ].join('-')}
                          >
                            <Unit
                              id={unitId}
                              name={unitName}
                              actions={actions}
                              content={unitContent}
                              sectionId={sectionId}
                              subsectionId={subsectionId}
                            />
                          </AntItem>
                        )}
                      </AntSubMenu>
                )}
              </AntSubMenu>
        )}
      </AntMenu>
    );
  }
}

Sidebar.propTypes = {
  data: ImmutablePropTypes.mapContains({
    name: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    sections: ImmutablePropTypes.list,
  }).isRequired,
  route: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
};

Sidebar.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Sidebar;
