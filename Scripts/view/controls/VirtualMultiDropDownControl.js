function VirtualMultiDropDownControl() {
	VirtualDropDownControl.apply(this, arguments);
}

VirtualMultiDropDownControl.Inherit(VirtualDropDownControl, "VirtualMultiDropDownControl");

VirtualMultiDropDownControl.Implement(ITemplateSourceImpl, new Defaults("templateName", "bindkraft/control-vmultidropdown"));
VirtualMultiDropDownControl.$defaults = {
	templateName: "bindkraft/control-vmultidropdown",
};

VirtualMultiDropDownControl.prototype.$init = function(){
	this.set_multiselect(true);
	
	VirtualDropDownControl.prototype.$init.apply(this, arguments);
}