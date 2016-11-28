import React, {
  Component,
  PropTypes,
} from 'react';
import katex from 'katex';
import { isEqual } from 'lodash/fp';
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
    )) {
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
        '?',
        this.refs.tex
      );
    }
  }

  render() {
    return (
      <span className={styles.preview}>
        <span
          ref="tex"
          className={styles.tex}
          contentEditable="false"
        />
      </span>
    );
  }
}

Preview.propTypes = {
  data: PropTypes.shape({
    tex: PropTypes.string.isRequired,
  }).isRequired,
};

export default Preview;
