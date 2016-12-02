import React, {
  Component,
  PropTypes,
} from 'react';

import { Checkbox as AntCheckbox } from 'antd';


const Preview = ({ data }) => {
  debugger;
  return (
    <div>
      <span>{data.question}</span>
      {data.answers.map((content, index) =>
        <AntCheckbox
          key={index}
          checked={content.checked}
        >
          {content.value}
        </AntCheckbox>)}
    </div>
  );
};


export default Preview;
