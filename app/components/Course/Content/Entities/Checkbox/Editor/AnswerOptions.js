import React, {
  PropTypes,
} from 'react';
import styles from './styles.css';


const AnswerOptions = ({
  data,
}) => {
  const rightAnswers = data.answers.filter((answers) => answers.isRight === true);
  return (
    <div>
      <div className={styles.options}>
        <p>Варианты ответа</p>
        {rightAnswers.length === 0 ? <span>Не заданы</span> : <span>Заданы</span>}
      </div>
    </div>
  );
};

AnswerOptions.propTypes = {
  data: PropTypes.shape({
    anwsers: PropTypes.arrayOf(
      PropTypes.shape({
        isRight: PropTypes.bool.isRequired,
      }).isRequired,
    ),
  }).isRequired,
};

export default AnswerOptions;
