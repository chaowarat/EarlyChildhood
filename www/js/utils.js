define(function() {
	var $ = Dom7;

	function generateGUID(){
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return uuid;
	}

	function getRandomInt(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getStorageKeys() {
	    var keys = [];
	    for (var i = 0; i < localStorage.length; i++) {
	        keys.push(localStorage.key(i));
	    }
	    return keys;
	}

	function getAnswers(date, personId) {
	    var answerStartWith = 'answer';
	    var keys = getStorageKeys();
	    var answers = [];
	    for (var i = 0; i < keys.length; i++) {
	        var key = keys[i];
	        if (key.indexOf(answerStartWith) === 0) {
	            var obj = JSON.parse(localStorage.getItem(key));
	            if (date && personId) {
	                if (obj.recordDate.indexOf(date) === 0 && obj.personId == personId) {
	                    answers.push(obj);
	                }
	            }
	            else if (date) {
	                if (obj.recordDate.indexOf(date) === 0) {
	                    answers.push(obj);
	                }
	            }
	            else if (personId) {
	                if (obj.personId == personId) {
	                    answers.push(obj);
	                }
	            }
	            else {
	                answers.push(obj);
	            }
	        }
	    }
	    return answers;
	}

	function findAnswer(id) {
	    if (!id) {
	        return null;
	    }
	    var answerStartWith = 'answer';
	    var keys = getStorageKeys();
	    for (var i = 0; i < keys.length; i++) {
	        var splited = keys[i].split('-');
	        if (splited[0] == answerStartWith) {
	            var GUID = keys[i].substr(splited[0].length);
	            if (GUID == id) {
	                return keys[i];
	            }
	        }
	    }
	    return null;
	}

	function insertAnswer(answer) {
	    var key = findAnswer(answer.id);
	    if (key) {
	        localStorage.setItem(key, JSON.stringify(answer));
	    }
	    else {
	        localStorage.setItem('answer-' + answer.id, JSON.stringify(answer));
	    }
	}

	function getDateNow() {
	    var currentdate = new Date();
	    return (currentdate.getMonth() + 1) + "/"
               + currentdate.getDate() + "/"
               + currentdate.getFullYear();
	}

	function getTimeNow() {
	    var currentdate = new Date();
	    return currentdate.getHours() + ":"
               + currentdate.getMinutes() + ":"
               + currentdate.getSeconds();
	}

	function getDateTimeNow() {
	    return getDateNow() + " " + getTimeNow();
	}

	return {
		generateGUID: generateGUID,
		getRandomInt: getRandomInt,
		getDateNow: getDateNow,
		getDateTimeNow: getDateTimeNow,
		getAnswers: getAnswers,
		insertAnswer: insertAnswer
	};
});