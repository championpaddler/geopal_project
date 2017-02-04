var map;
var infoWindow;
var drawingManager;
var selectedOverlay;

/**
 * Initialize map, infoWindow and drawingManager
 */
function initMap() {
	map = new google.maps.Map(
		document.getElementById('map'), {
			center: {lat: 53.349660, lng: -6.260261},
			zoom: 14
		}
	);
	infoWindow = new google.maps.InfoWindow();
	initDrawingManager();
}

/**
 * Initialize the drawing manager to provide a graphical interface for users to draw polygons, rectangles, polylines, circles and markers on the map.
 */
function initDrawingManager() {
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: null,
		drawingControl: false,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: ['polygon', 'rectangle']
		},
		rectangleOptions: {
			draggable: false,
			editable: false,
			strokeColor: "#000",
			strokeWeight: "2"
		}
	});
	drawingManager.setMap(map);
	addOverlayCompleteEvent();
}

/**
 * When a shape overlay is created, an overlaycomplete event is fired. A reference to the overlay is passed as an argument.
 */
function addOverlayCompleteEvent() {
	google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
		selectedOverlay = event.overlay;
		drawingManager.setMap(null);
		var tbody = "";
		if (event.type == 'rectangle') 
			tbody = isRectangleComplete();
		else if (event.type == 'polygon') 
			tbody = isPolygonComplete();
		$("#dialog-use-lasso table tbody").html(tbody);
		$("#dialog-use-lasso").dialog("open");
	});
}

/**
 * The Google Maps Data layer provides a container for arbitrary geospatial data. 
 * You can use the Data layer to store your custom data, or to display GeoJSON data on a Google map.
 * @param {string} jsonRawData - GeoJson points
 */
function uploadGeoJson(jsonRawData) {
	$("#dialog-upload-geojson" ).dialog("close");
	try {
		var json = JSON.parse(jsonRawData);
		map.data.addGeoJson(json);	
		map.data.addListener('click', function(event) {
			map.setCenter(event.feature.getGeometry().get());
			var name = event.feature.getProperty("name");
			var address = event.feature.getProperty("address");
			var description = event.feature.getProperty("description");
			var html = "<div style='min-width:100px; text-align: center;'>";
			if (name) html += "<p><strong>"+name+"</strong></p>";
			if (address) html += "<p>"+address+"</p>";
			if (description) html += "<p>"+description+"</p>";
			html += "</div>";
			infoWindow.setContent(html);
			infoWindow.setPosition(event.feature.getGeometry().get());
			infoWindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
			infoWindow.open(map);
		});
		centerMap();
	} catch(e) {
		alert("JSON is not valid ");
	}
}

/**
 * Update map's viewport to fit each geometry in a dataset
 */
function centerMap() {
	var bounds = new google.maps.LatLngBounds();
	map.data.forEach(function(feature) {
		processPoints(feature.getGeometry(), bounds.extend, bounds);
	});
	map.fitBounds(bounds);
}

/**
 * Process each point in a Geometry, regardless of how deep the points may lie.
 * @param {google.maps.Data.Geometry} geometry - The structure to process
 * @param {function(google.maps.LatLng)} callback - A function to call on each LatLng point encountered (e.g. Array.push)
 * @param {Object} thisArg - The value of 'this' as provided to 'callback' (e.g. myArray)
 */
function processPoints(geometry, callback, thisArg) {
  if (geometry instanceof google.maps.LatLng) {
    callback.call(thisArg, geometry);
  } else if (geometry instanceof google.maps.Data.Point) {
    callback.call(thisArg, geometry.get());
  } else {
    geometry.getArray().forEach(function(g) {
      processPoints(g, callback, thisArg);
    });
  }
}

/**
 * The Lasso tool allows you to select multiple points on the map
 * @param {string} type - The shape (RECTANGLE, POLYGON)
 */
function useLasso(type) {
	$("#dialog-use-lasso").dialog("close");
	if (selectedOverlay) selectedOverlay.setMap(null);
	var overlayType = google.maps.drawing.OverlayType.RECTANGLE;
	if (type=="POLYGON") overlayType = google.maps.drawing.OverlayType.POLYGON;
	drawingManager.setDrawingMode(overlayType);
	drawingManager.setMap(map);
}

/**
 * When the rectangle is complete I can use getbounds() to return a google.maps.LatLngBounds and 
 * for each point check if latLng is in the area 
 * @returns {string}
 */
function isRectangleComplete() {
	var tbody = "";
	map.data.forEach(function(feature){
		var name = feature.getProperty("name");
		var address = feature.getProperty("address");
		var latLng = feature.getGeometry().get();
		if (selectedOverlay.getBounds().contains(latLng)) {
			tbody += "<tr><td>"+name+"</td><td>"+address+"</td><td>"+latLng.lat().toFixed(6)+"</td><td>"+latLng.lng().toFixed(6)+"</td></tr>";
		}
	});
	return tbody;
}

/**
 * When the polygon is complete I can use polygon coords to create a google.maps.Polygon and 
 * for each point check if polygon contains location
 * @returns {string}
 */
function isPolygonComplete() {
	var overlayCoords = selectedOverlay.getPath().getArray();
	var polygon = new google.maps.Polygon({paths: overlayCoords});
	var tbody = "";
	map.data.forEach(function(feature){
		var name = feature.getProperty("name");
		var address = feature.getProperty("address");
		var latLng = feature.getGeometry().get();
		if(google.maps.geometry.poly.containsLocation(latLng,polygon)){
			tbody += "<tr><td>"+name+"</td><td>"+address+"</td><td>"+latLng.lat().toFixed(6)+"</td><td>"+latLng.lng().toFixed(6)+"</td></tr>";
		}
	});
	return tbody;
}

/**
 * GeoJSON Data use the Data.setStyle() method to specify how your data should look
 */
function changeIconsColor() {
	var color = $("select[name='colors'] option:selected").text();
	map.data.setStyle({
	  icon: 'http://maps.google.com/mapfiles/ms/micons/'+color+'-dot.png',
	});
}