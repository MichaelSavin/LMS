import React, {
  PropTypes,
} from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import styles from './styles.css';


const Preview = ({ data, toggleChecked, images}) => {
  return (
    <div>
      <span className={styles.question}>{data.question}</span>
      {data.answers.map((content, index) =>
        <AntCheckbox
          key={index}
          checked={content.checked}
          className={styles.answer}
          onChange={toggleChecked(index)}
        >
          {content.value}
          {content.image &&
            <img
              src={images[content.image]}
              role="presentation"
              width={250}
            />
          }
        </AntCheckbox>)}
    </div>
  );
};


export default Preview;
