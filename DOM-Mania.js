
// ============================================================================
//    				DOM-MANIA
//	  	Author: Al-Khafaji, Ali Kifah
//	    Date:   02.08.2022
//  	Description: A Javascript library that eases the DOM manibulation
// ============================================================================
//######################################################################
//#######  BASIC DOM MANIBULATION CODE  #######################################
//######################################################################

function get(id) { return document.getElementById(id); }
function add(tag, parent = '', id = '', classes = '', text = '', onClick = null) {	
	if (isString(parent))
		parent = get(parent);
	if (!isElement( parent))
		parent = document.body;
	const elementToAdd = document.createElement(tag);	
	if (id === '')
		id = uniqueID(tag + '-');
	elementToAdd.id = id;
	
	if (classes.length > 0) {
		classes = classes.trim();
		classes = classes.reduceWhiteSpace();
		let classArray = classes.split(' ');
		for (var className of classArray)
			elementToAdd.classList.add(className);
	}
	if (typeof (text) === 'number') text = String(text);
	if (text.length > 0) {
		if (tag === 'input' || tag === 'textarea')
			elementToAdd.value = text;
		else
			elementToAdd.innerText = text;
	}
	parent.appendChild(elementToAdd);
	if (onClick != null && onClick != '')
		elementToAdd.addEventListener('click', onClick);
	return elementToAdd;
}

function insertAfter(tag, referenceNodeToAddAfter, id = '', classes = '', text = '', onClick = null) {
	if (isString(referenceNodeToAddAfter))
		referenceNodeToAddAfter = get(referenceNodeToAddAfter);
	if (!isElement(referenceNodeToAddAfter)) 
		return add(tag, '', id, classes, text, onClick);

	const elementToAdd = document.createElement(tag);
	if (id === '')
		id = uniqueID(tag + '-');
	elementToAdd.id = id;
	if (classes.length > 0) {
		classes = classes.trim();
		classes = classes.reduceWhiteSpace();
		let classArray = classes.split(" ");
		for (var className of classArray)
			elementToAdd.classList.add(className);
	}
	if (text.length > 0) {
		if (tag === 'input' || tag === 'textarea')
			elementToAdd.value = text;
		else
			elementToAdd.innerText = text;
		referenceNodeToAddAfter.parentNode.insertBefore(elementToAdd, referenceNodeToAddAfter.nextSibling);
		if (onClick != null)
			elementToAdd.addEventListener('click', onClick);
		return elementToAdd;
	}
}
function insertBefore(tag, referenceNodeToAddBefore, id = '', classes = '', text = '', onClick = null) {
	if (isString(referenceNodeToAddBefore))
		referenceNodeToAddBefore = get(referenceNodeToAddBefore);
	if (!isElement(referenceNodeToAddBefore))
		return add(tag, '', id, classes, text, onClick);

	const elementToAdd = document.createElement(tag);
	if (id === '')
		id = uniqueID(tag + '-');
	elementToAdd.id = id;
	if (classes.length > 0) {
		classes = classes.trim();
		classes = classes.reduceWhiteSpace();
		let classArray = classes.split(" ");
		for (var className of classArray)
			elementToAdd.classList.add(className);
	}
	if (text.length > 0) {
		if (tag === 'input' || tag === 'textarea')
			elementToAdd.value = text;
		else
			elementToAdd.innerText = text;
		referenceNodeToAddBefore.parentNode.insertBefore(elementToAdd, referenceNodeToAddBefore);
		if (onClick != null)
			elementToAdd.addEventListener('click', onClick);
		return elementToAdd;
	}
}
function remove(obj) {
	if (isString(obj)) 
		obj = get(obj);	
	if (isElement(obj)) {
		obj.remove();
	}
	else if (isArray(obj)) {
		{
			if (obj.length > 0) {
				for (let el of obj) {
					if (isElement(el))
						el.remove();
				}
			}
		}
	}
}

function getSubChildren( parent,tag='', subChildren=[] ){
	let children = parent.children;
	for (let c of children) {
		if(tag === ''){
			subChildren.push(c);
		}
		else{
			if ( c.nodeName === tag.toUpperCase() )
				subChildren.push(c);
		}
		getSubChildren(c,tag, subChildren );	
	}
	return subChildren;
}

function addClass(obj, className) {
	if (isString(obj)) obj = get(obj);
	if (!isElement(obj)) return;
	obj.classList.add(className);
}
function removeClass(obj, className) {
	if (isString(obj)) obj = get(obj);
	if (!isElement(obj)) return;
	obj.classList.remove(className);
}
function hasClass(obj, className) {
	if (isString(obj)) obj = get(obj);
	if (!isElement(obj)) return false;
	return obj.classList.contains(className);
}
//######################################################################
//#######  TABLE MANIBULATION CODE  #######################################
//######################################################################
const tablesClickEvents = new Map(); // key=table.id/ table.id + '-function name' , value= function body
const selectedRows = new Map();// key=table id, value=array of rows
let activeContextMenu = null;
let activeConfirmationPanel = null;
const defaultCellPadding="5px";
const defaultCellMargin="5px";
const defaultCellHeight="15px";
const defaultCellWidth="50px";
const defaultTableBorder= "1px solid black";

// local clipboard to be used with the context menu
let clipBoard = null;
function writeToClipBoard(object){clipBoard = object;}
function readFromClipBoard(){return clipBoard;}

function addCell(row ,textContent='', onCellClick = defaultMode ){
	let tag='';
	if (row.parentNode.nodeName === 'TBODY' || row.parentNode.nodeName === 'TABLE')
		tag='td';
	else if (row.parentNode.nodeName === 'THEAD')
		tag='th';
	else
		return;
	let cell = add(tag, row, '', '', textContent, onCellClick);
	cell.style.padding=defaultCellPadding;
	cell.style.margin=defaultCellMargin;
	cell.style.width=defaultCellWidth;
	cell.style.height=defaultCellHeight;
	cell.style.border=defaultTableBorder;
	cell.addEventListener('contextmenu', onCellClick);
	return cell
}

function addTableEmpty(columnCount=2, rowCount=2, parent='', id = '', tableClasses = '', onCellClick = defaultMode) {
	let table = add('table', parent, id, tableClasses);
	table.setAttribute('cellspacing','0');
	if (onCellClick != null) {
		tablesClickEvents.set(table.id, onCellClick);
		table.style.cursor = "pointer";
	}
	let thead = add('thead', table);
	let theadRow = add('tr', thead);
	for(let i=0; i<rowCount;i++){
		let cell = addCell( theadRow, '', onCellClick );
	}
		
	const tbody = add('tbody', table);
	for(let i=0; i<rowCount;i++){
		let tbodyRow = add('tr', tbody);
		for(let j=0; j<columnCount;j++){
			addCell(tbodyRow,'', onCellClick  );
		}
	}
	if (onCellClick === defaultMode)
		addDefaultTableBehaviour(table, true);	
	return table;
}

