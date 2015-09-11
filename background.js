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
    window.calendars = resp.result.items;
  }, function(error) {
    console.log(error);
  });
}

function freebusyQuery(timeMin, timeMax) {
  var requestBody = {
    'timeMin': timeMin,
    'timeMax': timeMax,
    'items': _.map(window.calendars, function(aCalendar) { 
      return { 'id': aCalendar.id }; 
    })
  };

  var restRequest = gapi.client.request({
    'method': 'POST',
    'path': 'calendar/v3/freeBusy',
    'body': requestBody
  });

  return restRequest.then(function(resp) {
    return resp.result;
  }, function(error) {
    return error;
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type == 'freebusyReq') {
    freebusyQuery(request.timeMin, request.timeMax).
      then(function(resp) {
        sendResponse({freebusyData: resp});
      });
    return true; // chromium bug: https://code.google.com/p/chromium/issues/detail?id=343007
  }

  if (request.type == 'selectionReq') {
    chrome.tabs.executeScript({
      code: '$("'+request.proposedId+'").mousedown().mouseup()' // still no -- can't access DOM
    });
  }
});
