
/**
	@classdesc A window containing a collection of child windows, showing only one at a time. No full UI support is implemented in PageSetWindow, because it is intended
		to serve as base class for tab sets and alike.
	@class
*/
function PageSetWindow() {
    PanelWindow.apply(this, arguments);
    this.$cachedChildren = this.getDelegatedProperty("_cachedChildren", new Delegate(this, this.$filterVisibleChildren));
}
PageSetWindow.Inherit(PanelWindow, "PageSetWindow");
PageSetWindow.prototype.whenRemovedSelectPage = "next";
PageSetWindow.prototype.get_page = function (idx) { // Only visible pages
    var pages = this.get_pages();
    if (pages != null && idx >= 0 && idx < pages.length) return pages[idx];
    return null;
};
PageSetWindow.prototype.get_pageindex = function (page) {
    var pages = this.get_pages();
    if (!IsNull(pages)) {
        for (var i = 0; i < pages.length; i++) {
            if (pages[i] == page) {
                return i;
            }
        }
    }
    return -1;
};
PageSetWindow.prototype.$defaultWindowStyles = WindowStyleFlags.Default | WindowStyleFlags.adjustclient;
PageSetWindow.prototype.handleWindowEvent = function (evnt, currentResult) { // Override the handler procedure
    switch (evnt.type) {
        case PageSetEventEnum.notifyPageAdded:
        case PageSetEventEnum.notifyPageRemoved:
        case PageSetEventEnum.notifyPageSelected:
            this.$cachedChildren.clear();
            this.updateTargets();
            break;
    }
    return this.handleWindowEventDefault(evnt, currentResult);
};
PageSetWindow.prototype.on_ActivateChild = function (msg) {
    if (msg.target != this) {
        msg.handled = true;
    }
};
PageSetWindow.prototype.on_EnableWindow = function (msg) {
    if (msg.data != null && msg.data.enable != null) {
        var enabledPage = msg.target;
        if (!msg.data.enable) {
            var currentIndex = this.get_currentindex();
            var currentPage = this.get_childwindow(currentIndex);
            if (currentPage == msg.target) {
                // The disabled page is the current page, we need to deal with that and switch to another
                var newIndex = currentIndex;
                var pages = this.get_pages();
                if (currentIndex == pages.length - 1) {
                    newIndex = (pages.length > 0) ? 0 : currentIndex; // We keep the same index if there are other enabled pages after this one
                }
                this.set_currentindex(newIndex);
            }
        } else if (msg.data.enable) {
            if (this.$cachedChildren != null) this.$cachedChildren.clear();
            var pages = this.get_pages();
            var idx = pages.findElement(enabledPage);
            if (idx > 0 && idx < (pages.length - 1)) {
                idx++;
            }
            if (idx != null) {
                this.$currentindex = idx;
            }
        };
    }
	this.callAsync(this.updateTabs);
    //this.updateTabs();
};
PageSetWindow.prototype.updateTabs = function () {
    this.updateSources();
    this.updateTargets();
    return this;
};
PageSetWindow.prototype.on_ChildAdded = function (msg) {
    if (msg.data != null && msg.data.child != null) {
        msg.data.child.setWindowStyles(WindowStyleFlags.fillparent, "set");
        this.notifyParent(PageSetEventEnum.notifyPageAdded, { page: msg.data.child });
		this.callAsync(this.updateTabs);
    }
};
PageSetWindow.prototype.on_ChildRemoved = function (msg) {
    this.$cachedChildren.clear();
    var newIndex = this.get_currentindex();
    if (newIndex >= this.get_pages().length) {
        newIndex = this.get_pages().length - 1;
    }
    if (newIndex <= 0) newIndex = 0;
    this.set_currentindex(newIndex);
	this.notifyParent(PageSetEventEnum.notifyPageRemoved, { page: msg.data.child });
	this.callAsync(this.updateTabs);
}
/*
    @param {object|boolean} - null - nothing, true - activate, false noactive
*/
PageSetWindow.prototype.addPage = function (page,options) {
    var msgdata = { page: page };
    if (typeof options == "boolean") {
        if (options) {
            msgdata.active = true;
            msgdata.noactive = false;
        } else {
            msgdata.noactive = true;
            msgdata.active = false;
        }
    } else if (typeof options == "object") {
        msgdata = BaseObject.CombainObjects(msgdata, options);
    }
    WindowingMessage.fireOn(this, PageSetEventEnum.addPage, msgdata);
    return this;
};
PageSetWindow.prototype.removePage = function (page) {
    WindowingMessage.fireOn(this, PageSetEventEnum.removePage, { page: page });
    return this;
};
PageSetWindow.prototype.removeAllPages = function () {
	var pages = this.get_pages();
	if (pages != null) {	
		pages = Array.createCopyOf(pages);
		for (var i = 0; i < pages.length; i++) {
			var page = pages[i];
			if (page != null) {
				WindowingMessage.fireOn(this, PageSetEventEnum.removePage, { page: page });
			}
		}
	}
    return this;
};
/*
    msg.data {
        page - page to add (a window)
        active - (boolean) - activate on add
        noactive
    }
 */
