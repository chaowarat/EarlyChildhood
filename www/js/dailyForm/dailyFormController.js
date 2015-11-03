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
		    oldAnswer = tmp.pop();
		    console.log(template)
		    if (oldAnswer) {
		        isEdit = true;
		        //for (var i = 0; i < template.length; i++) {
		        //    for (var j = 0; j < template[i].details.length; j++) {
		        //        for (var k = 0; k < template[i].details[j].answers.length; j++) {
		        //            var answer = findValue(oldAnswer.answers, template[i].details[j].answers[k].id);                            
		        //            if (answer) {
		        //                console.log(answer)
		        //                for (var l = 0; l < template[i].details[j].answers.length; l++) {
		        //                    if (template[i].details[j].answers[l].id == answer) {
		        //                        template[i].details[j].answers[l].checked = true;
		        //                    }
		        //                    else {
		        //                        template[i].details[j].answers[l].checked = false;
		        //                    }
		        //                }
		        //            }
		        //        }
		        //    }
		        //}
		    }
		}
		View.render({ model: contact, bindings: bindings, state: state, doneCallback: saveContact, data: template });
	}

	function findValue(array, key){
	    for (var i = 0; i < array.length; i++) {
	        if (Object.keys(array[i])[0] == key) {
	            return array[i][key];
	        }
	    }
	    return null;
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