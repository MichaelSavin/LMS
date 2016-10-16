import React, { Component, PropTypes } from 'react';
import { Tree as AntTree } from 'antd';
import { isEqual } from 'lodash';
// import styles from './styles.css';

class Tree extends Component {

  constructor(props) {
    super(props);
    this.state = props.content;
  }

  shouldComponentUpdate(
    nextProps,
    nextState
  ) {
    return !isEqual(
      this.state,
      nextState
    );
  }

  render() {
    return (
      <div>
        <AntTree
          showLine
          checkable
          defaultExpandAll
        >
          <AntTree.TreeNode title="parent 1" key="0-0">
            <AntTree.TreeNode title="parent 1-0" key="0-0-0">
              <AntTree.TreeNode title="leaf" key="0-0-0-0" />
              <AntTree.TreeNode title="leaf" key="0-0-0-1" />
            </AntTree.TreeNode>
            <AntTree.TreeNode title="parent 1-1" key="0-0-1">
              <AntTree.TreeNode title="leaf" key="0-0-1-0" />
            </AntTree.TreeNode>
          </AntTree.TreeNode>
        </AntTree>
      </div>
    );
  }
}

Tree.propTypes = {
  entityKey: PropTypes.string.isRequired,
  content: PropTypes.shape({
    tree: PropTypes.object.isRequired,
  }).isRequired,
};

export default Tree;
