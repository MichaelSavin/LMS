import React, { PropTypes } from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
} from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import styles from './styles.css';

export default function styledHoC(WrappedComponent) {
  class HoC extends WrappedComponent {
    constructor(...args) {
      super(...args);
      this.toggleReadOnly = this.toggleReadOnly.bind(this);
    }

    toggleReadOnly(option) {
      const readOnly = option !== undefined ? option : !this.state.isReadOnly;
      this.setState({
        isReadOnly: readOnly,
      }, () => this.context.toggleReadOnly(readOnly));
    }

    render() {
      const { isReadOnly } = this.state;
      const anchorUrl = `${
        window.location.pathname
      }#id${
        this.props.blockKey
      }`;
      return (<div
        id={`id${this.props.blockKey}`}
        className={styles.main}
        onDoubleClick={isReadOnly && this.editMode}
      >
        <WrappedComponent
          {...this.props}
          hocState={this.state}
          toggleReadOnly={this.toggleReadOnly}
        />
        {(!this.context.isPlayer && isReadOnly) ? (
          <div className={styles.actions}>
            <CopyToClipboard text={anchorUrl}>
              <AntButton
                type="primary"
                icon="paper-clip"
                className={styles.icon}
              >
                Скопировать: {anchorUrl}
              </AntButton>
            </CopyToClipboard>
            <AntButton
              type="primary"
              icon="up-square"
              className={styles.icon}
              onClick={this.moveBlockUp}
            />
            <span
              icon="ellipsis"
              className={`${styles.icon} sortable-handle`}
            >
              <AntIcon type="ellipsis" />
            </span>
            <AntButton
              type="primary"
              icon="down-square"
              className={styles.icon}
              onClick={this.moveBlockDown}
            />
            <AntButton
              type="danger"
              icon="close-circle"
              className={styles.icon}
              onClick={this.deleteBlock}
            />
            <AntButton
              icon="copy"
              type="primary"
              className={styles.icon}
              onClick={this.duplicateBlock}
            />
            <AntButton
              icon="edit"
              type="primary"
              className={styles.icon}
              onClick={this.editMode}
            />
          </div>
        ) : (
          <div className={styles.editor}>
            <div className={styles.actions}>
              <AntButton
                type="primary"
                icon="rollback"
                className={styles.icon}
                onClick={this.closeEditor}
              />
              <AntButton
                type="primary"
                icon="check-circle"
                className={styles.icon}
                onClick={this.saveSettings}
              />
            </div>
          </div>
        )}
      </div>);
    }
  }

  HoC.contextTypes = {
    moveBlock: PropTypes.func,
    removeBlock: PropTypes.func,
    duplicateBlock: PropTypes.func,
    toggleReadOnly: PropTypes.func,
    isPlayer: PropTypes.bool,
  };

  const wrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  HoC.displayName = `HoC(${wrappedComponentName})`; // eslint-disable-line fp/no-mutation
  return HoC;
}

