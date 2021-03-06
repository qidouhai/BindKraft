


// This class shows an entry from a lookup with value id passed as value
/*CLASS*/
// USage: data-class="LookupStatic identification='key'" data-bind-$items=... data-bind-$value=...
// And a template inside is required. Data context for the template is the item with key equal to the value.
function LookupStatic() {
    ViewBase.apply(this, arguments);
    this.finditem = null;
}
LookupStatic.Inherit(ViewBase, "LookupStatic");
LookupStatic.prototype.$init = function() {
    // We need to cut the innerHTML and keep it as a template for displaying the item of data
    var el = $(this.root);
    if (this.get_itemTemplate() == null) {
        var em, it = this.child("itemtemplate");
        if (it != null && it.length > 0) {
            this.set_itemTemplate(it.clone().get(0));
            em = this.child("emptytemplate");
            if (em != null && em.length > 0) {
                this.set_emptyTemplate(em.clone().get(0));
            } else {
                this.set_emptyTemplate(null);
            }
        } else {
            this.set_itemTemplate(el.children().clone().get(0));
            this.set_emptyTemplate(null);
        }
        el.Empty();
    }
    this.init();
    this.initializedevent.invoke(this, null);
    this.rebind(); // Default behaviour, items controls should override this
};
LookupStatic.prototype.identification = null;
// identification cues for the items. The internal impl uses this as name of the id property
LookupStatic.prototype.$selectedIndex = -1;
LookupStatic.prototype.get_itemTemplate = function() {
    return this.root.jboundItemTemplate;
};
LookupStatic.prototype.set_itemTemplate = function(v) {
    this.root.jboundItemTemplate = v;
};
LookupStatic.prototype.get_emptyTemplate = function() {
    return this.root.jboundEmptyTemplate;
};
LookupStatic.prototype.set_emptyTemplate = function(v) {
    this.root.jboundEmptyTemplate = v;
};
LookupStatic.prototype.get_selectedindex = function() { return this.$selectedIndex; };
LookupStatic.prototype.set_selectedindex = function(v, bDontRaiseEvent) {
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    this.$selectedIndex = v;
    if (this.$selectedIndex == null || this.$selectedIndex < 0) {
        this.$selectedIndex = -1;
    } else if (this.$selectedIndex >= itmsCount) {
        this.$selectedIndex = -1;
    }
    this.$applySelection();
};
LookupStatic.prototype.get_selecteditem = function() {
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    if (this.$selectedIndex != null && this.$selectedIndex >= 0 && this.$selectedIndex < itmsCount) {
        return itms[this.$selectedIndex];
    }
    return null;
};
LookupStatic.prototype.set_selecteditem = function(v) {
    var itms = this.get_items();
    var itmsCount = (itms != null) ? itms.length : 0;
    if (itmsCount > 0) {
        this.set_selectedindex(this.$findItemIndex(v));
    }
};
LookupStatic.prototype.set_value = function(v) {
    var n = this.$findItem(v);
    this.set_selectedindex(n, true);
};
LookupStatic.prototype.get_value = function() {
    var itms = this.get_items();
    if (itms != null && itms.length > 0 && this.$selectedIndex >= 0 && this.$selectedIndex < itms.length) {
        var itm = itms[this.$selectedIndex];
        if (this.identification != null && this.identification.length > 0) {
            return itm[this.identification];
        } else {
            return itm;
        }
    }
    return null;
};
LookupStatic.prototype.$findItemIndex = function(idObj) { // by item
    if (this.identification != null && this.identification.length > 0) {
        return this.$findItem(idObj[this.identification]);
    } else {
        return this.$findItem(idObj);
    }
};
LookupStatic.prototype.$findItem = function(idData) { // By value
    var itms = this.get_items();
    if (itms != null) {
        if (this.finditem == null) {
            var i;
            if (this.identification != null && this.identification.length > 0) {
                for (i = 0; i < itms.length; i++) {
                    if (itms[i][this.identification] == idData) return i;
                }
            } else {
                for (i = 0; i < itms.length; i++) {
                    if (itms[i] == idData) return i;
                }
            }
            return -1;
        } else {
            if (BaseObject.is(this.finditem, "Delegate")) {
                return this.finditem.invoke(idData, itms);
            } else {
                return this.finditem.call(this, idData, itms);
            }
        }
    } else {
        return -1;
    }
};
LookupStatic.prototype.finditem = null;
// custom callback to find item by data proto: function (idData,items): int; returns the index of the element
LookupStatic.prototype.set_items = function(v) { // override to disallow objects and allow only arrays
    if (v == null || BaseObject.is(v, "Array")) {
        this.$items = v;
        this.$applySelection();
        return;
    }
    throw "LookupStatic: only arrays (lists) can be bound to the $items property";
};
LookupStatic.prototype.get_items = function() {
    return this.$items;
};
LookupStatic.prototype.$applySelection = function() {
    this.$createChildren();
    this.rebind();
    this.updateTargets();
};
LookupStatic.prototype.$createChildren = function() {
    var el = $(this.root);
    if (this.get_itemTemplate() == null) return;
    el.Empty();
    var itm = this.get_selecteditem();
    var o;
    if (itm != null) {
        o = ViewBase.cloneTemplate(el, this.get_itemTemplate(), itm);
        if (this.storeIndexIn != null && this.storeIndexIn.length > 0) {
            BaseObject.setProperty(item, this.storeIndexIn, this.get_selectedindex());
        }
    } else {
        if (this.get_emptyTemplate() != null) {
            o = ViewBase.cloneTemplate(el, this.get_emptyTemplate(), { });
        }
    }
};