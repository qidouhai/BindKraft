


/*CLASS*/ /*QUERY*/
function ActionRuleQuery(ruleNames, purpose, scope, allownamereuse) {
    BaseObject.apply(this, arguments);
    if (ruleNames != null) {
        if (BaseObject.is(ruleNames,"Array")) {
            this.ruleNames.addElements(ruleNames); // Add all the rules
        } else {
            this.ruleNames.addElement(ruleNames);
        }
    } 
	this.allownamereuse = allownamereuse;
	this.scope = scope || "app";
}
ActionRuleQuery.Description("A query class for finding rule(s)")
    .Param("ruleNames", "A string or array of strings with the names of the rules to fetch")
    .Param("purpose", "The purpose of the ")
    .Param("scope", "The purpose of the ")
    .Param("allownamereuse", "If true the rule names will be left in the ruleNames array and searched throughout all the levels.");
    
ActionRuleQuery.Inherit(BaseObject,"ActionRuleQuery");
ActionRuleQuery.prototype.purpose = ActionRulePurposeEnum.unspecified;
ActionRuleQuery.prototype.ruleNames = new InitializeArray("Array of rule names to seek");
ActionRuleQuery.prototype.foundRuleNames = new InitializeArray("The names of the found rules will be copied/moved here. They can repeat unlike in the ruleNames.");

ActionRuleQuery.prototype.rules = new InitializeArray("Found rules"); // The found rules go here. Avoid using this directly.

ActionRuleQuery.prototype.$obtainRuleFromRegister = function(rulename, register) {
    var rule = register.getActionRule(rulename, this.purpose);
    if (rule != null) {
        if (this.allownamereuse !== true) { // move the name
            var n = this.ruleNames.removeElement(rulename);
            if (n != null) this.foundRuleNames.addElement(n);
        } else {
            this.foundRuleNames.addElement(rulename); // Just make sure the name is there at least once.
        }
        this.rules.addElement(rule);
        return true;
    }
    return false;
}
// Helper impl. Standard processing implemented inside the query. Call this in the onStructuralQuery method.
ActionRuleQuery.prototype.obtainRulesFromRegister = function(register) {
    var nrules = 0;
    if (BaseObject.is(register,"IActionRuleRegister")) {
        var names = Array.createCopyOf(this.ruleNames);
        for (var i = 0; i < names.length; i++) {
            if (this.$obtainRuleFromRegister(names[i],register)) {
                nrules ++;
            }
        }   
    }
    return nrules;
}.Description("Default implementation which works over a register implementing the PRuleRegister. You can call it in your query handler (usually onStructuralQuery) if nothing non-standard is needed.")
    .Param("register","Pass your 'this' here.")
    .Returns("Integer - the number of rules obtained. The rules are saved into the rules property");

//
ActionRuleQuery.prototype.shouldComplete = function(processor) {
	switch (this.scope) {
        case ActionRuleRegisterScopeEnum.window:
            if (BaseObject.is(processor,"BaseWindow")) {
                return true;
            }
        break;
        case ActionRuleRegisterScopeEnum.view:
            if (BaseObject.is(processor,"ITemplateRoot")) {
                return true;
            }
        break;
        case ActionRuleRegisterScopeEnum.first:
            return true;
        case ActionRuleRegisterScopeEnum.app:
        default:
            if (BaseObject.is(processor,"IApp")) return true;
	}
    return false;
}.Description("A routine each processor should call AFTER processing the query (no matter if successfuly or not). It implements scope checking and if it returns true the operation should be completed no matter if rule has been found or not.")
	.Returns("True if the operation should complete.");
