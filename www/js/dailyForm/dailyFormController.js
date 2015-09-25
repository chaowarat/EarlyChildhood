define(["app", "js/contactModel", "js/dailyForm/dailyFormView"], function (app, Contact, View) {

	var contact = null;
	var state = {
		isNew: false
	};
	var bindings = [{
		element: '.contact-delete-button',
		event: 'click',
		handler: deleteContact
	}];

	var questions = [];

	function init(query){
		var contacts = JSON.parse(localStorage.getItem("f7Contacts"));
		if (query && query.id) {
			contact = new Contact(_.find(contacts, { id: query.id }));
			state.isNew = false;
		}
		else {
			contact = new Contact({ isFavorite: query.isFavorite });
			state.isNew = true;
		}
		questions = getQuestion();
		View.render({ model: contact, bindings: bindings, state: state, doneCallback: saveContact, data: questions });
	}

	function getQuestion() {
	    var data = localStorage.getItem("templates");
	    var templates = data ? JSON.parse(data) : [];
	    var template = null;
	    for (var i = 0; i < templates.length; i++) {
	        if (templates[i].selected == true) {
	            template = templates[i];
	        }
	    }
	    if (template) {
	        return template.data;
	    }
	    else{
	        return null;
	    }
	}

	function deleteContact() {
		app.f7.actions([[{
			text: 'ยืนยันการลบ',
			red: true,
			onClick: function() {
				var contacts = JSON.parse(localStorage.getItem("f7Contacts"));
				_.remove(contacts, { id: contact.id });
				localStorage.setItem("f7Contacts", JSON.stringify(contacts));
				app.router.load('list'); // reRender main page view
				app.mainView.goBack("index.html", false);
				app.f7.closeModal();
			}
		}], [{
			text: 'ยกเลิก',
			bold: true
		}]]);
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