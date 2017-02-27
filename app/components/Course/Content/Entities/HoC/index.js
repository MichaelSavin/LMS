import React, { PropTypes, PureComponent } from 'react';
import {
  Icon as AntIcon,
  Button as AntButton,
} from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import styles from './styles.css';

export default function styledHoC(WrappedComponent) {
  class HoC extends PureComponent {
    constructor(...args) {
      super(...args);
      this.state = ({
        isReadOnly: true,
        actionFlag: '',
      });
    }

    openEditor = () => {
      this.setState({
        actionFlag: 'openEditor',
      });
    }

    saveSettings = () => {
      this.setState({
        actionFlag: 'saveSettings',
      });
    }

    closeEditor = () => {
      this.setState({
        actionFlag: 'closeEditor',
      });
    }

    toggleReadOnly = (option) => {
      const readOnly = option !== undefined ? option : !this.state.isReadOnly;
      this.setState({
        isReadOnly: readOnly,
        actionFlag: '',
      }, () => {
        this.context.toggleReadOnly(!readOnly);
      });
    }

    deleteBlock = () => this.context.removeBlock(this.props.blockKey);

    duplicateBlock = () => this.context.duplicateBlock(this.props.entityKey);

    moveBlockUp = () => this.context.moveBlock(this.props.blockKey, -1);

    moveBlockDown = () => this.context.moveBlock(this.props.blockKey, 1);

    render() {
      const { isReadOnly } = this.state;
      const anchorUrl = `${
        window.location.pathname
      }#id${
        this.props.blockKey
      }`;
      return this.context.isPlayer ? (<WrappedComponent
        {...this.props}
        {...this.state}
        toggleReadOnly={this.toggleReadOnly}
      />) : (<div
        id={`id${this.props.blockKey}`}
        className={`${styles.main} ${!isReadOnly && styles.editing}`}
        onDoubleClick={(!this.context.isPlayer && isReadOnly) && this.openEditor}
      >
        <WrappedComponent
          {...this.props}
          {...this.state}
          toggleReadOnly={this.toggleReadOnly}
        />
        {isReadOnly ? (
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
              onClick={this.openEditor}
            />
          </div>
        ) : (
          <div className={styles.editor}>
            <div className={styles.actions}>
              <AntButton
                icon="rollback"
                type="ghost"
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
        {!isReadOnly && <div className={styles.confirms}>
          <AntButton type="ghost" onClick={this.closeEditor} icon="rollback">
            Отменить
          </AntButton>
          <AntButton type="primary" onClick={this.saveSettings} icon="check-circle">
            Применить
          </AntButton>
        </div>}
      </div>);
    }
  }

  HoC.propTypes = {
    blockKey: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
  };

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

