define(['app', 'hbs!js/formEdit/formEdit'], function (app, formEdit) {
	var $ = Dom7;

	function render(params) {
	    var template = formEdit({ model: params.model});
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
		$('.contact-save-link').on('click', function() {
			var inputValues = $('.contact-edit-form input');
			doneCallback(inputValues);
		});
	}

	return {
		render: render
	};
});