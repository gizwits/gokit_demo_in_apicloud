/**
 * Created by chaoso on 15/5/21.
 */
var gizwitsSDK;
var GizWifiDevice;
var newDevices;
var offLineDeivces;
var boundDevices;
var devicesList;
var tempDeivceList;
var tempList = [];
var index;
var ssid;

var NetworkTimeOutFlag =0;
var LoginTimeOutFlag =0;
var GetDeviceTimeOutFlag =0;
var LoginDeviceTimeOutFlag =0;
var BindDeviceFlag = 0;

var NetworkTimeOut;
var LoginTimeOut;
var GetDeviceTimeOut;
var LoginDeviceTimeOut;
var BindDeviceTimeOut;

var isGetJsonFileSuccess=0;
var isShowGetListDialog=0;

apiready = function () {
    gizwitsSDK = api.require("gizWifiSDK");
    GizWifiDevice = api.require("gizWifiDevice");
    
//    gizwitsSDK.setLogLevel({logLevel:3});
//    gizwitsSDK.setLogLevel({"logLevel": 3,"printDataLevel":true});
    
//  gizwitsSDK.getVersion(function(ret, err) {
//	        alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
//	});

	var GizWifiLogLevelAll = 3;
	gizwitsSDK.setLogLevel({"logLevel": GizWifiLogLevelAll});

    initSDK();

    api.addEventListener({
        name: 'deviceList'
    }, function (ret, err) {
        if (ret.value.name == "deviceList") {
            NetworkCheck();
        }
    });

    api.addEventListener({
        name: 'resume'
    }, function (ret, err) {
        NetworkCheck();
    });

    api.addEventListener({
        name: 'onLogin'
    }, function (ret, err) {
        onLogin();
    });

    api.addEventListener({
        name: 'bindDevice'
    }, function (ret, err) {
        if(ret && ret.value){
            bindDevice(ret.value.did,ret.value.passcode,ret.value.remark);
        }

    });
    gizwitsSDK.getPhoneSSID(function(ret, err){
        if(ret && ret.SSID){
            if(( ret.SSID.indexOf("XPG-GAgent") )!= -1){
                sortTo.toSoftAp();
                return;
            }
        }
		setTimeout("onLogin()", 2000);
        onLogin();

    });
}
var initSDK = function () {
    var params = {appID: window.appId};
    gizwitsSDK.startWithAppID(params);
};

function NetworkCheck() {
    showLoading('检查网络中');
    NetworkTimeOutFlag = 0;
    NetworkTimeOut=setTimeout(function () {
        if (NetworkTimeOutFlag == 0) {
            hideProgress();
            alert("检查网络超时");
            return;
        }
    }, 15000);

    var connectionType = api.connectionType;
    if (connectionType == 'none') {
        if(NetworkTimeOutFlag==1)
            return;

        setTimeout(function () {
            hideProgress();
            alert("网络很差，请重新尝试");
            return;
        }, 1000);
    } else {
        setTimeout(function () {
            gizwitsSDK.getPhoneSSID(function (ret, err) {
                if(NetworkTimeOutFlag==1)
                    return;

                if (err) {
                    hideProgress();
                    alert("网络不稳定，请重新尝试");
                    return;
                }
                else {
                    ssid = ret.SSID;
                    hideProgress();
                    if ((ssid.indexOf("XPG-GAgent")) != -1) {
                        alert('检测到Softap模式，已经跳进softap页面');
                        sortTo.toSoftAp();
                    } else {
                        onLogin();
                    }
                }
            });
        }, 500);
    }
}

