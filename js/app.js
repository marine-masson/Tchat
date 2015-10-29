(function (window, $) {

	'use strict';

	const API_ROOT_URL = "http://greenvelvet.alwaysdata.net/kwick/api";

	var userLogin;           
	var userPassword;        
	var $passwordConfirm  = $('#passwordConfirm');
	var $register         = $('#register');
	var $connect          = $('#connect');
	var $disconnect       = $('#disconnect');
	var $send       = $('#send');


	function call_tchat_api(url, cb) {
		var request = $.ajax({
			type: 'GET',
			url: API_ROOT_URL + url,
			dataType: 'jsonp'
		});

		setInterval( function(){
			request.ajax.reload();
		},2000 );

		// En cas d'erreur
		request.fail(function (jqXHR, textStatus, errorThrown){
			cb(textStatus, null);
		});

		// En cas de succès
		request.done(function (data){
			cb(null, data);
		});
	};

var app ={

		init: function(){},

		SignUp: function() {
			$register.on('click', function(e){
				e.preventDefault();
				userLogin  = $('#login').val();
				userPassword = $('#password').val();
				app.Register(userLogin, userPassword);
			});
		},

		Register: function(userLogin, userPassword) {

			call_tchat_api('/signup/' + userLogin + '/' + userPassword +'', function(err, data){
				var tchat = 'tchat.html';
				if(err) {
					return alert('Une erreur c\'est produite');
				}
				else if(data.result.status == "failure"){
					return $('#infos').append('<p class=" fa fa-times unconnect"><span>'+data.result.message+'</span></p>');
				}

				localStorage.setItem('login', userLogin);
				localStorage.setItem('token', data.result.token);
				localStorage.setItem('uid', data.result.id);


				window.location = tchat;

			});
		},

		initTchat: function() {
			var loginStorage = localStorage.getItem('login');
			var tokenStorage = localStorage.getItem('token');

			if(loginStorage == null || tokenStorage == null){
				$('#userLogged').append('<p class="fa fa-times unconnect"><span>Vous n\'êtes pas connecté </span></p>');
			}else {
				$('#userLogged').append('<p class="fa fa-check connect"><span>Vous êtes connecté </span></p>');
			}
		},

		connect: function(){
			$connect.on('click', function(e){
				e.preventDefault();
				userLogin  = $('#login').val();
				userPassword = $('#password').val();
				app.connectAction(userLogin, userPassword);
			
			});
		},

		connectAction: function(userLogin, userPassword) {

			call_tchat_api('/login/' + userLogin + '/' + userPassword +'', function(err, data){
				var tchat = 'tchat.html';
				if(err) {
					return alert('Une erreur c\'est produite');
				}
				else if(data.result.status == "failure"){
					return $('#infos').append('<p class=" fa fa-times unconnect"><span>'+data.result.message+'</span></p>');
				}

				localStorage.setItem('login', userLogin);
				localStorage.setItem('token', data.result.token);
				localStorage.setItem('id', data.result.id);

				window.location = tchat;

			});
		},

		disconnect: function() {
			$disconnect.on('click', function(e){
				e.preventDefault();
				var idStorage = localStorage.getItem('id');
				var tokenStorage = localStorage.getItem('token');
				app.disconnectAction(tokenStorage, idStorage);
			});
		},

		disconnectAction: function(tokenStorage, idStorage) {
			call_tchat_api('/logout/' + tokenStorage + '/' + idStorage +'', function(err, data){
				var connect = 'connect.html';
				if(err) {
					return alert('Une erreur c\'est produite');
				}
				else if(data.result.status == "failure"){
					return $('#infos').append('<p class=" fa fa-times unconnect"><span>'+data.result.message+'</span></p>');
				}

				localStorage.removeItem('id');
				localStorage.removeItem('token');
				localStorage.removeItem('login');
				window.location = connect;

			});
		},

		userListLogged: function(){
			var tokenStorage = localStorage.getItem('token');
			call_tchat_api('/user/logged/' + tokenStorage, function(err, data){

				if(err) {
					return alert('Une erreur c\'est produite');
				}
				
				for(var i =0; i < data.result.user.length; i++){
					$('#userLogged').append('<li class="fa fa-user list-users"><span>' + data.result.user[i] + '</Span></li>');
				}
			});
		},

		postMessage: function(){

			$send.on('click', function(e){
				e.preventDefault();
				var idStorage = localStorage.getItem('id');
				var tokenStorage = localStorage.getItem('token');
				var messageStorage = localStorage.getItem('message');
				app.getMessage(tokenStorage, idStorage, messageStorage);
				$('#userTexte').val('');

				window.setInterval(app.getMessage,3000);
			});
		},

		getMessage: function(tokenStorage, idStorage) {
			var idStorage = localStorage.getItem('id');
			var tokenStorage = localStorage.getItem('token');
			var messageStorage = encodeURIComponent($('#userTexte').val());

			call_tchat_api('/say/' + tokenStorage + '/' + idStorage +'/' + messageStorage, function(err, data){
				if(err) {
					return alert('Une erreur c\'est produite');
				}

			});
		},

		talk: function(){
			var tokenStorage = localStorage.getItem('token');
			app.getTalk(tokenStorage);
		},

		getTalk: function(tokenStorage){
			var tokenStorage = localStorage.getItem('token');


			call_tchat_api('/talk/list/' + tokenStorage + '/' + 0, function(err, data){
				if(err) {
					return alert('Une erreur c\'est produite');
				}

				var tblTalk = data.result.talk;
				var infinite = 10^10;
				for(var i = 0; i < tblTalk.length; i++){
					$('#message').append('<div class="user"> ' + tblTalk[i].user_name +' : </div> ' + tblTalk[i].content + '<br>').scrollTop(10*10000000000000);
				}

			});						

		}
};

	window.app = app;

})(window, jQuery)


