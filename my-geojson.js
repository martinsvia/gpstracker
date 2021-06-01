var myGeoJSON = {};
var myLayer;

$.get('https://apex.oracle.com/pls/apex/martinsvia/points/list', function(data) {
	var npk = 1;
	$.each(data.items, function(i, item) {
		var json = JSON.parse(item.json);
		$('#listTable tr:last').after('<tr><td>'+npk+'</td><td><a onclick="loadData('+json.properties.id+')" href="#">'+json.properties.date+'</a></td></tr>');
		npk++;
	});
});

loadData(5859);
function loadData(id){

	if(typeof myLayer === 'object' && myLayer !== null) {
		myLayer.remove();
	}

	$.getJSON('https://apex.oracle.com/pls/apex/martinsvia/points/get?ID=' + id, function(data) {

		myGeoJSON.type = "FeatureCollection";
		myGeoJSON.features = [];


		$.each(data.items, function(i, item) {
			myGeoJSON.features.push(JSON.parse(item.json));
		});

		myLayer = L.geoJSON([myGeoJSON], {

			style: function (feature) {
				return feature.properties && feature.properties.style;
			},

			onEachFeature: onEachFeature,

			pointToLayer: function (feature, latlng) {
				return L.circleMarker(latlng, {
					radius: 8,
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
			}
		});

		myLayer.addTo(map);
		map.fitBounds(myLayer.getBounds());

		//pathCoords = connectTheDots(myGeoJSON);
		//var pathLine = L.polyline(pathCoords).addTo(map2)



	});
}

function connectTheDots(data){
	var c = [];
	for(i in data.features) {
		var x = data.features[i].geometry.coordinates[1];
		var y = data.features[i].geometry.coordinates[0];
		c.push([x, y]);
	}
	return c;
}
