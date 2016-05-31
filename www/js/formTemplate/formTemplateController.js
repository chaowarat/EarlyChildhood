define(["app", "js/formTemplate/formTemplateView"], function (app, View) {

    var templates = [];
    var selectedRemove = null;
    var bindings = [{
        element: '.button-select-template',
        event: 'click',
        handler: selectTemplate
    },
    {
        element: '.button-delete-template',
        event: 'click',
        handler: deleteTemplate
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
    
    function deleteTemplate(e){
      var templateId = e.target.getAttribute('data-value');
      for (var i = 0; i < templates.length; i++) {
        if (templates[i].id == templateId && templates[i].refId) {
          selectedRemove = i;
          var buttons = [
          {
              text: 'ยืนยันการลบ template' + templates[i].name,
              bold: true,
              onClick: function () {
                var memo = JSON.parse(localStorage.getItem("memo"));
                if (!memo['0'] || !memo['1']) {
                    return;
                }
                var url = 'http://alphaedu.azurewebsites.net/webservices/getservice.svc/deleteTemplate?USERNAME=' 
                + app.utils.Base64.decode(memo['0'])
                +'&PASSWORD=' + app.utils.Base64.decode(memo['1']) + '&hostId=' 
                + localStorage.getItem("host") + '&templateId=' + templates[selectedRemove].refId;
                Dom7.ajax({
                    url: url,
                    dataType: 'json',
                    success: function (msg) {
                      templates.splice(selectedRemove,1);
                      localStorage.setItem("templates", JSON.stringify(templates));
                      View.render({ model: templates, bindings: bindings });
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        app.f7.alert(xhr.responseText + 'ผิดพลาดในการลบ template', 'ERROR!');
                    }
                });
              }
          },
          {
              text: 'ยกเลิก',
              color: 'red'
          },
          ];
          app.f7.actions(buttons);
        }
      }
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