define(["app", "js/contactModel", "js/dailyForm/dailyFormView"], function (app, Contact, View) {

	var contact = null;
	var state = {
		isNew: false
	};
	var isEdit = false;
	var oldAnswer = null;
	var bindings = [];

	var template = {};

	function init(query) {
	    isEdit = false;
	    oldAnswer = null;
		var contacts = JSON.parse(localStorage.getItem("f7Contacts"));
		if (query && query.id) {
			contact = new Contact(_.find(contacts, { id: query.id }));
			state.isNew = false;
		}
		else {
			contact = new Contact({ isFavorite: query.isFavorite });
			state.isNew = true;
		}
		template = getQuestion();
	    // load from local storage if exist
	    // isEdit = true
	    // edit ddl selected value in template
	    // store answer id to answerId
		var tmp = app.utils.getAnswers(app.utils.getDateNow(), contact.id);		
		if (tmp) {
		    var _pop = tmp.pop();
		    if (_pop) {
		        oldAnswer = JSON.parse(JSON.stringify(_pop.answers));
		        isEdit = true;
		        for (var m = 0; m < oldAnswer.length; m++) {
		            var questionId = Object.keys(oldAnswer[m])[0];
		            for (var i = 0; i < template.length; i++) {
		                for (var j = 0; j < template[i].details.length; j++) {
		                    if (template[i].details[j].id == questionId && template[i].details[j].isQuestion) { // same question		                        
		                        var answerId = oldAnswer[m][template[i].details[j].id];
		                        var _answers = JSON.parse(JSON.stringify(template[i].details[j].answers));
		                        for (var k = 0; k < _answers.length; k++) {
		                            if (_answers[k].id == answerId) {
		                                _answers[k].checked = true;
		                                template[i].details[j].answers = _answers;
		                                break;
		                            }
		                        }
		                        break;
		                    }		                    
		                }
		            }
		        }		        
		    }
		}
		View.render({ model: contact, bindings: bindings, state: state, doneCallback: saveContact, data: template });
	}

	function getQuestion() {
	    var data = localStorage.getItem("templates");
	    var templates = data ? JSON.parse(data) : [];
	    var template = null;
	    for (var i = 0; i < templates.length; i++) {
	        if (templates[i].selected == true) {
	            template = templates[i].template;
	        }
	    }
	    if (template) {
	        var answers = JSON.parse(defaultTemplate).answers;
	        for (var i = 0; i < template.length; i++) {
	            for (var j = 0; j < template[i].details.length; j++) {
	                answers[0].checked = true;
	                template[i].details[j]['answers'] = answers;
	            }
	        }

	        return template;
	    }
	    else{
	        return null;
	    }
	}

	function saveContact(inputValues) {
	    var QAs = [];
	    for (var i = 0; i < inputValues.length; i++) {
	        if (inputValues[i].getAttribute('data-type') == 'QA' && inputValues[i].checked) {
	            var tmp = {};
	            tmp[inputValues[i].getAttribute('name')] = inputValues[i].getAttribute('value');
	            QAs.push(tmp);
	        }
	    }
	    var _id = app.utils.generateGUID();
	    if (isEdit) {
	        _id = oldAnswer.id;
	    }
	    var answer = {
	        'id': _id,
	        'recordDate': app.utils.getDateTimeNow(),
	        'personId': contact.id, 'templateId': template.id, 'answers': QAs
	    };
	    app.utils.insertAnswer(answer);
		closePage();
	}

	function closePage() {
	    app.router.load('list');
		app.f7.closeModal();
	}

	return {
		init: init
	};
});