function addColumn(table) {
	let onClick= tablesClickEvents.get(table.id);
	let header = getHeader(table);
	if (header!== null)
		addCell( header,'',  onClick );
	let rows = getRows(table);	
	for (let row of rows){
		addCell( row, '', onClick );
	}
}

function addTableEmptyHeaderless( columnCount=2, rowCount=2, parent='', id = '', tableClasses = '', onCellClick = defaultMode) {
	let table = add('table', parent, id, tableClasses);
	table.setAttribute('cellspacing','0');
	if (onCellClick != null) {
		tablesClickEvents.set(table.id, onCellClick);
		table.style.cursor = "pointer";
	}
	const tbody = add('tbody', table);
	for(let i=0; i<rowCount;i++){
		let tbodyRow = add('tr', tbody);
		for(let j=0; j<columnCount;j++){
			addCell(tbodyRow,onCellClick  );
		}
	}
	if (onCellClick === defaultMode)
		addDefaultTableBehaviour(table, true);	
	return table;
}

function addTable(obj, parent= '', id = '', tableClasses = '', onCellClick = defaultMode) {
	var table;
	if (parent.nodeName === 'TABLE') {
		addToTable(parent, obj);
	}
	else {
		table = add('table', parent, id, tableClasses);
		
		if (tableClasses === ''){
			table.style.border=defaultTableBorder;
			table.setAttribute('cellspacing','0');
		}
		if (onCellClick != null) {
			tablesClickEvents.set(id, onCellClick);
			table.style.cursor = "pointer";
		}
		const tbody = add('tbody', table);
		if (Array.isArray(obj)) {
			if (obj.length === 0) { table.remove(); return; }
			if (isObject(obj[0])) { // if array of json files is to be added to table
				// create header
				let thead = add('thead', table);
				let theadRow = add('tr', thead);
				for (let key in obj[0]) { let cell = addCell(theadRow, capitalizeFirstLetter(key) , onCellClick  );}
				// add rows to body
				for (let el of obj) {
					// create row for every jsn file
					let tbodyRow = add('tr', tbody);
					for (let key in el) {
						let cell = addCell(tbodyRow,el[key], onCellClick  );
					}
				}
			}
			else { // if array of strings or numbers make headerless table
				let tbodyRow = add('tr', tbody);
				for (let item of obj) {
					let bcell = add('td', tbodyRow, '', '', item, onCellClick);
				}
			}
		}
		else { // if single json file is to be added
			// create header	
			let thead = add('thead', table);
			let theadRow = add('tr', thead);
			for (let key in obj) { let cell = addCell(theadRow, key ); }
			// add rows to body
			let tbodyRow = add('tr', tbody);
			for (let key in obj) { let bcell = addCell(tbodyRow, obj[key] );}
		}
	}
	if (onCellClick === defaultMode)
		addDefaultTableBehaviour(table, true);
	return table;
}

function addRow(table) {
	if (isString(table)) table = get(table);
	if (!isTable(table)) return;	
	let clickEvent = tablesClickEvents.get(table.id);
	let tW = getTableColumnCount(table);
	let rowParent;
	const tbody = table.querySelector('tbody');
	if (tbody != null)
		rowParent = tbody;
	else
		rowParent = table;
	let tbodyRow = add('tr', rowParent);

	for (let i = 0; i < tW; i++) {
		let cell = add('td', tbodyRow, 'tcell-' + i, '', '', clickEvent); 
		cell.style.padding=getTableCellPadding(table);
		cell.style.margin=getTableCellMargin(table);
		cell.style.height=getTableCellHeight(table);
		setTableModeToCell(table, cell);
	}
	return tbodyRow;
}

function getTableCellPadding(table){
	if(isTable(table)){
		let cells=getCells(table);
		if (cells.length >0){
			if (cells[0].style.padding!="")
				return cells[0].style.padding;
		}
	}
	return defaultCellPadding;
}
function getTableCellMargin(table){
	if(isTable(table)){
		let cells=getCells(table);
		if (cells.length >0){
			if (cells[0].style.margin!="")
				return cells[0].style.margin;
		}
	}	
	return defaultCellMargin;
}
function getTableCellHeight(table){
	if(isTable(table)){
		let cells=getCells(table);
		if (cells.length >0)
		{
			if (cells[0].style.height!="")
				return cells[0].style.height;
		}
	}	
	return defaultCellHeight;
}

function removeEventFromRow(row) {
	let table = getTableFromCell(cell);
	let cells = getCells(row);
	let event = tablesClickEvents.get(table.id);
	for (let cell in cells) {
		cell.removeEventListener('contextmenu', event);
		cell.removeEventListener('click', event);
	}
}
function getSelectedText(){
     if (window.getSelection)
        return window.getSelection();
    else if (document.getSelection)
        return document.getSelection();
	else if (document.selection) {
        return document.selection.createRange().text;
	}
    else return '';	
}

//##############################################################################
//#####  TABLE MODES ##########################################################
//##############################################################################

function getTableMode(table) {
	if (!isTable(table)) return null;
	if (tablesClickEvents.has(table.id))
		return tablesClickEvents.get(table.id);
	return null;
}
function setTableMode(table, mode) {
	if (!isTable(table)) return;
	if (tablesClickEvents.has(table.id)) {
		let ev = tablesClickEvents.get(table.id);
		tablesClickEvents.delete(table.id);
		tablesClickEvents.set(table.id, mode);
		let cells = getCells(table);
		for (let c of cells) {
			c.removeEventListener('click', ev);
			c.addEventListener('click', mode);
			c.addEventListener('contextmenu', mode);
		}
	}
}

function setTableModeToCell(table, cell) {
	if (!isTable(table)) return;
	if (!isCell(cell)) return;
	let mode= getTableMode(table);
	if(mode!= null){
		cell.addEventListener('click', mode);
		cell.addEventListener('contextmenu', mode);
	}	
}
function clearTableMode(table) {
	if (!isTable(table)) return;
	if (tablesClickEvents.has(table.id)) {
		let ev = tablesClickEvents.get(table.id);
		let cells = getCells(table);
		for (let c of cells) {
			c.removeEventListener('click', ev);
		}
		tablesClickEvents.delete(table.id);
	}
	addDefaultTableBehaviour(table, true);
}


//#############################
//##### TABLE DEFAULT MODE ##
//#############################
function defaultMode() {
	let cell = event.target;
	let row = getRowFromCell(cell);
	if (row === null) return;
	let table = getTableFromCell(cell);
	clearSelectedRows(table);
	if (event.type === "contextmenu")
		selectRow(table, row);
}

