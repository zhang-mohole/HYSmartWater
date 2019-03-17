	//控制时间选择器
	(function($) {
		$.init();
		var result = $('#result1')[0];
		var btns = $('.btn');
		btns.each(function(i, btn) {
			btn.addEventListener('tap', function() {
				var _self = this;
				if(this.getAttribute('id') == 'time-end'){
					result = $('#time-end')[0];
				}
				else if(this.getAttribute('id') == 'time-begin')	{
					result = $('#time-begin')[0];
				}
					
				if(_self.picker) {
					_self.picker.show(function(rs) {
						//result.innerText = '选择结果: ' + rs.text;
						result.innerText =  rs.text;
						_self.picker.dispose();
						_self.picker = null;
					});
				} else {
					var begin_value = document.getElementById("time-begin").innerText;
					var end_value = document.getElementById("time-end").innerText;
					//获得time picker option
					var optionsJson = this.getAttribute('data-options') || '{}';
					var options = JSON.parse(optionsJson);
					var id = this.getAttribute('id');
					/*
					 * 首次显示时实例化组件
					 * 示例为了简洁，将 options 放在了按钮的 dom 上
					 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
					 */
					if(this.getAttribute('id') == 'time-end'){
						options.value = end_value;
						_self.picker = new $.DtPicker(options);
					}
					else if(this.getAttribute('id') == 'time-begin'){
						options.value = begin_value;
						_self.picker = new $.DtPicker(options);
					}
//					_self.picker = new $.DtPicker(options);
					_self.picker.show(function(rs) {
						/*
						 * rs.value 拼合后的 value
						 * rs.text 拼合后的 text
						 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
						 * rs.m 月，用法同年
						 * rs.d 日，用法同年
						 * rs.h 时，用法同年
						 * rs.i 分（minutes 的第二个字母），用法同年
						 */
						//result.innerText = '选择结果: ' + rs.text;
						result.innerText =  rs.text;
						/* 
						 * 返回 false 可以阻止选择框的关闭
						 * return false;
						 */
						/*
						 * 释放组件资源，释放后将将不能再操作组件
						 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
						 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
						 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
						 */
						_self.picker.dispose();
						_self.picker = null;
					});
				}

			}, false);
		});
	})(mui);
	
	//建立参数数据词典
	var para_dist = ['loading...', '腐蚀速率', '水平管压差', '热阻', '供水流量', '压力降检测管流量', '蒸汽温度',
			'炼油PH', '发电PH', '电导率', '游离氯', '炼油荧光信号强度', '发电荧光信号强度', '浊度',
			'阻垢缓蚀剂计量泵','//药剂罐液位', '//加酸剂量泵', '次氯酸钠计量泵', '排污电磁阀', '加强氯精电磁阀',
			'进水温度', '出水温度', '温差', '阻垢缓蚀剂药剂罐液位', '缓蚀剂剂量泵', '缓蚀剂药剂罐液位', '炼油加酸剂量泵','发电加酸剂量泵',
			'阻垢缓蚀剂投加量','缓蚀剂投加量','次氯酸钠投加量','次氯酸钠药剂罐液位','炼油硫酸投加量','发电硫酸投加量'
		];
	var para_unit = ['loading...', 'mm/a', 'kpa', 'm²K/W', 'm³/h', 'm³/h', '℃',
		'', '', 'μs/cm', 'mg/l', '', '', 'NTU',
		'%开度','', '', '%开度', '%开度', '%开度','℃','℃','℃','%','%开度','%','%开度','%开度',
		'L/h','L/h','L/h','%','L/h','L/h'];
	//存储后台发送的数据
	var data;
	var title_no;//参数编号
	
	//需要折线图标志位,默认不需要
