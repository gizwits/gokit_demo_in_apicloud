var flag;
var gizwits;

var dialogTimeOut;
var dialogTimeOutflag;

apiready = function() {
    gizwits = api.require("gizWifiSDK");//api.require
    api.lockSlidPane();

	//恢复Frame事件监听器注册
	api.addEventListener({
		name: 'RegisterForgetPage'
	}, function (ret, err) {
		updateInfo();
	});
	updateInfo();

};

//更新对应信息
function updateInfo(){
	flag = getKeyAndParam("isRegister").isRegister;

	if (flag==true) {
		document.getElementById('controle_btn').innerHTML = "注册";
		document.getElementById('newPassword').setAttribute("placeholder", "密码");
	} else {
		document.getElementById('controle_btn').innerHTML = "重置";
		document.getElementById('newPassword').setAttribute("placeholder", "新密码");
	}
	document.getElementById("phone").value="";
	document.getElementById("newPassword").value="";
	document.getElementById("confirmPassword").value="";
	document.getElementById("textVerifyCode").value="";
};

//获取验证码
function getVerifyCode() {
    var phone = document.getElementById('phone').value;

	if(isEmpty(phone,11,null)!=0){
		alert('手机号码不正确');
		return;
	}

	var params = {
		"phone" : phone
	};
    gizwits.requestSendVerifyCode(params, function(ret, err) {
        if(err){
           alert("获取验证码失败");

        }
        else{
           alert("获取成功");
        }

    });
};

//注册或者重置
function registOrReset() {
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("newPassword").value;
    var passwordConfirm = document.getElementById("confirmPassword").value;
	var verifyCode = document.getElementById("textVerifyCode").value;
    
	var params;

	if(isEmpty(phone,11,null)!=0){
		alert('手机号码格式不正确');
		return;
	}

	if(isEmpty(password,20,null)!=0){
		alert('密码格式不正确');
		return;
	}

	if(isEmpty(passwordConfirm,20,null)!=0){
		alert('密码格式不正确');
		return;
	}

	if(isEmpty(verifyCode,29,null)!=0){
		alert('验证码格式不正确');
		return;
	}

	if(password!=passwordConfirm){
		alert('两次输入的密码不一致');
		return;
	}

	dialogTimeOutflag = 0;
	dialogTimeOut=setTimeout(function () {
		if (dialogTimeOutflag == 0) {
			hideProgress();
			alert("登录超时");
			return;
		}
	}, 15000);

	if (flag==true) {
		showLoading("正在注册");
		params = {
			"phone" : phone,
			"password" : password,
			"code" : verifyCode
		};
		gizwits.registerUserByPhoneAndCode(params, function(ret, err) {
			if (dialogTimeOutflag == 1)
				return;

			hideProgress();
			if (err) {//失败
				if(err.errorCode==9010){
					alert("验证码无效");
				}else if(err.errorCode==9018){
					alert("手机号已注册");
				}else{
					alert("注册失败");
				}
            } else {//成功
               alert("注册成功");
			}
		});
	} else {
		showLoading("正在重置");
		params = {
			"phone" : phone,
			"code" : verifyCode,
			"newPassword" : password
		};
		gizwits.changeUserPasswordByCode(params, function(ret, err) {
			if (dialogTimeOutflag == 1)
				return;

			hideProgress();
			if (err) {//失败
				if(err.errorCode==9010){
					alert("验证码无效");
				}else{
					alert("重置失败");
				}
			} else {//成功
				alert("重置成功");
			}
		});
	}
};

hideProgress=function(){
	dialogTimeOutflag =1;

	clearTimeout(dialogTimeOut);

	api.hideProgress();
}
