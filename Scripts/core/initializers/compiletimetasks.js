CompileTime.Tasks.add("completion", function() {
	var classes = Class.implementors("BaseObject");
	if (classes != null) {
		for (var i = 0; i < classes.length; i++) {
			var classDef = Class.getClassDef(classes[i]);
			for (var k in classDef.prototype) {
				var member = classDef.prototype[k];
				if (Class.is(member,"Initialize")) {
					CompileTime.warn("In the declaration of " + classes[i] + " the field " + k + " looks incorrectly initialized - the initializer is not created properly.");
				}
			}
		}
	}
});
