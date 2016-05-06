define(['app', 'js/contactModel', 'hbs!js/dailyForm/dailyForm'], function (app, Contact, dailyForm) {
	var $ = Dom7;

	function render(params) {
	  var template = dailyForm({ model: params.model, state: params.state, data: params.data });
		app.f7.popup(template);
		bindEvents(params.bindings);
		bindSaveEvent(params.doneCallback);
		$('#inputWeight').val(params.weight).trigger("input");
		$('#inputHeight').val(params.height).trigger("input");
    $('#inputHead').val(params.head).trigger("input");
	}

	function bindEvents(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	function bindSaveEvent(doneCallback) {
		$('.contact-save-link').on('click', function() {
		    var inputValues = $('.daily-list input');
		    doneCallback(inputValues, $('#inputWeight').val(), $('#inputHeight').val(), $('#inputHead').val(), $('#inputDate').val());
		});
		$('.close-daily').on('click', function () {
		    app.f7.closeModal("#dailyModal");
		});
		$('input[type="range"]').on('input', function () {
		    var node = this.parentNode.parentNode.previousSibling.previousSibling;
		    node.innerText = node.innerText.split('(')[0] + '(' + this.value + ' ' + node.innerText.split(' ')[1];
		});
	}

	return {
		render: render
	};
});