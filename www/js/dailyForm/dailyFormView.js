define(['app', 'js/contactModel', 'hbs!js/dailyForm/dailyForm'], function (app, Contact, dailyForm) {
	var $ = Dom7;

	function render(params) {
	    var template = dailyForm({ model: params.model, state: params.state, data: params.data });
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