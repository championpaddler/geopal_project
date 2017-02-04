/**
 * HTML5 finally provides a standard way to interact with local files, via the File API specification
 */
function readFile() {
	
	var file = document.getElementById("file").files[0];
	if (file) {
		var reader = new FileReader();
		
		// Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string.
		reader.readAsText(file, "UTF-8");
		
		// A handler for the load event. This event is triggered each time the reading operation is successfully completed.
		reader.onload = function (evt) {
			uploadGeoJson(evt.target.result);
		}
		
		// A handler for the error event. This event is triggered each time the reading operation encounter an error.
		reader.onerror = function (evt) {
			alert("Failed to reading file");
		}
		
	} else {
	  alert("Failed to load file");
	}
	
}