var onLogin = function () {
    showLoading('登录账号中');
    LoginTimeOutFlag = 0;
    LoginTimeOut=setTimeout(function () {
        if (LoginTimeOutFlag == 0) {
            hideProgress();
            alert("登录账号超时");
            return;
        }
    }, 15000);

    var flag;
    if (getAdmin().length == 0 || getPwd().length == 0) {
        flag = 0;
    } else {
        flag = 1;
    }
    if (flag == 0) {
        anonymousLogin();
    }
    else {
        onUserLogin(getAdmin(), getPwd());
    }
}
//匿名登录
var anonymousLogin = function () {
    gizwitsSDK.userLoginAnonymous(function (ret, err) {

        //TODO 修改超时逻辑
        if (LoginTimeOutFlag == 1)
            return;

        if (err) {
            if (err.errorCode != 0){
                alert("匿名登录失败,请重试");
                hideProgress();
            }
        } else {
            saveTokenAndUid(ret.token, ret.uid);
            hideProgress();
            getDevices();
        }
    });
};
//登录
var onUserLogin = function (username, pwd) {
    gizwitsSDK.userLogin({
        "userName": username,
        "password": pwd
    }, function (ret, err) {
        //TODO 修改超时逻辑
        if (LoginTimeOutFlag == 1)
            return;

        if (err) {
            hideProgress();
            alert("登录失败");

            saveAdminAndPwd("", "");
        }
        else {
            hideProgress();

            var uid = ret.uid;
            var token = ret.token;
            saveTokenAndUid(token, uid);
            saveAdminAndPwd(username, pwd);
            isLogin = true;
            getDevices();
        }
    });
}

//登录设备
var loginDevice = function (macDevice, didDevice, passcodeDevice) {
    if(isGetJsonFileSuccess==0){
        alert('配置文件未加载成功，请刷新列表');
        return;
    }

    showLoading('正在登录设备');
    LoginDeviceTimeOutFlag = 0;
    LoginDeviceTimeOut=setTimeout(function () {
        if (LoginDeviceTimeOutFlag == 0) {
            hideProgress();
            alert("登录设备超时");
            return;
        }
    }, 15000);

    var params;
    var _uid;
    var _token;

    var uidAndToken = getTokenAndUid();
    _uid = uidAndToken.uid;
    _token = uidAndToken.token;


    params = {
        "uid": _uid,
        "token": _token,
        "device": {
            "mac": macDevice,
            "did": didDevice
        }
    };
    var deviceParam = {device: {"mac": macDevice, "did": didDevice}};
    //alert("getConnection===="+JSON.stringify(deviceParam));
    GizWifiDevice.getIsConnected(deviceParam, function (ret, err) {
        if (LoginDeviceTimeOutFlag == 1)
            return;

        if (ret) {
            if (!ret.isConnected) {
                GizWifiDevice.login(params, function (ret, err) {
                    if (LoginDeviceTimeOutFlag == 1)
                        return;

                    if (ret) {
                        //界面跳转
                        hideProgress();
                        alert('登录设备成功');

                        var param = {
                            "mac": macDevice,
                            "did": didDevice,
                            "passcode": passcodeDevice
                        }

                        setKeyAndParams("deviceInfo", param);
                        sortTo.toControl();
                    } else {
                        hideProgress();
                        alert('连接设备失败');

                        return;
                    }
                });
            }
            else {
                //直接
                hideProgress();
                alert('已经登录');
                var param = {
                    "mac": macDevice,
                    "did": didDevice,
                    "passcode": passcodeDevice
                }
                setKeyAndParams("deviceInfo", param);
                sortTo.toControl();
            }
        }
        if (err) {
            hideProgress();
            alert('连接失败');
        }

    });
};
//绑定设备
var bindDevice = function (didDevice, passcodeDevice, remark) {
//	alert('开始绑定aaaaa：'+isBinding);
	if(api.systemType == 'ios') $api.setStorage('isBinding','true');
    showLoading('正在绑定设备');
    BindDeviceTimeOut=setTimeout(function () {
        if (BindDeviceFlag == 0) {
            hideProgress();
            alert("绑定设备超时");
            return;
        }
    }, 15000);

    var params;
    var uidAndToken = getTokenAndUid();
    mUid = uidAndToken.uid;
    mToken = uidAndToken.token;
    params = {
        "uid": mUid,
        "token": mToken,
        "passcode": passcodeDevice,
        "did": didDevice,
        "remark": remark
    };
//  alert('asdf');
    gizwitsSDK.bindDevice(params, function (ret, err) {
    // alert('bindDevice: '+JSON.stringify(ret)+'==<br>=='+JSON.stringify(err));
    // alert('BindDeviceFlag:'+BindDeviceFlag);
        // if (BindDeviceFlag == 1) return;

        if (err) {
//          alert('设备绑定失败'+JSON.stringify(err));
        } else {
            alert('设备绑定成功');
            setTimeout(function(){
                getDevices();
            },500);
         setTimeout(function(){
             if(api.systemType == 'ios') $api.setStorage('isBinding','false');
         },3000);
        }
        hideProgress();
    });
};


