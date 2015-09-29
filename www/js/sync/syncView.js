define(['app', 'hbs!js/sync/sync', 'hbs!js/sync/roomPanel', 'hbs!js/sync/rightPanel'], function (app, newForm, room, rpanel) {
	var $ = Dom7;

	function render(params) {	    
	    if ($('.sync-content').length) { // refresh
	        var template = room({ model: params.model.rooms });
	        removeEvents(params.bindings);
	        $('.sync-content').html(template);	        
	    }
	    else { // load new
	        var template = newForm();
	        app.f7.popup(template);
	        $('.sync-content').html(room({ model: params.model.rooms }));
	    }
	    bindEvents(params.bindings);
	    $('.update-time-text').text('ข้อมูลวันที่ : ' + params.model.updateTime);
	}

	function renderRight(room, model) {
	    $('.right-panel-list').html(rpanel({ room:room, model: model }));
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

	return {
	    render: render,
	    renderRight: renderRight
	};
});