import React, {
  PropTypes,
  Component,
} from 'react';
import katex from 'katex';
import { isEqual } from 'lodash';
import { Entity } from 'draft-js';
import AntPromt from 'components/UI/Promt';
import styles from 'katex/dist/katex.min.css'; // eslint-disable-line no-unused-vars

class TeX extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: Entity
        .get(this.props.entityKey)
        .getData()
        .content
        .value,
      promt: {
        open: false,
        value: null,
      },
    };
  }

  componentDidMount() {
    katex.render(
      this.state.value,
      this.refs.math
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState);
  }

  editValue = () => {
    this.setState({
      promt: {
        open: true,
        value: this.state.value,
      },
    });
  }

  modifyValue = () => {
    const { value } = this.state.promt;
    Entity.replaceData(
      this.props.entityKey, {
        content: {
          value,
        },
      }
    );
    katex.render(
      value,
      this.refs.math
    );
    this.setState({
      value,
      promt: {
        open: false,
      },
    });
  }

  render() {
    const {
      promt,
    } = this.state;
    return (
      <span className="TeX">
        <span
          ref="math"
          onDoubleClick={this.editValue}
          contentEditable="false"
          style={{
            WebkitUserSelect: 'none',
            padding: '2.5px 5px',
            cursor: 'pointer',
          }}
        />
        <AntPromt
          value={promt.value}
          onSave={this.modifyValue}
          visible={promt.open}
          onChange={(event) => {
            this.setState({
              promt: {
                ...promt,
                value: event.target.value,
              },
            });
          }}
          onCancel={() => {
            this.setState({
              promt: {
                ...promt,
                open: false,
              },
            });
          }}
        />
      </span>
    );
  }
}

TeX.propTypes = {
  children: PropTypes.array.isRequired,
  entityKey: PropTypes.string.isRequired,
};

export default TeX;