function addDefaultTableBehaviour(table, addToCells = true) {
	if (!isTable(table)) return;

	if (!tablesClickEvents.has(table.id + '-defaultTableClick'))
		tablesClickEvents.set(table.id + '-defaultTableClick', function () {clearSelectedRows(table); });
	
	if (!tablesClickEvents.has(table.id + '-defaultTableContext'))
		tablesClickEvents.set(table.id + '-defaultTableContext', function () {
		if (activeContextMenu != null) {
			if (!isMouseOverElement(table, getXPositionAfterScroll(event.pageX), getYPositionAfterScroll( event.pageY) ))
				clearSelectedRows(table);
		}
	});

	let defaultTableClick = tablesClickEvents.get(table.id + '-defaultTableClick',);
	let defaultTableContext = tablesClickEvents.get(table.id + '-defaultTableContext',);	
	
	document.addEventListener('click', defaultTableClick);
	document.addEventListener('contextmenu', defaultTableContext);

	if (addToCells)
		setTableMode(table, defaultMode);
}

function removeDefaultTableBehaviour(table) {
	if (!isTable(table)) return;
	if (!tablesClickEvents.has(table.id + '-defaultTableClick')) return;
	if (!tablesClickEvents.has(table.id + '-defaultTableContext')) return;
	let defaultTableClick = tablesClickEvents.get(table.id + '-defaultTableClick');
	let defaultTableContext = tablesClickEvents.get(table.id + '-defaultTableContext');
	document.removeEventListener('click', defaultTableClick);
	document.removeEventListener('contextmenu', defaultTableContext);
	tablesClickEvents.delete(table.id + '-defaultTableClick');
	tablesClickEvents.delete(table.id + '-defaultTableContext');
	clearSelectedRows(table);
}

function removeListeners(element) {
	if (!isElement(element)) return;
	element.outerHTML = element.outerHTML;
}
function addToTable(table, obj) {
	if (isString(table)) table = get(table);
	if (!isElement(table)) return;
	let clickEvent = tablesClickEvents.get(table.id);
	let rowParent;
	const tbody = table.querySelector('tbody');
	if (tbody != null)
		rowParent = tbody; // if tbody is null add directly to table
	else
		rowParent = table;
	if (Array.isArray(obj)) {
		if (hasTableHeader(table)) {
			for (let el of obj) {
				// create row for every jsn file
				let tbodyRow = add('tr', rowParent);
				for (let key in el) { 
					addCell(tbodyRow, el[key], clickEvent);
				}
			}
		}
		else { // if array of strings or numbers make headerless table
			let tbodyRow = add('tr', tbody);
			for (let item of obj) { 
				addCell(tbodyRow, item, clickEvent);
			}
		}
	}
	else {
		// create row for every jsn file
		let tbodyRow = add('tr', rowParent);
		for (let key in obj) {
			let bcell = add('td', tbodyRow, '', '', obj[key], clickEvent);
		}
	}
}

//##########################
//##### TABLE EDIT MODE ##
//##########################
function editCellMode() {
	let cell = event.target;
	addCellEditOverlay(cell);
}
//############################
//########### SELECT MODE ##
//############################
function selectMode() {
	let cell = event.target;
	let row = getRowFromCell(cell);
	if (row === null) return;
	let table = getTableFromCell(cell);
	if (event.type === "click") {
		if (isRowSelected(row)) {
			unselectRow(table, row);
		}
		else {
			selectRow(table, row);
		}
	}
}

function getSelectedRows(table) {
	if (!isTable(table)) return;
	if (selectedRows.has(table.id))
		return selectedRows.get(table.id);
	return null;
}
function selectRow(table, row) {
	if (isRowSelected(row)) return;
	
	let arr = [];
	if (!selectedRows.has(table.id)) {
		arr.push(row)
		selectedRows.set(table.id, arr);
	} else {
		arr = selectedRows.get(table.id);
		arr.push(row);
		selectedRows.set(table.id, arr);
	}
	row.style.backgroundColor = "blue";
	row.style.color = "white";
}
function unselectRow(table, row) {
	let arr = selectedRows.get(table.id);
	//if (arr === undefined) return;
	arr.remove(row);
	row.style.backgroundColor = "white";
	row.style.color = "black";
}
function isRowSelected(row) {
	if (row === null || row === undefined) return false;
	let table = getTableFromRow(row);
	let selRows = getSelectedRows(table);
	if (selRows === null)
		return false;
	if (selRows.includes(row))
		return true;
}
function clearSelectedRows(table) {
	if (selectedRows.has(table.id)) {
		let rows = getSelectedRows(table);
		for (let row of rows) {
			unselectRow(table, row);
		}
		selectedRows.delete(table.id);
	}
}

//##############################################################################
//############# retrieve information from Table #########################################
//##############################################################################
	function getData(obj) {
		if (isString(obj)) obj = get(obj);
		if (isElement(obj)) {
			if (isTable(obj)) {
				if (hasTableHeader(obj))
					return TableDataProvider.getDataFromTable(obj);
				else
					return TableDataProvider.getDataFromTableHeaderless(obj);
			}
			else if (isRow(obj))
				return TableDataProvider.getDatafromRows([obj]);
		}
		else if (isArray(obj)) { // if array of rows
			if (obj.length === 0) return null;
			if (!isRow(obj[0])) return null;
			let table = getTableFromRow(obj[0]);
			if (hasTableHeader(table))
				return TableDataProvider.getDatafromRows(obj);
			else
				return TableDataProvider.getDatafromRowsHeaderless(obj);
		}
		return null;
	}

function getCell(table, cellX, cellY) {
	if (!isTable(table)) return null;
	let children = table.children;
	if (children.length === 0) return null;
	let x = 0;
	let y = 0;
	for (let c of children) {
		let nodeName = c.nodeName;
		if (nodeName === 'TBODY') {
			for (let row of c.children)// itereate rows
			{
				x = 0;
				y++;
				if (row.nodeName === 'TR') {
					for (let cell of row.children)// itereate cells
					{
						x++;
						if (cellX === x && cellY === y) {
							return cell;
						}
					}
				}
			}
		}
	}
}
function getCells(obj) {
	let cells = [];
	if (isTable(obj)) // get cells from table
	{
		let wCellCount = getTableColumnCount(obj);
		let hCellCount = getTableRowCount(obj);
		for (let y = 1; y <= hCellCount; y++) {
			for (let x = 1; x <= wCellCount; x++) {
				cells.push(getCell(obj, x, y));
			}
		}
		return cells;
	} // get cells from row		
	else if (isRow(obj)) {
		let children = obj.children;
		for (let c of children) {
			if (c.nodeName === 'TH' || c.nodeName === 'TD')
				cells.push(c);
		}
		return cells;
	}
	return null;
}
function getRow(table, rowNum) {
	if (!isTable(table)) return null;
	let children = table.children;
	if (children.length === 0) return null;
	if (rowNum > getTableRowCount(table)) return null;
	let x = 0;
	let y = 0;
	for (let c of children) {
		let nodeName = c.nodeName;
		if (nodeName === 'TBODY') {
			for (let row of c.children)// itereate rows
			{
				x = 0;
				y++;
				if (row.nodeName === 'TR') {
					if (y == rowNum)
						return row;
				}
			}
		}
	}
	return null;
}
function getRows(table) {
	let rows = [];
	if (!isTable(table)) return rows;
	let children = table.children;
	if (children.length === 0) return rows;
	let rowsCount = getTableRowCount(table);
	for (let i = 1; i <= rowsCount; i++) {let row = getRow(table, i); if (row !== null ) rows.push(row);}
	return rows;
}
function getColumn(table, colName) {
	let output = [];
	let headerCells = getHeaderCells(table);
	if (headerCells === null) return output;
	let colLength = getTableRowCount(table);
	if (colLength == 0) return output;
	let n = headerCells.length;
	var colNum;
	for (let i = 0; i < n; i++) {
		if (headerCells[i].textContent == colName) {
			colNum = i + 1;
			continue;
		}
	}
	for (let i = 1; i <= colLength; i++) {
		output.push(getCell(table, colNum, i));
	}
	return output;
}

