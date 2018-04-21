var initLocations = [
          {category: '1', title: 'Old Settlers Park Disc Golf', position: {lat: 30.5410321, lng: -97.62581109999999}, FSID: '4c32511a7cc0c9b6871df09a'},
          {category: '1', title: 'Cat Hollow Disc Golf', position: {lat: 30.5064047, lng: -97.7304463}, FSID: '4c13eb38a9c220a17faa569d'},
          {category: '2', title: 'Falcon Pointe Disc Golf Course', position: {lat: 30.458378, lng: -97.5849549}, FSID: '4cafa62c1463a143934b96a9'},
          {category: '2', title: 'Wells Branch Disc Golf Course', position: {lat: 30.4342523, lng: -97.6712814}, FSID:'4ce72ffd8ef78cfa54b9919b'},
          {category: '3', title: 'Williamson County Disc Golf Course', position: {lat: 30.561017, lng: -97.7669112}, FSID: '4bc0eaf0461576b0880d7b32'},
          {category: '3', title: 'San Gabriel Disc Golf Course', position: {lat: 30.6332618, lng: -97.6779842}, FSID: '4aee1fb8f964a5204dd221e3'},
          {category: '4', title: 'Rivery Park Disc Golf Course', position: {lat: 30.5282057, lng: -97.6925576}, FSID: '4cb60ad764998cfa4d6912a2'},
          {category: '4', title: 'Bartholemews Disc Golf Course', position: {lat: 30.2967083, lng: -97.6895933}, FSID: '4f416feee4b0c868de8c7416'},
          {category: '5', title: 'MaryMoore Searight Metro Disc Golf Course', position: {lat: 30.2578349, lng: -97.7499692}, FSID: '4d7baad5ea35236a0ad34923'},
          {category: '5', title: 'Zilker Park Disc Golf Course', position: {lat: 30.2967083, lng: -97.8676655}, FSID: '4bbf8c4274a9a59378a4cef6'}
        ];

var Location = function(data) {
  this.title = ko.observable(data.title);
  this.position = ko.observable(data.position);
  this.category = ko.observable(data.category);
  this.marker = data.marker;
};

var map;

function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.5082551, lng: -97.67889599999999},
          zoom: 10,
          mapTypeControl: false
        });
        ko.applyBindings(new ViewModel());
}


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

    //Clicking on marker animates bounce or cancels bounce animation
    //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
    locationItem.marker.addListener('click', toggleBounce);

      function toggleBounce() {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }



    self.locationList.push(new Location(locationItem));
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
    return ko.utils.arrayFilter(self.locationList(), function(location) {
      var category = location.category().toLowerCase();
      var match = category === selectedCategory;
      self.locationList().forEach(function(location) {
        if (location.category() === selectedCategory) {
          location.marker.setVisible(true);
        } else {
          location.marker.setVisible(false);
          infoWindow.close();
        }
      });
      return match;
    });
});

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

function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.

    //Foursquare implementation
    var clientID = '1TTRU30VHJFEHTQIAHSEOCJAMFT5AIC0MVYQ54ONFD1UXVEJ';
    var clientSecret = 'Y1KF2YQECOFMW3CBMWQEZ35FDP1AOFX0S1F2NF3JDJ0FNTXG';
    var version ='20180417';
    var venueID = marker.id;
    var foursquareURL = 'https://api.foursquare.com/v2/venues/'+ venueID +'?&client_id='+ clientID +'&client_secret='+ clientSecret +'&v='+ version;


//Load JSON-encoded data from the server using a GET HTTP Ajaxrequest.
    $.getJSON(foursquareURL, function(data) {
      var venueLike = data.response.venue.likes.count;
      var venueRating = data.response.venue.rating;
      var fsUrl = data.response.venue.canonicalUrl;

      marker.setIcon(highlightedIcon);
      infowindow.setContent('<div id="markerTitle">'+ marker.title +'</div><br><div>From Foursquare: <strong>'+ venueLike +'</strong> people have liked this location and it has been rated <strong>'+ venueRating +'</strong>/ 10.</div><br><div><a href="'+ fsUrl +'" target="_blank">Check out this spot on Foursquare</a></div><br><div>(Click icon to reset animation)</div>');
      infowindow.open(map, marker);

    }).fail(function() {alert('Foursquare could not be loaded...');});
  }

  this.currentLocation = function(location) {
    google.maps.event.trigger(this.marker, 'click');
  };

};

  //this.currentLocation = ko.observable( this.locationList()[0] );
  // increment the counter
  //this.incrementCounter = function(){
    //self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    // console.log(this.clickCount());
  //};

  //this.setLocation = function(clickedLocation) {
      //self.currentLocation(clickedLocation);
  //};


