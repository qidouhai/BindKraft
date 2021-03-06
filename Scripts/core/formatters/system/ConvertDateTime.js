function ConvertDateTime() {
	SystemFormatterBase.apply(this,arguments);
	if (typeof System.Default().settings.DefaultTransferDateEncoding == "string") {
		// This setting is put deep into system settings and not as defaults of this
		// class because it matters in more general sense (to other code as well)
		this.set_defaultencoding(System.Default().settings.DefaultTransferDateEncoding); 
	}
}
ConvertDateTime.Inherit(SystemFormatterBase,"ConvertDateTime");
ConvertDateTime.Implement(IArgumentListParserStdImpl,"trim");
ConvertDateTime.ImplementProperty("defaultencoding", new InitializeStringParameter("The default format if nothing is specified", "ISO"));
ConvertDateTime.$reMS = /\/Date\(([+-]?\d+)\)\//i;
ConvertDateTime.prototype.ToDate = {
	ISO: function(val) {
		// Limitator - intentionally limiting the syntax  to the one widely agreed upon.
		if (typeof val == "string" && /^\d{4}-\d{1,2}-\d{1,2}T\d{1,2}:\d{1,2}:\d{1,2}(?:\.\d+)?Z$/.test(val)) {
			return new Date(val);
		}
		return null;
	},
	MS: function(val) {
		if (typeof val == "string") {
			var matches = ConvertDateTime.$reMS.exec(val);	
			if (matches != null) {
				var ms = parseInt(matches[1], 10);
				if (!isNaN(ms)) {
					return new Date(ms);
				}
			}
		}
		return null;
	}
};
ConvertDateTime.prototype.FromDate = {
	ISO: function(val) {
		return val.toISOString();
	},
	MS: function(val) {
		return "\\/Date(" + val.getTime().toString() + ")\\/";
	}
	
};
ConvertDateTime.prototype.Read = function(val, bind, params) {
	if (BaseObject.is(val, "Date")) return val; // already date - pass through
	var conv = this.ToDate[this.get_defaultencoding()];
	if (typeof params == "string" && params.length > 0) {
		conv = this.ToDate[params];
	}
	if (typeof conv == "function") {
		return conv(val);
	}
	return null;
}
ConvertDateTime.prototype.Write = function(val, bind, params) {
	if (BaseObject.is(val,"Date")) {
		var conv = this.FromDate[this.get_defaultencoding()];
		if (typeof params == "string" && params.length > 0) {
			conv = this.FromDate[params];
		}
		if (typeof conv == "function") {
			return conv(val);
		}
		throw "ConvertDateTime cannot convert the date to raw transfer value - the conversion specified is not available";
	}
	return val;
}