


// Workspace (the desktop) features are defined by this Interface
function IWorkspaceWindow() {
}
IWorkspaceWindow.Interface("IWorkspaceWindow");
IWorkspaceWindow.prototype.get_toplevelwindows = function() {
	var w = this.get_children();
	if (BaseObject.is(w, "Array")) {
		return w.Select(function(idx, item) {
			var styles = item.getWindowStyles();
			if ( (styles & WindowStyleFlags.popup == 0) &&
				 (styles & WindowStyleFlags.visible != 0)) {
				 return item;
			}
			return null;
		});
	} else {
		return w;
	}
}
IWorkspaceWindow.prototype.popups = new InitializeArray("All popups in this workspace");
IWorkspaceWindow.prototype.$addPopup = function(wnd) {
	if (this.popups.addElement(wnd)) {
		// The window is not yet there
		var client = this.get_clientcontainer(this.$clientSlot);
		var child = wnd.get_windowelement();
		if (client != null && child != null) {
			if (!wnd.$isAttachedToDom()) $(client).append(child);
		}
	}
}
IWorkspaceWindow.prototype.$removePopup = function(wnd) {
	if (this.popups.removeElements(wnd) != null) {
		if (wnd.root != null) $(wnd.root).detach();
	}
}
IWorkspaceWindow.prototype.$isRegisteredAsPopup = function(wnd) {
	if (this.popups.findElement(wnd) >= 0) return true;
	return false;
}