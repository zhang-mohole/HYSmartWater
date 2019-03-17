	mui(document.body).on('tap', '.jump1', function(e) {	   
		request_itempage_data('jump1');
	});
	mui(document.body).on('tap', '.jump2', function(e) {
	   	request_itempage_data('jump2');
	});
	
	
	
	//定义函数，ajax请求数据
	var request_itempage_data = function(jump){
		//从服务器获取数据
		var request_url = 'http://59.110.143.153:8080/goto/getinitialdata';
		var response;
		//设备参数编号
		var page_para = [[7,8,9,10,11,12,13,14,17,18,19,23,24,25,26,27,28,29,30,31,32,33],
						 [1,2,3,4,5,6,20,21,22]];
		var page_para_list;//目标页面参数列表
		var para_title;//目标页面title
		if(jump == 'jump1'){
			page_para_list = page_para[0];
			para_title = '水质监控及自动加药';
		}else if(jump == 'jump2'){
			page_para_list = page_para[1];
			para_title = '监测换热器';
		}
		mui.ajax(request_url, {//同步请求
			data: {
				'para_list': JSON.stringify(page_para_list)
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			async: false,
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.success) {
					response = data.data;
				} else {
					mui.toast('服务器出问题啦');
					mui.openWindow({
						url: 'server_wrong.html',
						id: 'server_wrong',
					})
					//alert('server failed');
				}
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				mui.toast(type + '服务器出问题啦');
				mui.openWindow({
					url: 'server_wrong.html',
					id: 'server_wrong',
				})
				//alert(type + 'wrong');
			}
		}); //ajax
		mui.openWindow({
			url: 'water.html',
			id: 'water',
			
			extras: { //2：水质监测；3：投加药剂；1：监测换热器
				data: response,
				page_title: para_title
			},
			waiting: {
				autoShow: true
			}
		});
		//mui.currentWebview.close();
	}//request_itempage_data