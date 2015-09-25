define(["app", "js/newForm/newFormView"], function (app, View) {

	var bindings = [{
	    element: '.navbar-inner .left .back.link',
	    event: 'click',
	    handler: backClick
	}];

	var sections = [
        {
            sectionId: 1, sectionName: 'ด้านที่ 1',
            data: [
                {
                    qText: 'การดื่มนม', qId: '01', qNo: 1
                },
                {
                    qText: 'การรับประทานอาหาร', qId: '02', qNo: 2
                }
            ]
        },
        {
            sectionId: 2, sectionName: 'ด้านที่ 2',
            data: [
                {
                    qText: 'การดื่มนม', qId: '01', qNo: 1
                },
                {
                    qText: 'การรับประทานอาหาร', qId: '02', qNo: 2
                }
            ]
        }
	];
    
	function init(query) {
	    var mySwiper = app.f7.swiper('.swiper-container', {
	        pagination: '.swiper-pagination'
	    });
	    View.render({ model: sections, bindings: bindings, doneCallback: saveTemplate});
	}

	function backClick() {
	    //localStorage.setItem(templateId, JSON.stringify(template));
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