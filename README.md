# DOM-MANIA
#### A simple and light weight JS DOM-Manipulation library that .
a sample app created with this library:
https://utilities.alikifah.cyou/Home/Calculator

### Basic DOM-Manibulation functions: 
  

#### getting elements: 

* get(id);

Discription: this function returns an element by passing its id as a parameter( a shortcut for typing document.getElementById(id) ).

* getSubChildren( parent ,tag);

Discription: a recursive function to get all subchildren or just elements of a specific type.

Parameters:

parent: element you want to get its subchildren 

tag: the tag of the wanted subchildren, when left empty, all subchildren will be retrieved

example:
```js
// get an array that contains all buttons on the page
let elements = getSubChildren(document.body,'button');
```
 
 
#### adding elements to the Page 

  
* add(tag, parent , id , classes , text , onClick) 

Discription: adds a new Dom-Element  

parameters: 

tag name(like: 'div', 'button', 'label', 'input' .... etc.) 

parent element (id or a reference to the actual element). when left empty, the body will be added as a parent for the generated element. 

id: if not entered, a unique id will be generated for the new element. 

classes: css classes to be added to the element ( multiple classes are seperated by a white space) 

text:  text contetnt to be added to the created element 

onClick: event to be trigered when clicking on the element 


* insertAfter (tag, referenceNodeToAddAfter, id , classes , text, onClick) 


* insertBefore(tag, referenceNodeToAddBeforeid , classes , text, onClick) 

  
  

#### removing elements from the DOM: 

  
* remove(obj) 

Description: removes single or multiple DOM elements.

parameters:

obj: array of elements, reference to an element or just its id. 

  


#### adding or removing css classes 

addClass(obj, className) 

removeClass(obj, className) 

hasClass(obj, className) 

  

### Table Manipulation 

 

#### adding table 

  
* addTableEmpty(columnCount, rowCount, parent, id , tableClasses , onCellClick ) 

* addTableEmptyHeaderless(columnCount, rowCount, parent, id , tableClasses , onCellClick) 
  

Discription: create empty tables with or without header to be filled manually. 

  

* addTable(obj , parent, id , tableClasses , onCellClick) 

Discription: create tables that are filled automatically with json or json array. 

obj: json or json array to be used as a template for the table. the table will be created and filled automatically with this object. This function can be very handy when retrieving data from a remote API.

Example of creating a table and filling it with data from a local json array:
```js
let obj =[
  { 'name':'Martin', 'Age':30 , 'email':'Martin.1988@gmail.com'  },
  { 'name':'Michael', 'Age':20 , 'email':'Michael.x@gmail.com'  },
  { 'name':'Tom', 'Age':30  , 'email':'Tom.c@gmail.com'  },
  { 'name':'Jack', 'Age':30 , 'email':'Jack.122@gmail.com'  }
];
let r = addTable( obj);
```

Example of creating and filling the table with data from a remote API:

```js
fetchData('https://catfact.ninja/breeds?page=2', function(data){
  let jsnArray = data['data'];
  let t = addTable(jsnArray);
});
```

### adding json objects to table 

  

* addToTable(table, obj) 

Discription: add a new json or a json array to the table 


### retrieving information from tables, rows or from cells: 


* getData(obj) 

obj: table,  row or array of rows 

  

* getRow(table, rowNum) 

Discription: get a single row from a table according to its number within the table 

  

* getRows(table) 

Discription: get all rows from table 

  

* getCell(table, cellX, cellY) 

Discription: get a single cell element according to its x and y coordinate within the table 

  

* getCells(obj) 

Discription: get all cells from table or row 

obj: table or row 

  

* getColumn(table, colName) 

Discription: get a single column from table by passing its name 

  

* hasTableHeader(table) 

Discription: checks if the table has a header row. this function returns a boolean.

  

* getHeader(table) 

Discription: get the header row of the table 

  

* getHeaderCells(obj) 

Discription: get an array of the header cells 

  

* getTableFromCell(cell) 

Discription: get the table that a cell belongs to 

  

* getRowFromCell(cell)  

Discription: returns the row that a cell belongs to 

  

* getTableFromRow(row) 

Discription: get the table that a row belongs to 

  

* searchCells(table, value) 

Discription: search a table for cells that contains a specific value. This function returns an array of cells.

  

* searchCells(table, columnName, value) 

Discription: search a table for cells that contains a specific value in a specific column. This function returns an array of cells 

  

* searchRows(table, columnName, value) 

Discription: search a table for rows that contains a specific value in a specific column. This function returns an array of rows 

  

* getCellCount(table) 

Discription: returns the cell count of a table 

  

* getTableColumnCount(table)  

Discription: returns columns count in a table 

  

* getTableRowCount(table) 

Discription: return row count in a table 

  

* getCellContent(cell) 

Discription: return the textContent of a specific cell 

  
  

#### updating tables 

  

* setCellContent(cell, text) 

Discription: set the textContent of a specific cell 
  

* editCell(table, cellX, cellY, text , className)  

Discription: set the textContent / class name for a cell by passing its x and y coordinates in a specific table 

  
* removeRow(table, rowNum) 

Discription: removes a single row in a table by passing its number 

  

* clearTable(table) 

Discription: removes all rows in a table 

  

* removeLastRow(table) 

Discription: removes the last row in a table 

  

* addCellEditOverlay(cell) 

Discription: adds an input field over the cell, so that the user can edit the text content of the cell 

  

* editRow(row) 

