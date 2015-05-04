(function () {
    'use strict';

    angular.module('blocks.dragdrop')
        .directive('ddDraggable', ddDraggable);

    // service declaration
    function ddDraggable(dragdropService) {
        return {
            restrict: 'EA',
            scope: {
                // identify item that represents the data being dragged
                draggedItem: '=ddDraggable'
            },
            link: function (scope, element) {
                element.attr('draggable', 'true');
                element.on('dragstart', function (e) {
                    var dt = e.originalEvent.dataTransfer;
                    dt.effectAllowed = 'move';
                    dragdropService.setDraggedItem(scope.draggedItem);
                    this.classList.add('drag');
                }).on('dragend', function (e) {
                    dragdropService.setDraggedItem(null);
                    this.classList.remove('drag');
                });
            }
        }
    }
})();
