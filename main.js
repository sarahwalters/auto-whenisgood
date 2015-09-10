var nameInput = $('.enterName input'); // to autofill
var proposed = $('.proposed');
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var isodates = [];
_.each(proposed, function(aProposed) {
	var millis = parseInt($(aProposed).attr('id'));
	var momentDate = moment(millis).tz('GMT');
	isodates.push({
		day: momentDate.date(),
		month: monthNames[momentDate.month()],
		year: momentDate.year(),
		hour: momentDate.hour(),
		minute: momentDate.minute()
	});
});

if (isodates.length >== 0) {
	chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	  console.log('Got response:');
	  console.log(response.farewell);
	});
}
