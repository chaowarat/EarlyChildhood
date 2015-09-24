define(["app", "js/formTemplate/formTemplateView"], function (app, View) {

    var template = [
        { id: '001', name: 'แบบฟอร์มที่ 1', content: generateContent('001'), data:[], selected: true },
        { id: '002', name: 'แบบฟอร์มที่ 2', content: generateContent('002'), data: [] },
        { id: '003', name: 'แบบฟอร์มที่ 3', content: generateContent('003'), data: [] },
        { id: '004', name: 'แบบฟอร์มที่ 4', content: generateContent('004'), data: [] },
        { id: '005', name: 'แบบฟอร์มที่ 5', content: generateContent('005'), data: [] },
        { id: '006', name: 'แบบฟอร์มที่ 6', content: generateContent('006'), data: [] }
    ];
    var bindings = [{
        element: '.button-select-template',
        event: 'click',
        handler: selectTemplate
    },
    {
        element: '.create-new-link',
        event: 'click',
        handler: createTemplate
    }];

	function init(query) {
	    var mySwiper = app.f7.swiper('.swiper-container', {
	        pagination: '.swiper-pagination'
	    });
	    View.render({ model: template, bindings: bindings});
	}

	function selectTemplate(e) {
	    var buttons = [
        {
            text: 'ยืนยันการเลือก',
            bold: true,
            onClick: function () {
                var templateId = e.target.getAttribute('data-value');
                var first = [], last = [];
                for (var i = 0; i < template.length; i++) {
                    if (template[i].id == templateId) {
                        first.push(template[i]);
                        template[i]['selected'] = true;
                    }
                    else {
                        last.push(template[i]);
                        template[i]['selected'] = false;
                    }
                }
                last.sort(function (a, b) {
                    if (a.id > b.id) {
                        return 1;
                    }
                    if (a.id < b.id) {
                        return -1;
                    }
                    return 0;
                });
                template = first.concat(last);
                View.render({ model: template, bindings: bindings });
            }
        },
        {
            text: 'ยกเลิก',
            color: 'red'
        },
	    ];
	    app.f7.actions(buttons);	    
	}

	Handlebars.registerHelper('inHTML', function (content) {
	    return new Handlebars.SafeString(content);
	});

	function generateContent(id) {
	    var text = 'The content of ' + id;
	    text += '<br /> Card with header and footer. <br />Card header is used to display card title and footer for some additional information or for custom actions.';
	    return text;
	}

	function createTemplate() {
	    app.router.load('newForm');
	}

	function closePage() {		
		app.f7.closeModal();
	}

	return {
		init: init
	};
});