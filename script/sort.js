/**
 * Created by chaoso on 15/5/28.
 */

function toPage(title, url, name, param) {
    var headerPos = getKeyAndParam('headerPos');
    api.openFrame({
        name: name,
        url: url,
        bounces: false,
        rect: {
            x: 0,
            y: headerPos.h,
            w: headerPos.w,
            h:'auto'
        },
        pageParam: param
    });
    api.sendEvent({
        name: name,
        extra: {
            title: title,
            name: name
        }
    });
    api.sendEvent({
        name: 'slide',
        extra: {
            title: title,
            name: name
        }
    });
    
    if(name!='softap'){
	    api.closeFrame({
	    	name: 'softap'
		});
    }
    
    api.closeSlidPane();
};
var sortTo = {
    toAddDev: function () {
        title = "Airlink配置";
        name = "airlink";
        url = "../html/IotAirlinkConfig.html";
        api.execScript({
            name: 'slide',
            script: 'toPage("' + title + '","' + url + '","' + name + '","");'
        });
    },
    toDevList: function () {
        title = "设备列表";
        name = "deviceList";
        url = "../html/IotDeviceList.html";
        api.execScript({
            name: 'slide',
            script: 'toPage("' + title + '","' + url + '","' + name + '","");'
        });
        api.execScript({
            name: 'fixed',
            script: 'hideLiControl();'
        });
    },
    toQrCodeScan: function () {
        var scanner = api.require('scanner');
        scanner.open(function(ret,err) {
            if(ret.msg){
                if(( ret.msg.indexOf("product_key=") )!= -1
                    &&( ret.msg.indexOf("did=") )!= -1
                    &&( ret.msg.indexOf("passcode=") )!= -1){

                    pk=getParamFomeUrl(ret.msg,"product_key");
                    did=getParamFomeUrl(ret.msg,"did");
                    passcode=getParamFomeUrl(ret.msg,"passcode");
                    
                    if(pk==window.productKey){
	                    api.sendEvent({
	                        name: "bindDevice",
	                        extra: {
	                            did: did,
	                            passcode: passcode,
	                            remark:""
	                        }
	                    });
                    }else{
                    	alert('请扫描机智云官网的Gokit虚拟设备');
                    }
                    
                    sortTo.toDevList();
                }
            }
        });
    },
    toLogin: function () {
        title = "账号登录";
        name = "login";
        url = "IotLogin.html";

        window.isLogin = isUserLogin();
        if (window.isLogin=="true") {
            isLoginWithFlag(false);

            saveAdminAndPwd("", "");
            sortTo.toDevList();

        } else {
            api.execScript({
                name: 'slide',
                script: 'toPage("' + title + '","' + url + '","' + name + '","");'
            });
        }

    },
    toControl: function () {
        //window.location.href = '../html/IotController.html';
        title = "设备控制";
        name = "control";
        url = "IotController.html";
        api.execScript({
            name: 'slide',
            script: 'toPage("' + title + '","' + url + '","' + name + '");'
        });
        api.execScript({
            name: 'fixed',
            script: 'showLiControl();'
        });
    },
    toSoftAp: function () {
        title = "SoftAp模式";
        name = "softap";
        url = "IotSoftAp.html";
        api.execScript({
            name: 'slide',
            script: 'toPage("' + title + '","' + url + '","' + name + '","");'
        });
    },
    toForget: function () {
        title = "忘记密码";
        name = "RegisterForgetPage";
        url = "IotRegister.html";

        param = {"isRegister": false};
        setKeyAndParams("isRegister", param);

        param = {"key": name};
        api.execScript({
            name: 'slide',
            script: 'toPage("' + title + '","' + url + '","' + name + '","");'
        });
        api.execScript({
            name: 'slide',
            script: 'showBackButton();'
        });
    },
    toRegister: function () {
        title = "注 册";
        name = "RegisterForgetPage";
        url = "IotRegister.html";

        param = {"isRegister": true};
        setKeyAndParams("isRegister", param);

        param = {"key": name};
        api.execScript({
            name: 'slide',
            script: 'toPage("' + title + '","' + url + '","' + name + '","");'
        });
    }

};

//控制设备界面的菜单栏
var menuItem = {
    disconnect: function () {
//      sortTo.toControl();
        api.sendEvent({
            name: 'disconnect',
            extra: {
                title: "设备控制",
                name: "control"
            }
        });

    },
    unbind: function () {
        api.sendEvent({
            name: 'unbind',
            extra: {
                title: "设备控制",
                name: "control"
            }
        });
    },
    status: function () {
        sortTo.toControl();
        api.sendEvent({
            name: 'getStatus',
            extra: {
                title: "设备控制",
                name: "control"
            }
        });
    }
};


