define(function() {
    var $ = Dom7;
    var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

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
		Base64: Base64,
		insertAnswer: insertAnswer
	};
});