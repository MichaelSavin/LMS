import React, {
  PropTypes,
} from 'react';
import {
  Icon as AntIcon,
  Carousel as AntCarousel,
} from 'antd';
import styles from './styles.css';

const Preview = ({
  data,
  cache,
  placement,
  fullscreen,
  toggleView,
}) => {
  const getViewportWidth = (
    document.getElementById('viewport') || {}
  ).offsetWidth;
  const calculateWidth =
    fullscreen
      ? (getViewportWidth || 440) - 20
      : getViewportWidth < 400
        ? getViewportWidth - 20
        : 400;
  const calculateHeight = calculateWidth * 0.625;
  const calculatedStyles = {
    width: calculateWidth,
    height: calculateHeight,
  };
  return (
    <div
      className={styles.preview}
      style={calculatedStyles}
    >
      <AntCarousel>
        {data.slides.map(({
          type,
          text,
          image,
        }, index) =>
          <div
            key={index}
            className={styles[type]}
          >
            {type === 'text'
              ?
                <div
                  style={calculatedStyles}
                  className={styles.text}
                >
                  {text}
                </div>
              : type === 'image'
                ? cache[image.source]
                  ?
                    <img
                      src={cache[image.source]}
                      alt={image.text}
                      style={calculatedStyles}
                    />
                  :
                      <div
                        style={calculatedStyles}
                        className={styles.empty}
                      >
                        Изображение не загружено
                      </div>
                : undefined
            }
          </div>
        )}
      </AntCarousel>
      {placement === 'editor' &&
        <span className={styles.resize}>
          <AntIcon
            type={fullscreen
              ? 'shrink'
              : 'arrows-alt'
            }
            onClick={toggleView}
          />
        </span>
      }
    </div>
  );
};

Preview.propTypes = {
  data: PropTypes.shape({
    slides: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf([
          'text',
          'image',
        ]).isRequired,
        text: PropTypes.string,
        image: PropTypes.shape({
          source: PropTypes.string,
          text: PropTypes.string,
        }),
      }).isRequired,
    ).isRequired,
  }).isRequired,
  cache: PropTypes.object.isRequired,
  placement: PropTypes.oneOf([
    'modal',
    'editor',
  ]).isRequired,
  fullscreen: PropTypes.bool,
  toggleView: PropTypes.func,
};

export default Preview;
