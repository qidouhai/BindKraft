


/*CLASS*/
function SimpleInfoDisplay() {
    Base.apply(this, arguments);
}
SimpleInfoDisplay.Inherit(Base, "SimpleInfoDisplay");
SimpleInfoDisplay.Implement(IUIControl);
SimpleInfoDisplay.Implement(IInfoDisplayPanelImpl);
SimpleInfoDisplay.prototype.onShowHidePanel = function (e, dc, binding, bparam) {
};
SimpleInfoDisplay.prototype.TypeColor = {
    ToTarget: function (v) {
        switch (v) {
            case "error":
                return "#D0C0C0";
                break;
            case "warning":
                return "#D0D0C0";
                break;
            case "info":
                return "#C0C0D0";
                break;
            default:
                return "#C0C0C0";
                break;

        }
    }
};