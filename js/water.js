var para_dist = ['loading...', '腐蚀速率', '水平管压差', '热阻', '供水流量', '压力降检测管流量', '蒸汽温度',
			'炼油PH', '发电PH', '电导率', '游离氯', '炼油荧光信号强度', '发电荧光信号强度', '浊度',
			'阻垢缓蚀剂计量泵','//药剂罐液位', '//加酸剂量泵', '次氯酸钠计量泵', '排污电磁阀', '加强氯精电磁阀',
			'进水温度', '出水温度', '温差', '阻垢缓蚀剂药剂罐液位', '缓蚀剂剂量泵', '缓蚀剂药剂罐液位', '炼油加酸剂量泵','发电加酸剂量泵',
			'阻垢缓蚀剂投加量','缓蚀剂投加量','次氯酸钠投加量','次氯酸钠药剂罐液位','炼油硫酸投加量','发电硫酸投加量'
		];
var para_unit = ['loading...', 'mm/a', 'kpa', 'm²K/W', 'm³/h', 'm³/h', '℃',
		'', '', 'μs/cm', 'mg/l', '', '', 'NTU',
		'%开度','//15', '//16', '%开度', '%开度', '%开度','℃','℃','℃','%','%开度','%','%开度','%开度',
		'L/h','L/h','L/h','%','L/h','L/h'];
//存储页面传递的数据
var data;
var title;

mui.init()
window.onload = function() {

	mui.plusReady(function() {
		//获取页面基本信息
		var self = plus.webview.currentWebview();
		//获取首页传来的数据
		data = self.data;
//		console.log(JSON.stringify(data));
		title = self.page_title;
		//alert(title+JSON.stringify(data));
		//刷新页面title
		document.getElementById('title').innerText = title;
		document.getElementById('time-title').innerText = '当前参数时间：' + data[0].date + ' ' + data[0].time.substring(0,5);
		//设置底部导航状态
		var bottom_bar_btns = document.getElementsByClassName('mui-tab-item');
		if(title == '水质监控及自动加药') {
			bottom_bar_btns[0].classList.add('mui-active');
		} else {
			bottom_bar_btns[1].classList.add('mui-active');
		}
		//动态添加参数信息
		refresh_list();

		//关闭等待框
		plus.nativeUI.closeWaiting();
		//显示当前页面
		mui.currentWebview.show();
		//关闭前页
		var pre_page = plus.webview.getWebviewById('item_chart');
		if(pre_page) {
			pre_page.close();
		}
	});

} //onload

//状态栏点击加载浮窗
mui('body').on('tap', '.item-right', function(e) {
	var ul = document.getElementById('state-ul');
	//如果已经有li节点，全部删掉
	var old_li = ul.childNodes;
	var li_num = ul.getElementsByTagName('li').length;
	if(li_num > 0) {
		for(var i = li_num; i > 0; --i) {
			ul.removeChild(old_li[i]);
		}
	}
	//开始挂载新的浮窗li节点
	var para_name = this.parentNode.firstElementChild.innerHTML;
	var para_no = para_dist.indexOf(para_name);
	var data_length = data.length;
	for(var i = 0; i < data_length; ++i) { //找到具体参数信息
		if(parseInt(data[i].number) == para_no) {
			//挂载浮窗内容
			var li;
			//ul节点上方已经获得
			//参数名
			li = document.createElement('li');
//			li.setAttribute('class', 'mui-table-view-cell popover-li');
			li.setAttribute('class', 'mui-table-view-cell popover-li');
			li.setAttribute('style', 'text-align: center;');
			li.innerHTML = para_name;
			ul.appendChild(li);
			//value
			li = document.createElement('li');
			li.setAttribute('class', 'mui-table-view-cell popover-li');
			li.innerHTML = '当前值：' + data[i].value + para_unit[para_no];
			ul.appendChild(li);
			//state
			li = document.createElement('li');
			li.setAttribute('class', 'mui-table-view-cell popover-li');
			var signal_color = data[i].signal.substring(0, 2);
			if(signal_color == '红色') {
				li.innerHTML = '<span>当前状态：' +
					'<img src="../images/icons/red_alarming.svg" width="15" height="15" />' +
					"报警</span>";
			} else if(signal_color == '黄色') {
				li.innerHTML = '<span>当前状态：' +
					'<img src="../images/icons/yellow_warning.svg" width="15" height="15" />' +
					"警告</span>";
			} else if(signal_color == '绿色') {
				li.innerHTML = '<span>当前状态：' +
					'<img src="../images/icons/green_safe.svg" width="15" height="15" />' +
					"正常</span>";
			} else {
				li.innerHTML = '<span>当前状态：未设置</span>';
			}
			ul.appendChild(li);
			//提示信息
			li = document.createElement('li');
			li.setAttribute('class', 'mui-table-view-cell popover-li');
			li.innerHTML = '提示信息：' + data[i].information;
			ul.appendChild(li);
			
			//警报解除状态
			li = document.createElement('li');
			li.setAttribute('class', 'mui-table-view-cell popover-li');
			//此处对后台参数说明进行了修改，alert字段分别加1构造词典
			var alert_info = ['未解除报警', '未报警', '已解除报警'];
			var style_font_color = ['red', 'green', 'green'];
			var alert_num = data[i].alert + 1;
//			var img_src = '../images/icons/' + alert_num + '_alert.svg';
			li.innerHTML = '警报解除状态：' +
				'<span style="color:' + style_font_color[alert_num] + '">' +
				alert_info[alert_num] + "</span>";
			ul.appendChild(li);
			
			//应对方法
			li = document.createElement('li');
			li.setAttribute('class', 'mui-table-view-cell popover-li');
			li.innerHTML = '应对方法：' + data[i].method;
			ul.appendChild(li);
			//最后将middlePopover 置为显示状态
//			document.getElementById('middlePopover').style.display = "";
			
			
			var target_id = 'item-right-id' + i;
			console.log(target_id);
			mui('#middlePopover').popover('show',document.getElementById(target_id));
			
			break;
		} //if
	} //for
	//mui('#middlePopover').popover('show',document.getElementById("middlePopover-test"));
});

