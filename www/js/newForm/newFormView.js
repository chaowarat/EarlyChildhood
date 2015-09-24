define(['app', 'hbs!js/newForm/newForm'], function (app, newForm) {
	var $ = Dom7;

	function render(params) {
	    var template = newForm({ model: params.model});
	    app.f7.popup(template);
		bindEvents(params.bindings);
		bindSaveEvent(params.doneCallback);
	}

	function bindEvents(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	function bindSaveEvent(doneCallback) {
	    $('.contact-save-link').on('click', function () {
	        var inputValues = $('.contact-edit-form input');
	        doneCallback(inputValues, $('#input-form-name').val(), $('#input-form-detail').val());
	    });
	}

	return {
		render: render
	};
});