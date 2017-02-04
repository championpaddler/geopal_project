$(function() {
	
	/**
	 * jQueryUI provides dialog() method that transforms the HTML code written on the page into HTML code to display a dialog box.
	 * $(selector, context).dialog(options);
	 */
	$(".dialog").dialog({
		autoOpen: false, 
		minWidth: 400
	});
	
	/**
	 * I show "upload-geojson" and "change-icons-colors" dialog only when click the relative button 
	 * $(selector, context).dialog ("action", [params]);
	 */
	$("#btn-upload-geojson").click(function() {
		$( "#dialog-upload-geojson" ).dialog("open");
	});
	$("#btn-change-icons-color").click(function() {
		$( "#dialog-change-icons-color" ).dialog("open");
	});
	
	/**
	 * All dialogs have an input close button to close the dialog
	 * You can do it using the default "X" icon also
	 */
	$(".dialog .close").click(function() {
		$(this).parents(".dialog").dialog("close");
	});
	
	/**
	 * When users choose a color, they can see the icon preview before to apply the change
	 */
	$("select[name='colors']").on('change', function() {
		var color = $("select[name='colors'] option:selected").text();
		$("img.icon-preview").attr("src","http://maps.google.com/mapfiles/ms/micons/"+color+"-dot.png");
	})
	
});