$(document).ready(function() {

var osmMapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
})

var openTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: "Map data: &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors, <a href='http://viewfinderpanoramas.org'>SRTM</a> | Map style: &copy; <a href='https://opentopomap.org'>OpenTopoMap</a> (<a href='https://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA</a>)"
})

var nccExtent = new L.GeoJSON.AJAX('data/ncc_extent.geojson', {
    style: function(feature) {
        return {color: '#333333', fillOpacity: 0.0, weight: 2}
    }
})

var nccZoning= new L.GeoJSON.AJAX('data/ncc_zoning.geojson', {
    style: function(feature) {
        switch (feature.properties.ZONE) {
           case 'Buffer Zone':   return {color: '#333333', fillColor: '#ff7f00', fillOpacity: 0.75, weight: 1.0}
           case 'Neighborhood Level Commercial': return {color: '#333333', fillColor: '#ff0000', fillOpacity: 0.75, weight: 1.0}
           case 'City Level Commercial': return {color: '#333333', fillColor: '#ff0000', fillOpacity: 0.75, weight: 1.0}
           case 'Central Business Zone': return {color: '#333333', fillColor: '#ff0000', fillOpacity: 0.75, weight: 1.0}
           case 'Excluded Area': return {color: '#333333', fillColor:'#f0bb71', fillOpacity: 0.75, weight: 1.0}
           case 'General Industrial Zone': return {color: '#333333', fillColor:'#8c00c8', fillOpacity: 0.75, weight: 1.0}
           case 'Light Industrial Zone': return {color: '#333333', fillColor:'#8c00c8', fillOpacity: 0.75, weight: 1.0}
           case 'RnD Zone': return {color: '#333333', fillColor:'#0000ff', fillOpacity: 0.75, weight: 1.0}
           case 'Government and Institutional Zone': return {color: '#333333', fillColor:'#0000ff', fillOpacity: 0.75, weight: 1.0}
           case 'Education Zone': return {color: '#333333', fillColor:'#0000ff', fillOpacity: 0.75, weight: 1.0}
           case 'Protected Zone': return {color: '#333333', fillColor: '#006400', fillOpacity: 0.75, weight: 1.0}
           case 'Active Recreational Zone': return {color: '#333333', fillColor: '#d3eb4a', fillOpacity: 0.75, weight: 1.0}
           case 'Active Recreational Zone (SEA Games)': return {color: '#333333', fillColor: '#d3eb4a', fillOpacity: 0.75, weight: 1.0}
           case 'Passive Recreational Zone': return {color: '#333333', fillColor: '#d3eb4a', fillOpacity: 0.75, weight: 1.0}
           case 'High Density Residential Zone': return {color: '#333333', fillColor: '#ffff82', fillOpacity: 0.75, weight: 1.0}
           case 'Medium Density Residential Zone': return {color: '#333333', fillColor: '#ffff82', fillOpacity: 0.75, weight: 1.0}
           case 'Mixed Use Residential Zone': return {color: '#333333', fillColor: '#ffff82', fillOpacity: 0.75, weight: 1.0}
           case 'Roads': return {color: '#333333', fillColor: '#bebebe', fillOpacity: 0.75, weight: 1.0}
           case 'Infrastructure Zone': return {color: '#333333', fillColor: '#bebebe', fillOpacity: 0.75, weight: 1.0}
           case 'Transport Hub': return {color: '#333333', fillColor: '#bebebe', fillOpacity: 0.75, weight: 1.0}
       }
   },
   onEachFeature: function (feature, layer) {
        layer.bindPopup('<b>Zoning:</b> ' +feature.properties.ZONE)
    }
})

var nccFloodMGB = new L.GeoJSON.AJAX('data/ncc_flood_mgb.geojson', {
    style: function(feature) {
        switch (feature.properties.FloodSusc) {
            case 'Low':   return {color: '#ffff02', fillOpacity: 0.75, weight: 1}
            case 'Moderate':   return {color: '#e69800', fillOpacity: 0.75, weight: 1}
            case 'High':   return {color: '#e60000', fillOpacity: 0.75, weight: 1}
            case 'Very High':  return {color: '#e427d8', fillOpacity: 0.75, weight: 1}
        }
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<b>Flood Susceptibility:</b> ' +feature.properties.FloodSusc)
    }
})

var nccLandslideMGB = new L.GeoJSON.AJAX('data/ncc_landslide_mgb.geojson', {
    style: function(feature) {
        switch (feature.properties.LndslideSu) {
            case 'Low':   return {color: '#ffff02', fillOpacity: 0.75, weight: 1}
            case 'Moderate':   return {color: '#e69800', fillOpacity: 0.75, weight: 1}
            case 'High':   return {color: '#e60000', fillOpacity: 0.75, weight: 1}
            case 'Very High':  return {color: '#e427d8', fillOpacity: 0.75, weight: 1}
        }
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<b>Landslide Susceptibility:</b> ' +feature.properties.LndslideSu)
    }
})

var poiIcon = new L.Icon({
	iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
	shadowUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-shadow.png',
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

var poiAranguren = new L.GeoJSON.AJAX('data/poi_aranguren.geojson', {
	pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: poiIcon})
    },
	onEachFeature: function (feature, layer) {
        layer.bindPopup('<img src="' + feature.properties.photo + '" width="420"></img><hr>' + feature.properties.description, {
			minWidth: 420,
		})
    }
})

var poiAlli = new L.GeoJSON.AJAX('data/poi_alli.geojson', {
	pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: poiIcon})
    },
	onEachFeature: function (feature, layer) {
        layer.bindPopup('<img src="' + feature.properties.photo + '" width="420"></img><hr>' + feature.properties.description, {
			minWidth: 420,
		})
    }
})

var baseTree = {
    label: '<b>BASEMAPS</b>',
    children: [
        {label: 'OpenStreetMap Mapnik', layer: osmMapnik},
        {label: 'OpenTopoMap', layer: openTopo},
    ]
}

var overlayTree = {
    label: '<b>OVERLAYS</b>',
    selectAllCheckbox: 'Un/select all',
    children: [
        {
            label: '<b>New Clark City</b>',
            selectAllCheckbox: true,
            children: [
                {label: 'Extent', layer: nccExtent},
                {label: 'Zoning', layer: nccZoning},
            ]
        },
		{
            label: '<b>Points of Interest</b>',
            selectAllCheckbox: true,
            children: [
                {label: 'Aranguren', layer: poiAranguren},
				{label: 'Alli', layer: poiAlli},
            ]
        },
        {
            label: '<b>Hazards (Mines and Geosciences Bureau)</b>',
            selectAllCheckbox: true,
            children: [
                {label: 'Flood (MGB)', layer: nccFloodMGB},
                {label: 'Landslide (MGB)', layer: nccLandslideMGB},
            ]
        }
    ]
}

var map = L.map('map', {
    center: [15.2950, 120.4892],
    zoom: 12,
    minZoom: 12,
    maxBounds: [
        [15.16, 120.33],
        [15.45, 120.64]
    ],
    layers: [osmMapnik, nccExtent, nccZoning]
})

L.control.layers.tree(baseTree, overlayTree).addTo(map)

map.invalidateSize();
})
