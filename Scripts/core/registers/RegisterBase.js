// DEPRECATED - kept temporarily for compatibility reasons
// Please derive directly from IRegister, because the actual behavior needed in Registers proved to be too varying for this base class

function RegisterBase(registername) {
    this.$registername = registername;
    BaseObject.apply(this, arguments);
};

RegisterBase.Inherit(BaseObject, "RegisterBase");
RegisterBase.Implement(IRegister);


RegisterBase.ImplementReadProperty("registername", new InitializeStringParameter("The name of the register.", null));
RegisterBase.ImplementActiveProperty("collection", new InitializeObject("The collection of key-item pairs."));
RegisterBase.prototype.get_registername = function () { return this.$registername; };

RegisterBase.isRegisterKeyValid = function (key) {
    if (!(typeof key == "string")) return false;
    if (key.length == 0) return false;
    return true; //allowed symbols: [a-zA-Z0-9._-#@%&$]
};

RegisterBase.prototype.loadFromAjaxJson = function (url, callback) {

    if (!BaseObject.is(url, "string")) throw "The url argument must be a string!"
    this.ajaxGetJson(url, null, function (result) {
        //if(!BaseObject.is(result, "object")) throw "Incorrect data received from AJAX Json source!"
        this.$collection = result;
        BaseObject.callCallback(callback);
    });
};

RegisterBase.trimRegisterKey = function (key) {
    if (!RegisterBase.isRegisterKeyValid(key)) throw "The key argument is invalid!";
    key = key.trim().replace("\\", "/");
    var $left = true, $right = true;
    while ($left || $right) {
        if (key[0] != "/") $left = false;
        if (key[key.length - 1] != "/") $right = false;
        if ($left) key = key.slice(1);
        if ($right) key = key.slice(0, -1);
    }

    return key;
};

// "/keyA/keyAA/keyAAA" => ["keyA", "keyAA", "keyAAA"]
// "/keyA/keyAA/keyAAA/" => ["keyA", "keyAA", "keyAAA"]
// "keyA/keyAA/keyAAA/" => ["keyA", "keyAA", "keyAAA"]
// "/keyA" => ["keyA"]
// "keyA/" => ["keyA"]
RegisterBase.splitRegisterKey = function (key) {
    var regsIntm = RegisterBase.trimRegisterKey(key);
    var regs = regsIntm.split("/");
    for (var i = 0; i < regs.length; i++) {
        if (!RegisterBase.isRegisterKeyValid(regs[i])) {
            return [];
        }
    }
    return regs;
};

RegisterBase.combineRegisterKeys = function () {
    var registerKeyParts = [];
    for (var i = 0; i < arguments.length; i++) {
        var currRegs = RegisterBase.splitRegisterKey(arguments[i]);
        registerKeyParts.push.apply(registerKeyParts, currRegs);
    }

    var jnt = registerKeyParts.join("/");
    return jnt;
};

RegisterBase.prototype.$locateRegisterCollection = function (key) {
    var ref = this.$collection;
    var keys = RegisterBase.splitRegisterKey(key);

    for (var k = 0, len = keys.length; k < len; k += 1) {
        var key_ = keys[k];
        ref = ((typeof ref == "object") && ref[key_] != undefined) ? ref[key_] : null;
        if (ref == null) { return null; }
        if (!(typeof ref == "object")) throw "Only key-item collections can be queried!";
    }

    return ref;
};

RegisterBase.prototype.$execWithParsedKey = function (key, func) {
    var keyss = RegisterBase.splitRegisterKey(key);
    if (keyss.length == 0) throw "Incorrect item key!"
    var lkey = keyss.pop();

    var prnt_key = RegisterBase.combineRegisterKeys.apply(RegisterBase, keyss);
    var prnt = this.$locateRegisterCollection(prnt_key);
    if (prnt == null) throw "The \"" + prnt_key + "\" key-value collection does not exist.";

    return func(prnt, prnt_key, lkey);
};

RegisterBase.prototype.register = function (key, item) {
    this.$execWithParsedKey(key, function (prnt, prnt_key, lkey) {
        if (prnt.hasOwnProperty(lkey)) throw "The \"" + prnt_key + "\" key-value collection already contains an item with the key \"" + lkey + "\"!";
        prnt[lkey] = item;
    });
};

RegisterBase.prototype.unregister = function (key) {
    this.$execWithParsedKey(key, function (prnt, prnt_key, lkey) {
        if (prnt.hasOwnProperty(lkey)) delete prnt[lkey];
    });
};

RegisterBase.prototype.item = function (key, aspect) {
    return this.$execWithParsedKey(key, function (prnt, prnt_key, lkey) {
        return prnt[lkey];
    });
};

RegisterBase.prototype.exists = function (key) {
    return this.$execWithParsedKey(key, function (prnt, prnt_key, lkey) {
        return (prnt.hasOwnProperty(lkey));
    });
};