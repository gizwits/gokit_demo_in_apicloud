var GizwitsSDK;
var GizwitsDevice;
var deviceMac;
var deviceDid;
var devicePasscode;
var uid;
var token;

var LED_OnOff;
var LED_Color;
var LED_R;
var LED_G;
var LED_B;
var Motor_Speed;
var LED_RShowText;
var LED_GShowText;
var LED_BShowText;
var Motor_SpeedShowText;
var Temperature;
var Humidity;
var Infrared;

var AntiShake = 0;
var AntiTimeOut;

apiready = function () {
    GizwitsSDK = api.require("gizWifiSDK");
    GizwitsDevice = api.require("gizWifiDevice");
    //GizwitsSDK.setLogLevel({"logLevel": "all", "printDataLevel": true});

    if(api.systemType == 'ios') {
    	$api.setStorage('isBinding',false);
    
	    params = {
	        "device": {
	            "mac": deviceMac,
	            "did": deviceDid
	        }
	    };
	    GizwitsDevice.getIsOnline(params, function(ret, err){
	    	if (!ret.isOnline) {
	                //设备已断开
	                	alert('设备断开连接');
	                	back2DeviceList();
	            }
	    });
	}

    //恢复Frame事件监听器注册
    api.addEventListener({
        name: 'control'
    }, function (ret, err) {
        updateInfo();
        getDevOnline();
    });
    
    updateInfo();
    getDevOnline();

    //断开连接的菜单事件监听器注册
    api.addEventListener({
        name: 'disconnect'
    }, function (ret, err) {
        disconnect();
    });

    //断开连接的菜单事件监听器注册
    api.addEventListener({
        name: 'unbind'
    }, function (ret, err) {
        unBind();
    });

    //获取设备状态的菜单事件监听器注册
    api.addEventListener({
        name: 'getStatus'
    }, function (ret, err) {
        getStatus();
    });

    LED_OnOff = document.getElementById("showText_LED_on_off");
    LED_Color = document.getElementById("showText_LED_combind");
    LED_R = document.getElementById("positionLED_red");
    LED_G = document.getElementById("positionLED_green");
    LED_B = document.getElementById("positionLED_blue");
    Motor_Speed = document.getElementById("positionLED_motor");
    Infrared = document.getElementById("showText_LED_infrared");
    Humidity = document.getElementById("showText_hum");
    Temperature = document.getElementById("showText_temp");
    LED_RShowText = document.getElementById("showText_LED_red");
    LED_GShowText = document.getElementById("showText_LED_green");
    LED_BShowText = document.getElementById("showText_LED_blue");
    Motor_SpeedShowText = document.getElementById("showText_LED_motor");

//  document.addEventListener('touchend',touchCancel);
};

function touchCancel(event){
    event.preventDefault();
    var elementsList = event.changedTouches;
    var element = elementsList[0].target;
    if(element.id == "positionLED_red"){
        sliderSend(1);
    }else if(element.id == "positionLED_green"){
        sliderSend(2);
    }else if(element.id == "positionLED_blue"){
        sliderSend(3);
    }else if(element.id == "positionLED_motor"){
        sliderSend(4);
    }

}

function getDevOnline() {
    params = {
        "device": {
            "mac": deviceMac,
            "did": deviceDid
        }
    };

    GizwitsDevice.getIsConnected(params,function(ret, err){
        if(ret.isConnected){
            GizwitsDevice.registerNotifications(params, onMyStatus);
            setTimeout(function () {
                getStatus();
            }, 500);
        }else{
        	alert('设备不在线，不可以做控制，但可以解除绑定');
        }
    });
}

//更新设备信息
function updateInfo() {

    var mResult = getTokenAndUid();
    uid = mResult.uid;
    token = mResult.token;

    deviceInfo = getKeyAndParam("deviceInfo");

    deviceMac = deviceInfo.mac;
    deviceDid = deviceInfo.did;
    devicePasscode = deviceInfo.passcode;

}

function back2DeviceList() {
    sortTo.toDevList();
}

//登录设备
var loginDevice = function (macDevice, didDevice, passcodeDevice) {

    params = {
        "uid": uid,
        "token": token,
        "device": {
            "mac": macDevice,
            "did": didDevice
        }
    };

    GizwitsDevice.login(params, function (ret, err) {
        if (ret) {
            alert('登录设备成功');

        } else {
            alert('登录设备失败');

        }
    });
};

