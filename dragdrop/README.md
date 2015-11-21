"dd-draggable" and "dd-dropzone" directive allowing for dragging and dropping arbitrary item.

## Usage

Define a `draggable` item.  The item bound to the draggable property will be used as data transfer object.

      <div dd-draggable="item"></div>
      
Draggable items can be picked up and dropped onto a `dropzone` item.  Define the dropzone and implement methods to handle
allow-drop and on-drop.  They will be passed an instance of the item that was bound to the `dd-draggable` property of the draggable
item.

      <div dd-dropzone allow-drop="allowDrop(item)" on-drop="onDrop(item)"></div>
