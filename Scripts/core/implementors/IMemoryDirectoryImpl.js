/**
	The standard implementation all file-like acting stuff has to implement
*/
function IMemoryDirectoryImpl() {
	this.set_filedatemodified();
}
IMemoryDirectoryImpl.InterfaceImpl(IMemoryDirectory);
IMemoryDirectoryImpl.Initialize();
// Last time canged or saved to the memory location
IMemoryDirectoryImpl.prototype.$filedatemodified = null;
IMemoryDirectoryImpl.prototype.get_filedatemodified = IMemoryFileImpl.prototype.get_filedatemodified;
IMemoryDirectoryImpl.prototype.set_filedatemodified = IMemoryFileImpl.prototype.set_filedatemodified;
// The original content creation date (optional)
IMemoryDirectoryImpl.prototype.$filedatecreated = null;
IMemoryDirectoryImpl.prototype.get_filedatecreated = IMemoryFileImpl.prototype.get_filedatecreated;
IMemoryDirectoryImpl.prototype.set_filedatecreated = IMemoryFileImpl.prototype.set_filedatecreated;
IMemoryDirectoryImpl.prototype.touch = IMemoryFileImpl.prototype.touch;
IMemoryDirectoryImpl.prototype.$memfileflags = 0;
IMemoryDirectoryImpl.prototype.setMemFileFlags = IMemoryFileImpl.prototype.setMemFileFlags;
IMemoryDirectoryImpl.prototype.resetMemFileFlags = IMemoryFileImpl.prototype.resetMemFileFlags
IMemoryDirectoryImpl.prototype.getMemFileFlags = IMemoryFileImpl.prototype.getMemFileFlags
IMemoryDirectoryImpl.prototype.checkMemFileFlags = IMemoryFileImpl.prototype.checkMemFileFlags



