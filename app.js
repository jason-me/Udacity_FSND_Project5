var initLocations = [
          {title: 'Old Settlers Park Disc Golf', location: {lat: 330.5410321, lng: -97.62581109999999}},
          {title: 'Cat Hollow Disc Golf', location: {lat: 30.5064047, lng: -97.7304463}},
          {title: 'Falcon Pointe Disc Golf Course', location: {lat: 30.458378, lng: -97.5849549}},
          {title: 'Wells Branch Disc Golf Course', location: {lat: 30.4342523, lng: -97.6712814}},
          {title: 'Williamson County Disc Golf Course', location: {lat: 30.561017, lng: -97.7669112}},
          {title: 'San Gabriel Disc Golf Course', location: {lat: 30.6332618, lng: -97.6779842}}
        ];
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 30.5082551, lng: -97.67889599999999},
          zoom: 13,
        });
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


//var ViewModel = function() {
  //var self = this;

  //this.catList = ko.observableArray([]);

  //initialCats.forEach(function(catItem){
    //self.catList.push( new Cat(catItem) );
  //});

  //this.currentCat = ko.observable( this.catList()[0] );
  // increment the counter
  //this.incrementCounter = function(){
    //self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    // console.log(this.clickCount());
  //};

  //this.setCat = function(clickedCat) {
      //self.currentCat(clickedCat);
  //};
//};

//ko.applyBindings(new ViewModel());