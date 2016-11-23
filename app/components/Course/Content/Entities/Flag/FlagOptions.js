import React, { PropTypes, Component } from 'react';
import cx from 'classnames';
import {
  Button as AntButton,
  Input as AntInput,
  Form as AntForm,
  Select as AntSelect,
  Col, Row,
  Modal as AntModal } from 'antd';
import styles from './styles.css';


const FormItem = AntForm.Item;

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
    const { getFieldDecorator } = this.props.form;
    const {
      modal,
      message,
      colors,
      icons,
      onCancel,
      onCreate,
      onChooseIcon,
      onChooseColor,
      onEditMessage,
    } = this.props;
    const { disabled } = this.state;
    return (
      <div>
        <AntModal
          title="Флаг"
          visible={modal}
          okText="Create"
          onCancel={onCancel}
          footer={null}
        >
          <AntForm onSubmit={onCreate} onChange={this.disableButton}>
            <Row className={styles.form}>
              <FormItem>
                <Col span="3">
                  <FormItem>
                    {getFieldDecorator('colors', {
                      initialValue: colors,
                    })(
                      <AntSelect onChange={onChooseColor}>
                        {['info-color',
                        'sucess-color',
                        'error-color',
                        'warning-color'].map((color, index) =>
                          <AntSelect.Option value={color} key={index}>
                            <div
                              className={cx(
                                styles.rounded,
                                styles[color],
                              )}
                            />
                          </AntSelect.Option>
                        )}
                      </AntSelect>
                    )}
                  </FormItem>
                </Col>
                <Col span="1" />
                <Col span="3">
                  <FormItem>
                    {getFieldDecorator('icons', {
                      initialValue: icons,
                    })(
                      <AntSelect onChange={onChooseIcon} >
                        {['anticon-check-circle',
                        'anticon-info-circle',
                        'anticon-exclamation-circle',
                        'anticon-cross-circle'].map((icon, index) =>
                          <AntSelect.Option value={icon} key={index}>
                            <i
                              className={cx(
                                { [`anticon ${icon}`]: true },
                                styles.anticonflagselect,
                                styles[icon]
                              )}
                            />
                          </AntSelect.Option>
                        )}
                      </AntSelect>
                      )}
                  </FormItem>
                </Col>
                <Col span="1" />
                <Col span="16">
                  <FormItem>
                    {getFieldDecorator('message', {
                      rules: [{ required: true, message: 'Поле должно быть заполнено!' }],
                      initialValue: message,
                    })(
                      <AntInput onChange={onEditMessage} />
                    )}
                  </FormItem>
                </Col>
              </FormItem>
            </Row>
            <Row>
              <Col span="24" className={styles.preview}>
                <span className={styles.title}>Предпросмотр</span>
                {disabled === false &&
                  <div
                    className={cx(
                      styles.flag,
                      styles[colors],
                    )}
                  >
                    <i
                      className={cx(
                        { [`anticon ${icons}`]: true },
                        styles.anticonflag,
                        styles[icons],
                      )}
                    />
                    <span className={styles.noselect}>{message}</span>
                  </div>
                }
              </Col>
            </Row>
            <Row style={{ textAlign: 'right' }}>
              <Col span="24">
                <AntButton
                  htmlType="button"
                  className="login-form-button"
                  onClick={onCancel}
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
              </Col>
            </Row>
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
  onChooseIcon: React.PropTypes.func,
  onChooseColor: React.PropTypes.func,
  onEditMessage: React.PropTypes.func,
  promt: PropTypes.object,
  modal: PropTypes.func,
  message: PropTypes.string,
  icons: PropTypes.string,
  colors: PropTypes.string,
};

export default AntForm.create({})(FlagOptions);
