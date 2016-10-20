import React, {
  Component,
  PropTypes,
} from 'react';
import { List } from 'immutable';
import ImmutablePropTypes from
  'react-immutable-proptypes';
import { Menu, Icon } from 'antd';

const SubMenu = Menu.SubMenu;
const Item = Menu.Item;

class Sidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: undefined,
    };
  }

  onClick(event) {
    this.setState({
      current: event.key,
    });
  }

  render() {
    const {
      data: {
        // name,
        // info,
        sections = List(),
      },
      // actions,
    } = this.props;
    return (
      <Menu
        theme="light"
        onClick={event => this.onClick(event)}
        style={{ width: 240 }}
        selectedKeys={[this.state.current]}
        mode="inline"
      >
        {sections.map(({
          name: sectionName,
          subsections = List(),
        },
          sectionIndex
        ) =>
          subsections.isEmpty()
            ? <Item key={sectionIndex}>{sectionName}</Item>
            :
              <SubMenu
                key={sectionIndex}
                title={
                  <span>
                    <Icon
                      type="folder"
                    />
                    <span>{sectionName}</span>
                  </span>
                }
              >
                {subsections.map(({
                  name: subsectionName,
                  units = List(),
                },
                  subsectionIndex
                ) =>
                  units.isEmpty()
                    ? <Item key={`${sectionIndex}.${subsectionIndex}`}>{subsectionName}</Item>
                    :
                      <SubMenu
                        key={`${sectionIndex}.${subsectionIndex}`}
                        title={
                          <span>
                            <Icon
                              type="file-text"
                            />
                            <span>{subsectionName}</span>
                          </span>
                        }
                      >
                        {units.map((
                          {
                            name: unitName,
                          },
                          unitIndex,
                        ) =>
                          <Item
                            key={`${sectionIndex}.${subsectionIndex}.${unitIndex}`}
                          >
                            {unitName}
                          </Item>
                        )}
                      </SubMenu>
                )}
              </SubMenu>
        )}
      </Menu>
    );
  }
}

Sidebar.propTypes = {
  data: ImmutablePropTypes.mapContains({
    name: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
    sections: ImmutablePropTypes.list,
  }).isRequired,
  actions: PropTypes.object.isRequired,
};

export default Sidebar;
