
	function iniRightBtns( selector ){
        var eLi = $api.domAll( selector ),
            clientX = 0,
            clientY = 0,
            hasLeft = false;
            for( var x in eLi ){
                if( eLi[x] instanceof Element ){
                    eLi[x].addEventListener('touchstart', handleTouchEvent, false);
                    eLi[x].addEventListener('touchmove', handleTouchEvent, false);
                    eLi[x].addEventListener('touchend', handleTouchEvent, false);
                }
            }
    
        function handleTouchEvent(event) {
            //只跟踪一次触摸
            if (event.touches.length <= 1) {
                switch (event.type) {
                    case 'touchstart':
                        clientX = event.changedTouches[0].clientX;
                        clientY = event.changedTouches[0].clientY;
                        if( this.offsetLeft < 0 ){
                            hasLeft = true;
                        }else{
                            hasLeft = false;
                        }
                        var eLeft = $api.domAll( selector + '.animation');
                            if( eLeft.length ){
                                for( var x in eLeft ){
                                    if( eLeft[x] instanceof Element ){
                                        $api.removeCls( eLeft[x], 'animation');
                                        $api.removeCls( eLeft[x], 'left');
                                    }
                                }
                            }
                        break;
                    case 'touchend':
                        var current = this;
                        if( Math.abs( this.offsetLeft ) <= this.querySelector('.right-btns').offsetWidth / 2 ){
                            $api.addCls( current, 'animation');
                            current.style.left =  0;
                            setTimeout(function(){
                                $api.removeCls( current, 'animation');
                                $api.removeCls( current, 'left');
                            },300);
                        }else{
                            var eLeft = $api.domAll( selector +'.left' );
                                if( eLeft.length ){
                                    for( var x in eLeft ){
                                        if( eLeft[x] instanceof Element ){
                                            if( current != eLeft[x] ){
                                                $api.addCls( eLeft[x], 'animation');
                                                eLeft[x].style.left =  0;
                                            }
                                        }
                                    }
                                }
                            $api.addCls( current, 'animation');
                            $api.addCls( current, 'left');
                            current.style.left =  - current.querySelector('.right-btns').offsetWidth + 'px';
                            setTimeout(function(){
                                $api.removeCls( current, 'animation');
                            },300);
                        }
                        break;
                    case 'touchmove':
                        var x = event.changedTouches[0].clientX - clientX;
                        var y = event.changedTouches[0].clientY - clientY;
                        if( Math.abs( y ) < 8 ){
                        	event.preventDefault(); //阻止滚动
	                        if( hasLeft ){
	                            if( x >= this.querySelector('.right-btns').offsetWidth ){
	                                this.style.left = '0';
	                            }else{
	                                if( x < 0  ){
	                                    this.style.left =  - this.querySelector('.right-btns').offsetWidth + 'px';
	                                }else{
	                                    this.style.left =  - ( this.querySelector('.right-btns').offsetWidth - x ) + 'px';
	                                }
	                            }
	                        }else{
	                            if( x > 0 ){
	                                this.style.left = '0';
	                            }else{
	                                if( x <= - this.querySelector('.right-btns').offsetWidth ){
	                                    this.style.left =  - this.querySelector('.right-btns').offsetWidth + 'px';
	                                }else{
	                                    this.style.left =  x + 'px';
	                                }
	                            }
	                        }
                        }
                        break;
                }
            }
        }
    }
    
function fnFormatNumber( num ){
	return num < 10 ? '0' + num : num;
}

function fnAjax( obj, callback){	//get 请求
    var vXhr = new XMLHttpRequest();
    vXhr.onreadystatechange = function(){
		callback( vXhr.responseText, vXhr.status );
//		console.log( vXhr )
    }
    vXhr.open('post', obj.url, true );
    for( var x in obj.headers ){
		vXhr.setRequestHeader( x, obj.headers[x] );
    }
	vXhr.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded' );	// post 提交需要模拟表单提交，设置请求头 'Content-Type' 即可
    vXhr.send(fnParam(obj.data));
	//	vXhr.abort();		// 	取消访问
}


function fnParam( obj ){
	var param = '';
	for( var x in obj ){
		param += x + '=' + encodeURIComponent( obj[x] )+'&';
	}
	return param;
}

function fnJumpWin( obj ){
	api.openWin({
	    name: 'win_'+obj.name,
	    url: api.wgtRootDir+'/html/public/headers.html',
	    pageParam: obj,
	    slidBackEnabled: typeof obj.slidBackEnabled !== 'undefined' ? false : true,
	    bgColor: obj.bg || '#ededed'
	    
	});
}

