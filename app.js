var initLocations = [
          {title: 'Old Settlers Park Disc Golf', position: {lat: 330.5410321, lng: -97.62581109999999}},
          {title: 'Cat Hollow Disc Golf', position: {lat: 30.5064047, lng: -97.7304463}},
          {title: 'Falcon Pointe Disc Golf Course', position: {lat: 30.458378, lng: -97.5849549}},
          {title: 'Wells Branch Disc Golf Course', position: {lat: 30.4342523, lng: -97.6712814}},
          {title: 'Williamson County Disc Golf Course', position: {lat: 30.561017, lng: -97.7669112}},
          {title: 'San Gabriel Disc Golf Course', position: {lat: 30.6332618, lng: -97.6779842}}
        ];


var map;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.5082551, lng: -97.67889599999999},
          zoom: 11,
          mapTypeControl: false
        });
        ko.applyBindings(new ViewModel());
}

//var Cat = function(data){
  //this.clickCount = ko.observable(data.clickCount);
  //this.name = ko.observable(data.name);
  //this.imgSrc = ko.observable(data.imgSrc);
  //this.alias = ko.observableArray(data.alias);

  // level up
  //this.level = ko.computed(function(){
    //var level;
    //if (this.clickCount() < 15){
      //level = 'Newb';
    //}else if (this.clickCount() < 35){
      //level = 'Samourai';
    //}else{
      //level = 'Kunoichi';
    //};
    //return level;
  //}, this);
//}

function googleError() {
  alert("Google Maps could not be loaded.");
}

var ViewModel = function() {
  var self = this;

  this.locationList = ko.observableArray([]);

  var infoWindow = new google.maps.InfoWindow();

  var defaultIcon = makeMarkerIcon('0091ff');
        // Create a "highlighted location" marker color.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  initLocations.forEach(function(locationItem){
    var marker = new google.maps.Marker({
      position: locationItem.position,
      title: locationItem.title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      map: map
    });
    locationItem.marker = marker;
    locationItem.marker.addListener('click', function() {
      setMarkersDefault();
      populateInfoWindow(this, infoWindow);
    });
  });

  this.currentLocation = ko.observable(this.locationList()[0]);

  self.selectedCategory = ko.observable('all');


  self.filteredLocations = ko.computed(function() {
    var selectedCategory = self.selectedCategory().toLowerCase();

    // If the 'All' category is selected, shows all listings and markers.
    if (selectedCategory === 'all') {
      self.locationList().forEach(function(location) {
        if (location.marker) {
          location.marker.setVisible(true);
        }
      });
      return self.locationList();
    }

    // Else if a category is selected, filters the list and markers.
});

function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
          // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
          // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
          // In case the status is OK, which means the pano was found, compute the
          // position of the streetview image, then calculate the heading, then get a
          // panorama from that and set the options
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            }
          };
        var panorama = new google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
          // Use streetview service to get the closest streetview image within
          // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

function setMarkersDefault() {
  self.locationList().forEach(function(locationItem) {
    locationItem.marker.setIcon(defaultIcon);
  });
}
  //this.currentLocation = ko.observable( this.locationList()[0] );
  // increment the counter
  //this.incrementCounter = function(){
    //self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    // console.log(this.clickCount());
  //};

  //this.setLocation = function(clickedLocation) {
      //self.currentLocation(clickedLocation);
  //};
};

