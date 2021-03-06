////////////// CompareNumbersValidatorRule /////////////////////////
function CompareNumbersValidatorRule(v) {
	ValidateValue.apply(this, arguments);
}
CompareNumbersValidatorRule.Inherit(ValidateValue, "CompareNumbersValidatorRule");
CompareNumbersValidatorRule.registerValidator("comparenumbers");
CompareNumbersValidatorRule.prototype.$valueToCompare = null;
CompareNumbersValidatorRule.prototype.get_message = function (lastValue) {
	var msg = this.get_text();
	if (IsNull(msg) || msg.length == 0) {
		msg = Binding.resources.get("Validation.Compare");
	}
	if (IsNull(msg) || msg.length == 0) {
		msg = "Input value must be equal to %l";
	}
	return msg.sprintf(this.get_valueToCompare());
};
CompareNumbersValidatorRule.prototype.get_valueToCompare = function () {
	return this.$valueToCompare;
};
CompareNumbersValidatorRule.prototype.set_valueToCompare = function (v) {
	this.$valueToCompare = v;
};
CompareNumbersValidatorRule.prototype.validateValue = function (validator, value, binding) {
	var result = ValidationResultEnum.correct;
	if (!IsNull(value) && value.toString().trim().length > 0) {
		var numericValue = parseFloat(value);
		var numericValueToCompare = parseFloat(this.get_valueToCompare());
		if (numericValue != numericValueToCompare) {
			result = ValidationResultEnum.incorrect;
		}
	}
	return this.validationResult(result);
};
var CompareNumbersValidatorControl = CompareNumbersValidatorRule;
//////////////////////END/////////////////////////////