function fnPopup( obj, callback ){
	obj.name = obj.name ?  'frm_'+obj.name : 'frm_popup'+Math.floor( Math.random()*1000 );
	api.openFrame({
	    name: obj.name,
	    url: api.wgtRootDir+'/html/public/popup.html',
	    bgColor: 'rgba(0,0,0,.2)',
	    pageParam: obj
    });
    localStorage.setItem( 'hasBack', obj.name );
    setTimeout(function(){
    	api.closeFrame({
		    name: obj.name
		});
		localStorage.removeItem( 'hasBack' );
		callback && callback();
    },1500);
}

function fnVerifyInput( obj ){
	switch( obj.type ){
		case 'number':
			var reg = /[^\d]/ig;
			if( reg.test( obj.el.value ) ){
				obj.el.value = obj.el.value.replace( /[^\d]/ig, '' );
				api.toast({
				    msg: '请输入数字'
				});
			}break;
		case 'length':
			var reg =  new RegExp('^.{0,'+obj.max+'}$');
			if( ! reg.test( obj.el.value ) ){
				obj.el.value = RegExp.input;
				api.toast({
				    msg: '不能超过 '+obj.max+' 位'
				});
			};
			break;
	}
}

function fnNotes( obj, callback ){
	if( !obj )return;
	var notes = {
		'0': 'SDK 接口执行成功',
		'8001': 'SDK 内部通讯数据格式无效',
		'8002': 'SDK 未启动',
		'8003': '无效的 SDK 版本号',
		'8004': 'UDP 端口绑定失败',
		'8005': 'SDK 后台服务发生异常',
		'8006': '接口参数无效',
		'8007': 'AppID 长度错误',
		'8008': 'SDK 日志路径无效',
		'8009': '日志级别无效',
		'8021': '设备配网信息发送失败',
		'8022': '设备配网正在执行',
		'8023': '设备配网超时',
		'8024': '设备 DID 无效',
		'8025': '设备 MAC 无效',
		'8026': '子设备 DID 无效',
		'8027': '设备验证码无效',
		'8029': '设备还未订阅',
		'8030': '设备无响应',
		'8031': '设备还未就绪',
		'8032': '设备还未绑定',
		'8033': '设备操作指令中包含无效指令',
		'8034': '设备操作失败',
		'8035': '设备状态获取失败',
		'8036': '设备操作指令参数类型错误',
		'8037': '设备操作指令参数值不在有效范围内',
		'8038': '设备操作指令中包含不可写指令',
		'8019': '设备绑定失败',
		'8040': '设备解绑失败',

		'8041': 'DNS 解析失败',
		'8042': 'M2M 服务器连接成功',
		'8043': 'socket 非阻塞设置失败',
		'8044': '连接超时',
		'8045': '连接被拒绝',
		'8046': '发生了连接错误',
		'8047': '连接被对端关闭',
		'8048': 'ssl 握手失败',
		'8049': '设备登录验证失败',
		'8050': '手机外网无法访问',

		'8096': 'HTTP 应答格式错误',
		'8097': 'HTTP 应答数据错误',
		'8098': 'HTTP 服务端无应答',
		'8099': 'HTTP 请求失败',

		'8100': '其他错误',
		'8101': '内存分配失败',
		'8102': '线程创建失败',

		'8150': '登录用户 ID 无效',
		'8151': '登录 token 无效',
		'8152': '设备分组的组 ID 无效',
		'8153': '设备分组的组名称无效',
		'8154': '设备分组的组类型无效',
		'8155': '设备分组删除失败',
		'8156': '设备分组添加失败',
		'8157': '设备分组获取失败',

		'8201': '设备数据点配置文件还未下载',
		'8202': '设备数据点配置服务不可用',
		'8203': '设备数据点解析失败',

		'8300': 'SDK 还未初始化',
		'8301': 'Android context 为空，无法启动 SDK',
		'8302': '使用 SDK 所需要的 Andro机智云-APICloud-H5开源项目id 权限还没有设置',
		'8303': 'SDK 后台服务进程的执行权限修改失败',
		'8304': 'SDK 后台服务进程启动失败',
		'8305': 'SDK 后台服务进程启动发生异常',
		'8306': 'AppID 为空，无法使用 SDK',
		'8307': '此 API 已废弃，不再提供支持',
		'8308': 'SDK 接口执行超时',
		'8309': 'SDK 后台服务版本无效',
		'8310': '手机没有连接设备热点',
		'8311': '手机当前 Wifi 与设备配网 SSID 不匹配，无法完成设备配网',
		'8312': '设备没有在 softap 配网模式下',
		'8313': '手机当前不是 Wifi 网络',
		'8314': '当前为原始数据透传方式',
		'8315': '正在下载设备数据点配置文件',
		'8316': 'SDK 启动成功',

		'10003': '产品类型标识码无效',
		'10010': '产品数据点未定义',
		'10011': '产品数据点无效',

		'9001': '设备 MAC 已经注册',
		'9002': '产品类型标识码无效',
		'9003': 'AppID 无效',
		'9004': '用户 token 无效',
		'9005': '用户不存在',
		'9006': '用户 token 已过期',
		'9007': 'M2M ID 无效',
		'9008': '服务发生错误',
		'9009': '验证码已过期',
		'9010': '验证码无效',
		'9011': '沙盒配额已耗尽',
		'9012': '产品配额已耗尽',

		'9013': 'product has no request scale!',
		'9014': '找不到对应的设备',
		'9015': '请求数据格式无效',
		'9016': '设备的 DID 或验证码无效',
		'9017': '设备未绑定',
		'9018': '手机号已注册',
		'9019': '用户名已注册',
		'9020': '用户名或密码错误',
		'9021': '指令发送失败',
		'9022': '邮箱已注册',
		'9023': '设备已注销',
		'9024': 'M2M 通知失败',
		'9025': '属性无效',
		'9026': '用户名无效',
		'9027': '找不到设备固件',
		'9028': '找不到京东产品信息',
		'9029': '找不到对应的设备数据点数据',
		'9030': '找不到计划任务',
		'9031': 'QQ 登录授权 key 无效',
		'9032': 'OTA 升级服务闲置或被禁用',
		'9033': 'BT 固件未验证',
		'9034': 'BT 固件不需要升级',
		'9035': 'kairosdb 存储错误',
		'9036': '事件未定义',
		'9037': '手机短信发送失败',
		'9038': '应用授权无效',
		'9039': '不允许使用已废弃的 API',
		'9040': 'QRCode 内容已损坏',
		'9041': '请求队列已满',
		'9042': '设备已离线',
		'9043': '时间戳无效',
		'9044': '应用签名无效',
		'9045': 'API 已废弃',
		'9999': '保留的错误字',

		'5001': '数据体无效',
		'5300': '数据不存在',
		'5501': '客户端没有配置推送 ID',
		'5502': '没有服务端数据',
		'5601': '机智云AppID已经存在',
		'5700': '参数错误',
		'5701': '授权无效',
		'5702': 'AppID 或用户 token 错误',
		'5703': '参数类型错误',
		'5704': 'ID 参数错误',
		'5705': 'APIKey 或者 SecretKey 无效',
		'5706': 'Channel ID 错误',
		'5900': '推送错误',
		
		'cancel login': 'QQ 授权失败'
	};
	fnPopup({msg: notes[obj.errorCode || obj.error_code ] || obj.msg}, callback)
}

