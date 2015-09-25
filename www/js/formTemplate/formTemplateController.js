define(["app", "js/formTemplate/formTemplateView"], function (app, View) {

    var templates = [];
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
        templates = getTemplate();
        var mySwiper = app.f7.swiper('.swiper-container', {
            pagination: '.swiper-pagination'
        });
        View.render({ model: templates, bindings: bindings });
    }

    function getTemplate() {
        return JSON.parse(localStorage.getItem("templates"));
    }

    function selectTemplate(e) {
        var buttons = [
        {
            text: 'ยืนยันการเลือก',
            bold: true,
            onClick: function () {
                var templateId = e.target.getAttribute('data-value');
                var first = [], last = [];
                for (var i = 0; i < templates.length; i++) {
                    if (templates[i].id == templateId) {
                        first.push(templates[i]);
                        templates[i]['selected'] = true;
                    }
                    else {
                        last.push(templates[i]);
                        templates[i]['selected'] = false;
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
                templates = first.concat(last);
                localStorage.setItem("templates", JSON.stringify(templates));
                View.render({ model: templates, bindings: bindings });
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