PageSetWindow.prototype.on_addPage = function (msg) {
    if (msg.data != null && msg.data.page != null) {
        if (this.addChild(msg.data.page) === false) {
            // Add refused
        } else {
            // reorder children if necessary
            if (msg.index != null) {
                if (msg.index >= 0 && msg.index <= this.children.length) {
                    if (msg.index < this.children.length) {
                        var o = this.children[msg.index];
                        this.children[msg.index] = msg.page;
                        this.children[this.children.length] = o;
                    }
                }
            }
            if (!msg.data.noactive  && ((!BaseObject.getProperty(this, "createParameters.data.dontActivateAddedPages") && msg.data.active) || BaseObject.getProperty(this, "createParameters.data.activateAddedPages"))) {
                msg.data.page.set_enabledwindow(true);
                this.$cachedChildren.clear();
            }
            var pages = this.get_pages();
            if ( !msg.data.noactive  &&  ((!BaseObject.getProperty(this, "createParameters.data.dontActivateAddedPages") && msg.data.active) || BaseObject.getProperty(this, "createParameters.data.activateAddedPages") || pages.length == 1)) {
                WindowingMessage.fireOn(this, PageSetEventEnum.selectPage, { page: msg.data.page });
            } else {
                msg.data.page.setWindowStyles(WindowStyleFlags.visible, "reset"); // Just in case it is not hidden by default
            }
        }
        msg.handled = true;
    }
};
PageSetWindow.prototype.on_removePage = function (msg) {
    var page;
    if (msg.data != null && msg.data.page != null) {
        page = msg.data.page;
    } else if (msg.data != null && msg.data.index != null) {
        page = this.get_childwindow(msg.data.index);
    }
    if (page != null) {
        var newIndex = 0, oldIndex = this.get_currentindex();

        if (page == this.get_page(oldIndex)) {
            // We are removing the active page and we need to select a suitable page to show.
            var pages = this.get_pages();
            if (oldIndex == pages.length - 1) {
                newIndex = (pages.length > 0) ? 0 : oldIndex; // We keep the same index if there are other enabled pages after this one
            }
        }
        this.removeChild(page);
        this.set_currentindex(newIndex);
        //$(page.root).Empty();
    }
};
// Only the visible pages
PageSetWindow.prototype.$currentIndex = -1;
PageSetWindow.prototype.get_currentindex = function () {
    return this.$currentIndex;
};
PageSetWindow.prototype.set_currentindex = function (v) {
    WindowingMessage.fireOn(this, PageSetEventEnum.selectPage, { index: v });
};
PageSetWindow.prototype.get_selectedpage = function () {
    var i = this.get_currentindex();
    return this.get_page(i);
};
PageSetWindow.prototype.selectPage = function (page) {
    WindowingMessage.fireOn(this, PageSetEventEnum.selectPage, { page: page });
};
PageSetWindow.prototype.on_selectPage = function (msg) {
    var current = null, old = this.get_selectedpage(), newIndex = -1;
    var pages = this.get_pages();
    if (msg.data != null) {
        if (msg.data.page != null) {
            var i = pages.findElement(msg.data.page);
            if (i >= 0 && i < pages.length) {
                newIndex = i;
                if (newIndex == this.get_currentindex()) {
                    return;
                }
                current = msg.data.page;
            }
        } else if (msg.data.index != null) {
            var i = msg.data.index;
            if (i >= 0 && i < pages.length) {
                newIndex = i;
                if (newIndex == this.get_currentindex()) {
                    return;
                }
                current = pages[i];
            }
        }
    }
    if (newIndex >= 0 && newIndex < pages.length) { // A bit paranoid
        if (old != null) {
            // Ask with the pageset specific message if we can change the page
            var result = this.notifyChild(old, PageSetEventEnum.pageDeactivating, { page: old, index: this.$currentIndex, newPage: current, newIndex: newIndex });
            if (result === false) {
                return;
            }
            // Ask with the abstract deactivation notification if the current page permits the deactivation.
            result = this.notifyChild(old, WindowEventEnum.Deactivating, { window: old, reason: "pageset", newWindow: current });
            if (result === false) return;

            old.setWindowStyles(WindowStyleFlags.visible, "reset");
            this.notifyChild(old, PageSetEventEnum.pageDeactivated, { page: old, index: this.$currentIndex });
        }
        if (current != null) {
            current.setWindowStyles(WindowStyleFlags.visible | WindowStyleFlags.fillparent, "set");
            this.notifyChild(current, PageSetEventEnum.pageActivated, { page: current, index: newIndex });
        }
        this.$currentIndex = newIndex;
        this.notifyParent(PageSetEventEnum.notifyPageSelected, { page: current, oldpage: old, index: this.$currentIndex });
    }
};
PageSetWindow.prototype.deactivateCurrentTab = function(callback, syncSave) {
    this.notifyChild(this.get_selectedpage(), WindowEventEnum.Deactivating, { callback: callback, sync: syncSave });
};
PageSetWindow.prototype.$filterVisibleChildren = function () {
    if (!IsNull(this.children)) {
        return this.children.Select(function (idx, item) {
            if (item.get_enabledwindow != null && item.get_enabledwindow()) {
                return item;
            } else {
            }
        });
    }
    else {
        return null;
    }
};
PageSetWindow.prototype.get_pages = function () {
    if (this.$cachedChildren != null) return this.$cachedChildren.get();
    return null;
};
PageSetWindow.prototype.rearangePages = function (currentIndex, newIndex) {
    RearangeItems(this.children, currentIndex, newIndex);
    this.$cachedChildren.clear();
};
