import React, { PropTypes } from 'react';
import { Timeline as AntTimeline } from 'antd';

const Preview = ({
  data,
  images,
}) =>
  <AntTimeline>
    {data.steps.map(({
      text,
      color,
      image,
    }, index) =>
      <AntTimeline.Item
        key={index}
        color={color}
      >
        <div>{text}</div>
        <div>
          {image &&
            <img
              src={images[image]}
              role="presentation"
              width={250}
            />
          }
        </div>
      </AntTimeline.Item>
    )}
  </AntTimeline>;

Preview.propTypes = {
  images: PropTypes.object.isRequired,
  data: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        image: PropTypes.string,
        color: PropTypes.oneOf([
          'blue',
          'red',
          'green',
        ]).isRequired,
      }).isRequired,
    ).isRequired,
  }).isRequired,
};

export default Preview;