function getHeader(table) {
	if (table === null) return null;
	let children = table.children;
	if (children.length === 0) return null;
	for (let c of children) {
		let nodeName = c.nodeName;
		if (nodeName === 'THEAD') {
			for (let row of c.children) {
				if (row.nodeName === 'TR')
					return row;
			}
		}
	}
	return null;
}
function getHeaderCells(obj) {
	if (obj === null) return null;
	let cells = [];
	if (obj.nodeName === 'TABLE')
		obj = getHeader(obj);
	if (obj === null) return null;
	let children = obj.children;
	for (let c of children) {
		if (c.nodeName === 'TH' || c.nodeName === 'TD')
			cells.push(c);
	}
	return cells;
}
function getTableFromCell(cell) {
	if (cell === null || cell === undefined) return null;
	while (cell.nodeName != 'TABLE') {
		cell = cell.parentNode;
		if (cell.nodeName === 'BODY' || cell.nodeName === 'DIV')
			return null;
	}
	return cell;
}
function getRowFromCell(cell) {
	if (cell === null || cell === undefined) return null;
	while (cell.nodeName != 'TR') {
		cell = cell.parentNode;
		if (cell.nodeName === 'BODY' || cell.nodeName === 'DIV')
			return null;
	}
	return cell;
}
function getTableFromRow(row) {
	if (row === null || row === undefined) return null;
	while (row.nodeName != 'TABLE') {
		row = row.parentNode;
		if (row.nodeName === 'BODY' || row.nodeName === 'DIV')
			return null;
	}
	return row;
}


function searchCells(table, value) {
	let output = [];
	let wCellCount = getTableColumnCount(table);
	let hCellCount = getTableRowCount(table);
	for (let y = 1; y <= hCellCount; y++) {
		for (let x = 1; x <= wCellCount; x++) {
			let cell = getCell(table, x, y);
			if (cell.textContent === value)
				output.push(cell);
		}
	}
	return output;
}

function searchCells(table, columnName, value) {
	let output = [];
	let col = getColumn(table, columnName);
	for (let c of col) {
		if (c.textContent == value)
			output.push(c);
	}
	return output;
}

function searchRows(table, columnName, value) {
	let output = [];
	let col = getColumn(table, columnName);
	let n = col.length;
	for (let i = 0; i < n; i++) {
		if (col[i].textContent == value)
			output.push(getRow(table, i + 1));
	}
	return output;
}
function getCellCount(table) { return getTableColumnCount(table) * getTableRowCount(table); }
function hasTableHeader(table) {
	if (!isTable(table)) return false;
	let children = table.children;
	if (children.length === 0) return false;
	for (let c of children) {
		let children1 = c.children;
		let nodeName = c.nodeName;
		if (nodeName === 'THEAD')
			return true;
	}
	return false;
}
function getTableColumnCount(table) {
	if (!isTable(table)) return 0;
	let children = table.children;
	if (children.length === 0) return 0;
	if (hasTableHeader(table)){
		return getHeaderCells(table).length;
	}
	else{
		for (let c of children) {
			let children1 = c.children;
			let nodeName = c.nodeName;			
			if (nodeName === 'TBODY') {
				for (let c1 of c.children) {
					if (c1.nodeName === 'TR')
						return c1.children.length;
				}
			}
		}
	}
	return 0;
}
function getTableRowCount(table) {
	if (!isTable(table)) return 0;
	let children = table.children;
	if (children.length === 0) return 0;
	for (let c of children) {
		let nodeName = c.nodeName;
		if (nodeName === 'TBODY') {
			return c.children.length;
		}
	}
	return 0;
}
function getCellContent(cell){if(!isCell) return '';return cell.textContent;}
//###########################################################################################################
//########## update table  ############################################################################
//###########################################################################################################
function setCellContent(cell, text){if(!isCell) return; cell.textContent=text;}
function editSelectedRow(table) {
	if (!isTable(table)) return;
	if (isString(table)) table = get(table);

	let selectedRows = getSelectedRows(table);

	if (selectedRows === null || selectedRows === undefined) return;
	for (let i = 0; i < selectedRows.length; i++) {
		let cells = getCells(selectedRows[i]);
		for (let cell of cells) {
			addCellEditOverlay(cell);
		}
	}
}
function editRow(row) {
	if (!isRow(row)) return;
	let cells = getCells(row);
	for (let cell of cells) {
		addCellEditOverlay(cell);
	}
}

function addCellEditOverlay(cell) {
	let oldtext = cell.innerText;
	cell.innerText = '';
	let cellEditOverlayContainr = add('div', cell);

	let input = add('input', cellEditOverlayContainr, '', '', oldtext);
	input.style.width = "150px";
	let rejectChangeBtn = add('button', cellEditOverlayContainr, '', '', '❌', function () {
		stopDefault(event);
		cell.innerText = oldtext;
		cellEditOverlayContainr.remove();
	});
	let acceptChangeBtn = add('button', cellEditOverlayContainr, '', '', '✔️', function () {
		stopDefault(event);
		cell.innerText = input.value;
		cellEditOverlayContainr.remove();

	});
	input.addEventListener('click', function () { stopDefault(event); });
	input.addEventListener('keyup', function () {

		if (event.key === 'Enter' || event.keyCode === 13) {
			cell.innerText = input.value;
			cellEditOverlayContainr.remove();
		}
		else if (event.key === 'Escape' || event.keyCode === 27) {
			cell.innerText = oldtext;
			cellEditOverlayContainr.remove();
		}
	});
	input.focus();
	input.style.position = "relative";
	input.style.left = 0;
	input.style.top = 0;
}