//设备状态回调
function onMyStatus(ret, err) {
//	alert($api.jsonToStr(ret)+' ==123321== '+$api.jsonToStr(err));
//  if (AntiShake > 0) {
//      return;
//  }
    if (ret) {
     if(api.systemType == 'ios') {
     	var isBinding = $api.getStorage('isBinding');
 	// if(isBinding) alert('断开aaaaa：'+isBinding);
//  	alert('onMyStatus: '+$api.jsonToStr(ret));
        if (typeof(ret.isConnected) != "undefined") {
            if (!ret.isConnected) {
                //设备已断开
//              alert('isBinding: '+isBinding);

                if(isBinding=='false') {
                	alert('设备断开连接');
                	back2DeviceList();
                	return;
                }
            }
        }
     }
     else {
     	if (typeof(ret.isConnected) != "undefined") {
            if (!ret.isConnected) {
                	alert('设备断开连接');
                	back2DeviceList();
                	return;
            }
        }
     }
     
//      if (!mStatus) return;
        mStatus = ret.status.data.entity0;
//      alert($api.jsonToStr(mStatus));
//      if (!mStatus.LED_R) return;
        //状态更新
        LED_R.value = mStatus.LED_R ? mStatus.LED_R : 0;
        LED_G.value = mStatus.LED_G ? mStatus.LED_G : 0 ;
        LED_B.value = mStatus.LED_B ? mStatus.LED_B : 0 ;
        Motor_Speed.value = mStatus.Motor_Speed ? mStatus.Motor_Speed : 0;
        LED_RShowText.innerHTML = mStatus.LED_R ? mStatus.LED_R : 0;
        LED_GShowText.innerHTML = mStatus.LED_G ? mStatus.LED_G : 0;
        LED_BShowText.innerHTML = mStatus.LED_B ? mStatus.LED_B : 0;
        Motor_SpeedShowText.innerHTML = mStatus.Motor_Speed ? mStatus.Motor_Speed : 0;

        Humidity.innerHTML = mStatus.Humidity ? mStatus.Humidity : 0;
        Temperature.innerHTML = mStatus.Temperature ? mStatus.Temperature : 0;

        LED_OnOff.value = mStatus.LED_OnOff ? 1 : 0;
        LED_Color.value = mStatus.LED_Color;
        Infrared.value = mStatus.Infrared ? 1 : 0;

    } else {
        //        alert('控制失败');
    }
};
//获取设备状态
function getStatus() {
    params = {
        "device": {
            "mac": deviceMac,
            "did": deviceDid
        },
        "data": {
            "cmd": 2
        }
    };
    GizwitsDevice.write(params, onMyStatus);
};

//主动断开连接
function disconnect() {
    params = {
        "device": {
            "mac": deviceMac,
            "did": deviceDid
        }
    };
//  alert(JSON.stringify(params));
//  alert('disconnect_start');

    GizwitsDevice.disconnect(params, function (ret, err) {
//  	alert('disconnect_end');
//  	alert(JSON.stringify(ret)+' === '+JSON.stringify(err));
        if (ret) {
            if (!ret.isConnected) {
                //断开连接跳界面
                back2DeviceList();
            }
        }
    });
};

//解绑设备
function unBind() {
    params = {
        "uid": uid,
        "token": token,
        "passcode": devicePasscode,
        "did": deviceDid
    };

    GizwitsSDK.unbindDevice(params, function (ret, err) {
            if (ret) {
                //解绑成功跳界面
                alert('解绑成功');
                back2DeviceList();
            } else {
                alert('解绑失败');
            }
        }
    );

};

//选择器控件发送控制指令方法
function selectorListener(num) {

    switch (num) {
        case 1:
            valueSend = document.getElementById("showText_LED_on_off").value;
            attrname = "LED_OnOff";
            break;
        case 2:
            valueSend = document.getElementById("showText_LED_combind").value;
            attrname = "LED_Color";
            break;
    }

    sendControlMsg(attrname, valueSend);
};

//滑动控件发送控制指令方法
function sliderSend(num) {

    switch (num) {
        case 1:
            atrrName = "LED_R";
            atrrValue = document.getElementById("positionLED_red").value;
            break;
        case 2:
            atrrName = "LED_G";
            atrrValue = document.getElementById("positionLED_green").value;
            break;
        case 3:
            atrrName = "LED_B";
            atrrValue = document.getElementById("positionLED_blue").value;
            break;
        case 4:
            atrrName = "Motor_Speed";
            atrrValue = document.getElementById("positionLED_motor").value;
            break;
    }
    sendControlMsg(atrrName, atrrValue);
};

//发送控制指令方法
function sendControlMsg(name, value) {
    sendMsg = '{"device": {"mac":"' + deviceMac + '","did": "' + deviceDid + '"},"data": {"cmd": 1,' +
        '"entity0": {' + name +
        ':"' + value + '"}}}';

    sendMsgJson = eval('(' + sendMsg + ')');

    AntiShake = 1;
    clearTimeout(AntiTimeOut);
    AntiTimeOut=setTimeout("AntiShake=0;", 2000);
    GizwitsDevice.write(sendMsgJson, onMyStatus);
}

//获取对应的控件
function getElement(num) {
    var slider;
    var text;
    switch (num) {
        case 1:
            text = document.getElementById("showText_LED_red");
            slider = document.getElementById("positionLED_red");
            break;
        case 2:
            text = document.getElementById("showText_LED_green");
            slider = document.getElementById("positionLED_green");
            break;
        case 3:
            text = document.getElementById("showText_LED_blue");
            slider = document.getElementById("positionLED_blue");
            break;
        case 4:
            text = document.getElementById("showText_LED_motor");
            slider = document.getElementById("positionLED_motor");
            break;
    }
    ;
    var valForSliderText = {
        "slider": slider,
        "textShow": text
    };
    return valForSliderText;
};

//滑动控件的事件监听，根据滑动控件的变动更新对应的文字和发送指令
function sliderShowText(num) {
    var slider;
    var value;
    var text;

    var myElement = getElement(num);
    slider = myElement.slider;
    text = myElement.textShow;
    value = slider.value;
    text.innerHTML = value;

    sliderSend(num);

};

//减一键点击事件监听
function sub(num) {
    var slider;
    var value;
    var text;

    sliderSend(num);

    var myElement = getElement(num);
    slider = myElement.slider;
    text = myElement.textShow;

    value = slider.value;
    value--;
    slider.value = value;
    text.innerHTML = value;

    sliderSend(num);
};

//加一键点击事件监听
function add(num) {
    var slider;
    var value;
    var text;

    var myElement = getElement(num);
    slider = myElement.slider;
    text = myElement.textShow;

    value = slider.value;
    value++;
    slider.value = value;
    text.innerHTML = value;

    sliderSend(num);
};

