var UTILS = {
	loadScript: function(url) {
	  var request = new XMLHttpRequest();

		request.onreadystatechange = function(){
			if(request.readyState !== 4) {
				return;
			}

			if(request.status !== 200){
				return;
			}

	    eval(request.responseText);
		};

		request.open('GET', url);
		request.send();
	},

	authorize: function(){
	  gapi.auth.authorize(
			{
				client_id: "900512445690-lhlj7951lc82ro5ncno5djlqtl413u1q.apps.googleusercontent.com",
				immediate: true,
				scope: 'https://www.googleapis.com/auth/calendar'
			},
			function(){
			  gapi.client.load('calendar', 'v3', window.calendar_onload);
			}
		);
	}
};