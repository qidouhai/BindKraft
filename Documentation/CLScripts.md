# CL Scripts - Command Line Scripts

This feature covers a lot of ground and some parts are described in separate articles.

CL - the command line is a feature that allows strings containing special command statements to be executed inside the BindKRaft workspace/desktop in the browser. Do not mistake this with CLI features popular with a number of development tools - this is a client side feature that allows various tasks to be represented by simple commands to form something like a batch language used for a long list of purposes - from booting the BindKraft, to controlling test beds for unit and integration testing. 

The official name of the feature is `CL Script`.

The commands can be both global and app specific and can change their context including the available commands at each specific state in which the script enters during its execution - e.g. a CL script can start globally, then start apps or find a running instance of them, then enter them and run some of their specific commands and so on. The script provides a way to write command code that is several degrees shorter than the alternative Javascript would be in the scenarios where this is desired, like: testing, booting the workspace and customizing it on the run, starting apps and bringing them to a desired state (saved one, corresponding to an URL, leading the user in tutorials and many other cases). One of the most important benefits is that they hid the complexity of the asynchronous tasks in the code (network requests, long tasks, innate asynchronous actions and so on.) and the CL scripts very linear, short and simple to understand with a quick look. However, behind the scenes this all happens thanks to the commands implemented by a number of developers - those who maintain the framework, those who write apps with it etc. There will be always something more to be desired and some more ways to make things easy, so the CL scripts are extensible and not only as an extensible set of commands, but they can be even extended with some new constructs that enrich the CL language.