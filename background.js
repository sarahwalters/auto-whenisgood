chrome.identity.getAuthToken({
  interactive: true
}, function(token) {
  //load Google's javascript client libraries
  window.gapi_onload = UTILS.authorize;
  window.calendar_onload = calendarQuery;
  UTILS.loadScript('https://apis.google.com/js/client.js');

  // request identity
  if (chrome.runtime.lastError) {
    alert(chrome.runtime.lastError.message);
    return;
  }
  var x = new XMLHttpRequest();
  x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
  x.onload = function() {
    window.email = JSON.parse(x.response).email;
  };
  x.send();
});

function calendarQuery() {
  var restRequest = gapi.client.request({
    'method': 'GET', // the default
    'path': 'calendar/v3/users/me/calendarList',
  });
  restRequest.then(function(resp) {
    freebusyQuery(resp.result.items);
  }, function(error) {
    console.log(error);
  });
}

function freebusyQuery(calendars) {
  var requestBody = {
    'timeMin': '2015-09-03T10:00:00.000-07:00',
    'timeMax': '2015-09-08T10:00:00.000-07:00',
    'items': _.map(calendars, function(aCalendar) { 
      return { 'id': aCalendar.id }; 
    })
  };

  var restRequest = gapi.client.request({
    'method': 'POST',
    'path': 'calendar/v3/freeBusy',
    'body': requestBody
  });

  restRequest.then(function(resp) {
    console.log(resp.result);
  }, function(error) {
    console.log(error);
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greeting == "hello") {
    // console.log(chrome.identity.getProfileUserInfo);
    // chrome.identity.getProfileUserInfo(function(userInfo) {
    //   console.log(userInfo);
    //   sendResponse({farewell: userInfo});
    // });
    //sendResponse({farewell: 'test'});
    sendResponse({farewell: 'test'})
  }
});

// console.log('after other function');