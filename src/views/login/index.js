import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Input, Icon, Button } from 'antd';
import appAction from 'app/action';
import logo from 'assets/logo.svg';
import './index.scss';

const propTypes = {
  prefixCls: PropTypes.string,
  errorMsg: PropTypes.string.isRequired,
  isLogin: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const defaultProps = {
  prefixCls: 'view-login',
};
class Login extends Component {
  state = {
    username: '',
    password: '',
  };

  componentDidMount() {
    const { isLogin, history } = this.props;
    if (isLogin) {
      //实现页面跳转，参考：https://segmentfault.com/a/1190000011137828
      history.push('/');
    }
  }

  componentDidUpdate() {
    const { isLogin, history } = this.props;
    if (isLogin) {
      history.push('/');
    }
  }

  onInputChange = (e, key) => {
    this.setState({ [key]: e.target.value });
  }


  handleLogin = () => {
    const { loginUser } = this.props;
    const { username, password } = this.state;
    loginUser(username, password);
  }

  renderErrorMsg = () => {
    const { errorMsg, prefixCls } = this.props;
    const show = !isEmpty(errorMsg);
    if (show) {
      return (
        <div className={`${prefixCls}-errorMsg`}>
          {errorMsg}
        </div>
      );
    }
    return null;
  };

  renderLoginPanel = () => {
    const { prefixCls, intl } = this.props;
    const { username, password } = this.state;
    return (
      <div className={`${prefixCls}-loginPanel`}>
        <div className={`${prefixCls}-appInfo`}>
          <img className={`${prefixCls}-appLogo`} src={logo} alt="logo" />
          <span className={`${prefixCls}-appName`}>
            11
          </span>
        </div>
        <div className={`${prefixCls}-appDesc`}>
          11
        </div>
        <Input
          className={`${prefixCls}-loginInput`}
          style={{ height: 40, marginBottom: 24 }}
          type="text"
          prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
          value={username}
          onChange={e => this.onInputChange(e, 'username')}
          //onPressEnter 当光标在输入框内时，然后敲回车键就会触发
          onPressEnter={this.handleLogin}
        />
        <Input
          className={`${prefixCls}-loginInput`}
          placeholder={11}
          type="password"
          prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
          value={password}
          onChange={e => this.onInputChange(e, 'password')}
          onPressEnter={this.handleLogin}
        />
        <Button
          className={`${prefixCls}-loginBtn`}
          type="primary"
          onClick={this.handleLogin}
        >
          11
        </Button>
        <div>
          {this.renderErrorMsg()}
        </div>
      </div>
    );
  }

  renderIntlSwitch = () => {
    const { prefixCls, intl ,history} = this.props;

    return (
      <div className={`${prefixCls}-intlSwitch`}>
        <span
          className={classnames({
            [`${prefixCls}-intlItem`]: true,
            [`${prefixCls}-intlItem-active`]: true,
          })}
          role="presentation"
        >
          English
        </span>
        <span className={`${prefixCls}-intlSwitchSeparator`}>
          |
        </span>
        <span
          className={classnames({
            [`${prefixCls}-intlItem`]: true,
            [`${prefixCls}-intlItem-active`]: true,
          })}
          role="presentation"
        >
          中文
        </span>
        <div onClick={()=>{
          console.log(this.props.loginUser);
        }}>oooooooooo</div>
        <Acv></Acv>
      </div>

    );
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div className={prefixCls}>
        {this.renderLoginPanel()}
        {this.renderIntlSwitch()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLogin: state.app.isLogin,
  errorMsg: state.app.loginErrorMsg,
});

//查看connect源码，mapDispatchToProps 一般接收函数，但也可以接收对象，并在对象中传递dispatch，
//当mapDispatchToProps为对象时，执行 this.props.loginUser() 会执行 appAction.loginUser()() ,主意哦，是两次()()！！
const mapDispatchToProps = {
  loginUser: appAction.loginUser,
};

const Acv = ({aaa})=>{
  return (<div>{aaa}</div>)
}
Acv.defaultProps={aaa:999889}

Login.propTypes = propTypes;
//defaultProps 定义Login的默认props属性
Login.defaultProps = defaultProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(Login));