mui('.mui-scroll-wrapper').scroll();
//mui('body').on('shown', '.mui-popover', function(e) {
//	//console.log('shown', e.detail.id);//detail为当前popover元素
//});
//mui('body').on('hidden', '.mui-popover', function(e) {
//	//console.log('hidden', e.detail.id);//detail为当前popover元素
//});

//本页底部导航
mui('body').on('tap', '.jump1', function(e) {
	var page = '水质监控及自动加药';
	refresh_page(page,false);
});
mui('body').on('tap', '.jump2', function(e) {
	var page = '监测换热器';
	refresh_page(page,false);
});

//顶部刷新按钮
mui(document.body).on('tap', '.nav-refresh', function(e) {
	var now_time = new Date();
	var hour = parseInt(now_time.getHours());
	var minute = parseInt(now_time.getMinutes());
	var pre_hour = parseInt(data[0].time.substring(0,3));
	var pre_minute = parseInt(data[0].time.substring(3));
	if(hour-pre_hour>1){
		if(title == '水质监控及自动加药'){
			refresh_page(title,true);
			mui.toast('数据已更新');
		}else{
			refresh_page('监测换热器',true);
			mui.toast('数据已更新');
		}
	}else{
		//如果小时+1了
		if(hour-pre_hour == 1){
			minute = minute+60;
		}
		if(minute - pre_minute < 10){//如果刷新时间距参数时间小于10分钟
			mui.toast('数据无变化');
		}else{//时间超过10分钟，刷新
			if(title == '水质监控及自动加药'){
				refresh_page(title,true);
				mui.toast('数据已更新');
			}else{
				refresh_page('监测换热器',true);
				mui.toast('数据已更新');
			}
		}//else
	}//else
});
//定义动态刷新本页函数
var refresh_page = function(page,top_refresh) {
	if((page == title) && (top_refresh == false)) { //已经是该设备
		//do nothing
	} else {
		title = page;
		//设备参数编号
		var page_para = [
			[7, 8, 9, 10, 11, 12, 13, 14, 17, 18, 19, 23,24,25,26,27,28,29,30,31,32,33],
			[1, 2, 3, 4, 5, 6, 20, 21 ,22]
		];
		var page_title = ['水质监控及自动加药', '监测换热器'];
		var request_url = 'http://59.110.143.153:8080/goto/getinitialdata';
		//发送ajax请求
		mui.ajax(request_url, {
			data: {
				'para_list': JSON.stringify(page_para[page_title.indexOf(page)])
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			async: false,
			timeout: 10000, //超时时间设置为10秒；
			success: function(data_response) {
				if(data_response.success) {
					//获得后台返回数据
					data = data_response.data;
					console.log('data updated');
					//刷新页面title
					document.getElementById('title').innerHTML = page;
					document.getElementById('time-title').innerText = '当前参数时间：' + data[0].date + ' ' + data[0].time.substring(0,5);
				} else {
					//alert('server failed');
					mui.toast('server failed');
					mui.openWindow({
						url: 'server_wrong.html',
						id: 'server_wrong',
					})
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				//alert(type + 'wrong');
				mui.toast('error:' + type);
				mui.openWindow({
					url: 'server_wrong.html',
					id: 'server_wrong',
				})
			}
		}); //ajax
		//刷新列表
		refresh_list();
	} //else
} //refresh_page

//动态加载列表函数
var refresh_list = function() {
	//获得列表div
	var content = document.getElementById('content');
	var children = content.childNodes;
	var item_num = content.getElementsByClassName('mui-row').length;
	//console.log(item_num+'');
	//alert(JSON.stringify(children[1].innerHTML));
	if(item_num > 1) {
		//删掉原有节点
		if(children[item_num+1]){
			content.removeChild(children[item_num+1]);
		}
		for(var i = item_num; i > 1; --i) {
			content.removeChild(children[i]);
		}
	}
	//动态添加参数信息
	var div_out;
	var div_inner;
	var inner_a;
	var para_num = data.length;
	
	for(var i = 0; i < para_num; ++i) {
		div_out = document.createElement('div');
		div_out.setAttribute("class", "mui-row item-body")
		content.appendChild(div_out);
		//添加 参数名列 div
		div_inner = document.createElement('div');
		div_inner.setAttribute("class", "mui-col-xs-5 item-left");
		div_inner.addEventListener('click',click_left_item);
		div_inner.innerHTML = para_dist[parseInt(data[i].number)];
		div_out.appendChild(div_inner);
		//添加 当前值列 div
		div_inner = document.createElement('div');
		div_inner.setAttribute("class", "mui-col-xs-4 item-middle");
		//div_inner.innerText = data[i].value;
		div_inner.innerHTML = data[i].value + "<span style='font-size: xx-small;'>" + para_unit[data[i].number] + "</span>";
		div_out.appendChild(div_inner);
		//添加 状态列 a标签
//		inner_a = document.createElement('a');
		inner_a = document.createElement('div');
		inner_a.setAttribute("id",'item-right-id' + i);
		inner_a.setAttribute("class", "mui-col-xs-3 item-right");
//		inner_a.setAttribute("href", "#middlePopover");
		var img_name = 'not_set';
		switch(data[i].signal.substring(0, 2)){
			case '红色': img_name = 'red_alarming';break;
			case '黄色': img_name = 'yellow_warning';break;
			case '绿色': img_name = 'green_safe';break;
			default: break;
		}
		var img_src = "../images/icons/" + img_name + ".svg";
		inner_a.innerHTML = '<span class="state">' +
			'<img src="' + img_src + '" width="20" height="20" />' +
			"</span>";
		div_out.appendChild(inner_a);
	} //for
} //refresh_list
function click_left_item(){
	var target_item = this.innerText;
	var target_para_no = para_dist.indexOf(target_item);
	//请求服务器数据
	request_iniChart_data(target_para_no);
}

//mui(document.body).on('tap', '.item-left', function(e) {
//	var target_item = this.innerText;
//	var target_para_no = para_dist.indexOf(target_item);
//	plus.nativeUI.showWaiting('加载中');
//	var t=setTimeout("plus.nativeUI.closeWaiting()",5000);
//	//请求服务器数据
//	request_iniChart_data(target_para_no);
//});

//定义函数，ajax请求图表页数据
var request_iniChart_data = function(para_no) {
	//从服务器获取数据
	var request_url = 'http://59.110.143.153:8080/chart/getchartdata';
	var response;
	plus.nativeUI.showWaiting('加载中');
	mui.ajax(request_url, {
		data: {
			'para': para_no,
			'today': true,
			'begin_date': '',
			'begin_time': '',
			'end_date': '',
			'end_time': ''
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		async: false,
		timeout: 10000, //超时时间设置为10秒；
		success: function(data) {
			if(data.success) {
				response = data.data;
				plus.nativeUI.closeWaiting();
			} else {
				//alert('server failed');
				plus.nativeUI.closeWaiting();
				mui.toast('服务器出错啦');
				mui.openWindow({
					url: 'server_wrong.html',
					id: 'server_wrong',
				})
			}
		},
		error: function(xhr, type, errorThrown) {
			//异常处理；
			//alert(type + 'wrong');
			plus.nativeUI.closeWaiting();
			mui.toast('服务器出错啦');
			mui.openWindow({
				url: 'server_wrong.html',
				id: 'server_wrong',
			})
		}
	}); //ajax
	mui.openWindow({
		url: 'item_chart.html',
		id: 'item_chart',

		extras: {
			data: response,
			page_title: para_no
		},
		waiting: {
			autoShow: true
		}
	});
	//mui.currentWebview.close();
} //request_nextpage_data