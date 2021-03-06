


/*CLASS*/
function DisapearingLabel() {
    Base.apply(this, arguments);
    $(this.root).hide();
}
DisapearingLabel.Inherit(Base,"DisapearingLabel");
DisapearingLabel.prototype.timeout = new InitializeNumericParameter("Timeout for the message in seconds (Default is 3)",3);
DisapearingLabel.prototype.$msg = null;
DisapearingLabel.prototype.set_message = function(v) {
    this.$msg = v;
    this.showMessage();
};
DisapearingLabel.prototype.get_message = function(v) {
    return this.$msg;
};
DisapearingLabel.prototype.showMessage = function() {
    this.$timeShown = 0;
    $(this.root).text(this.get_message()).show();
    DelayedTargetedMessage.callMeLater(this, this.timeout * 1000, this.hideMessage, null);
};
DisapearingLabel.prototype.hideMessage = function(msg) {
    $(this.root).hide("slow").text("");
};