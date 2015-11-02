define(["app", "js/newForm/newFormView"], function (app, View) {

	var bindings = [{
	    element: '.navbar-inner .left .back.link',
	    event: 'click',
	    handler: backClick
	}];

	var sections = [];
	var defaultAnswers = [];
    
	function init(query) {
	    defaultForm();
	    var mySwiper = app.f7.swiper('.swiper-container', {
	        pagination: '.swiper-pagination'
	    });
	    View.render({ model: sections, bindings: bindings, doneCallback: saveTemplate});
	}

	function defaultForm() {
	    var answers = JSON.parse(defaultTemplate);
	    defaultAnswers = answers.answers;

	    sections = [];
	    var templates = JSON.parse(localStorage.getItem("templates"));
	    var data = null;
	    if (templates) {
	        for (var i = 0; i < templates.length; i++) {
	            if (templates[i]['selected'] == true) {
	                data = templates[i].template.data; break;
	            }
	        }
	    }
	    if (data) {
	        for (var i = 0; i < data.length; i++) {
	            sections.push({
	                sectionId: (i + 1), sectionName: data[i].text,
	                data: reFormat(data[i].details)
	            });
	        }
	    }
	}

	function reFormat(data) {
	    var array = [];
	    for (var i = 0; i < data.length; i++) {
	        if (data[i].isQuestion) {
	            array.push({ id: data[i].id, text: data[i].text, isQuestion: data[i].isQuestion, answers: defaultAnswers });
	        }
	        else {
	            array.push({ id: data[i].id, text: data[i].text, isQuestion: data[i].isQuestion });
	        }
	        var tmp = data[i].details;
	        for (var j = 0; j < tmp.length; j++) {
	            if (tmp[j].isQuestion) {
	                array.push({ id: tmp[j].id, text: tmp[j].text, isQuestion: tmp[j].isQuestion, answers: defaultAnswers });
	            }
	            else {
	                array.push({ id: tmp[j].id, text: tmp[j].text, isQuestion: tmp[j].isQuestion });
	            }	            
	            var tmp2 = tmp[j].details;
	            for (var k = 0; k < tmp2.length; k++) {
	                if (tmp2[k].isQuestion) {
	                    array.push({ id: tmp2[k].id, text: tmp2[k].text, isQuestion: tmp2[k].isQuestion, answers: defaultAnswers });
	                }
	                else {
	                    array.push({ id: tmp2[k].id, text: tmp2[k].text, isQuestion: tmp2[k].isQuestion });
	                }	                
	            }
	        }
	    }
	    return array;
	}

	function backClick() {
	    app.f7.closeModal('#newFormModal');
	}

	function saveTemplate(inputValues, name, detail) {
	    var template = { id: app.utils.generateGUID(), name: name, content: detail, data: [], selected: true };
	    var _data = sections.slice();
	    for (var i = 0; i < inputValues.length; i++) {
	        var _sectionId = inputValues[i].getAttribute('section');
	        for (var j = 0; j < _data.length; j++) {
	            if (_data[j].sectionId == _sectionId) {
	                var index = -1;
	                for (var k = 0; k < _data[j].data.length; k++) {
	                    if (_data[j].data[k].qId == inputValues[i].value && !inputValues[i].checked) {
	                        index = k;
	                        break;
	                    }
	                }

	                if (index != -1) {
	                    _data[j].data.splice(index, 1);
	                }
	                break;
	            }
	        }
	    }
	    template.data = _data;
	    var templates = JSON.parse(localStorage.getItem("templates"));
	    if (templates) {
	        for (var i = 0; i < templates.length; i++) {
	            templates[i]['selected'] = false;
	        }
	        templates.sort(function (a, b) {
	            if (a.id > b.id) {
	                return 1;
	            }
	            if (a.id < b.id) {
	                return -1;
	            }
	            return 0;
	        });
	        var tmp = [];
	        tmp.push(template);
	        templates = tmp.concat(templates);
	        localStorage.setItem("templates", JSON.stringify(templates));
	    }	    
		closePage();
	}

	function generateContent(id) {
	    var text = 'The content of ' + id;
	    text += '<br /> Card with header and footer. <br />Card header is used to display card title and footer for some additional information or for custom actions.';
	    return text;
	}

	function closePage() {
		app.f7.closeModal();
	}

	return {
		init: init
	};
});