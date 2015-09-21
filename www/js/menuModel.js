define(['app'],function(app) {

    function Menu(values) {
		values = values || {};
		this.id = values['id'] || app.utils.generateGUID();
		this.text = values['text'] || app.utils.getRandomInt(1, 10);
		this.value = values['value'] || app.utils.getRandomInt(1, 10);
    }

    Menu.prototype.setValues = function (inputValues) {
		for (var i = 0, len = inputValues.length; i < len; i++) {
			var item = inputValues[i];
			if (item.type === 'checkbox') {
				this[item.id] = item.checked;
			}
			else {
				this[item.id] = item.value;
			}
		}
	};

    Menu.prototype.validate = function () {
		var result = true;
		if (_.isEmpty(this.text) && _.isEmpty(this.value)) {
			result = false;
		}
		return result;
	};

    return Menu;
});