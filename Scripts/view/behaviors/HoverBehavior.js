


// Hover behavour
function HoverBehavior(node, phase) {
    ElementBehaviorBase.apply(this, arguments);
}
HoverBehavior.Inherit(ElementBehaviorBase, "HoverBehavior");
HoverBehavior.bindBehavior = function (node, behParams, phase) {
    if (phase == BehaviorPhaseEnum.bind) {
        var beh = new HoverBehavior(node, phase);
        JBUtil.parametrize.call(beh, node, null, behParams); // JBUtil.parametrize.call(beh, behParams);
        beh.init();
		return beh;
    }
	return null;
};
HoverBehavior.ImplementProperty("showelements", new InitializeStringParameter("data-key expression(s) of the elements to show on hover", null));
HoverBehavior.ImplementProperty("hideelements", new InitializeStringParameter("data-key expression(s) of the elements to hide on hover", null));
HoverBehavior.prototype.init = function () {
    var el = $(this.$target);
    var t = this;
    if (this.hover) {
        el.mouseenter(function (e) {
            t.onActive(this, e);
        });
        el.mouseleave(function (e) {
            t.onInactive(this, e);
        });
        el.focus(function (e) {
            t.onActive(this, e);
        });
        el.focusout(function (e) {
            t.onInactive(this, e);
        });
        el.blur(function (e) {
            t.onInactive(this, e);
        });
    }
};
HoverBehavior.prototype.onActive = function (el, evnt) {
    var els, patt;
    patt = this.get_showelements();
    if (patt != null && patt.length > 0) {
        els = JBUtil.getRelatedElements(this.$target, patt);
        if (els != null) els.show();
    }
    patt = this.get_hideelements();
    if (patt != null && patt.length > 0) {
        els = JBUtil.getRelatedElements(this.$target, patt);
        if (els != null) els.hide();
    }
}
HoverBehavior.prototype.onInactive = function (el, evnt) {
    var els, patt;
    patt = this.get_showelements();
    if (patt != null && patt.length > 0) {
        els = JBUtil.getRelatedElements(this.$target, patt);
        if (els != null) els.hide();
    }
    patt = this.get_hideelements();
    if (patt != null && patt.length > 0) {
        els = JBUtil.getRelatedElements(this.$target, patt);
        if (els != null) els.show();
    }
}
