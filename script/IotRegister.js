var flag;
var gizwits;

var dialogTimeOut;
var dialogTimeOutflag;

var captchaCodeToken;
var captchaId;

apiready = function() {
    gizwits = api.require("gizWifiSDK");//api.require
    api.lockSlidPane();

	//恢复Frame事件监听器注册
	api.addEventListener({
		name: 'RegisterForgetPage'
	}, function (ret, err) {
		updateInfo();
	});
	getCaptchaCode();
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

// 获取图片验证码
function getCaptchaCode() {
	gizwits.getCaptchaCode({
        "appSecret": window.appSecret
	}, function(ret, err) {
//	        alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
			captchaCodeToken = ret.token;
			captchaId = ret.captchaId;
	        document.getElementById('captchaCode').src = ret.captchaURL;
//			alert('captchaCodeToken:'+captchaCodeToken+',captchaId:'+captchaId+',ret.captchaURL:'+ret.captchaURL);
	});
}

//获取验证码
function getVerifyCode() {
    var phone = document.getElementById('phone').value;
    var captchaCode = document.getElementById('textVerifyCode').value;

	if(isEmpty(phone,11,null)!=0){
		alert('手机号码不正确');
		return;
	}

	var params = {
		"token": captchaCodeToken,
        "captchaId": captchaId,
        "captchaCode": captchaCode,
		"phone": phone
	};
//	alert($api.jsonToStr(params));
    gizwits.requestSendPhoneSMSCode(params, function(ret, err) {
        if(err){
           alert("验证码输入有误，请重试");
        }
        else{
        	document.getElementById('content_getCaptchaCode').style.display="none";
			document.getElementById('content_register').style.display="block";
        }
    });
};

//注册
function registOrReset() {
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("newPassword").value;
    var passwordConfirm = document.getElementById("confirmPassword").value;
	var textSMSVerifyCode = document.getElementById("textSMSVerifyCode").value;
    
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

	if(isEmpty(textSMSVerifyCode,29,null)!=0){
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
			"code" : textSMSVerifyCode
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
			"code" : textSMSVerifyCode,
			"newPassword" : password
		};
//		alert(JSON.stringify(params));
		gizwits.changeUserPasswordByCode(params, function(ret, err) {
//			alert('ret:'+JSON.stringify(ret));
//  		alert('err:'+JSON.stringify(err));
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
				sortTo.toDevList();
			}
		});
	}
};

hideProgress=function(){
	dialogTimeOutflag =1;

	clearTimeout(dialogTimeOut);

	api.hideProgress();
}

function backToFristReg(){
	document.getElementById('content_getCaptchaCode').style.display="block";
	document.getElementById('content_register').style.display="none";
}

