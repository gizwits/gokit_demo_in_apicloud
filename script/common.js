/**
 * Created by chaoso on 15/5/21.
 */

//隐藏Loading对话框
var hideLoading = function () {
    api.hideProgress();
};

//展示Loading对话框
var showLoading = function (title) {
    api.showProgress({
        style: 'default',
        animationType: 'fade',
        title: title,
        modal: true
    });
};

//保存token和uid
var saveTokenAndUid = function (token, uid) {
    $api.setStorage('token', token);
    $api.setStorage('uid', uid);
};

//获取token和uid
var getTokenAndUid = function () {

    var result = {
        "token": $api.getStorage('token'),
        "uid": $api.getStorage('uid')
    };
    return result;
};

//保存账号和密码
var saveAdminAndPwd = function (admin, pwd) {
    $api.setStorage('admin', admin);
    $api.setStorage('pwd', pwd);
};

//获取账号和密码
var getAdminAndPwd = function () {
    var result = {
        "admin": $api.getStorage('admin'),
        "pwd": $api.getStorage('pwd')
    };
    return result;
};

//获取账号
var getAdmin = function () {
    var admin = $api.getStorage('admin');
    if (!admin)
        admin = '';
    return admin;
};

//获取密码
var getPwd = function () {
    var pwd = $api.getStorage('pwd');
    if (!pwd)
        pwd = '';
    return pwd;
};
var isLoginWithFlag = function (flag) {
    window.isLogin = flag;
    setKeyAndParams("isLogin", flag);
}

var isUserLogin = function () {
    login = getKeyAndParam("isLogin");
    if (login) {
        return login;
    } else {
        return false;
    }
}
function setKeyAndParams(key, params) {
    $api.setStorage(key, params);
}
function getKeyAndParam(key) {
    return $api.getStorage(key);
}
/**
 * @param obj 控件obj
 * @param tMaxLength 控件值允许的最大长度
 * @param tMinLength 控件值允许的最小长度
 * @returns {number} -1 少于允许的最小长度   0 正常  1 多于允许的最大长度
 */

var isEmpty = function (obj, tMaxLength, tMinLength) {

    if (tMaxLength == null || tMaxLength <= 0) {
        tMaxLength = 11;
    }
    if (tMinLength != null || tMinLength < 0) {
        tMinLength = 0;
    }

    if (obj.trim().length <= tMinLength) {
        return -1;
    }
    if (obj.trim().length > tMaxLength) {
        return 1;
    }

    return 0;
}

var getParamFomeUrl =function(url, param){
        var result = "";

        startindex = url.indexOf(param + "=");
        startindex += (param.length + 1);
        subString = url.substring(startindex);
        endindex = subString.indexOf("&");
        if (endindex == -1) {
            result = subString;
        } else {
            result = subString.substring(0, endindex);
        }
        return result;
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.LTrim = function () {
    return this.replace(/(^\s*)/g, "");
}
String.prototype.RTrim = function () {
    return this.replace(/(\s*$)/g, "");
}


//List
function ArrayList() {
    this.arr = [],
        this.size = function () {
            return this.arr.length;
        },
        this.add = function () {
            if (arguments.length == 1) {
                this.arr.push(arguments[0]);
            } else if (arguments.length >= 2) {
                var deleteItem = this.arr[arguments[0]];
                this.arr.splice(arguments[0], 1, arguments[1], deleteItem)
            }
            return this;
        },
        this.get = function (index) {
            return this.arr[index];
        },
        this.removeIndex = function (index) {
            this.arr.splice(index, 1);
        },
        this.removeObj = function (obj) {
            this.removeIndex(this.indexOf(obj));
        },
        this.indexOf = function (obj) {
            for (var i = 0; i < this.arr.length; i++) {
                if (this.arr[i] === obj) {
                    return i;
                }
                ;
            }
            return -1;
        },
        this.isEmpty = function () {
            return this.arr.length == 0;
        },
        this.clear = function () {
            this.arr = [];
        },
        this.contains = function (obj) {
            return this.indexOf(obj) != -1;
        }

};


function getClass(clazName,callback){
    var clazzList = document.getElementsByClassName(clazName);
    for(var i=0;i<clazzList.length;i++){
        callback(clazzList[i]);
    }
}


function $$(id){
    var obj=document.getElementById(id);
    return obj;
}

function tag(name){
    var obj = document.getElementsByTagName("li");
    return obj;
}