Discription: adds an input field over  each cell in a specific row, so that the user can edit the text content of these cells 

  

* editSelectedRow(table) 

Discription: adds an input field over each cell of the row, that is selected by the user, in a specific table, so that the user can edit the text content of these cells.

  
* tableInput( table, obj, parent , id , classes , lableClasses , btnClasses , btnCaption ) 

Discription: create an input form for a specific table, so that the user can enter data to that table through this form 

Parameters: 

table: the table to br filled through this input form 

obj: a json object that is used as a model for the data to be entered to the table. 

parent: the parent object of this form, if left empty the document body will be added as a parent 

  

 
#### table modes 

table modes are behaviors that are triggered by clicking on a table cell. 

By default there are three main modes: 

1. defaultMode: this mode is associated with context menu. In this mode rows are selected on right click. When there is an active custom context menu, this context menu will be displayed instead of the default context menu. 

2. selectMode: in this mode rows are selected on mouse left click. These rows can then be manipulated throw button or other elements, or you can extract data from these rows through code. 

3.  editCellMode: in this mode an overlay input field will be created over the clicked cell. Through this mode can cells be separately edited. 


Example of creating a new table with select mode: 
``` js
Let myTable = addTable(jsonData , tableContainer , 'myTable’ , 'table-hover table table-striped' , selectMode); 
```
 

Functions: 

* getTableMode(table) 

Discription: Return the active mode for the table 

 

* setTableMode(table, mode) 

Discription: sets a mode for the table. Custom modes can also be created. 

 
* clearTableMode(table) 

Discription: removes custom behaviors and go back to default mode 
 

* removeDefaultTableBehaviour(table) 

Discription: removes the default mode from a table 

Function associated with select mode: 

 * isRowSelected(row) 

Discription: check if a row is selected. Returns boolean 

 

* getSelectedRows(table) 

Discription: return an array of all selected row. Thes can be then manipulated as you wish. 

* clearSelectedRows(table) 

Discription: unselect all selected rows in a table 


 
 

### Creating different Dom-Elements: 

  

* addOList(array, parent, id , classes ) 

Discription: creates and returns an ordered list 

  

* addUList(array, parent, id , classes ) 

Discription: creates and returns an unordered list 

  

* addImage(src ,  parent ,  id , classes) 

Discription: creates and returns an image element 

  

* addButton( caption, onClick, parent, id, classes) 

Discription: creates and returns a button 

  

* addLabel( caption, parent , id, classes)  

Discription: creates and returns a label 

  

* addInput( type ,parent ,id, classes) 

Discription: creates and returns an input field 

parameters: 

type: type of the input field( text by default) 

  

  
  

### Creating a custom context menu 

ContextMenu is a class that has this constructor: 

 ```js
Class ContextMenu{ 
  constructor(menuClasses , btnClasses ) 
} 
```
menuClasses and btnClasses are optional parameters for custom css classes, when left empty the default style for context menu will be applied. 

Example: 
```js
let  miniContextMenu = new ContextMenu(); 
```
 

#### Adding buttons to context menu: 

* addBtn(caption, onClickEvent, associatedTags ) 

Parameters: 

Caption: caption text of the created button. 

OnClickEvent: event handler of the created buuton. 

AssociatedTags: the tag of the element when right clicking on it this button will be shown. When left empty this button will always be displayed. When entering ‘none’ as parameter the button will only be displayed on an empty point on the web page. 

 

Examples: 

The following button will only be displayed when right clicking on an empty space on the page 

```js
miniContextMenu.addBtn('say hello',function(){alert('Hello world!');} , ‘none’ ); 
```
 

The following button will only be displayed when right clicking on an image 

```js
miniContextMenu.addBtn('click this image',function(){alert('This is an image!');} , ‘img’); 
```
  

The following button will always be displayed and will tell you what an element you have right clicked on!  

```js
miniContextMenu.addBtn('what am I?',function(){ 

	let elements= miniContextMenu.getAllElementsClicked(); 

	let output='you have right clicked on: '; 

	for(let el of elements){output+= el.nodeName + ' ';} 

	alert( output); 

}); 
```
 

#### Disabling context menu: 
```js
miniContextMenu.disable(); 
```

This function removes Event listeners associated with the context menu and removes its components. 

 

#### Retrieving information about clicked elements: 

* getAllElementsClicked() 

Discription: returns an array of all elements that are under the mouse pointer when right clicking 

* getElementClicked(tag) 

Discription: returns a single element of a specific tag . Returns null when no element of this type is found under the mouse cursor. 

* isTagClicked(type) 

Discription: return boolean indicating whether an element of a specific type were clicked 

Example: 

```js
addImage('https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=480'); 

miniContextMenu.addBtn('is this an image?',function(){ alert(MiniContextMenu.isTagClicked('img'));}); 
```
 

  

### Creating a custom confirmation panel: 
```js
class confirmation{ 
  constructor(panelClasses , yesBtnClasses , noBtnClasses , captionClasses') 
} 
```
The constructor takes optional parameters, when left empty an IOS styled confirmation panel will be created. 

Example: 
```js
let conf = new confirmation(); 
miniContextMenu.addBtn('add label' , function(){  
  addLabel('hello world!');  
} ,'none');  

miniContextMenu.addBtn('remove Label' , function(){ 
  conf.show('Are you sure you want to delete this label?','Yes', 'No',function(){ 
    let lbl = miniContextMenu.getElementClicked('label'); 
    remove(lbl); 
}); 
} ,'label'); 
```
 

  

 

 

  
