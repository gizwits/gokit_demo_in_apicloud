/**
 * Created by chaoso on 15/5/21.
 */
var gizWifiSDK;
var LoginTimeOutFlag;
var LoginTimeOut;

apiready = function () {
    gizWifiSDK = api.require("gizWifiSDK");
};
var onForgetPwd = function () {
    sortTo.toForget();
}
var onLogin = function () {
    var username = document.getElementById('admin').value;
    var pwd = document.getElementById('pwd').value;

    if (isEmpty(username, 11, null) != 0 || isEmpty(pwd, 20, null) != 0) {
        alert("请填写用户名或密码");
        return;
    }

	showLoading('正在登录');
	
	LoginTimeOutFlag = 0;
    LoginTimeOut=setTimeout(function () {
        if (LoginTimeOutFlag == 0) {
            hideProgress();
            alert("登录超时");
            return;
        }
    }, 15000);
    
    gizWifiSDK.userLogin(jsonSetAdminAndPwd(username, pwd), function (ret, err) {
        if (LoginTimeOutFlag == 1)
            return;

        hideProgress();

        if (err) {
            if(err.errorCode == 9020){
                alert("帐号或者密码错误");
            }
            if(err.errorCode == 9005){
                alert("帐号不存在");
            }
            return;
        }
        if (ret) {
            var uid = ret.uid;
            var token = ret.token;
            saveTokenAndUid(token, uid);
            saveAdminAndPwd(username, pwd);
            isLoginWithFlag(true);
            alert("登录成功");
            sortTo.toDevList();
        }
    });
}
var jsonSetAdminAndPwd = function (username, pwd) {
    return {
        "userName": username,
        "password": pwd
    };
}

hideProgress=function(){
    LoginTimeOutFlag =1;

    clearTimeout(LoginTimeOut);

    api.hideProgress();
}