//	var is_need_line_chart = false;
	// 折线图对象
	var myChart;
	//跳转至本页时初始化
	window.onload = function(){
		mui.plusReady(function(){
			//获取页面基本信息
			var self = plus.webview.currentWebview();
			//获取首页传来的数据
	        data = self.data;
//	        console.log(JSON.stringify(data));
	        title_no = parseInt(self.page_title);
	        
			//修改nav bar 标题
			document.getElementById('title').innerText = para_dist[title_no];
			//设置时间选择器初始值及可选择范围
			var now_time = new Date();
			var end_year = now_time.getFullYear();
			var begin_and_end_month = now_time.getMonth()+1;
			var end_day = now_time.getDate();
			var begin_and_end_hour = now_time.getHours();
			var begin_and_end_minute = now_time.getMinutes();
			var begin_day = end_day;
			if((begin_and_end_month == 2)&&(end_day == 29)){
				begin_day = 28;
			}
			//如果分钟小于10，在前面加0
			var end_minute = begin_and_end_minute;
			if(begin_and_end_minute < 10){
				end_minute = '0' + begin_and_end_minute;
			}
			var begin_value =end_year + "-" + begin_and_end_month +"-"+ end_day +" "+ "00" +":"+ "00";
			var end_value =end_year + "-" + begin_and_end_month +"-"+ end_day +" "+ begin_and_end_hour +":"+ end_minute;
			//console.log(begin_value);
			var begin_data_option = {
				"value":'',
				"beginYear":end_year-1,
				"beginMonth":begin_and_end_month,
				"beginDay":begin_day,
				"beginHours":begin_and_end_hour,
				"beginMinutes":begin_and_end_minute,
				"endYear":end_year,
				"endMonth":begin_and_end_month,
				"endDay":end_day,
				"endHours":begin_and_end_hour,
				"endMinutes":begin_and_end_minute
			};
			var end_data_option = {
				"value":'',
				"beginYear":end_year-1,
				"beginMonth":begin_and_end_month,
				"beginDay":begin_day,
				"beginHours":begin_and_end_hour,
				"beginMinutes":begin_and_end_minute,
				"endYear":end_year,
				"endMonth":begin_and_end_month,
				"endDay":end_day,
				"endHours":begin_and_end_hour,
				"endMinutes":begin_and_end_minute
			};
			//console.log(JSON.stringify(end_data_option));
			var btn_time_begin = document.getElementById('time-begin');
			var btn_time_end = document.getElementById('time-end');
			btn_time_begin.setAttribute('data-options',JSON.stringify(begin_data_option));
			btn_time_end.setAttribute('data-options',JSON.stringify(end_data_option));
			btn_time_begin.innerText = begin_value;
			btn_time_end.innerText = end_value;
			//获得数据个数
			var para_num = data.length;
			
			//设置参数单位
			if(para_unit[title_no] == ''){
				var table_para_unit = '';
			}else{
				var table_para_unit = '(' +para_unit[title_no]+ ')';
			}
			//判断是否需要趋势图
//	        if( need_line_chart.indexOf(title_no) > -1 ){
	        		//置is_need_line_chart为true
//	        		is_need_line_chart = true;
				//加载折线图
				myChart = echarts.init(document.getElementById('line-chart'));
				//关闭表头，隐藏数据表，显示折线图
				document.getElementById('table-title').style.display = "none";
				document.getElementById('table-div').style.display = "none";
				document.getElementById('line-chart').style.display = "";
				load_line_chart(para_num);
				//加载表格
				document.getElementById('para-unit').innerText = table_para_unit;
				load_table(para_num);
//	        }//if 有折线图
	        
	        //关闭等待框
	        plus.nativeUI.closeWaiting();
	        //显示当前页面
	        mui.currentWebview.show();
	        //alert(JSON.stringify(data)+title);
	        
	        //关闭前页
	        var pre_page = plus.webview.getWebviewById('water');
	        if(pre_page){
	        		pre_page.close();
	        }
		});//plusReady
	}//onload

	//动态生成表格
	var load_table = function(para_num){
		//动态挂载表格
		var tr;
		var td;
		var table = document.getElementById('table');
		var tr_num = table.getElementsByTagName('tr').length;
		var children = table.childNodes;
		if(tr_num > 1){
			for(var i = tr_num; i > 1; --i){
				table.removeChild(children[i]);
			}
		}
		//加载表格数据
		var number_of_per_page = 15;//表格每页显示条目数
		if(para_num > 50){
			number_of_per_page = 20;
		}
		var state_num = -1;
//		for(var i = 0; i < para_num && i < 15; ++i) {
		for(var i = 0; i < para_num && i < number_of_per_page; ++i) {
			tr = document.createElement('tr');
			table.appendChild(tr);
			//参数名
			td = document.createElement('td');
			td.setAttribute('class','td-time');
			td.innerHTML = data[i].date + ' ' + data[i].time.substring(0,5);
			tr.appendChild(td);
			//参数值
			td = document.createElement('td');
			td.setAttribute('class','td-value');
			td.innerHTML = data[i].value;
			tr.appendChild(td);
		}
		
		//加载分页按钮
		var pagination_ul = document.getElementById('ul-pagination');
		var pagination_li_num = pagination_ul.childNodes.length;
		var pagination_li = pagination_ul.childNodes;
		//console.log('pagination_num:'+pagination_li_num);
		if(pagination_li_num > 0){
			//删除所有原有分页按钮
			for(var i = pagination_li_num-1; i > 0; --i){
				pagination_ul.removeChild(pagination_li[i]);
			}
		}
		//逐个加载分页按钮
		var new_pagination_li;
		var sub_table_num = Math.ceil(para_num / number_of_per_page);
		//console.log(sub_table_num+'');
		//挂载前一页按钮
		new_pagination_li = document.createElement('li');
		new_pagination_li.setAttribute('class', 'mui-previous');
		new_pagination_li.innerHTML = "<a>&laquo;</a>";
		pagination_ul.appendChild(new_pagination_li);
		//逐个挂载中间数字按钮
		for(var i = 1; i <= sub_table_num; ++i) {
			new_pagination_li = document.createElement('li');
			new_pagination_li.innerHTML = "<a>" + i + "</a>";
			pagination_ul.appendChild(new_pagination_li);
		} //for
		//挂载后一页按钮
		new_pagination_li = document.createElement('li');
		new_pagination_li.setAttribute('class', 'mui-next');
		new_pagination_li.innerHTML = "<a>&raquo;</a>";
		pagination_ul.appendChild(new_pagination_li);
		//设置第一页为active
		pagination_ul.childNodes[2].setAttribute('class', 'mui-active');
	}
	
	//生成折线图
	var load_line_chart = function(para_num){
		//准备折线图数据
		if(para_unit[title_no] == ''){
			var y_unit = '';
		}else{
			var y_unit = '(' + para_unit[title_no] + ')';
		}
		
//		var y_ceiling = data[0].ceiling;
//		var y_limit = data[0].limit;
		console.log('para_num:' + para_num);
		if(para_num == 0){
			mui.toast('该时间段内无任何数据');
			return;
		}else{
			var line_x = new Array(para_num);
			var line_y = new Array(para_num);
			var max_value = data[0].value;
			var min_value = data[0].value;
//			var test_ceiling_data = new Array(para_num);
		}
		
		for(var i = 0; i < para_num; ++i) {
			line_x[i] = data[i].date + ' ' + data[i].time.substring(0,5);
			line_x[i] = line_x[i].substring(5).replace(/\-/g,'/');
			line_x[i] = line_x[i].replace(' ', '\n');
			line_y[i] = data[i].value;
//			test_ceiling_data[i] = data[i].define1;
			if(line_y[i] > max_value){
				max_value = line_y[i];
			}
			if(line_y[i] < min_value){
				min_value = line_y[i];
			}
		}
		
//		console.log('ceiling data:' + JSON.stringify(test_ceiling_data));
		var series_data;
		//判断参数是否有设定值
		var need_difine_value = [4,5,6,9,11,12];
		console.log('title no:' + title_no);
		if(need_difine_value.indexOf(title_no) > -1){
			//需要设定值的操作
			if((title_no == 11) || (title_no == 12)){
//				var warning_data_top = new Array(para_num);
//				var warning_data_bottom = new Array(para_num);
//				var alarming_data_top = new Array(para_num);
//				var alarming_data_bottom = new Array(para_num);
//				var temp = 0;
				var warning_top = new Array(para_num);//设定上限
				var alarming_bottom = new Array(para_num);//设定下限
				for(var i = 0; i < para_num; ++i) {
//					temp = 0.05 * data[i].define;
//					warning_data_top[i] = data[i].define + temp;
//					warning_data_bottom[i] = data[i].define - temp;
//					alarming_data_top[i] = data[i].define + 2*temp;
//					alarming_data_bottom[i] = data[i].define - 2*temp;
//					console.log('data:' + JSON.stringify(data));
					warning_top[i] = data[i].define1;//设定上限
					alarming_bottom[i] = data[i].define2;//设定下限
					if(alarming_bottom[i] < min_value){
						min_value = alarming_bottom[i];
					}
					if(warning_top[i] > max_value){
						max_value = warning_top[i];
					}
				}
//				series_data = new Array(5);
				series_data = new Array(3);
				series_data[0] = {name:'参数值',type:'line',color:'#007AFF',data:line_y};
				series_data[1] = {name:'警示值',type:'line',color:'#ec971f',
								symbol:'none',lineStyle:{width:1,type:'dot'},data:alarming_bottom};
//				series_data[2] = {name:'警示下限',type:'line',color:'#ec971f',
//								symbol:'none',lineStyle:{width:1,type:'dot'},data:warning_data_bottom};
				series_data[2] = {name:'报警值',type:'line',color:'#cc0033',
								symbol:'none',lineStyle:{width:1,type:'dot'},data:warning_top};
//				series_data[4] = {name:'报警下限',type:'line',color:'#cc0033',
//								symbol:'none',lineStyle:{width:1,type:'dot'},data:alarming_data_bottom};
			}//if 11 or 12
			else if(title_no == 9){
				var alarming_line_data = new Array(para_num);
				for(var i = 0; i < para_num; ++i) {
					alarming_line_data[i] = data[i].define;
					if(alarming_line_data[i] < min_value){
						min_value = alarming_line_data[i];
					}
					if(alarming_line_data[i] > max_value){
						max_value = alarming_line_data[i];
					}
				}
				series_data = new Array(2);
				series_data[0] = {name:'参数值',type:'line',color:'#007AFF',data:line_y};
				series_data[1] = {name:'报警',type:'line',color:'#cc0033',
								symbol:'none',lineStyle:{width:1,type:'dot'},data:alarming_line_data};
			}// if 9
			else{
				var alarming_data_top = new Array(para_num);
				var alarming_data_bottom = new Array(para_num);
				var add_value = 0;
				if(title_no == 6){
					add_value = 1;
				}else{
					add_value = 0.1;
				}
				for(var i = 0; i < para_num; ++i){
					alarming_data_top[i] = data[i].define + add_value;
					alarming_data_bottom[i] = data[i].define - add_value;
					if(alarming_data_bottom[i] < min_value){
						min_value = alarming_data_bottom[i];
					}
					if(alarming_data_top[i] > max_value){
						max_value = alarming_data_top[i];
					}
				}
				series_data = new Array(3);
				series_data[0] = {name:'参数值',type:'line',color:'#007AFF',data:line_y};
				series_data[1] = {name:'报警上限',type:'line',color:'#cc0033',
								symbol:'none',lineStyle:{width:1,type:'dot'},data:alarming_data_top};
				series_data[2] = {name:'报警下限',type:'line',color:'#cc0033',
								symbol:'none',lineStyle:{width:1,type:'dot'},data:alarming_data_bottom};
			}//if 4,5,6
		}
		else{
			//无需设定值的操作
			var markline_values = {warning:[[0.06],[],[],[],[],[],[7.5],
											[7.5],[],[0.5],[],[],[10],[0,30,100],
											[],[],[0,30,100],[0,30],[0,30],[],[],
											[],[30],[0,30,100],[30],[0,30],[0,30],[0,3,10],
											[0,3,10],[0,3,10],[30],[0,7.5],[0,7.5]],
								alarming:[0.075,-1,-1,-1,-1,-1,9,
											9,-1,0.1,-1,-1,20,-1,
											-1,-1,-1,100,100,-1,-1,
											10,15,-1,15,100,100,-1,
											-1,-1,15,25,25],
								need_warning:[1,0,0,0,0,0,1, 1,0,1,0,0,1,3,
											  0,0,3,2,2,0,0, 0,1,3,1,2,2,3,
											  3,3,1,1,1],
								need_alarming:[1,0,0,0,0,0,1, 1,0,1,0,0,1,0,
											   0,0,0,1,1,0,0, 1,1,0,1,1,1,0,
											   0,0,1,1,1]
								};
			series_data = new Array(3);
			series_data[0] = {name:'参数值',type:'line',color:'#007AFF',data:line_y};
			series_data[1] = {type:'line',markLine:{symbol:['none','none'],
							lineStyle:{type:'doc',color:'#ec971f'},data:[],
							label:{normal:{formatter:'警示'}} }};
			series_data[2] = {type:'line',markLine:{symbol:['none','none'],
							lineStyle:{type:'doc',color:'#cc0033'},data:[],
							label:{normal:{formatter:'报警'}} }};
			//既有报警又有警示
			if( markline_values.need_alarming[title_no-1] > 0 && markline_values.need_warning[title_no-1] >0){
				
				//alarming 数值与最大值比并更新
				if(markline_values.alarming[title_no-1] > max_value)
					max_value = markline_values.alarming[title_no-1];
				if(markline_values.alarming[title_no-1] < min_value)
					min_value = markline_values.alarming[title_no-1];
				//warning 数值与最小值比并更新
				if(markline_values.warning[title_no-1][0] > max_value)
					max_value = markline_values.warning[title_no-1][0];
				if(markline_values.warning[title_no-1][0] < min_value)
					min_value = markline_values.warning[title_no-1][0];
				series_data[2].markLine.data = [{yAxis:markline_values.alarming[title_no-1]}];
				console.log(JSON.stringify(series_data[2].markLine.data));
				var series_warning_data = [
					[],
					[{yAxis:markline_values.warning[title_no-1][0]}],
					[{yAxis:markline_values.warning[title_no-1][0]},{yAxis:markline_values.warning[title_no-1][1]}],
					[{yAxis:markline_values.warning[title_no-1][0]},{yAxis:markline_values.warning[title_no-1][1]},{yAxis:markline_values.warning[title_no-1][2]}]
					];
				series_data[1].markLine.data = series_warning_data[markline_values.need_warning[title_no-1]];
				console.log(JSON.stringify(series_data[1].markLine.data));
			}
			//只有报警
			else if(markline_values.need_alarming[title_no-1] >0){
				//alarming 数值与最大值比并更新
				if(markline_values.alarming[title_no-1] > max_value)
					max_value = markline_values.alarming[title_no-1];
				if(markline_values.alarming[title_no-1] < min_value)
					min_value = markline_values.alarming[title_no-1];
				series_data[2].markLine.data = [{yAxis:markline_values.alarming[title_no-1]}];
			}
			else if(markline_values.need_warning[title_no-1] >0){
				//warning 数值与最小值比并更新
				if(markline_values.warning[title_no-1][0] > max_value)
					max_value = markline_values.warning[title_no-1][0];
				if(markline_values.warning[title_no-1][0] < min_value)
					min_value = markline_values.warning[title_no-1][0];
				var series_warning_data = [
					[],
					[{yAxis:markline_values.warning[title_no-1][0]}],
					[{yAxis:markline_values.warning[title_no-1][0]},{yAxis:markline_values.warning[title_no-1][1]}],
					[{yAxis:markline_values.warning[title_no-1][0]},{yAxis:markline_values.warning[title_no-1][1]},{yAxis:markline_values.warning[title_no-1][2]}]
					];
				series_data[1].markLine.data = series_warning_data[markline_values.need_warning[title_no-1]];
			}
			else{
				//do nothing
			}
		}
		console.log(JSON.stringify(series_data));
		var blank_width = 0.2*(max_value-min_value);
		var top_value = max_value + blank_width;
		console.log(max_value);
		
		var bottom_value = min_value - blank_width;
		if(bottom_value == top_value){
			bottom_value--;
			top_value++;
		}
		
		top_value = Number(top_value.toFixed(1));
		if(top_value <= max_value){
			top_value = top_value + 0.1;
			top_value = top_value.toFixed(1);
		}
		console.log(top_value);
		
		bottom_value = Number(bottom_value.toFixed(1)) - 0.1;
		bottom_value = bottom_value.toFixed(1);
		console.log(bottom_value + ' ' +top_value);
//		console.log(bottom_value);
		if(bottom_value < 0){
			bottom_value = 0;
		}
		if(top_value - bottom_value >= 10){
			top_value = Math.ceil(top_value);
		}
		//var myChart = echarts.init(document.getElementById('line-chart'));
		option = {
			tooltip: {
				trigger: 'axis',
			},
			xAxis: {
				type: 'category',
				data: line_x
//				data: line_x.map(function (str) {
//						str = str.substring(5).replace(/\-/g,'/');
//		                return str.replace(' ', '\n')
//		            })
			},
			yAxis: {
				name:y_unit,
				type: 'value',
				min: bottom_value,
				max: top_value
			},
			toolbox: {
	            left: 'center',
	            feature: {
	                dataZoom: {
	                    yAxisIndex: 'none'
	                },
                		restore: {}
	            }
	        },
	        dataZoom: [{
	        		type: 'inside',
	            startValue: line_x[0]
	        }, {
	            type: 'slider',
	            bottom:'0%'
	        }],
	        
			series: series_data
		};
		myChart.setOption(option);
				
	}

	//自选时间段
	mui('body').on('click','#time-conform',function(e){
		//获取选中时间
		var time_begin = document.getElementById('time-begin').innerText;
		var time_end = document.getElementById('time-end').innerText;
		//判断开始时间是否晚于结束时间
		var begin_late_than_end = compareDate(time_begin,time_end);
		if(begin_late_than_end){
			mui.toast('开始时间不能大于结束时间！');
			return;
			//alert('请先选择起止时间');
		}
		else{
			//向服务器请求数据
			var request_url = 'http://59.110.143.153:8080/chart/getchartdata';
			var begin = time_begin.split(' ');
			var end = time_end.split(' ');
//			var mask = mui.createMask();//遮罩层
			plus.nativeUI.showWaiting('加载中');
			mui.ajax(request_url, {//同步请求
				data: {
					'para': title_no,
					'today': false,
					'begin_date': begin[0],
					'begin_time': begin[1],
					'end_date': end[0],
					'end_time': end[1]
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				async: false,
				timeout: 10000, //超时时间设置为10秒；

				success: function(data_response) {
					if(data_response.success) {
						plus.nativeUI.closeWaiting();
//						mask.close();//关闭遮罩层
						data = data_response.data;
						var para_num = data.length;
						//alert(JSON.stringify(data));
						//重新加载图&表
						myChart.clear();
						load_line_chart(para_num);
						load_table(para_num);
					} else {
						plus.nativeUI.closeWaiting();
//						mask.close();//关闭遮罩层
						//alert('server failed');
						mui.toast('服务器出错啦');
						mui.openWindow({
				    			url:'server_wrong.html',
				    			id: 'server_wrong',
				    		})
					}
				},
				error: function(xhr, type, errorThrown) {
					plus.nativeUI.closeWaiting();
//					mask.close();//关闭遮罩层
					//异常处理；
					//alert(type + 'wrong');
					mui.toast('服务器出错啦');
					mui.openWindow({
			    			url:'server_wrong.html',
			    			id: 'server_wrong',
			    		})
				}
			}); //ajax
		}
		
	});
	function compareDate(beginTime,endTime){
		return (new Date(beginTime.replace(/\-/g,"/")))>(new Date(endTime.replace(/\-/g,'/')));
	}
	
	//控制图表切换按钮
	mui('body').on('tap','#chart-btn',function(e){
		//判断目前是否已处于折线图
		var docThis = document.getElementById('chart-btn');
		if(docThis.style.backgroundColor == '#007AFF'){
			//do nothing
		}
		else{
			docThis.style.backgroundColor = "#007AFF";
			document.getElementById('table-btn').style.backgroundColor = "#AAAAAA";
			document.getElementById('line-chart').style.display = "";
			document.getElementById('table-div').style.display = "none";
		}//else
		
	});
	
	mui('body').on('tap','#table-btn',function(e){
		var docThis =document.getElementById('table-btn');
		//判断目前是否已处于表格
		if(docThis.style.backgroundColor == '#007AFF'){
			//do nothing
		}
		else{
			docThis.style.backgroundColor = "#007AFF";
			document.getElementById('chart-btn').style.backgroundColor = "#AAAAAA";
			document.getElementById('line-chart').style.display = "none";
			document.getElementById('table-div').style.display = "";
		}//else
	});