


/*CLASS*/
function ConnectorHelperPrimaryKey() {
    ConnectorHelperBase.apply(this,arguments);
}
ConnectorHelperPrimaryKey.Inherit(ConnectorHelperBase,"ConnectorHelperPrimaryKey");
ConnectorHelperPaging.Implement(IConnectorPrimaryKeyHelper);
ConnectorHelperPrimaryKey.prototype.get_primaryKeyParameterName = function() {
    return this.configuration.primarykey;
}
ConnectorHelperPrimaryKey.prototype.get_primaryKeyValue = function() {
    return this.connector.get_parameters(this.get_primaryKeyParameterName());
}
ConnectorHelperPrimaryKey.prototype.set_primaryKeyValue = function(v) {
    this.connector.set_parameters(this.get_primaryKeyParameterName(),v);
}