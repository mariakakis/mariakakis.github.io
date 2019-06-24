function addPoints(map, color, category) {
	var layerName = category+"-points";
	map.addLayer({
		"id": layerName,
		"type": "circle",
		"source": category,
		"paint": {
			"circle-color": color,
			"circle-stroke-color": "black",
			"circle-stroke-width": 1
		}
	});

	map.on('click', layerName, function(e) {
		var results = tooltip(e, category);
		new mapboxgl.Popup().setLngLat(results['coordinates']).
		setHTML(results['description']).addTo(map);
	});
}

function tooltip(elem, category) {
	// Position the popup nicely
	var coordinates = elem.features[0].geometry.coordinates.slice();
	while (Math.abs(elem.lngLat.lng - coordinates[0]) > 180)
		coordinates[0] += elem.lngLat.lng > coordinates[0] ? 360 : -360;

	// Add useful information to the popup
	var pointProperties = elem.features[0].properties;
	var description = '<b>City:</b> ' + pointProperties.city;
	if (pointProperties.reason) {
		if (category == "Conference")
			description += '<br />' + pointProperties.reason;
		else if (category == "Internship")
			description += '<br />' + pointProperties.reason;
		else
			description += '<br />' + pointProperties.reason;
	}
	return {'coordinates': coordinates, 
	'description': description};
}

function addMapPoint(layers, city, lat, lng, reason, year, category) {
	var lat = parseFloat(lat);
	var lng = parseFloat(lng);
	var data = {
		"type": "Feature",
		"geometry": {"type": "Point", 
		"coordinates": [lng, lat]},
		"properties": {
		  "city": city,
		  "reason": reason,
		  "year": year
		}
	};
	layers[category].push(data);
	return layers;
}