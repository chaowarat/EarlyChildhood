define(["app", "js/newForm/newFormView"], function (app, View) {

	var contact = null;
	var state = {
		isNew: false
	};
	var bindings = [{
	    element: '.navbar-inner .left .back.link',
	    event: 'click',
	    handler: backClick
	}];

	function init(query) {
	    var mySwiper = app.f7.swiper('.swiper-container', {
	        pagination: '.swiper-pagination'
	    });
		View.render({ model: contact, bindings: bindings, doneCallback: saveTemplate });
	}

	function backClick() {
	    app.f7.closeModal('#newFormModal');
	}

	function saveTemplate() {
		//contact.setValues(inputValues);
		//if (!contact.validate()) {
		//	app.f7.alert("First name and last name are empty");
		//	return;
		//}
		//var contacts = JSON.parse(localStorage.getItem("f7Contacts"));
		//if (!state.isNew) {
		//	_.remove(contacts, { id: contact.id });
		//}
		//contacts.push(contact);
		//localStorage.setItem("f7Contacts", JSON.stringify(contacts));
		//app.router.load('list'); // reRender main page view
		closePage();
	}

	function closePage() {
		app.f7.closeModal();
	}

	return {
		init: init
	};
});