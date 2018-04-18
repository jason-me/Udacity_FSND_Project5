var initLocations = [
          {title: 'Old Settlers Park Disc Golf', position: {lat: 30.5410321, lng: -97.62581109999999}, FSID: '4c32511a7cc0c9b6871df09a'},
          {title: 'Cat Hollow Disc Golf', position: {lat: 30.5064047, lng: -97.7304463}, FSID: '4c13eb38a9c220a17faa569d'},
          {title: 'Falcon Pointe Disc Golf Course', position: {lat: 30.458378, lng: -97.5849549}, FSID: '4cafa62c1463a143934b96a9'},
          {title: 'Wells Branch Disc Golf Course', position: {lat: 30.4342523, lng: -97.6712814}, FSID:'4ce72ffd8ef78cfa54b9919b'},
          {title: 'Williamson County Disc Golf Course', position: {lat: 30.561017, lng: -97.7669112}, FSID: '4bc0eaf0461576b0880d7b32'},
          {title: 'San Gabriel Disc Golf Course', position: {lat: 30.6332618, lng: -97.6779842}, FSID: '4aee1fb8f964a5204dd221e3'},
          {title: 'Rivery Park Disc Golf Course', position: {lat: 30.5282057, lng: -97.6925576}, FSID: '4cb60ad764998cfa4d6912a2'},
          {title: 'Bartholemews Disc Golf Course', position: {lat: 30.2967083, lng: -97.6895933}, FSID: '4f416feee4b0c868de8c7416'},
          {title: 'MaryMoore Searight Metro Disc Golf Course', position: {lat: 30.2578349, lng: -97.7499692}, FSID: '4d7baad5ea35236a0ad34923'},
          {title: 'Zilker Park Disc Golf Course', position: {lat: 30.2967083, lng: -97.8676655}, FSID: '4bbf8c4274a9a59378a4cef6'}
        ];


var map;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.5082551, lng: -97.67889599999999},
          zoom: 10,
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
      id: locationItem.FSID,
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

    //Foursquare implementation
    var clientID = '1TTRU30VHJFEHTQIAHSEOCJAMFT5AIC0MVYQ54ONFD1UXVEJ';
    var clientSecret = 'Y1KF2YQECOFMW3CBMWQEZ35FDP1AOFX0S1F2NF3JDJ0FNTXG';
    var version ='20180417';
    var venueID = marker.id;
    var foursquareURL = 'https://api.foursquare.com/v2/venues/'+ venueID +'?&client_id='+ clientID +'&client_secret='+ clientSecret +'&v='+ version;

    $.getJSON(foursquareURL, function(data) {
      var venueLike = data.response.venue.likes.count;
      var venueRating = data.response.venue.rating;
      var fsUrl = data.response.venue.canonicalUrl;

      marker.setIcon(highlightedIcon);
      infowindow.setContent('<div id="markerTitle">'+ marker.title +'</div><br><div>From Foursquare: <strong>'+ venueLike +'</strong> people have liked this location and it has been rated <strong>'+ venueRating +'</strong>/ 10.</div><br><div><a href="'+ fsUrl +'" target="_blank">Check out this spot on Foursquare</a></div>');
      infowindow.open(map, marker);

    }).fail(function() {alert('Foursquare could not be loaded...');});


  this.currentLocation = function(location) {
    google.maps.event.trigger(this.marker, 'click');
  };
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

