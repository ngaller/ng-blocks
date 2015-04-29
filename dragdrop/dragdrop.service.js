(function () {
    'use strict';

    angular.module('blocks.dragdrop')
        .factory('dragdropService', dragdropService);

    // internal service used to share the drag/drop item
    function dragdropService() {
        var service = {
            setDraggedItem: setDraggedItem,
            getDraggedItem: getDraggedItem
        };
        var _draggedItem = null;

        return service;

        //////// Implementation

        function setDraggedItem(data){
            _draggedItem = data;
        }

        function getDraggedItem(){
            return _draggedItem;
        }
    }
})();