var getDevices = function () {
    showLoading('正在获取设备');
    GetDeviceTimeOutFlag = 0;
    GetDeviceTimeOut=setTimeout(function () {
        if (GetDeviceTimeOutFlag == 0) {
            hideProgress();
            alert("获取设备超时");
            return;
        }
    }, 15000);

    var result = getTokenAndUid();
    var flag = 0;
    var stopflag = 0;
    isGetJsonFileSuccess=0;
    isShowGetListDialog=0;

    index = 0;
    var params = {
        'uid': result.uid,
        'token': result.token,
        'specialProductKeys': ["6f3074fe43894547a4f1314bd7e3ae0b"]
        //'specialProductKeys': []
    };

    cleanList();

    gizwitsSDK.getBoundDevices(params, function (ret, err) {
        if (err) {
            alert("获取设备失败");
        }
        if (ret) {
//      	alert('getBoundDevices: '+JSON.stringify(ret));
            devicesList = [];
            devicesList = ret.devices;

            newDevices = [];
            offLineDeivces = [];
            boundDevices = [];
            tempList = [];
            tempDeivceList = [];
        }
        setTimeout(function()
        {
            sortDevicesList();
            hideProgress();
        },500);


    });
};

var sortDevicesList = function () {
    if(!devicesList)
        return;

    if(devicesList.length == 0){
        if(isGetJsonFileSuccess==0){
            isGetJsonFileSuccess=1;
        }
    }
    for (var i = 0; i < devicesList.length; i++) {

        if(isGetJsonFileSuccess==0){
            if(devicesList[i].productName){
                isGetJsonFileSuccess=1;
            }
        }

        isBind(devicesList[i], function (device, bindFlag) {
            var deviceObj = new Device();
            deviceObj.mac = device.mac;
            deviceObj.did = device.did;
            deviceObj.passcode = device.passcode;
            deviceObj.isOnline = device.isOnline;
            deviceObj.isDisabled = device.isDisabled;
            deviceObj.isLAN = device.isLAN;
            deviceObj.isBind = bindFlag;

            dereplicationWithDev(tempDeivceList, deviceObj);

            for (var j = 0; j < tempDeivceList.length; j++) {
                var obj = tempDeivceList[j];
                if (obj.isDisabled)
                    continue;
                if (obj.isLAN && !obj.isBind) {
                    dereplicationWithDev(newDevices, obj);
                    continue;
                }
                if (obj.isLAN || obj.isOnline) {
                    dereplicationWithDev(boundDevices, obj);
                    continue;
                }
                dereplicationWithDev(offLineDeivces, obj);
            }
            //alert(JSON.stringify(tempDeivceList) + "=====" + JSON.stringify(newDevices) + "====" + JSON.stringify(boundDevices) + "====" + JSON.stringify(offLineDeivces));
            buildList();

        });
    }

//  if(isGetJsonFileSuccess==0&&isShowGetListDialog==0){
//      alert('配置文件未加载成功，请刷新列表');
//      isShowGetListDialog=1;
//  }
	if(isGetJsonFileSuccess==0){
        alert('配置文件未加载成功，请刷新列表');
    }
};
var buildList = function () {
    var newDevicesList = buildUl(newDevices, 1);
    var offLineDeivcesList = buildUl(offLineDeivces, 2);
    var boundDevicesList = buildUl(boundDevices, 0);

    document.getElementById('bindingDev').innerHTML = boundDevicesList;
    document.getElementById('newDev').innerHTML = newDevicesList;
    document.getElementById('offLineDev').innerHTML = offLineDeivcesList;
};

