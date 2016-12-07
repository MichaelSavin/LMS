import React, { PropTypes } from 'react';
import {
  Icon as AntIcon,
  Input as AntInput,
  Select as AntSelect,
  Popconfirm as AntPopconfirm,
} from 'antd';
import {
  SortableHandle,
  SortableElement,
  SortableContainer,
} from 'react-sortable-hoc';
import styles from './styles.css';

const Editor = ({
  data,
  dragStep,
  removeStep,
  changeText,
  changeColor,
}) =>
  <div className={styles.editor}>
    <Sortable.List
      onSortEnd={dragStep}
      useDragHandle
    >
      <div className={styles.steps}>
        {data.steps.map((
          step,
          stepIndex
        ) =>
          <Sortable.Item
            key={stepIndex}
            index={stepIndex}
          >
            <div className={styles.step}>
              <Sortable.Handler />
              <AntSelect
                value={step.color}
                className={styles.color}
                onChange={changeColor(stepIndex)}
              >
                {['blue',
                  'red',
                  'green',
                ].map((color, colorIndex) =>
                  <AntSelect.Option
                    key={colorIndex}
                    value={color}
                  >
                    <div
                      className={styles[color]}
                    />
                  </AntSelect.Option>
                )}
              </AntSelect>
              <div className={styles.text}>
                <AntInput
                  value={step.text}
                  onChange={changeText(stepIndex)}
                />
              </div>
              <AntPopconfirm
                title="Удалить событие?"
                okText="Да"
                onConfirm={removeStep(stepIndex)}
                cancelText="Нет"
              >
                <AntIcon
                  type="close"
                  className={styles.remove}
                />
              </AntPopconfirm>
            </div>
          </Sortable.Item>
        )}
      </div>
    </Sortable.List>
  </div>;

Editor.propTypes = {
  data: PropTypes.shape({
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        image: PropTypes.string,
        color: PropTypes.oneOf([
          'blue',
          'red',
          'green',
        ]).isRequired,
      }).isRequired
    ).isRequired,
  }).isRequired,
  dragStep: PropTypes.func.isRequired,
  removeStep: PropTypes.func.isRequired,
  changeText: PropTypes.func.isRequired,
  changeColor: PropTypes.func.isRequired,
};

const Sortable = {
  List: SortableContainer(
    (props) => <ul>{props.children}</ul>
  ),
  Item: SortableElement(
    (props) => <li>{props.children}</li>
  ),
  Handler: SortableHandle(() =>
    <AntIcon
      type="appstore-o"
      className={styles.drag}
    />
  ),
};

export default Editor;
