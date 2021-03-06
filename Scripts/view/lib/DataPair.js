


/* Used for data packing whenever an item must know the key or index under which it sits in its parent and/or needs to perform actions
    on the parent.
*/
/*CLASS*/

function DataPair(obj, propname) {
    BaseObject.apply(this, arguments);
    this.data = obj;
    this.prop = propname;
}

DataPair.Inherit(BaseObject, "DataPair");
DataPair.Implement(IDataStateManager);
DataPair.prototype.get_DataItemState = function() {
    return this.data[Binding.entityStatePropertyName];
};
DataPair.prototype.set_DataItemState = function(v) {
    if (v == DataStateEnum.Delete) {
        this.data[Binding.entityOldStatePropertyName] = this.get_DataItemState();
    }
    if (v == DataStateEnum.Undelete && this.get_DataItemState() == DataStateEnum.Delete) {
        this.data[Binding.entityStatePropertyName] = this.data[Binding.entityOldStatePropertyName];
    } else {
        this.data[Binding.entityStatePropertyName] = v;
    }
};
DataPair.prototype.get_value = function() {
    return this.data[this.prop];
};
DataPair.prototype.set_value = function(v) {
    this.data[this.prop] = v;
};
DataPair.prototype.get_key = function() {
    return this.prop;
};
DataPair.prototype.get_parent = function() {
    return this.data;
};
DataPair.prototype.remove = function() {
    if (BaseObject.is(this.data, "Array")) {
        this.data.splice(this.prop, 1);
    } else {
        delete this.data[this.prop];
    }

};