function editCell(table, cellX, cellY, text = '', className = '') {
	let cell = getCell(table, cellX, cellY);
	if (!isCell(cell)) return;
	setCellContent(cell, text);
	if (className != '')
		cell.classList.add(className);
}
function clearTable(table) { if (!isTable(table)) return; let n = getTableRowCount(table); for (let i = 1; i <= n; i++) { removeRow(table, i); } }
function removeRow(table, rowNum) {
	if (table === null) return;
	let children = table.children;
	if (children.length === 0) return;
	let x = 0;
	let y = 0;
	for (let c of children) { // itereate rows
		let nodeName = c.nodeName;
		if (nodeName === 'TBODY') {
			for (let row of c.children)// itereate rows
			{
				removeEventFromRow(row);
				x = 0;
				y++;
				if (row.nodeName === 'TR') {
					if (y == rowNum)
						remove(row);
				}
			}
		}
	}
}

function removeLastRow(table) { if (table === null) return false; let rowCount = getTableRowCount(table); if (rowCount > 0) removeRow(table, rowCount); }
//########## table input form code #######################################################
function tableInput(parent, obj, table, id = '', classes = '', lableClasses = '', btnClasses = '', btnCaption = 'Add') {
	if (obj === null) return;
	if (parent === null) parent = document.body;
	if (!isElement(parent)) parent = get(parent);
	if (Array.isArray(obj)) { if (obj.length > 0) obj = obj[0]; else return; }
	if (!isObject(obj)) return;
	let keys = [];
	let type = 'text';
	for (let key in obj) {
		keys.push(key);
		let divForKey = add('div', parent);
		let label = add('label', divForKey, '', lableClasses, key);
		let inputText = add('input', divForKey, 'inputText-' + key, classes);
		if (isEmail(obj[key])) type = 'email';
		else if (isDate(obj[key])) type = 'date';
		inputText.setAttribute('type', type);
		label.setAttribute('for', 'inputText-' + key);
	}
	// add btn to save data from form
	add('button', parent, '', btnClasses, btnCaption, function () {
		event.preventDefault();
		let jsnB = new jsonBuilder();
		for (let key of keys) {
			let val = get('inputText-' + key).value;
			if (val === '') return;
			jsnB.add(key, val);
		}
		addToTable(table, jsnB.jsn());
	});
}


//#######################################################################
//####### different Dom-Elements ################################################
//#######################################################################

function addOList(array, parent='', id = '', classes = '') {
	let list = add('ol', parent, id, classes);
	for (let el of array) {
		let item = add('li', list, '', '', String(el));
	}
	return list
}
function addUList(array , parent='', id = '', classes = '') {
	let list = add('ul', parent, id, classes);
	for (let el of array) {
		let item = add('li', list, '', '', String(el));
	}
	return list
}
function addImage(src, parent='', id='', classes='') {
	let img = add('img', parent, id, classes);
	img.src = src;
	return img;
}
function addButton( caption, onClick=null, parent='', id='', classes='') {
	let btn = add('button', parent, id, classes,caption, onClick);
	return btn;
}
function addLabel( caption, parent='', id='', classes='') {
	let lbl = add('label', parent, id, classes, caption);
	return lbl;
}
function addInput( type='text',parent='',id='', classes=''){	
	let input = add('input', parent, id, classes);
	input.setAttribute('type', type);
	return input;
}




