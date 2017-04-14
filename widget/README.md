2016年8月10日15:59:17

selectWiFi 修改

index 增加

2016年8月6日11:58:27

receive_fn[*] 前缀函数表示 execScript 回传到 fn[*] 执行的窗口方法

2016年8月4日18:43:19

容宝祺(314833735)  18:42:09
@Right 是你的用户名不对，我的appid是下午才创建的，你需要在你的APP里面写入这个appid，重新注册一个新的账号才可以使用
我刚才注册了这个用户名，是可以使用的

用户名：   密码：
bob		123456
18883881016		123456
18010427193		123456

2016年8月3日10:56:16

要将所有注册的人保留下来

2016年8月1日16:08:33

定时预约
	
http://site.gizwits.com/zh-cn/document/openplatform/i_05_openapi/#appschedulerlimitskip



1. 所有方法的字段减、值 都需要做到见名知意

	api.openWin({
		name: 'winName',
		url: 'url',
		pageParam: {
			name: 'param'
		}
	});

2. 所有方法实例代码只预留必选项和常用字段

3. 代码的格式需要统一









2016年7月28日16:31:58

	'eve_aMap' 获取本地位置缓存字段

	'hasBack' 判断当前页面是否可关闭缓存字段

	'faults_list'	故障列表缓存

	'CountDown_Off_min'	延时关机缓存字段
	
	'appointment-add'	预约缓存字段
	
	'appID'			AppId 缓存字段
	
	'appSecret'		appSecret 缓存字段
	
	'Power_Switch' id	开关机缓存字段
	
	'scheduler_repeat_'	 id	定时星期循环缓存字段
2016年7月27日18:47:02

“更多” 
	应该是在首页获取到信息以后才能进吧？
	位置还可以修改？ 修改以后首页的温度值都要重新获取嘛？


2016-7-26 16:08:20

免费获取天气的接口找到了，可以用这个：http://apistore.baidu.com/apiworks/servicedetail/478.html



第二期2016年7月12日13:49:54

机智云空气净化器2代

50 是不是应该有一步确认设备是否可控的 UI ？

50 的默认的应该是什么样的 UI？

55 关机的状态下，底部导航是不是应该让“睡眠”导航高亮呢？

57. setCustomInfo 设置设备名称，remark 可以不传？

57. “滤网” 需要用  write 接口。 滤网默认值是多少？  滤网是否可以修改？

62. 使用 registerNotifications 接口获取数据点所有故障。 确定显示最大多少条数？

57. “滤芯复位” 云裳数据点为什么没有？

57. “解除绑定” 使用 unbindDevice。

57. 如果 isBind 为 true，“设备名称”、“解除绑定” 显示灰色。

65. 定时预约在云上的“数据点”的数据范围是 0 -1440 ， 那么单位是什么？

65. 延时关机为什么有一个像右的箭头。

67、68、69 在云上是用哪个数据点。

云数据点中 “按周重复” 255 的单位是什么？

1. getDeviceStatus 查看设备状态

2. 空气净化器返回列表是否取消订阅 setSubscribe ?

3. 如果切换到自定义模式？？

自动模式、睡眠模式、自定义模式相互如何切换？ 他们有对应条用哪些接口？







第一期

使用 SetSubscribe 方法却走了 GetBoundDevices 方法的回调！！！


x 字体大小尺寸单位可以统一嘛？ 单位多数是 PT，部分是像素，部分没有单位

按照 iPhone 5s 那个尺寸 604 * 1136（ 分辨率/屏幕密度 ）

pt = px 乘以 3/4。
px = pt 除以 3 * 4。

operation 	操作、jump 跳转、device 设备、refresh 刷新、connection 连接、environment 环境

“设备处于连接状态” 左上角是返回并且有返回图标。

所有提示统一弹窗自动消失一种风格。

connectionDevice.html	手动连接设备
myDeviceList.html		我的设备
deviceSeting.html 		设置

errorCode === 9018   提示 “手机已经被注册”


缓存字段
user	用户有信息
hasBack	当前是否存在弹窗
hasConfigure 当前是否为强制退出配置
searchDevice	当前是否正在配置进行中
moduleType		模组类型

问题

	设计图
		登录时用户名应该可以是任何类型（手机、邮箱等）
		
接口
	20 -> setDeviceOnboarding	GizWifiAirLink
	26 -> setDeviceOnboarding	GizWifiSoftAP
	4  -> getListInfo || registerNotifications || getBoundDevices
	4 -> 刷新使用 getBoundDevices
	4 -> 点击设备开始订阅  setSubscribe
	2 -> “跳过” 页面先加载， 后台匿名登录
	
	提示4
	匿名登录时需要处理与正常注册冲突
	
	
	调用 bindDevice 接口以后一直没有回调是为什么？
	
2016年7月11日16:15:46

	注册成功立即登录。
	
	设备列表
	
	    已绑定设备高度以 UE 为准
	
	    列表为空时需要标题占位
	
	    设备列表取的应该 Mac 地址
	
	    列表默认是 pro， 如果有 ac 则显示 ac
	    
	    设备离线以后自动刷新列表
	
	    离线设备不需要箭头
	
	    列表左滑删除
	
	    二维码扫描没反应，iPhone 6s
	
	    模组默认显示 乐鑫
	
	    字体样式  “微软雅黑”
	
	    关于页面需要调整
	