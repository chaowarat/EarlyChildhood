define(["app", "js/formEdit/formEditView"], function (app, View) {

	var contact = null;
	var state = {
		isNew: false
	};
	var bindings = [];

	function init(query) {
	    var mySwiper = app.f7.swiper('.swiper-container', {
	        pagination: '.swiper-pagination'
	    });
		View.render({ model: contact, bindings: bindings, doneCallback: saveContact });
	}

	function saveContact(inputValues) {
		contact.setValues(inputValues);
		if (!contact.validate()) {
			app.f7.alert("First name and last name are empty");
			return;
		}
		var contacts = JSON.parse(localStorage.getItem("f7Contacts"));
		if (!state.isNew) {
			_.remove(contacts, { id: contact.id });
		}
		contacts.push(contact);
		localStorage.setItem("f7Contacts", JSON.stringify(contacts));
		app.router.load('list'); // reRender main page view
		closePage();
	}

	function closePage() {
		if (!state.isNew) {
			app.router.load('contact', {id: contact.id});
		}
		else {
			app.mainView.loadPage('contact.html?id=' + contact.id, false);
		}
		app.f7.closeModal();
	}

	return {
		init: init
	};
});