import React, {
  Component,
  PropTypes,
} from 'react';
import katex from 'katex';
import { isEqual } from 'lodash/fp';
import classNames from 'classnames';
import 'katex/dist/katex.min.css';
import styles from './styles.css';

class Preview extends Component {

  componentDidMount() {
    this.renderTeX(
      this.props.data.tex
    );
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(
      this.props.data,
      nextProps.data,
    ) && nextProps.data) {
      this.renderTeX(
        nextProps.data.tex
      );
    }
  }

  renderTeX = (tex) => {
    try {
      katex.render(
        tex,
        this.refs.tex
      );
    } catch (error) {
      katex.render(
        '???',
        this.refs.tex
      );
    }
  }

  render() {
    const {
      size,
    } = this.props;
    return (
      <span className={styles.preview}>
        <span
          ref="tex"
          className={classNames(
            styles.tex,
            styles[size]
          )}
          contentEditable="false"
        />
      </span>
    );
  }
}

Preview.propTypes = {
  size: PropTypes.oneOf([
    'small',
    'large',
    'default',
  ]),
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
};

export default Preview;