// function fnNotes( obj, callback ){
// 	if( ! obj.msg )return;
// 	var notes = {
// 		'GIZ_SDK_SUCCESS': 'SDK 接口执行成功',
// 		'GIZ_SDK_PARAM_FORM_INVALID': 'SDK 内部通讯数据格式无效',
// 		'GIZ_SDK_CLIENT_NOT_AUTHEN': 'SDK 未启动',
// 		'GIZ_SDK_CLIENT_VERSION_INVALID': '无效的 SDK 版本号',
// 		'GIZ_SDK_UDP_PORT_BIND_FAILED': 'UDP 端口绑定失败',
// 		'GIZ_SDK_DAEMON_EXCEPTION': 'SDK 后台服务发生异常',
// 		'GIZ_SDK_PARAM_INVALID': '接口参数无效',
// 		'GIZ_SDK_APPID_LENGTH_ERROR': 'AppID 长度错误',
// 		'GIZ_SDK_LOG_PATH_INVALID': 'SDK 日志路径无效',
// 		'GIZ_SDK_LOG_LEVEL_INVALID': '日志级别无效',
// 		'GIZ_SDK_DEVICE_CONFIG_SEND_FAILED': '设备配网信息发送失败',
// 		'GIZ_SDK_DEVICE_CONFIG_IS_RUNNING': '设备配网正在执行',
// 		'GIZ_SDK_DEVICE_CONFIG_TIMEOUT': '设备配网超时',
// 		'GIZ_SDK_DEVICE_DID_INVALID': '设备 DID 无效',
// 		'GIZ_SDK_DEVICE_MAC_INVALID': '设备 MAC 无效',
// 		'GIZ_SDK_SUBDEVICE_DID_INVALID': '子设备 DID 无效',
// 		'GIZ_SDK_DEVICE_PASSCODE_INVALID': '设备验证码无效',
// 		'GIZ_SDK_DEVICE_NOT_SUBSCRIBED': '设备还未订阅',
// 		'GIZ_SDK_DEVICE_NO_RESPONSE': '设备无响应',
// 		'GIZ_SDK_DEVICE_NOT_READY': '设备还未就绪',
// 		'GIZ_SDK_DEVICE_NOT_BINDED': '设备还未绑定',
// 		'GIZ_SDK_DEVICE_CONTROL_WITH_INVALID_COMMAND': '设备操作指令中包含无效指令',
// 		'GIZ_SDK_DEVICE_CONTROL_FAILED': '设备操作失败',
// 		'GIZ_SDK_DEVICE_GET_STATUS_FAILED': '设备状态获取失败',
// 		'GIZ_SDK_DEVICE_CONTROL_VALUE_TYPE_ERROR': '设备操作指令参数类型错误',
// 		'GIZ_SDK_DEVICE_CONTROL_VALUE_OUT_OF_RANGE': '设备操作指令参数值不在有效范围内',
// 		'GIZ_SDK_DEVICE_CONTROL_NOT_WRITABLE_COMMAND': '设备操作指令中包含不可写指令',
// 		'GIZ_SDK_BIND_DEVICE_FAILED': '设备绑定失败',
// 		'GIZ_SDK_UNBIND_DEVICE_FAILED': '设备解绑失败',
// 		'GIZ_SDK_DNS_FAILED': 'DNS 解析失败',
// 		'GIZ_SDK_M2M_CONNECTION_SUCCESS': 'M2M 服务器连接成功',
// 		'GIZ_SDK_SET_SOCKET_NON_BLOCK_FAILED': 'socket 非阻塞设置失败',
// 		'GIZ_SDK_CONNECTION_TIMEOUT': '连接超时',
// 		'GIZ_SDK_CONNECTION_REFUSED': '连接被拒绝',
// 		'GIZ_SDK_CONNECTION_ERROR': '发生了连接错误',
// 		'GIZ_SDK_CONNECTION_CLOSED': '连接被对端关闭',
// 		'GIZ_SDK_SSL_HANDSHAKE_FAILED': 'ssl 握手失败',
// 		'GIZ_SDK_DEVICE_LOGIN_VERIFY_FAILED': '设备登录验证失败',
// 		'GIZ_SDK_INTERNET_NOT_REACHABLE': '手机外网无法访问',
// 		'GIZ_SDK_HTTP_ANSWER_FORMAT_ERROR': 'HTTP 应答格式错误',
// 		'GIZ_SDK_HTTP_ANSWER_PARAM_ERROR': 'HTTP 应答数据错误',
// 		'GIZ_SDK_HTTP_SERVER_NO_ANSWER': 'HTTP 服务端无应答',
// 		'GIZ_SDK_HTTP_REQUEST_FAILED': 'HTTP 请求失败',
// 		'GIZ_SDK_OTHERWISE': '其他错误',
// 		'GIZ_SDK_MEMORY_MALLOC_FAILED': '内存分配失败',
// 		'GIZ_SDK_THREAD_CREATE_FAILED': '线程创建失败',
// 		'GIZ_SDK_USER_ID_INVALID': '登录用户 ID 无效',
// 		'GIZ_SDK_TOKEN_INVALID': '登录 token 无效',
// 		'GIZ_SDK_GROUP_ID_INVALID': '设备分组的组 ID 无效',
// 		'GIZ_SDK_GROUPNAME_INVALID': '设备分组的组名称无效',
// 		'GIZ_SDK_GROUP_PRODUCTKEY_INVALID': '设备分组的组类型无效',
// 		'GIZ_SDK_GROUP_FAILED_DELETE_DEVICE': '设备分组删除失败',
// 		'GIZ_SDK_GROUP_FAILED_ADD_DEVICE': '设备分组添加失败',
// 		'GIZ_SDK_GROUP_GET_DEVICE_FAILED': '设备分组获取失败',
// 		'GIZ_SDK_DATAPOINT_NOT_DOWNLOAD': '设备数据点配置文件还未下载',
// 		'GIZ_SDK_DATAPOINT_SERVICE_UNAVAILABLE': '设备数据点配置服务不可用',
// 		'GIZ_SDK_DATAPOINT_PARSE_FAILED': '设备数据点解析失败',
// 		'GIZ_SDK_SDK_NOT_INITIALIZED': 'SDK 还未初始化',
// 		'GIZ_SDK_APK_CONTEXT_IS_NULL': 'Android context 为空，无法启动 SDK',
// 		'GIZ_SDK_APK_PERMISSION_NOT_SET': '使用 SDK 所需要的 Android 权限还没有设置',
// 		'GIZ_SDK_CHMOD_DAEMON_REFUSED': 'SDK 后台服务进程的执行权限修改失败',
// 		'GIZ_SDK_EXEC_DAEMON_FAILED': 'SDK 后台服务进程启动失败',
// 		'GIZ_SDK_EXEC_CATCH_EXCEPTION': 'SDK 后台服务进程启动发生异常',
// 		'GIZ_SDK_APPID_IS_EMPTY': 'AppID 为空，无法使用 SDK',
// 		'GIZ_SDK_UNSUPPORTED_API': '此 API 已废弃，不再提供支持',
// 		'GIZ_SDK_REQUEST_TIMEOUT': 'SDK 接口执行超时',
// 		'GIZ_SDK_DAEMON_VERSION_INVALID': 'SDK 后台服务版本无效',
// 		'GIZ_SDK_PHONE_NOT_CONNECT_TO_SOFTAP_SSID': '手机没有连接设备热点',
// 		'GIZ_SDK_DEVICE_CONFIG_SSID_NOT_MATCHED': '手机当前 Wifi 与设备配网 SSID 不匹配，无法完成设备配网',
// 		'GIZ_SDK_NOT_IN_SOFTAPMODE': '设备没有在 softap 配网模式下',
// 		'GIZ_SDK_PHONE_WIFI_IS_UNAVAILABLE': '手机当前不是 Wifi 网络',
// 		'GIZ_SDK_RAW_DATA_TRANSMIT': '当前为原始数据透传方式',
// 		'GIZ_SDK_PRODUCT_IS_DOWNLOADING': '正在下载设备数据点配置文件',
// 		'GIZ_SDK_START_SUCCESS': 'SDK 启动成功',
// 		'GIZ_SITE_PRODUCTKEY_INVALID': '产品类型标识码无效',
// 		'GIZ_SITE_DATAPOINTS_NOT_DEFINED': '产品数据点未定义',
// 		'GIZ_SITE_DATAPOINTS_NOT_MALFORME': '产品数据点无效',
// 		'GIZ_OPENAPI_MAC_ALREADY_REGISTERED': '设备 MAC 已经注册',
// 		'GIZ_OPENAPI_PRODUCT_KEY_INVALID': '产品类型标识码无效',
// 		'GIZ_OPENAPI_APPID_INVALID': 'AppID 无效',
// 		'GIZ_OPENAPI_TOKEN_INVALID': '用户 token 无效',
// 		'GIZ_OPENAPI_USER_NOT_EXIST': '用户不存在',
// 		'GIZ_OPENAPI_TOKEN_EXPIRED': '用户 token 已过期',
// 		'GIZ_OPENAPI_M2M_ID_INVALID': 'M2M ID 无效',
// 		'GIZ_OPENAPI_SERVER_ERROR': '服务发生错误',
// 		'GIZ_OPENAPI_CODE_EXPIRED': '验证码已过期',
// 		'GIZ_OPENAPI_CODE_INVALID': '验证码无效',
// 		'GIZ_OPENAPI_SANDBOX_SCALE_QUOTA_EXHAUSTED': '沙盒配额已耗尽',
// 		'GIZ_OPENAPI_PRODUCTION_SCALE_QUOTA_EXHAUSTED': '产品配额已耗尽',

