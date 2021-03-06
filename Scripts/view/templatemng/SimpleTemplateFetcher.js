
/*CLASS*/
function SimpleTemplateFetcher(param) { 
	BaseObject.apply(this,arguments);
	this.$templatesource = param;
}
SimpleTemplateFetcher.Inherit(BaseObject, "SimpleTemplateFetcher");
SimpleTemplateFetcher.Implement(ITemplateFetcher);
SimpleTemplateFetcher.prototype.$templatesource = null;
// Set your custom extractor if you expect
SimpleTemplateFetcher.prototype.templateExtractorCallback = null;
SimpleTemplateFetcher.prototype.$templateExtractorCallback = function(data, method) {
	if (typeof this.templateExtractorCallback == "function") {
		return this.templateExtractorCallback(data, method);
	} else {
		return data;
	}
}
SimpleTemplateFetcher.prototype.fetchTemplate = function(callback) {
	if (BaseObject.is(this.$templatesource, "Connector")) {
		this.$templatesource.bind(function (resource,err) {
			if (resource = null && err === false) {
				BaseObject.callCallback(callback, null);
			} else {
				BaseObject.callCallback(callback, this.$templateExtractorCallback(resource,"Connector"));
			}
		});
	} else if (BaseObject.is(this.$templatesource,"string")) {
		var re = /^(selector|text|key)\:/gi;
		var r = re.exec(this.$templatesource);
		var s = null;
		var pos = -1;
		if (r != null && r.length > 1) {
			pos = re.lastIndex;
			if (r[1] == "selector") {
				s = this.$templatesource.substring(pos);
				s = $(s);
				if (s.length > 0) {
					s = s.children().clone().get(0);
				} else {
					s = null;
				}
			} else if (r[1] == "text") {
				s = this.$templatesource.substring(pos);
			} else if (r[1] == "key") {
				throw "not supported yet";
			} else {
				throw "Cannot understand how to treat this string";
			}
			BaseObject.callCallback(callback, this.$templateExtractorCallback(s,r[1]));
		} else {
			throw "When you use a string, you have to specify what the templatesource means: selector|text|key.";
		}
	}
}
	