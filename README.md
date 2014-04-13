ebankomaty
=========

polish Euronet service ATM finder

Refactoring of existing web application used for finding Polish Euronet ATMs
* "http://apps.karpicki.com/ebankomaty"

Application can be extended to be used with different web services (example: German CashGroup ATM finder)
* "http://apps.karpicki.com/cashgroup"

To use application with own service go to application.js.php and replace current data file with own copy that will
 implement the same interface

buil.sh script

1.parameters:

* template_name.html (optional)
    Template file can be delivered via param (if param does not exist index.hml used by default)
    Note: Template require to have sections and nav defined as in example

* folder_target (optional)
    Optional name of generated folder with built application. By default script will generate "current-folder-name_target"

2. usage

./build.sh index2.hml my-target-folder
./build.sh index2.html
./build.sh

3. what does it do?

Script will find "application.js.php" file which includes all javascript files (concatenated via php on dev env)
concatenate and minify using google closure compiler and generate "application.min.js".
Having that it will replace using of original file in main template with new one.

Backlog:

* Plan to add yahoo ui compressor to minify css file
* make customized build cleaner because currently we need:
- call script with template param
- change init.js
- change application.js.php (messages, dataUtil)


