


/* This behaviour is automatically attached to DOM elements by bubble-direction implementation. 
*/	
/*BEHAVIOR*/
function NakedDOMFocusContainerHelperBehavior() {
	ElementBehaviorBase.apply(this, arguments);
	this.$FocusNotifyState = new StateTrailHelper(FocusNotifyEnum.lost, 1);
	this.$FocusDirectionState = new StateTrailHelper(FocusDirectionEnum.indeterminate, 1);
}
NakedDOMFocusContainerHelperBehavior.Inherit(ElementBehaviorBase, "NakedDOMFocusContainerHelperBehavior"); 
NakedDOMFocusContainerHelperBehavior.Implement(IFocusContainer);
NakedDOMFocusContainerHelperBehavior.behaviorPhase = BehaviorPhaseEnum.immediate;
NakedDOMFocusContainerHelperBehavior.prototype.useevent = null;
NakedDOMFocusContainerHelperBehavior.ImplementProperty("controller", new Initialize("The focus container which actually controls this element",null));
NakedDOMFocusContainerHelperBehavior.prototype.init = function (optional_phase) { 
  this.on("focusin",this.onFocus);
  this.on("focusout", this.onLostFocus);
  if (this.useevent == null) {
	this.capture("keyup", this.onKeyup);
  } else {
	  this.capture(this.useevent, this.onKeyup);
  }
}; 
NakedDOMFocusContainerHelperBehavior.prototype.FCHasFocus = function() {
	if (document.activeElement == this.$target) return true;
	return false;
}
NakedDOMFocusContainerHelperBehavior.prototype.FCSetFocus = function(direction) {
	// this.$hasFocus = true;
	//this.$FocusNotifyState.set(FocusNotifyEnum.received);
	this.$FocusDirectionState.set(direction);
	this.$target.focus(); // This causes onFocus indirectly
}
NakedDOMFocusContainerHelperBehavior.prototype.OnLoseFocus = function() {
	this.$FocusDirectionState.clear();
}
// Internal DOM event handler
NakedDOMFocusContainerHelperBehavior.prototype.onFocus = function (ev) { 
	this.FCNotifyCoordinator(FocusNotifyEnum.received, this.$FocusDirectionState.pull());
}; 
// Internal DOM event handler
NakedDOMFocusContainerHelperBehavior.prototype.onLostFocus = function (ev) { 
	this.FCNotifyCoordinator(FocusNotifyEnum.lost, this.$FocusDirectionState.pull());
};	
NakedDOMFocusContainerHelperBehavior.prototype.onKeyup = function(ev) {
	if (BaseObject.is(this.$controller,"IDOMFocusContainer")) {
		if (this.$controller.OnDOMFCKeyEvent(ev, this)) {
			e.preventDefault();
			e.stopPropagation();
		}
	}
}