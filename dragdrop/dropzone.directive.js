(function () {
    'use strict';

    angular.module('blocks.dragdrop')
        .directive('ddDropzone', ddDropzone);

    // define an item that users can drag stuff onto.
    function ddDropzone(dragdropService) {
        return {
            restrict: 'EA',
            scope: {
                // called with the dragged item to determine if the drop should be allowed.
                // return false to prevent it.
                // eg: allow-drop="allowDrop(item)"
                allowDrop: '&',
                // called with the dragged item when it is successfully dropped
                // eg: on-drop="onDrop(item)"
                onDrop: '&'
            },
            link: function(scope, element) {

                var dragCounter = 0;

                function allowDrop() {
                    if(scope.allowDrop){
                        return scope.allowDrop({item: dragdropService.getDraggedItem()});
                    }
                    return true;
                }

                element.on('dragover', function (e) {
                    var dt = e.originalEvent.dataTransfer;
                    if (!allowDrop()){
                        return;
                    }
                    e.preventDefault();
                    dt.dropEffect = 'move';
                    return false;
                }).on('dragenter', function (e) {
                    if (!allowDrop()) return;
                    dragCounter++;
                    if (dragCounter) {
                        this.classList.add('over');
                    }
                    return false;
                }).on('dragleave', function (e) {
                    if (!allowDrop()) return;
                    dragCounter--;
                    if (dragCounter <= 0) {
                        dragCounter = 0;
                        this.classList.remove('over');
                    }
                    return false;
                }).on('drop', function (e) {
                    e.stopPropagation();
                    this.classList.remove('over');

                    scope.onDrop({item: dragdropService.getDraggedItem()});
                });
            }
        }
    }
})();
