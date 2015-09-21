define(['hbs!js/list/contact-list-item', 'hbs!js/list/contact-list-menu'], function (template, menu) {
    var $ = Dom7;

    function render(params) {
        $('.list-block .list-group ul').html(menu(params));
        $('.contacts-list ul').html(template(params.model));
        $('.searchbar-cancel').click();
		bindEvents(params.bindings);
    }

	function reRender(params) {
		$('.contacts-list ul').html(template(params.model));
		$('.contacts-list-header').text(params.header);
        $('.searchbar-cancel').click();
	}

	function bindEvents(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

    return {
        render: render,
		reRender: reRender
    };
});