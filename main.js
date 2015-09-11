var nameInput = $('.enterName input'); // to autofill
var proposed = $('.proposed');
var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var isodates = [];
_.each(proposed, function(aProposed) {
	var millis = parseInt($(aProposed).attr('id'));
	var momentDate = moment(millis).tz('GMT');
	isodates.push(momentDate);
});

isodates = _.sortBy(isodates, function(anIsodate) {
	return anIsodate.format();
});

if (isodates.length >= 2) {
	var requestBody = {
		type: 'freebusyReq',
		timeMin: isodates[0].format(),
		timeMax: isodates[isodates.length - 1].format()
	};

	chrome.runtime.sendMessage(requestBody, function(response) {
		var busy = response.freebusyData.calendars['s.walters.4925@gmail.com'].busy.slice(0); // make a copy
		var proposedDuration = isodates[1].diff(isodates[0]); // ms TODO mode-based interpolation? popup?	
		var i = 0;
		while (i < isodates.length) {
			if (busy.length) {
				var proposedStart = isodates[i].format().slice(0,-6); // get rid of +00:00
				var proposedEnd = isodates[i].add(proposedDuration, 'milliseconds').format().slice(0,-6);
				var busyStart = busy[0].start.slice(0,-1); // get rid of Z
				var busyEnd = busy[0].end.slice(0,-1);

				// Can throw out a busy as soon as you're sure
				// nothing starts before it ends
				while (busy.length > 1 && proposedStart >= busyEnd) {
					busy.shift();
					busyStart = busy[0].start.slice(0,-1); // get rid of Z
					busyEnd = busy[0].end.slice(0,-1);
				}

				// console.log(busy[0]);
				// console.log(proposedStart);
				// console.log(proposedEnd);

				var startsDuringProposed = (proposedStart <= busyStart && busyStart < proposedEnd);
				var endsDuringProposed = (proposedStart < busyEnd && busyEnd <= proposedEnd);
				isodates[i].busy = startsDuringProposed || endsDuringProposed;
				// console.log(isodates[i].busy);
				// console.log('-');
			} else {
				isodates[i].busy = false;
			}
			i++;
		}

		// could do this in place...
		_.each(isodates, function(anIsodate) {
			if (!anIsodate.busy) {
				// this time is good!
				// chrome.tabs.executeScript -- isolated environments
				var messageBody = {
					type: 'selectionReq',
					proposedId: '.proposed#' + anIsodate._i
				};
				chrome.runtime.sendMessage(messageBody);
			}
		})
	});
}