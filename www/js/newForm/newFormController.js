define(["app", "js/newForm/newFormView"], function (app, View) {

	var bindings = [{
	    element: '.navbar-inner .left .back.link',
	    event: 'click',
	    handler: backClick
	}];

	var sections = [];
    
	function init(query) {
	    defaultForm();
	    var mySwiper = app.f7.swiper('.swiper-container', {
	        pagination: '.swiper-pagination'
	    });
	    View.render({ model: sections, bindings: bindings, doneCallback: saveTemplate});
	}

	function defaultForm() {
	    sections = [];
	    var templates = JSON.parse(localStorage.getItem("templates"));        
	    var data = null;
	    if (templates) {
	        for (var i = 0; i < templates.length; i++) {
	            if (templates[i]['isDefault'] == true) {
	                data = templates[i].template; break;
	            }
	        }
	    }
	    if (data) {
	        for (var i = 0; i < data.length; i++) {
	            sections.push({
	                sectionId: (i + 1), sectionName: data[i].text, id: data[i].id,
	                data: data[i].details
	            });
	        }
	    }
	}

	function backClick() {
	    app.f7.closeModal('#newFormModal');
	}

	function saveTemplate(inputValues, name) {
	    var template = { id: app.utils.generateGUID(), name: name, template: [], selected: true };
	    var _data = [];
	    for (var i = 0; i < sections.length; i++) {
	        _data.push({ id: sections[i].id, isQuestion: false, text: sections[i].sectionName, details: [] });
	    }
	    for (var i = 0; i < inputValues.length; i++) {
	        if (inputValues[i].checked) {
	            var _sectionId = inputValues[i].getAttribute('section');
	            var _id = inputValues[i].getAttribute('value');
	            var _text = inputValues[i].getAttribute('data-text');
	            for (var j = 0; j < _data.length; j++) {
	                if (_data[j].id == _sectionId) {
	                    _data[j].details.push({ id: _id, isQuestion: true, text: _text });
	                    break;
	                }
	            }
	        }	        
	    }
      var answer = [];
      for(var i = 0; i < _data.length; i++){
        if(_data[i].details.length > 0){
          for(var j = 0; j < _data[i].details.length; j++){
            answer.push(_data[i].details[j].id);
          }
        }
      }
      
      var _dataPost = {};
        var memo = JSON.parse(localStorage.getItem("memo"));
        if (!memo['0'] || !memo['1']) {
            return;
        }

        _dataPost['USERNAME'] = app.utils.Base64.decode(memo['0']);
        _dataPost['PASSWORD'] = app.utils.Base64.decode(memo['1']);
        _dataPost['host'] = localStorage.getItem("host");
        _dataPost['staff'] = localStorage.getItem("staff");
        _dataPost['templateName'] = name;
        _dataPost['data'] = answer;
        var _url = 'http://alphaedu.azurewebsites.net/webservices/getservice.svc/saveTemplate';
        Dom7.ajax({
            url: _url,
            method: 'POST',
            data: 'json=' + encodeURIComponent(JSON.stringify(_dataPost)),
            contentType: "application/x-www-form-urlencoded",          
            success: function (msg) {
                var response = JSON.parse(JSON.parse(msg));
                if (response['status'].toLocaleLowerCase() == 'ok') {
                  template['refId'] = response['templateId'];
                  template.template = _data;;
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
                else {
                  app.f7.alert(response['errorMessage'].substring(0, 200) + ' โปรดติดต่อผู้ดูแลระบบ');
                }
            },
            error: function (error) {
                console.log(error)
                app.f7.alert(error.statusText + ' โปรดติดต่อผู้ดูแลระบบ');
                app.f7.pullToRefreshDone();
            }
        });
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