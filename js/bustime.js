// bustime.js

var map;
var markers = [];

function initMap() {
  var myMapCenter = {lat: 43.052955, lng: -87.9003088};
  var mapOptionsHide = {
    default: null,
    hide: [
      {
        featureType: 'poi.business',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{visibility: 'on'}]
      }
    ]
  };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: myMapCenter
  });
  map.setOptions({styles: mapOptionsHide['hide']});

  setInterval(function() { // Timer Loop

    // Data Fetch
    downloadUrl('http://koster.ninja/getvehicles', function(data) {
    var json_response = JSON.parse(data.response) // Transform JSON String to Object

    clearMarkers()

    // Data Loop
    json_response["vehicle"].forEach(function(vehicle) {
      var marker = {lat: parseFloat(vehicle.lat), lng: parseFloat(vehicle.lon)};
      addMarker(marker, vehicle.rt, vehicle.des)
    })
    }); // downloadUrl
  }, 10000) // setInterval
} //initMap

// Adds a marker to the map and push to the array.
function addMarker(location, route, destination) {
  var bus_icon = {
    url : 'img/bus.svg',
    scaledSize: new google.maps.Size(40, 40)
  }

  var marker = new google.maps.Marker({
    position: location,
    map: map,
    icon: bus_icon
  });
  markers.push(marker);

  var infoWindow = new google.maps.InfoWindow;
  var infowincontent = document.createElement('div');

  var strong = document.createElement('strong');
  strong.textContent = route + " - " + destination
  infowincontent.appendChild(strong);
  infowincontent.appendChild(document.createElement('br'));

  // var text = document.createElement('text');
  // text.textContent = my_vehicle + " - " + my_timestamp
  // infowincontent.appendChild(text);

  marker.addListener('mouseover', function() {
    infoWindow.setContent(infowincontent);
    infoWindow.open(map, marker);
  })

  marker.addListener('click', function() {
    infoWindow.setContent(infowincontent);
    infoWindow.open(map, marker);
  })

  marker.addListener('mouseout', function() {
    infoWindow.close(map, marker);
  })

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };
  request.open('GET', url, true);
  request.send(null);
}

function doNothing() {} // Dummy function for State loop
