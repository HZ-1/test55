const messages = process.env.BUILD_LOCALE_MESSAGES;
const buildConfig = process.env.BUILD_CONFIG;

/*
const messages = {
  "en-us": {
    "appName": "React App Pro",
    "siderMenu_dashboard": "Dashboard",
    "siderMenu_analysis": "Analysis",
    "siderMenu_realtime": "Real-time",
    "siderMenu_offline": "Offline",
    "siderMenu_workplace": "Workplace",
    "siderMenu_outlets": "Outlets Management",
    "siderMenu_exception": "Exception",
    "siderMenu_403": "403 Forbidden",
    "siderMenu_404": "404 Not Found",
    "pageTitle_homePage": "Home",
    "pageTitle_outlets": "Outlets Management",
    "pageTitle_outletDetail": "Outlet Detail",
    "basicLayout_profile": "Profile",
    "basicLayout_setting": "Setting",
    "basicLayout_logout": "Logout",
    "basicLayout_readall_notice": "You have read all notices!",
    "notFound_404": "Not Found",
    "unauthorized_403": "Forbidden",
    "exception_backToHome": "Back To Home",
    "login_appDesc": "React App Boilerplate for Enterprise Admin System",
    "login_usernameInput_placeholder": "Enter your username",
    "login_passwordInput_placeholder": "Enter your password",
    "login_login_btn": "Login",
    "outletDetail_description": "Location: ",
    "outletDetail_hours": "Opening Hours: ",
    "outletDetail_phone": "Phone: ",
    "outletDetail_categories": "Categories: ",
    "outletDetail_showNotification": "Show Notification",
    "outletDetail_notificationTitle": "Notification Title",
    "outletDetail_notificationContent": "Notification will dismiss after {seconds}s."
  },
  "zh-cn": {
    "appName": "React 中后台应用",
    "siderMenu_dashboard": "仪表盘",
    "siderMenu_analysis": "分析页",
    "siderMenu_realtime": "实时数据",
    "siderMenu_offline": "离线数据",
    "siderMenu_workplace": "工作台",
    "siderMenu_outlets": "门店管理",
    "siderMenu_exception": "异常页",
    "siderMenu_403": "403 禁止访问",
    "siderMenu_404": "404 不存在",
    "pageTitle_homePage": "首页",
    "pageTitle_outlets": "门店列表",
    "pageTitle_outletDetail": "门店详情",
    "basicLayout_profile": "个人中心",
    "basicLayout_setting": "设置",
    "basicLayout_logout": "退出登陆",
    "basicLayout_readall_notice": "你已阅读所有消息!",
    "notFound_404": "页面不存在",
    "unauthorized_403": "无权限查看",
    "exception_backToHome": "返回首页",
    "login_appDesc": "企业级管理系统 React 应用模版",
    "login_usernameInput_placeholder": "请输入用户名",
    "login_passwordInput_placeholder": "请输入密码",
    "login_login_btn": "登陆",
    "outletDetail_description": "位置: ",
    "outletDetail_hours": "营业时间: ",
    "outletDetail_phone": "联系电话: ",
    "outletDetail_categories": "类型: ",
    "outletDetail_showNotification": "显示通知",
    "outletDetail_notificationTitle": "通知标题",
    "outletDetail_notificationContent": "通知会在 {seconds} 秒后消失."
  }
}

const buildConfig ={"locale":"en-us","apiDomain":"http://localhost:3000"}
*/

export {
  messages,
  buildConfig,
};
