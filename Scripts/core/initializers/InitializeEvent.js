
/*CLASS*/
function InitializeEvent(desc, defval) {
    Initialize.apply(this, arguments);
    this.type = "Event";
	this.active = true;
    if (defval == null) this.defaultValue = "EventDispatcher";
};
InitializeEvent.Inherit(Initialize, "InitializeEvent");
InitializeEvent.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    if (def != null) {
		var defActual = def;
		if (typeof def == "string") {
			defActual = Class.getClassDef(def);
		}
		return new defActual(obj);
	}
    return null;
};
InitializeEvent.prototype.Arguments = function() {
	var args = Array.createCopyOf(arguments);
	this.$argumentTypes = args; // Verified when used (To support forward declarations we cannot verify them here)
	return this;
};
InitializeEvent.prototype.defValueDescription = function () {
    return {
        value: "",
        type: ((this.defaultValue != null) ? Class.fullClassType(this.defaultValue) : "")
    };
};