//#######################################################################################################
//#######################################################################################################
//#############  helper functions  ################################################
//#######################################################################################################
//#######################################################################################################
Array.prototype.IndexOf = function (value) { return this.findIndex(x => x === value); };
String.prototype.killWhiteSpace = function () { return this.replace(/\s/g, ''); };
String.prototype.reduceWhiteSpace = function () { return this.replace(/\s+/g, ' '); };
String.prototype.insertAt = function (text, index) { return this.slice(0, index) + text + this.slice(index); };
Array.prototype.remove = function (value) { for (let i = 0; i < this.length; i++) { if (this[i] === value) { this.splice(i, 1); i--; } } };
function isNumeric(text) {
	if (text === null || text === undefined) return false;
	if (typeof (text) === 'number') return true;
	let n = text.length;
	if (n === 0) return false;
	let t = '.0123456789';
	let start = 0;
	let ispointfound = false;
	let isNegative = false;
	text = text.trim();
	if (text[0] === '-') {
		isNegative = true;
		if (n > 1)
			start = 1;
		else
			return false;
	}
	for (let i = start; i < n; i++) {
		if (text[i] === '.') {
			if (ispointfound === false)
				ispointfound = true;
			else
				return false;
		}
		if (t.includes(text[i]) === false)
			return false;
	}
	return true;
}
function uniqueID(prefix = '') { return prefix + String(Math.floor(Math.random() * Date.now())); }
function makeFirstLetterSmall(str) { return str.charAt(0).toLowerCase() + str.slice(1); }
function capitalizeFirstLetter(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function getIndexOf(char, text) { for (let i = 0; i < text.length; i++) { if (text[i] === char) return i; } return -1; }
function print(obj) { console.log(obj); }
function prt(obj) { print(obj); }
function isElement(element) { return element instanceof Element || element instanceof HTMLDocument; }
function isCell(element) { if (!isElement(element)) return false; if (element.nodeName === 'TD') return true; return false; }
function isRow(element) { if (!isElement(element)) return false; if (element.nodeName === 'TR') return true; return false; }
function isTable(element) { if (!isElement(element)) return false; if (element.nodeName === 'TABLE') return true; return false; }
function isObject(obj) { return obj !== undefined && obj !== null && obj.constructor == Object; }
function isArray(obj) { return obj !== undefined && obj !== null && obj.constructor == Array; }
function isBoolean(obj) { return obj !== undefined && obj !== null && obj.constructor == Boolean; }
function isFunction(obj) { return obj !== undefined && obj !== null && obj.constructor == Function; }
function isNumber(obj) { return obj !== undefined && obj !== null && obj.constructor == Number; }
function isString(obj) { return obj !== undefined && obj !== null && obj.constructor == String; }
function isEmail(text) { if (text === null) return false; if (!isString(text)) return false; if (text.length < 3) return false; if (text === null) return false; if (!text.includes('@')) return false; if (!text.includes('.')) return false; return true; }
function isDate(text) { if (text === null) return false; if (!isString(text)) return false; if (text.length < 5) return false; let arr = []; if (text.includes('.')) arr = text.split('.'); if (text.includes('/')) arr = text.split('/'); if (text.includes('-')) arr = text.split('-'); if (arr.length === 3 && isNumeric(arr[0]) && isNumeric(arr[1]) && arr[2].length > 1 && isNumeric(arr[2].substring(0, 2))) return true; return false; }
function stopDefault(event) { event.preventDefault(); event.stopPropagation(); }
function isMouseOverElement(element, mouseX, mouseY) {
	if (!isElement( element)) return false;
	let rect = element.getBoundingClientRect();
	let x = rect.x;
	let y = rect.y;
	let w = rect.width;
	let h = rect.height;
	if (mouseX < x || mouseX > x + w)
		return false;
	if (mouseY < y || mouseY > y + h)
		return false;
	return true;
}
function getElementWidth(element) {
	if (!isElement(element)) return 0;
	let rect = element.getBoundingClientRect();
	return rect.width;
}
function getElementHeight(element) {
	if (!isElement(element)) return 0;
	let rect = element.getBoundingClientRect();
	return rect.height;
}
function getElementY(element) {
	if (!isElement(element)) return 0;
	let rect = element.getBoundingClientRect();
	return rect.y;
}
function getElementX(element) {
	if (!isElement(element)) return 0;
	let rect = element.getBoundingClientRect();
	return rect.x;
}

function getAllElementsFromPoint(x, y) {return document.elementsFromPoint(x,y);}
function getXPositionAfterScroll(x){return x - document.documentElement.scrollLeft;	}
function getYPositionAfterScroll(y){return y - document.documentElement.scrollTop;	}

async function fetchData(url, onRecieve ){
	let response = await fetch( url );
	if (!response.ok){
		const msg='Error: ' + response.status;
		throw new Error(msg);
	}
	let data = await response.json();
	onRecieve(data);
}

//#######################################################################################################
//########  HELPER CLASSES ###################################################################################
//#######################################################################################################
class jsonBuilder {
	#json;
	#openingCurlyPracket = '{';
	#closingCurlyPracket = '}';
	#doubleQuote = "\x22";
	#colon = ':';
	#comma = ',';
	#isFirstKey = true;
	#isClosed = false;
	#isAutoReset = true;
	#keys = [];
	constructor(autoReset = true) {
		this.#json = this.#openingCurlyPracket;
		this.#isAutoReset = autoReset;
	}
	#key(key) {
		let commaTemp = this.#comma;
		if (this.#isFirstKey) {
			this.#isFirstKey = false;
			commaTemp = '';
		}
		this.#json += commaTemp + this.#doubleQuote + key + this.#doubleQuote + this.#colon;
		this.#keys.push(key);
	}
	#value(value) {
		if (!isNumeric(value))
			value = this.#doubleQuote + value + this.#doubleQuote
		this.#json += value;
	}
	add(key, value) {
		if (this.#keys.includes(key)) {
			editValue(key, value);
			return;
		}
		this.#key(key);
		this.#value(value);
	}
	jsn() {
		if (!this.#isClosed) {
			this.#json += this.#closingCurlyPracket;
			this.#isClosed = true;
		}
		if (this.#isAutoReset) {
			let r = JSON.parse(this.#json);
			this.reset();
			return r;
		}
		return JSON.parse(this.#json);
	}
	reset() {
		this.#json = this.#openingCurlyPracket;
		this.#isClosed = false;
		this.#isFirstKey = true;
		this.#keys = [];
	}
	editValue(key, newValue) {
		this.#json = getJsonStringWithNewValue(this.#json, key, newValue);
	}
	getValueFromJsonString(jsonString, key) {
		let keyIndex = indexOfFirstOccurance(jsonString, key);
		if (keyIndex < 0)
			return null;
		let output = '';
		let start = '';
		let searchlimit = jsonString.length;
		for (let i = keyIndex; i < searchlimit; i++) {
			if (jsonString[i] === ':') {
				start = i + 1;
				break;
			}
		}
		for (let i = start; i < searchlimit; i++) {
			if (jsonString[i] === ',')
				break;
			output += jsonString[i];
		}
		output = output.trim();
		output = output.replaceAll('"', '');
		return output;
	}
	getJsonStringWithNewValue(jsonString, key, newValue) {
		// get index of old value
		let keyIndex = indexOfFirstOccurance(jsonString, key);
		if (keyIndex < 0)
			return null;
		let value = '';
		let searchlimit = jsonString.length;
		let valueIndex = 0;

		// find value index
		for (let i = keyIndex; i < searchlimit; i++) {
			if (jsonString[i] === ':') {
				valueIndex = i + 1;
				break;
			}
		}
		// find value
		for (let i = valueIndex; i < searchlimit; i++) {
			if (jsonString[i] === ',')
				break;
			value += jsonString[i];
		}
		// replace old value wth the new one
		if (!isNumeric(newValue))
			newValue = '\"' + newValue + '\"';
		output = jsonString.slice(0, valueIndex) + newValue + jsonString.slice(valueIndex + value.length);
		return output;
	}
	indexOfFirstOccurance(text, word) {
		if (text === null || word === null)
			return -1;

		let textLength = text.length;
		let wordLength = word.length;
		let searchlimit = textLength - wordLength;
		let wordLettersChecked = 0;
		let wordIndex = -1;
		for (let i = 0; i < searchlimit; i++) {
			if (wordIndex >= 0) {
				if (wordLettersChecked === wordLength)
					break;
				if (text[i] === word[wordLettersChecked])
					wordLettersChecked++;
				else {
					wordLettersChecked = 0;
					wordIndex = -1;
				}
			}
			else {
				if (text[i] === word[0]) {
					wordLettersChecked++;
					wordIndex = i;
				}
			}
		}
		return wordIndex;
	}
}// end of class jsnBuilder

class contextMenu {
	#contextMenuWidth = 150;
	#contextMenuBtnsInfo = new Map();
	#contextMenuBtns = new Map();
	#element = null;
	#cMenu = null;
	#clickhandler;
	#contextmenuHandler;
	#menuClasses = '';
	#btnClasses = '';
	#borderBottom = '';
	#x = 0;
	#y = 0;
	#bodyHeight;
	#bodyOverflow;	
	constructor(menuClasses = '', btnClasses = '') {
		if (activeContextMenu != null) return;
		activeContextMenu = this;
		this.#menuClasses = menuClasses;
		this.#btnClasses = btnClasses;
		this.initContextMenu();
		this.#clickhandler = this.hide.bind(this);
		this.#contextmenuHandler = this.contextMenu.bind(this);
		this.enable();
	}
	disable() {
		document.removeEventListener('click', this.#clickhandler);
		document.removeEventListener('contextmenu', this.#contextmenuHandler);
		if (this.#cMenu != null) this.#cMenu.remove();
	}
	enable() {
		document.addEventListener('click', this.#clickhandler);
		document.addEventListener('contextmenu', this.#contextmenuHandler);
	}

	setPosition(mouseX, mouseY) {
		if (mouseX > window.innerWidth - getElementWidth(this.#cMenu))
			this.#cMenu.style.left = (mouseX - getElementWidth(this.#cMenu)) + "px";
		else
			this.#cMenu.style.left = mouseX + "px";
		if (mouseY > window.innerHeight - getElementHeight(this.#cMenu))
			this.#cMenu.style.top = (mouseY - getElementHeight(this.#cMenu)) + "px";
		else
			this.#cMenu.style.top = mouseY + "px";
		this.#x = mouseX;
		this.#y = mouseY;
	}
	hide() { 
		if (this.#cMenu === null) return;
		this.#cMenu.style.display = "none";
		this.enableScroll(); 
	}
	show() { this.#cMenu.style.display = "block";}

	manageContextMenu(x, y) {
		this.show();
		this.setPosition( getXPositionAfterScroll(x),  getYPositionAfterScroll(y));
		this.updateButttons(x, y);
		this.stopScroll();
	}
	
	
	initContextMenu() {
		this.#bodyHeight = document.body.style.height;
		this.#bodyOverflow = document.body.style.overflow;
		let parent = document.body;
		this.#cMenu = add('div', parent, 'contextMenu', this.#menuClasses);
		this.#cMenu.focus();
		if (this.#menuClasses === '') { // load default menu styles
			this.#cMenu.style.position = "fixed";
			this.#cMenu.style.width = this.#contextMenuWidth + 'px';
			this.#cMenu.style.height = "auto";
			this.#cMenu.style.zIndex = 99999999999;
			this.#cMenu.style.borderStyle = "solid";
			this.#cMenu.style.borderColor = "blue";
			this.#cMenu.style.borderWidth = "1px";
			this.#cMenu.style.cursor = "pointer";
			this.#cMenu.style.display = "flex";
			this.#cMenu.style.flexDirection = "column";
			this.#cMenu.style.justifyContent = "center";
			this.#cMenu.style.alignContent = "center";
			this.#cMenu.style.backgroundColor = "white";
		}
		this.hide();
	}
	

	addBtn(caption, onClickEvent, associatedTags = '' ) {// element = the array of elements to show the button on
		if (this.#contextMenuBtnsInfo.has(caption)) return;
		let arr = [];
		arr.push(onClickEvent);
		arr.push(associatedTags);
		this.#contextMenuBtnsInfo.set(caption, arr);
		let b = add('div', this.#cMenu, '', this.#btnClasses, caption, onClickEvent);
				if (this.#btnClasses === '') { // load default btn styles
					this.#borderBottom = "1px solid blue";
					b.style.display = "flex";
					b.style.flexDirection = "column";
					b.style.justifyContent = "center";
					b.style.textAlign = "center";
					b.style.position = "relative";
					b.style.width = "100%";
					b.style.height = "auto";
					b.style.borderBottom = this.#borderBottom;
					b.style.paddingBottom = "5px";
					b.style.paddingTop = "5px";
				}
				this.#contextMenuBtns.set(caption, b);
				// set buttons visibility
				if (associatedTags != '') {// if has associated element
					if (this.isTagClicked(associatedTags) )// show only when mouse over associated element
					{
						b.style.display = 'block';
						b.style.borderBottom = this.#borderBottom;
					}
					else // hide
						b.style.display = 'none';
				}
				else { // show always
					b.style.display = 'block';
					b.style.borderBottom = this.#borderBottom;
				}
		return b;
	}
	
	
	initializeButtons(){
		let lastBtn;
		if (this.#contextMenuBtns.size === 0) {
			// initialize btns
			for (var btn of this.#contextMenuBtnsInfo) {
				let associatedTags = btn[1][1];
				let caption = btn[0];
				let onClickEvent = btn[1][0];
				
				let b = addBtn(caption,onClickEvent,associatedTags );
				if (b.style.display === 'block')
					lastBtn=b;

			}
		
			lastBtn.style.borderBottom = "none";
		}
	}
	updateButttons() {
		let lastBtn;
		if (this.#contextMenuBtnsInfo.size === 0) {
			this.disable();
			return;
		}
			for (var btn of this.#contextMenuBtnsInfo) {
				let associatedTags = btn[1][1];
				let caption = btn[0];
				let onClickEvent = btn[1][0];
				let b = this.#contextMenuBtns.get(caption);
				//if (b === undefined) continue;
				if (associatedTags != '') {// if has associated element
					if (this.isTagClicked(associatedTags))// show only when mouse over associated element
					{
						b.style.display = 'block';
						b.style.borderBottom = this.#borderBottom;
						lastBtn = b;
					}
					else // hide
						b.style.display = 'none';
				}
				else { // show always
					b.style.display = 'block';
					b.style.borderBottom = this.#borderBottom;
					lastBtn = b;
				}
			}
			//if(lastBtn!== undefined)
				lastBtn.style.borderBottom = "none";
	}

	contextMenu() { event.preventDefault(); this.manageContextMenu(event.pageX, event.pageY);}
	
	getAllElementsClicked() {		
		let el = getAllElementsFromPoint(this.#x, this.#y);
		el.remove(document.children[0]);
		el.remove(document.body);
		el.remove(this.#cMenu);				
		return el;	
	}
	getElementClicked(tag){
		let el = this.getAllElementsClicked();
		for (let e of el) { 
			if (e.nodeName === tag.toUpperCase()) { 
				return e;
			}
		}
		return null;	
	}

	isTagClicked(type){
		if(!isString(type) || type === '') return false;
		let elementsClicked = this.getAllElementsClicked();
		if (type === 'none')
			if (elementsClicked.length==0 )
				return true;
		type=type.toUpperCase();
		for (let el of elementsClicked){
			if (el.nodeName=== type)
				return true;
		}
		return false;		
	}


stopScroll(){
	document.body.style.height="100%";
	document.body.style.overflow="hidden";
}
enableScroll(){
	document.body.style.height=this.#bodyHeight;
	document.body.style.overflow=this.#bodyOverflow;
}

}// end class contextMenu

class TableDataProvider{
	static getDataFromTableHeaderless(table) {
		let data = [];
		let rowCount = getTableRowCount(table);
		let colCount = getTableColumnCount(table);
		for (let y = 1; y <= rowCount; y++) {
			let dContainer = [];
			let row = getRow(table, y);
			let cells = row.children;
			for (let x of cells) {
				let val = x.textContent;
				dContainer.push(val);
			}
			data.push(dContainer);
		}
		return data;
	}
	static getDatafromRowsHeaderless(rows) {
		let data = [];
		let rowCount = rows.length;
		if (rowCount === 0) return data;
		let colCount = getCells(rows[0]).length;
		for (let row of rows) {
			let dContainer = [];
			let cells = row.children;
			for (let x of cells) {
				let val = x.textContent;
				dContainer.push(val);
			}
			data.push(dContainer);
		}
		return data;
	}
	static getDataFromTable(table) {
		let data = [];
		let headerCells = getHeaderCells(table);
		if (headerCells === null) return data;
		let rowCount = getTableRowCount(table);
		let colNames = [];
		for (let c of headerCells) { colNames.push(c.textContent); }
		let colCount = colNames.length;
		let jsnB = new jsonBuilder();
		for (let y = 1; y <= rowCount; y++) {
			let row = getRow(table, y);
			let cells = row.children;
			for (let x = 1; x <= colCount; x++) {
				let key = makeFirstLetterSmall(colNames[x - 1]);
				let val = cells[x - 1].textContent;
				jsnB.add(key, val);
			}
			let j = jsnB.jsn();
			data.push(j);
		}
		return data;
	}
	static getDatafromRows(rows) {
		let data = [];
		if (rows.length === 0) return data;
		let table = getTableFromRow(rows[0]);
		let headerCells = getHeaderCells(table);
		if (headerCells === null) return data;
		let rowCount = getTableRowCount(table);
		let colNames = [];
		for (let c of headerCells) { colNames.push(c.textContent); }
		let colCount = colNames.length;
		let jsnB = new jsonBuilder();
		for (let y = 0; y < rows.length; y++) {
			let row = rows[y];
			let cells = row.children;
			for (let x = 1; x <= colCount; x++) {
				let key = makeFirstLetterSmall(colNames[x - 1]);
				let val = cells[x - 1].textContent;
				jsnB.add(key, val);
			}
			let j = jsnB.jsn();
			data.push(j);
		}
		return data;
	}
} // end class TableDataProvider


class confirmation{
	#panelContainer;
	#panel;
	#captionContainer;
	#caption;
	#btnContainer;
	#yesBtn;
	#noBtn;
	#question;
	#yesCaption;
	#noCaption;
	#yesCallback=null;
	#noCallback=null;

	// styling css classes
	#yesBtnClasses = '';
	#noBtnClasses = '';
	#panelClasses = '';
	#captionClasses = ''


	constructor(panelClasses = '', yesBtnClasses = '', noBtnClasses='' , captionClasses='') {
		if (activeConfirmationPanel !== null) return;
		activeConfirmationPanel = this;
		this.#yesBtnClasses = yesBtnClasses;
		this.#noBtnClasses = noBtnClasses;
		this.#panelClasses = panelClasses;
		this.#captionClasses = captionClasses;
		this.initialize();
	}
	disable() {
		if (this.#yesCallback !== null)
			this.#yesBtn.removeEventListener('click', this.#yesCallback);
		if (this.#noCallback !== null)
			this.#noBtn.removeEventListener('click', this.#noCallback);
		this.#noBtn.removeEventListener('click', this.hide.bind(this));
		this.#yesBtn.removeEventListener('click', this.hide.bind(this));
		activeConfirmationPanel = null;

	}
	show(question, yesCaption = 'Yes', noCaption = 'No', yesCallback, noCallback =null) {
		this.#question = question;
		this.#yesCaption = yesCaption;
		this.#panelContainer.style.display = "flex";
		this.#caption.textContent = question;
		this.#yesBtn.textContent = yesCaption;
		this.#noBtn.textContent = noCaption;

		if (this.#yesCallback !== null)
			this.#yesBtn.removeEventListener('click', this.#yesCallback);
		this.#yesCallback = yesCallback;
		this.#yesBtn.addEventListener('click', yesCallback);

		if (this.#noCallback !== null)
			this.#noBtn.removeEventListener('click', this.#noCallback);
		this.#noCallback = noCallback;
		this.#noBtn.addEventListener('click', this.#noCallback);
	}
	hide() { this.#panelContainer.style.display = "none";}
	initialize() {
		this.#panelContainer = add('div', 'panelContainer');
		this.#panelContainer.style.width = "100%";
		this.#panelContainer.style.height = "100%";
		this.#panelContainer.style.top = "0px";
		this.#panelContainer.style.left = "0px";
		this.#panelContainer.style.textAlign = "center";
		this.#panelContainer.style.position = "fixed";
		this.#panelContainer.style.display = "flex";
		this.#panelContainer.style.alignItems = "center";
		this.#panelContainer.style.justifyContent = "center";
		
		this.#panel = add('div', this.#panelContainer, '', this.#panelClasses);
		if (this.#panelClasses === '') {
			this.#panel.style.display = "grid";
			this.#panel.style.gridTemplateRows = "6fr 1fr";
			this.#panel.style.alignItems= "stretch";
			this.#panel.style.borderRadius = "15px";
			this.#panel.style.backgroundColor = "white";
			this.#panel.style.boxShadow = "0 0 1em black";
			this.#panel.style.width = "320px";
			this.#panel.style.height = "200px";
		}

		this.#caption = add('label', this.#panel, 'panelLabel', this.#captionClasses, this.#question);
		if (this.#captionClasses === '') {
			this.#caption.style.display = "flex";
			this.#caption.style.justifyContent = "center";
			this.#caption.style.alignItems = "center";
			this.#caption.style.height = "100%";
			this.#caption.style.color = "black";
			this.#caption.style.backgroundColor = "white";
			this.#caption.style.borderRadius = "15px 15px 0 0";
			this.#caption.style.paddingTop = "10px";
			this.#caption.style.fontWeight = "600";
			this.#caption.style.fontSize = "16px";
		}

		this.#btnContainer = add('div', this.#panel, 'captionContainer');

		this.#yesBtn = add('button', this.#btnContainer, 'yesBtn', this.#yesBtnClasses, this.#yesCaption);
		if (this.#yesBtnClasses === '') {
			this.#yesBtn.style.width = "50%";
			this.#yesBtn.style.height = "100%";
			this.#yesBtn.style.color = "green";
			this.#yesBtn.style.fontWeight = "700";
			this.#yesBtn.style.fontSize = "20px";
			this.#yesBtn.style.backgroundColor = "white";
			this.#yesBtn.style.border = "none";
			this.#yesBtn.style.borderTop = "1px solid grey";
			this.#yesBtn.style.padding = "15px 32px";
			this.#yesBtn.style.textAlign = "center";
			this.#yesBtn.style.borderRadius = "0 0 0 15px";
		}

		this.#noBtn = add('button', this.#btnContainer, 'noBtn', this.#noBtnClasses, this.#noCaption);
		if (this.#noBtnClasses === '') {
			this.#noBtn.style.width = "50%";
			this.#noBtn.style.height = "100%";
			this.#noBtn.style.color = "red";
			this.#noBtn.style.fontWeight = "700";
			this.#noBtn.style.fontSize = "20px";
			this.#noBtn.style.backgroundColor = "white";
			this.#noBtn.style.border = "none";
			this.#noBtn.style.borderTop = "1px solid grey";
			this.#noBtn.style.borderLeft = "1px solid grey";
			this.#noBtn.style.padding = "15px 32px";
			this.#noBtn.style.textAlign = "center";
			this.#noBtn.style.borderRadius = "0 0 15px 0";
		}
		this.#noBtn.addEventListener('click', this.hide.bind(this));
		this.#yesBtn.addEventListener('click', this.hide.bind(this));
	}
} // end class confirmation


