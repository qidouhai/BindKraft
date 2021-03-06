/**
	Translates (picks) the limit and offset from IParameters or object.
	
*/
function LimitOffsetParametersExtractor(conf) {
	BaseObject.apply(this, arguments);
	
	if (typeof conf == "object" && conf != null) {
		this.$limitName = conf.limitName;
		this.$offsetName = conf.offsetName;
	}
}
LimitOffsetParametersExtractor.Inherit(BaseObject, "LimitOffsetParametersExtractor");
LimitOffsetParametersExtractor.Implement(ITranslateParamersToLimitOffset);
LimitOffsetParametersExtractor.ImplementProperty("limitName", new InitializeStringParameter("Gets/sets the name of the limit parameter", "numrows"));
LimitOffsetParametersExtractor.ImplementProperty("offsetName", new InitializeStringParameter("Gets/sets the name of the offset parameter", "startrowindex"));
/**
	@parameters {IParameters|object}
	@returns	{ limit: <limit>,offset: <offset> }
*/
LimitOffsetParametersExtractor.prototype.PerformTranslation = function(/*IParameters*/ parameters) {
	var result = {};
	if (BaseObject.is(parameters, "IParameters")) {
		if (typeof this.$limitName == "string" && this.$limitName.length > 0) {
			result.limit = parameters.get_parameters(this.$limitName);
		}
		if (typeof this.$offsetName == "string" && this.$offsetName.length > 0) {
			result.offset = parameters.get_parameters(this.$offsetName);
		}
	} else if (typeof parameters == "object") {
		if (typeof this.$limitName == "string" && this.$limitName.length > 0) {
			result.limit = parameters[this.$limitName];
		}
		if (typeof this.$offsetName == "string" && this.$offsetName.length > 0) {
			result.offset = parameters[this.$offsetName];
		}
	} 
	
	if (result.limit != null && typeof result.limit != "number") result.limit = null;
	if (result.offset != null && typeof result.offset != "number") result.offset = null;
	
	return result;
}