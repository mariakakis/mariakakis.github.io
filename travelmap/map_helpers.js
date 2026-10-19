var GEOCODE_CACHE_KEY = 'travelmap_geocode_cache_v1';

function getGeocodeCache() {
	try {
		var cached = localStorage.getItem(GEOCODE_CACHE_KEY);
		return cached ? JSON.parse(cached) : {};
	} catch (e) {
		console.warn('LocalStorage unavailable for geocoding cache:', e);
		return {};
	}
}

function saveGeocodeCache(cache) {
	try {
		localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
	} catch (e) {
		console.warn('Could not save geocoding cache to localStorage:', e);
	}
}

async function geocodeLocation(city, accessToken, cache) {
	if (!city || !city.trim()) return null;
	var normalizedCity = city.trim();

	if (cache && cache[normalizedCity] && Array.isArray(cache[normalizedCity]) && cache[normalizedCity].length === 2) {
		return cache[normalizedCity]; // [lng, lat]
	}

	try {
		var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + 
			encodeURIComponent(normalizedCity) + '.json?access_token=' + accessToken;
		var response = await fetch(url);
		if (!response.ok) {
			console.error('Failed to geocode "' + normalizedCity + '": HTTP status ' + response.status);
			return null;
		}
		var data = await response.json();
		if (data.features && data.features.length > 0) {
			var coords = data.features[0].center; // [lng, lat]
			if (cache) {
				cache[normalizedCity] = coords;
			}
			return coords;
		}
	} catch (err) {
		console.error('Geocoding error for "' + normalizedCity + '":', err);
	}
	return null;
}

function createFeature(city, lng, lat, reason, year) {
	var props = {
		"city": city,
		"year": year
	};
	if (reason !== null && reason !== undefined && reason !== "null" && reason !== "") {
		props.reason = reason;
	}
	return {
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [lng, lat]
		},
		"properties": props
	};
}

// Process all trip categories: uses provided lat/lng if available; otherwise geocodes client-side
async function populateTripLayers(categories, accessToken) {
	var layers = {};
	var uniqueCitiesToFetch = new Set();
	var cache = getGeocodeCache();

	// First pass: identify missing coordinates and use cache where possible
	for (var i = 0; i < categories.length; i++) {
		var cat = categories[i];
		layers[cat.key] = [];
		for (var j = 0; j < cat.trips.length; j++) {
			var trip = cat.trips[j];
			var lat = trip.lat !== undefined && trip.lat !== null && trip.lat !== "" ? parseFloat(trip.lat) : null;
			var lng = trip.lng !== undefined && trip.lng !== null && trip.lng !== "" ? parseFloat(trip.lng) : null;
			var hasHardcodedCoords = !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;

			if (!hasHardcodedCoords && trip.city) {
				var normCity = trip.city.trim();
				if (!cache[normCity]) {
					uniqueCitiesToFetch.add(normCity);
				}
			}
		}
	}

	// Geocode unique uncached cities in batches
	var citiesArr = Array.from(uniqueCitiesToFetch);
	var BATCH_SIZE = 6;
	for (var i = 0; i < citiesArr.length; i += BATCH_SIZE) {
		var batch = citiesArr.slice(i, i + BATCH_SIZE);
		await Promise.all(batch.map(function(city) {
			return geocodeLocation(city, accessToken, cache);
		}));
		saveGeocodeCache(cache);
	}

	// Second pass: construct GeoJSON features for each category
	for (var i = 0; i < categories.length; i++) {
		var cat = categories[i];
		for (var j = 0; j < cat.trips.length; j++) {
			var trip = cat.trips[j];
			var lat = trip.lat !== undefined && trip.lat !== null && trip.lat !== "" ? parseFloat(trip.lat) : null;
			var lng = trip.lng !== undefined && trip.lng !== null && trip.lng !== "" ? parseFloat(trip.lng) : null;
			var hasHardcodedCoords = !isNaN(lat) && !isNaN(lng) && lat !== null && lng !== null;

			if (hasHardcodedCoords) {
				layers[cat.key].push(createFeature(trip.city, lng, lat, trip.reason, trip.year));
			} else if (trip.city) {
				var cachedCoords = cache[trip.city.trim()];
				if (cachedCoords) {
					layers[cat.key].push(createFeature(trip.city, cachedCoords[0], cachedCoords[1], trip.reason, trip.year));
				} else {
					console.warn('Coordinates could not be found for:', trip.city);
				}
			}
		}
	}

	return layers;
}

function addPoints(map, color, category) {
	var layerName = category + "-points";
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
	if (pointProperties.reason && pointProperties.reason !== "null" && pointProperties.reason !== "undefined") {
		description += '<br />' + pointProperties.reason;
	}
	return {'coordinates': coordinates, 
	'description': description};
}

function addMapPoint(layers, city, lat, lng, reason, year, category) {
	var lat = parseFloat(lat);
	var lng = parseFloat(lng);
	var data = createFeature(city, lng, lat, reason, year);
	layers[category].push(data);
	return layers;
}