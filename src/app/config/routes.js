
import Login from 'views/login';
//这里需要定义两个路由？，绝对路径时，当登录后，重定向/outlets，
// 而/outlets是需要鉴权的页面，如果没有登录，会自动重定向到/login
//所以这里要定义/login，并且把登录页面指向到这个路由；如果不定义/login将指向404页面。
//所以这里必须要定义绝对路径和/login
const normalRoutes = [{
  path: '/',
  exact: true,
  redirect: '/outlets',
}, {
  path: '/login',
  exact: true,
  component: Login,
}];

const combineRoutes = [
  ...normalRoutes,
];

export {
  normalRoutes,
  combineRoutes,
};
