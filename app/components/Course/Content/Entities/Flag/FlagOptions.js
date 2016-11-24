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


const AntFormItem = AntForm.Item;

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
      onChooseIcons,
      onChooseColors,
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
              <AntFormItem>
                <AntCol span="3">
                  <AntFormItem>
                    {getFieldDecorator('colors', {
                      initialValue: 'info-color',
                    })(
                      <AntSelect onChange={onChooseColors}>
                        {['info-color',
                          'sucess-color',
                          'error-color',
                          'warning-color'].map((color, index) =>
                            <AntSelect.Option value={color} key={index}>
                              <div
                                className={classNames(
                                  styles.rounded,
                                  styles[data.color],
                                )}
                              />
                            </AntSelect.Option>
                        )}
                      </AntSelect>
                    )}
                  </AntFormItem>
                </AntCol>
                <AntCol span="1" />
                <AntCol span="3">
                  <AntFormItem>
                    {getFieldDecorator('icons', {
                      initialValue: data.icons,
                    })(
                      <AntSelect onChange={onChooseIcons} >
                        {['anticon-check-circle',
                          'anticon-info-circle',
                          'anticon-exclamation-circle',
                          'anticon-cross-circle'].map((icon, index) =>
                            <AntSelect.Option value={icon} key={index}>
                              <i
                                className={classNames(
                                  { [`anticon ${icon}`]: true },
                                  styles.anticonflagselect,
                                  styles[data.icon]
                                )}
                              />
                            </AntSelect.Option>
                        )}
                      </AntSelect>
                      )}
                  </AntFormItem>
                </AntCol>
                <AntCol span="1" />
                <AntCol span="16">
                  <AntFormItem>
                    {getFieldDecorator('message', {
                      rules: [{ required: true, message: 'Поле должно быть заполнено!' }],
                      initialValue: data.message,
                    })(
                      <AntInput onChange={onEditMessage} />
                    )}
                  </AntFormItem>
                </AntCol>
              </AntFormItem>
            </AntRow>
            <AntRow>
              <AntCol span="24" className={styles.preview}>
                <span className={styles.title}>Предпросмотр</span>
                {!disabled &&
                  <div
                    className={classNames(
                      styles.flag,
                      styles[data.colors],
                    )}
                  >
                    <i
                      className={classNames(
                        { [`anticon ${data.icons}`]: true },
                        styles.anticonflag,
                        styles[data.icons],
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
  form: PropTypes.object,
  onCancel: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onChooseIcons: React.PropTypes.func,
  onChooseColors: React.PropTypes.func,
  onEditMessage: React.PropTypes.func,
  modal: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default AntForm.create({})(FlagOptions);
