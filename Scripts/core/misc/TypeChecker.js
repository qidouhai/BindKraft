/**
	A simple utility class for implementing pluggable type checks where needed.
*/
function TypeChecker(typecoditions) {
	BaseObject.apply(this,arguments);
	for (var i = 0; i < arguments.length; i++) {
		this.addCondition(arguments[i]);
	}
}
TypeChecker.Inherit(BaseObject,"TypeChecker");
TypeChecker.Implement(IValueChecker);
TypeChecker.prototype.addCondition = function(c) {
	var arg = c;
	var conditions = null;
	if (typeof arg == "string") {
		if (arg.charAt(0) == "!") {
			if (this.negative == null) this.negative = [];
			conditions = this.negative;
			arg = arg.slice(1);
		} else {
			if (this.positive== null) this.positive = [];
			conditions = this.positive;
		}
	} else if (typeof arg == "function") {
		arg = Class.getType(arg);
		if (arg != null) {
			arg = arg.classType;
			if (this.positive== null) this.positive = [];
			conditions = this.positive;
		}
	}
	if (arg != null && conditions != null) {
		var parts = arg.split(",");
		if (parts != null) {
			conditions.push(parts);
		}
	}
}
TypeChecker.prototype.clearConditions = function() {
	this.positive = [];
	this.negative = [];
}
TypeChecker.prototype.positive = null;
TypeChecker.prototype.negative = null;
TypeChecker.prototype.checkType = function(v) {
	var i,j;
	if (this.negative != null && this.negative.length > 0) {
		for (i = 0 ; i < this.negative.length; i++) {
			if (BaseObject.is(this.negative[i], "Array")) {
				for (j = 0; j < this.negative[i].length; j ++) {
					if (BaseObject.is(v,this.negative[i][j])) return false;
				}
			}
		}		
	}
	if (this.positive != null && this.positive.length > 0) {
		var ok = false;
		for (i = 0 ; i < this.positive.length; i++) {
			if (!ok) {
				if (BaseObject.is(this.positive[i], "Array")) {
					for (j = 0; j < this.positive[i].length; j ++) {
						if (!BaseObject.is(v,this.positive[i][j])) continue;
					}
					ok = true;
				}
			} else {
				break;
			}
		}
		if (!ok) return false;
	}
	return true;
}
// IValueChecker
TypeChecker.prototype.checkValue = TypeChecker.prototype.checkType;

// Helpers (avoid null checking)
TypeChecker.check = function(typechecker, v) {
	if (typechecker == null) {
		return true;
	} else if (typeof typechecker == "string" && BaseObject.is(v,typechecker)) {
		return true;
	} else if (BaseObject.is(typechecker, "TypeChecker")) {
		return typechecker.checkType(v);
	}
	return false;
}

// Built-in checkers
TypeChecker.ValueType = new TypeChecker("string", "number", "boolean", "undefined", "null", "bigint");
TypeChecker.BaseObject = new TypeChecker("BaseObject", "null");
TypeChecker.Object = new TypeChecker("!BaseObject", "object", "null", "!Date","!Array");
