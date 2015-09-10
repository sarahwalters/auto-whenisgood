var nameInput = $('.enterName input'); // to autofill
var proposed = $('.proposed');
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var isodates = [];
_.each(proposed, function(aProposed) {
	var millis = parseInt($(aProposed).attr('id'));
	var momentDate = moment(millis).tz('GMT');
	isodates.push(momentDate);
});

if (isodates.length >= 2) {
	var requestBody = {
		type: 'freebusyReq',
		timeMin: isodates[0].format(),
		timeMax: isodates[isodates.length - 1].format()
	};

	chrome.runtime.sendMessage(requestBody, function(response) {
	  console.log(response);
	});
}