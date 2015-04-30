# ng-blocks

General purpose application blocks for Angular applications.  The blocks are mostly self-contained but may depend on each other.  
Refer to the module.js file or to the individual README files.

## Usage

Install a block by copying its folder under your application's source code.  Then, require the block in your module declaration, for example:

    angular.module('app', ['blocks.sdata']);
    
You can also include the whole blocks repository as a submodule in your project:
    
    git submodule add https://github.com/ngaller/ng-blocks.git blocks
    
See http://git-scm.com/book/en/v2/Git-Tools-Submodules for more information.

## Available blocks

### blocks.sdata

Simple sdata client service.  Sdata service provider needs to be configured first:

    module.config(function(sdataServiceProvider) {
        sdataServiceProvider.configure({sdataUri: 'http://localhost/sdata/slx/dynamic/-/'});
    });
    
Then sdata service needs to be logged in before calling the actual methods.  The bundled authenticationService may be used to get a better error reporting, or the sdataService 'setAuthenticationParameters' may be called directly, or the username and password may be passed at the same time the sdataUri is:

    sdataServiceProvider.configure({sdataUri: ..., username: 'admin', password: ''});


### blocks.dragdrop

"dd-draggable" and "dd-dropzone" directive allowing for dragging and dropping arbitrary item.

    <div dd-draggable="item"></div>
    <div dd-dropzone allow-drop="allowDrop(item)" on-drop="onDrop(item)"></div>