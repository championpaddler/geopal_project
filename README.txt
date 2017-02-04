--------------------------------------------------------------------------------------------
GeoPal Project 2017
Author: Tullio Guli
Email: gulitullio@gmail.com
Description: 

- Create a webpage using whatever technologies you feel appropriate to allow a user to:
	1. Upload a GeoJson File to display points on a map
	2. Allow user to lasso points to display in a grid
	3. Allow user to change the color of all the icons displayed

About Lasso button: 
	Allows for selecting multiple points on the map by drowing a rectangle over them.
	Once the rectangle has been drawn the list of selected points will be shown.
	When this button is clicked, the mouse pointer icon should change.
	
About Change Icons Color button: 
	When clicking on a marker there should be a popup giving only details about point
	
--------------------------------------------------------------------------------------------

Folders and files:
    css/
        default.css
    js/
        dialogHandler.js
		fileHandler.js
		gmapHandler.js
    json/
		DublinPOI.json
		InvalidFileTest.json
		USmanyPoints.json
	index.html
    README.txt
	
--------------------------------------------------------------------------------------------

Technologies / Libraries:
	Google Map
	jQuery
	jQuery UI - Dialog
	
--------------------------------------------------------------------------------------------
	
Design choices and possible improvements:
	- I chose "jQuery UI Dialog" because it offers many default features: the dialog window can be moved, resized and closed.
	- As required by the project, I have used rectangle shape to select multiple points using "useLasso('RECTANGLE')" on click on use Lasso button
	  You can try POLYGON using "useLasso('POLYGON')" to have more accuracy
	- It might be useful to add a button to show the information of selected points after dialog window's closing
	- To be user friendly, it would be appropriate put the "drawingControl" to 'true' and add other "drawingModes" such as 'circle'
	- To storing points information, it would be appropriate to use a database 
	- The list of icons colors is static, it could be improved loading an array of elements or selecting them from a database
	- I don't really upload the file but only the contained information
	- When you upload more files, they are added and not replaced. In this way if you add the same file the map will have two markers in the same point.
	  This can be solved adding an ID and checking if it exists already
	  