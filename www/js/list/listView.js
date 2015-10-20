define(['hbs!js/list/contact-list-item', 'hbs!js/list/contact-list-menu'], function (template, menu) {
    var $ = Dom7;

    function render(params) {
        $('.list-block .list-group ul').html(menu(params));
        $('.contacts-list ul').html(template(params.model));
        $('.searchbar-cancel').click();
        setHeaderText(params.header);
        bindEvents(params.bindings);
    }

    function reRender(params) {
        removeEvents(params.bindings);
		$('.contacts-list ul').html(template(params.model));
		setHeaderText(params.header);
		$('.searchbar-cancel').click();		
		bindEvents(params.bindings);
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

	function bindEvents(bindings) {
		for (var i in bindings) {
			$(bindings[i].element).on(bindings[i].event, bindings[i].handler);
		}
	}

	function setHeaderText(text) {
	    $('#headerText').text(text);
	}

    return {
        render: render,
		reRender: reRender
    };
});