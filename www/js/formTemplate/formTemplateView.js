define(['app', 'hbs!js/formTemplate/formTemplate'], function (app, formTemplate) {
	var $ = Dom7;

	function render(params) {
	    var template = formTemplate({ model: params.model });
	    if ($('#formTemplateModal').length) {
	        removeEvents(params.bindings);
	        var div = document.createElement('div');
	        div.innerHTML = template;
	        $('#formTemplateModal').html(div.childNodes[0].innerHTML);
	    }
	    else {
	        app.f7.popup(template);            
	    }
	    bindEvents(params.bindings);
	}

	function bindEvents(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	function removeEvents(bindings) {
	    for (var i in bindings) {
	        $(bindings[i].element).on(bindings[i].event, bindings[i].handler);
	        if (bindings[i].element.removeEventListener)
	            bindings[i].element.removeEventListener(bindings[i].event, bindings[i].handler, false);
	        if (bindings[i].element.detachEvent)
	            bindings[i].element.detachEvent('on' + bindings[i].event, bindings[i].handler);
	    }
	}

	return {
		render: render
	};
});