// 		'GIZ_OPENAPI_PRODUCT_HAS_NO_REQUEST_SCALE': 'product has no request scale!',
// 		'GIZ_OPENAPI_DEVICE_NOT_FOUND': '找不到对应的设备',
// 		'GIZ_OPENAPI_FORM_INVALID': '请求数据格式无效',
// 		'GIZ_OPENAPI_DID_PASSCODE_INVALID': '设备的 DID 或验证码无效',
// 		'GIZ_OPENAPI_DEVICE_NOT_BOUND': '设备未绑定',
// 		'GIZ_OPENAPI_PHONE_UNAVALIABLE': '手机号已注册',
// 		'GIZ_OPENAPI_USERNAME_PASSWORD_ERROR': '用户名或密码错误',
// 		'GIZ_OPENAPI_SEND_COMMAND_FAILED': '指令发送失败',
// 		'GIZ_OPENAPI_EMAIL_UNAVALIABLE': '邮箱已注册',
// 		'GIZ_OPENAPI_DEVICE_DISABLED': '设备已注销',
// 		'GIZ_OPENAPI_FAILED_NOTIFY_M2M': 'M2M 通知失败',
// 		'GIZ_OPENAPI_ATTR_INVALID': '属性无效',
// 		'GIZ_OPENAPI_USER_INVALID': '用户名无效',
// 		'GIZ_OPENAPI_FIRMWARE_NOT_FOUND': '找不到设备固件',
// 		'GIZ_OPENAPI_JD_PRODUCT_NOT_FOUND': '找不到京东产品信息',
// 		'GIZ_OPENAPI_DATAPOINT_DATA_NOT_FOUND': '找不到对应的设备数据点数据',
// 		'GIZ_OPENAPI_SCHEDULER_NOT_FOUND': '找不到计划任务',
// 		'GIZ_OPENAPI_QQ_OAUTH_KEY_INVALID': 'QQ 登录授权 key 无效',
// 		'GIZ_OPENAPI_OTA_SERVICE_OK_BUT_IN_IDLE': 'OTA 升级服务闲置或被禁用',
// 		'GIZ_OPENAPI_BT_FIRMWARE_UNVERIFIED': 'BT 固件未验证',
// 		'GIZ_OPENAPI_BT_FIRMWARE_NOTHING_TO_UPGRADE': 'BT 固件不需要升级',
// 		'GIZ_OPENAPI_SAVE_KAIROSDB_ERROR': 'kairosdb 存储错误',
// 		'GIZ_OPENAPI_EVENT_NOT_DEFINED': '事件未定义',
// 		'GIZ_OPENAPI_SEND_SMS_FAILED': '手机短信发送失败',
// 		'GIZ_OPENAPI_APPLICATION_AUTH_INVALID': '应用授权无效',
// 		'GIZ_OPENAPI_NOT_ALLOWED_CALL_API': '不允许使用已废弃的 API',
// 		'GIZ_OPENAPI_BAD_QRCODE_CONTENT': 'QRCode 内容已损坏',
// 		'GIZ_OPENAPI_REQUEST_THROTTLED': '请求队列已满',
// 		'GIZ_OPENAPI_DEVICE_OFFLINE': '设备已离线',
// 		'GIZ_OPENAPI_TIMESTAMP_INVALID': '时间戳无效',
// 		'GIZ_OPENAPI_SIGNATURE_INVALID': '应用签名无效',
// 		'GIZ_OPENAPI_DEPRECATED_API': 'API 已废弃',
// 		'GIZ_OPENAPI_RESERVED': '保留的错误字',
// 		'GIZ_PUSHAPI_BODY_JSON_INVALID': '数据体无效',
// 		'GIZ_PUSHAPI_DATA_NOT_EXIST': '数据不存在',
// 		'GIZ_PUSHAPI_NO_CLIENT_CONFIG': '客户端没有配置推送 ID',
// 		'GIZ_PUSHAPI_NO_SERVER_DATA': '没有服务端数据',
// 		'GIZ_PUSHAPI_GIZWITS_APPID_EXIST': '机智云AppID已经存在',
// 		'GIZ_PUSHAPI_PARAM_ERROR': '参数错误',
// 		'GIZ_PUSHAPI_AUTH_KEY_INVALID': '授权无效',
// 		'GIZ_PUSHAPI_APPID_OR_TOKEN_ERROR': 'AppID 或用户 token 错误',
// 		'GIZ_PUSHAPI_TYPE_PARAM_ERROR': '参数类型错误',
// 		'GIZ_PUSHAPI_ID_PARAM_ERROR': 'ID 参数错误',
// 		'GIZ_PUSHAPI_APPKEY_SECRETKEY_INVALID': 'APIKey 或者 SecretKey 无效',
// 		'GIZ_PUSHAPI_CHANNELID_ERROR_INVALID': 'Channel ID 错误',
// 		'GIZ_PUSHAPI_PUSH_ERROR': '推送错误',
// 		'cancel login': 'QQ 授权失败'
// 	};
// 	fnPopup({msg: notes[obj.msg] || obj.msg}, callback)
// }
