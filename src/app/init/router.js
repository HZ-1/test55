/**
* AclRouter 定义了 正常登陆的页面，异常页面
* */
/**router 实际模型如下，更多详细，请看router_modal.js：
 const Page = props=>(<BasicLayout {...props}>
                        <Outlets {...props} />
                     </BasicLayout>)

 <ConnectedRouter history={history}>
        <Switch>
            <Route key={path} path="/dashboard/analysis/realtime" component={Page} />
        </Switch>
 </ConnectedRouter>
 **/
import React from 'react';
import PropTypes from 'prop-types';
// 这里history单独拎出来，并且使用connected-react-router主要原因是为了 让路由与redux同步，可以调试redux-devtools工具
// 如果想用redux-tool调试工具，完全可以使用其他的react-router-dom 的BrowserRouter代替ConnectedRouter
import { ConnectedRouter } from 'connected-react-router';
import { connect } from 'react-redux';
//react-acl-router 带有权限控制的路由 参考：https://github.com/AlanWei/react-acl-router
//AclRouter 其实最终返回的是一个数组：
// <Switch>
//     <Route key={path} path="/dashboard/analysis/realtime" component={Page} />
// </Switch>
// import AclRouter from 'react-acl-router';
import AclRouter from 'src-acl-router';

import NormalLayout from 'layouts/NormalLayout';
//normalRoutes 登陆页 和 主页面Outlets Management 页面
import { normalRoutes } from '../config/routes';



// react-acl-router用于构建授权相关的路由，如登录？
// react-acl-router将覆盖render props。

const propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

//给Router定义history属性，是因为用这个来通过redux devTools 时无法同步看到url切换的问题
// 具体配置方法：
// 通过Router定制history，使用syncHistoryWithStore API创建；
//（参看：深入浅出react和redux书籍220页）
const Router = ({ history, user }) => (
  <ConnectedRouter history={history}>
      {/*AclRouter 用于构建授权相关AuthorizedRoute的路由*/}
      <AclRouter
          // 当前用户的权限
        authorities={user.authorities}
          //不需要授权的路由页面 //normalRoutes 登陆页 和 主页面Outlets Management 页面
        normalRoutes={normalRoutes}
          //不需要授权的路由容器//
        normalLayout={NormalLayout}
      />
  </ConnectedRouter>
);

const mapStateToProps = state => ({
  user: state.app.user,
});

Router.propTypes = propTypes;
export default connect(mapStateToProps)(Router);