var buildUl = function (devicesList, listType) {

    var liContent = '';
    if (devicesList.length == 0) {
        liContent = '<li class="ui-border-t" tapmode="liActive" data-href="">' + '<div class="ui-list-info">' + '<h4>没有设备</h4>' + '</div>' + '</li>' + liContent;
        return liContent;
    }
//  alert(JSON.stringify(devicesList));
    for (var i = 0; i < devicesList.length; i++) {
        var device = devicesList[i];
        var mac = device.mac;
        var did = device.did;
        var passcode = device.passcode;
        var status = device.isLAN ? "局域网在线" : "远程在线";

        if (!device.isOnline) {
            status = "离线";
        } else {
            if (listType == 1) {
                status = "未绑定";
            }
        }
        liContent = '<li class="ui-border-t" tapmode="liActive" data-href=>'
            + '<a href="javascript:toControlPage(\'' + mac + '\',\'' + did + '\',\'' + passcode + '\',\'' + listType + '\')"  class="ui-list-info"><div>'
            + '<h4>微信宠物屋</h4>' + '<p>' + mac + '</p>' + '</div>'
            + '<div class="ui-list-action">' + status + '</div>'
            + '<input type="hidden" value="' + did + '">' + '</a></li>' + liContent;
    }
    //if (listType == 0) {
    //    document.getElementById('bindingDev').innerHTML = "";
    //} else if (listType == 1) {
    //    document.getElementById('newDev').innerHTML = "";
    //} else {
    //    document.getElementById('offLineDev').innerHTML = "";
    //}
    return liContent;
};


var isBind = function (device, callback) {
    var uid = getTokenAndUid().uid;
    var params = {"device": {"mac": device.mac, "did": device.did}, "uid": uid};
    var bindFlag = false;
    //alert("getIsBind ======= "+JSON.stringify(params));
    GizWifiDevice.getIsBind(params, function (ret, err) {
        if (err) {
            //alert("获取设备信息失败");
            return;
        } else {
            bindFlag = ret.isBind;
            callback(device, bindFlag);
        }
    });
};


//listType 1：新发现设备 ，2：离线设备 ，0：绑定设备

var toControlPage = function (mac, did, passcode, listType) {
//	alert('listType: '+listType);
    param = {
        "mac": mac,
        "did": did,
        "passcode": passcode

    }

    if (listType == 1) {
        bindDevice(did, passcode, "");

    } else if (listType == 2) {
        //alert("该设备为离线设备");
        //return;
        //loginDevice(mac, did, passcode);
        setKeyAndParams("deviceInfo", param);
        sortTo.toControl();
    } else {
        loginDevice(mac, did, passcode);
        //setKeyAndParams("deviceInfo", param);
        //sortTo.toControl();
    }
}

//去重
function dereplicationWithDev(list, dev) {
    var length = list.length;
    if (length > 0) {
        for (var k = 0; k < length; k++) {
            var obj = list[k];
            if (obj.did == dev.did) {
                list[k] = dev;
                return;
            } else {
                if (k == length - 1) {
                    list[length] = dev;
                }
                continue;
            }
        }
    } else {
        list[length] = dev;
    }
}

var hideProgress=function(){
    NetworkTimeOutFlag =1;
    LoginTimeOutFlag =1;
    GetDeviceTimeOutFlag =1;
    LoginDeviceTimeOutFlag =1;
    BindDeviceFlag=1;

    clearTimeout(NetworkTimeOut);
    clearTimeout(LoginTimeOut);
    clearTimeout(GetDeviceTimeOut);
    clearTimeout(LoginDeviceTimeOut);
    clearTimeout(BindDeviceTimeOut);

    api.hideProgress();
}

var cleanList = function(){
    newDevices = [];
    offLineDeivces = [];
    boundDevices = [];

    var newDevicesList = buildUl(newDevices, 1);
    var offLineDeivcesList = buildUl(offLineDeivces, 2);
    var boundDevicesList = buildUl(boundDevices, 0);

    document.getElementById('bindingDev').innerHTML = boundDevicesList;
    document.getElementById('newDev').innerHTML = newDevicesList;
    document.getElementById('offLineDev').innerHTML = offLineDeivcesList;
    //removeContent("bindingDev");
    //removeContent("newDev");
    //removeContent("offLineDev");
}


function removeContent(id){
    $$(id).innerHTML = "";
}


