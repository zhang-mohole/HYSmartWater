(function($, doc) {
	$.init({
		statusBarBackground: '#f7f7f7'
	});
	$.plusReady(function() {
		plus.screen.lockOrientation("portrait-primary");
		var settings = app.getSettings();
		settings.autoLogin = true;
		app.setSettings(settings);
		var state = app.getState();
		
		var toMain = function() {
			mui.openWindow({
				url: 'html/home1.html'
			})
		};
		//检查 "自动登陆" 
		if(settings.autoLogin && state.token) {
			toMain();
		}
		
		var loginButton = doc.getElementById('login');
		var accountBox = doc.getElementById('account');
		var passwordBox = doc.getElementById('password');
		loginButton.addEventListener('tap', function(event) {
			var loginInfo = {
				account: accountBox.value,
				password: passwordBox.value
			};
			var request_url = 'http://59.110.143.153:8080/login2';
//			var request_url = 'http://liuzt199492.vicp.net:50455/login2';
			var base64 = new Base64();
			var base64_pwd = base64.encode(passwordBox.value);
			mui.ajax(request_url, {
				data: {
					'name': accountBox.value,
//					'password': passwordBox.value
					'password': base64_pwd
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 2000, //超时时间设置为2秒；
				success: function(data) {
					if(data.message == 'ok') {
						//alert(data.message)
						toMain();
						app.createState(loginInfo.account, function(err) {
							if(err) {
								console.log(err);
							}
						});
					} else if(data.message == '用户名不存在') {
						mui.toast('用户名不存在');
						$('#account')[0].setAttribute('style','color: #CF2D28');
						$('#account')[0].focus();
						//alert('未找到该用户');
					} else {
						mui.toast('用户密码不正确');
						var dom_pwd = $('#password')[0];
						dom_pwd.value = '';
						dom_pwd.focus();
						//alert('incorrect pwd');
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					//alert(type);
					mui.toast('服务器出错啦');
					mui.openWindow({
						url: 'server_wrong.html',
						id: 'server_wrong',
					})
				}
			});
		});
		$.enterfocus('#login-form input', function() {
			$.trigger(loginButton, 'tap');
		});

	});
}(mui, document));