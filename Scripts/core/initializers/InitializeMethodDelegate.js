/*
	Usage:
		MyClass.prototype.mydelegate = new InitializeMethodDelegate("A delegato for handling some events","MyDlegateImplmentation");
		MyClass.prototype.MyDlegateImplmentation = function() { .... implementation ...... }
*/
/*CLASS*/
function InitializeMethodDelegate(desc, defval) {
    Initialize.apply(this, arguments);
    this.type = "MethodDelegate";
	this.active = true;
};
InitializeMethodDelegate.Inherit(Initialize, "InitializeMethodDelegate");
InitializeMethodDelegate.prototype.produceDefaultValue = function (obj) {
    if (this.dontInitialize()) return null;
	var def = Defaults.getValue(this, this.defaultValue);
    if (def != null) return new Delegate(obj, def);
    return null;
};
InitializeMethodDelegate.prototype.defValueDescription = function () {
    return {
        value: "",
        type: ((this.defaultValue != null) ? "(method)" : "")
    };
};