function CLGlobalCmdHelper(reg) {
	BaseObject.apply(this,arguments);
	this.reg = reg;
}
CLGlobalCmdHelper.Inherit(BaseObject,"CLGlobalCmdHelper");
CLGlobalCmdHelper.prototype.register = function(cmdname, action, help) {
	this.reg.register(cmdname, null, null, action, help);
}
CLGlobalCmdHelper.prototype.registerPattern = function(cmdname, pattern, action, help) {
	this.reg.register(cmdname, null, pattern, action, help);
}
CLGlobalCmdHelper.prototype.exists = function(cmdname) {
	return this.reg.exists(cmdname);
}