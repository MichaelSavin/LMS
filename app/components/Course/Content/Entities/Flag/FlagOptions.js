import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';
import {
  Button as AntButton,
  Input as AntInput,
  Form as AntForm,
  Select as AntSelect,
  Col as AntCol,
  Row as AntRow,
  Modal as AntModal } from 'antd';
import styles from './styles.css';

class FlagOptions extends Component {
  constructor() {
    super();
    this.state = {
      disabled: false,
    };
  }
  disableButton = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.setState({ disabled: false });
      } else {
        this.setState({ disabled: true });
      }
    });
  }
  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const {
      modal,
      data,
      onCancel,
      onCreate,
      onChooseIcon,
      onChooseColor,
      onEditMessage,
    } = this.props;
    const resetAndClose = () => {
      resetFields();
      onCancel();
    };
    const { disabled } = this.state;
    return (
      <div>
        <AntModal
          title="Флаг"
          visible={modal}
          okText="Create"
          onCancel={resetAndClose}
          footer={null}
        >
          <AntForm onSubmit={onCreate} onChange={this.disableButton}>
            <AntRow className={styles.form}>
              <AntForm.Item>
                <AntCol span="3">
                  <AntForm.Item>
                    <AntSelect onChange={onChooseColor} defaultValue={data.color}>
                      {['#87D068',
                        '#2DB7F5',
                        '#FFAA00',
                        '#FF5500'].map((color, index) =>
                          <AntSelect.Option value={color} key={index}>
                            <div
                              style={{ backgroundColor: color }}
                              className={classNames(
                                styles.rounded,
                              )}
                            />
                          </AntSelect.Option>
                      )}
                    </AntSelect>
                  </AntForm.Item>
                </AntCol>
                <AntCol span="1" />
                <AntCol span="3">
                  <AntForm.Item>
                    <AntSelect onChange={onChooseIcon} defaultValue={data.icon}>
                      {['anticon-check-circle',
                        'anticon-info-circle',
                        'anticon-exclamation-circle',
                        'anticon-cross-circle'].map((icon, index) =>
                          <AntSelect.Option value={icon} key={index}>
                            <i
                              className={classNames(
                                { [`anticon ${icon}`]: true },
                                styles.anticonflagselect,
                              )}
                            />
                          </AntSelect.Option>
                      )}
                    </AntSelect>
                  </AntForm.Item>
                </AntCol>
                <AntCol span="1" />
                <AntCol span="16">
                  <AntForm.Item>
                    {getFieldDecorator('message', {
                      rules: [{ required: true, message: 'Поле должно быть заполнено!' }],
                      initialValue: data.message,
                    })(
                      <AntInput onChange={onEditMessage} />
                    )}
                  </AntForm.Item>
                </AntCol>
              </AntForm.Item>
            </AntRow>
            <AntRow>
              <AntCol span="24" className={styles.preview}>
                <span className={styles.title}>Предпросмотр</span>
                {!disabled &&
                  <div
                    style={{ backgroundColor: data.bgcolor }}
                    className={classNames(
                      styles.flag,
                    )}
                  >
                    <i
                      style={{ color: data.color }}
                      className={classNames(
                        { [`anticon ${data.icon}`]: true },
                        styles.anticonflag,
                      )}
                    />
                    <span className={styles.noselect}>{data.message}</span>
                  </div>
                }
              </AntCol>
            </AntRow>
            <AntRow style={{ textAlign: 'right' }}>
              <AntCol span="24">
                <AntButton
                  htmlType="button"
                  className="login-form-button"
                  onClick={resetAndClose}
                >
                  Отмена
                </AntButton>
                <AntButton
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onSubmit={onCreate}
                  disabled={disabled}
                  style={{ marginLeft: '10px' }}
                >
                  Сохранить
                </AntButton>
              </AntCol>
            </AntRow>
          </AntForm>
        </AntModal>
      </div>
    );
  }
}

FlagOptions.propTypes = {
  form: PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onCreate: React.PropTypes.func.isRequired,
  onChooseIcon: React.PropTypes.func.isRequired,
  onChooseColor: React.PropTypes.func.isRequired,
  onEditMessage: React.PropTypes.func.isRequired,
  modal: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default AntForm.create({})(FlagOptions);
