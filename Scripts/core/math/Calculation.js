var Calculation = {
	Scale: function(param) {
		var result;
		if (typeof param == "string") {
			if (/[0-9]%/.test(param)) {
				var n = parseInt(param.slice(0,-1),10);
				if (!isNaN(n)) {
					return new PercentageCalculation(n);
				}
			}
		} else if (typeof param == "number") {
			return new TrivialCalculation(param);
		}
		return null;
	}
	
};