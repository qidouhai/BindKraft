


/*CLASS*/
function TrivialElement() {
    Base.apply(this, arguments);
}
TrivialElement.Inherit(Base, "TrivialElement");
TrivialElement.Implement(IProcessAcceleratorsImpl);
TrivialElement.ImplementProperty("detectenter", new InitializeBooleanParameter("Monitor keyboard and detect pressing enter. If set $enterevent is fired whnever enter key is pressed.",false));
TrivialElement.prototype.enterevent = new InitializeEvent("Fired when enter is pressed, but only if detectenter parameter is set");
TrivialElement.prototype.valchangedevent = new InitializeEvent("Fired when the $val property changes");
TrivialElement.ExtendMethod("init", function() {
	if (this.get_detectenter()) {
		this.registerAccelerator ({
			"name" : "enter",
			"character" : "enter",
			"callback" : new Delegate(this, this.internalOnEnterClicked)
		});
	}
	this.on("keyup", this.fireValChanged);
});
TrivialElement.prototype.fireValChanged = function(e) {
	if (this.get_val() != this.$lastval) {
		this.valchangedevent.invoke(this,{ oldval: this.$lastval, newval: this.get_val()});
		this.$lastval = this.get_val();
		
	}
}
TrivialElement.prototype.$lastval = null;
TrivialElement.prototype.internalOnEnterClicked = function() {
	return this.OnEnterClicked.apply(this, arguments);
}
TrivialElement.prototype.OnEnterClicked = function() {
	this.enterevent.invoke(this, null);
}
TrivialElement.prototype.get_val = function () {
    return this.root.value;
};
TrivialElement.prototype.set_val = function (v) {
	var oldval = this.root.value;
    this.root.value = v;
	if (oldval != v) this.valchangedevent.invoke(this,{ oldval: oldval, newval: v});
};
TrivialElement.prototype.get_text = function () {
    return $(this.root).text();
};
TrivialElement.prototype.set_text = function (v) {
    $(this.root).text(v);
};