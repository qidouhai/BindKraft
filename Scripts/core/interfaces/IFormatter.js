function IFormatter() {}
IFormatter.Interface("IFormatter");
IFormatter.prototype.ToTarget = function(val, bind, args) { throw "not implemented"; }
IFormatter.prototype.FromTarget = function(val, bind, args) { throw "not implemented"; }