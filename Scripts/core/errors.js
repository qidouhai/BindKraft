var _Errors = {
	compose: function(success,facility,facility_args) {
		var code = this.$facilityCompose.apply(this,Array.createCopyOf(arguments,1));
		return (code | (success?GeneralCodesFlags.Ok:GeneralCodesFlags.Failure));
	},
	success: function(facility, facility_args) {
		return this.compose.apply(this, [true].append(arguments));
	},
	general: function(_kind, code) {
		var kind = GeneralCodesFlags.General;
		switch (_kind) {
			case "notfound":
			case "nf":
				kind = GeneralCodesFlags.NotFound;
			break;
			case "notallowed":
			case "na":
				kind = GeneralCodesFlags.NotAllowed;
			break;
			case "argument":
			case "a":
			case "arg":
				kind = GeneralCodesFlags.Argument;
			break;
			case "notavailable":
			case "notavail":
				kind = GeneralCodesFlags.NotAvailable;
			break;
			case "pending":
			case "p":
				kind = GeneralCodesFlags.Pending;
			break;
			case "access":
			case "ad":
			case "accessdenied":
				kind = GeneralCodesFlags.AccessDenied;
			break;
			case "format":
			case "type":
			case "f":
			case "t":
				kind = GeneralCodesFlags.Format;
			break;
		}
		return this.compose.call(this, false, 1, kind, code);
	},
	$facilityCompose: function(facility, args) {
		var _facility = 1;
		if (typeof facility == "number") _facility = facility;
		var fn = "f"+_facility;
		if (typeof this.facility[fn] == "function") {
			return this.facility[fn].apply(this, Array.createCopyOf(arguments,1));
		} else {
			return this.facility["f1"].apply(this, Array.createCopyOf(arguments,1));
		}
	},
	facility: {
		"f1": function(kind, code) {
			return (kind & GeneralCodesFlags.Kind_Mask) | (code & GeneralCodesFlags.Code_Mask) | GeneralCodesFlags.Facility_General;
		}
	}
};