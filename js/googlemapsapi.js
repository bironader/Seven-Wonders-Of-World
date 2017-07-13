var map;
var  infowindow;
var markers=[];
var contentString;
var seven_wonders = [
{
  name: 'Pyramids Of Giza',
  address: ' Pyramids of Giza, Al Haram, Giza, Egypt',
  lat:  29.976480,
  lng:  31.131302,
  desc: ' The Pyramids of Giza or The Giza Necropolis are amazing and very well know monument to ancient Egyptian culture'
},
{
  name:'The Eiffel Tower',
  address: 'The Eiffel Tower, Paris, France',
  lat:  48.858093,
  lng: 2.294694,
  desc: 'The Eiffel Tower is considered one of the most recognizable and favorite landmarks of modern world. The symbol of Paris and the whole France'
},
{
  name:  'Great Wall of China',
  address: 'Great Wall of China, Huairou, China',
  lat: 40.431908,
  lng: 116.570374,
  desc: 'Great Wall of China is one of the world famous miracle located in a few provinces of China. It is a very long fortification estimated to be over 21,000 km long which was built during the Early and Middle Ages'

},
{
  name: 'The Colosseum of Rome',
  address: 'The Colosseum of Rome, Rome, Italy',
  lat: 41.890251,
  lng: 12.492373,
  desc: "the Colosseum is one of the main attractions and historic monuments of Rome, Italy. It is an amphitheater constructed in the 80 AD (under the rule of Titus), made of stones and concrete"
},
{
  name: 'Taj Mahal',
  address: 'Taj Mahal, Agra, Uttar Pradesh, India',
  lat: 27.173891,
  lng: 78.042068,
  desc: "Taj Mahal is a palace built by Mughal emperor Shah Jahan for his third wife Mumtaz Mahal in 1632. It is one of the most popular tourist destinations and a known wonder of the world"
},
{
  name: "Christ the Redeemer",
  address: "Rio de Janeiro Brazil",
  lat:-22.951871,
  lng:-43.21118,
  desc:"Christ the Redeemer (Portuguese: Cristo Redentor), is a statue of Jesus Christ in Rio de Janeiro, Brazil. From 1931 until 2010 it was the largest Art Deco statue in the world. It is 30 metres (98 ft) tall. It sits on a 8 metres (26 ft) pedestal on the peak of the 700-metre (2,300 ft) tall Corcovado mountain. The statue overlooks the city."
},
{
  name: "Chichen Itza",
  address: "Yucatán, Mexico",
  lat: 20.4000,
  lng:88.3400,
  desc: "Chichén Itzá is a large Mayan city famous for a large, pyramid temple built by the Maya civilization. It is on the Yucatán Peninsula, about 120 km to the east of Mérida. The temple, called Castillo, is about 1 km in diameter."
}
];

var model = function(wonder){
  var self = this;
  this.name = wonder.name;
  this.lat = wonder.lat;
  this.lng = wonder.lng;
  this.address = wonder.address;
  this.desc = wonder.desc;

};

function viewModel(){

 self.searchKey = ko.observable('');
 self.wonderList = ko.observableArray([]);

 for (var i =0 ; i<seven_wonders.length ; i++) {

   self.wonderList.push(new model(seven_wonders[i]));
 }
 map = new google.maps.Map(document.getElementById('map'), {
  center: {lat: 29.976480, lng:  31.131302},
  zoom: 3
});
 infowindow = new google.maps.InfoWindow();
 initMarkers();


 self.filteredRecored = ko.computed( function() {
  var filter = self.searchKey().toLowerCase();

   if (!filter) { // if search box is empty show all markers 

    markers.forEach(function(rec){
      rec.setMap(map);
    });

    return self.wonderList(); // wonderList will bind to html 
  }
  else // search box is not empty
  {
    var counter = 0 ;
    return ko.utils.arrayFilter(self.wonderList(), function(rec) { //  filter wonderlist  and return filteredRecored
     var filter = self.searchKey().toLowerCase();


     var string = rec.name.toLowerCase();

     var result = (string.search(filter) >= 0);
     marker = markers[counter];
     if (result === true){
      marker.setMap(map); // show only the filered marker
    }else{
      marker.setMap(null); // hide all marker
    }
    counter = counter + 1;

    return result;
    
  });
  }

}, self);
}

// init markers for all 7 locations
function initMarkers(){

  var marker;

  for (var i = 0; i < seven_wonders.length; i++) {
    var position = {lat: seven_wonders[i].lat, lng: seven_wonders[i].lng};
    var title = seven_wonders[i].name;
    var address = seven_wonders[i].address;
    marker= new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      address: address, 
      animation: google.maps.Animation.DROP,
      id: i,
    });

    onClickMarker(marker);
    markers.push(marker);

  }

}

function onClickMarker(marker){


  marker.addListener('click', function() {
    showInfo(marker);

  });

}

function showInfo(marker){

  // third party api getty image
  var url = "https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best&phrase="+marker.title;
  
  $.ajax({
    type: 'GET',
    url: url,
    processData: false,
    headers: {
      'Api-Key':'u8t6kp3vhp3egyzgz46sexbt',

    },
    
    success: function(result) {
     setTimeout(function() {
      marker.setAnimation(null);
    }, 2500);
     if (result) {
      var image =result.images[1].display_sizes[0].uri;
      contentString= '<div id="content">'+
      '<h1 id="firstHeading" class="firstHea  ding">'+marker.title+'</h1>'+
      '<h3 id="firstHeading" class="firstHeading">'+marker.address+'</h3>'+
      '<div id="bodyContent">'+
      '<p>'+seven_wonders[marker.id].desc+'</p>'+
      '<img src='+image+" style = width:100%;>"+
      '</div>'+
      '</div>';
      infowindow.setContent(contentString);
      marker.setAnimation(google.maps.Animation.BOUNCE);


      infowindow.open(map,marker);

    } 
    else
    {
      contentString = '<div id="content">'+
      '<h1 id="firstHeading" class="firstHea  ding">'+marker.title+'</h1>'+
      '<h3 id="firstHeading" class="firstHeading">'+marker.address+'</h3>'+
      '<div id="bodyContent">'+
      '<p>'+seven_wonders[marker.id].desc+'</p>'+
      '<p> faile to load the image</p>'+
      '</div>'+
      '</div>';

      infowindow.setContent(contentString);
      marker.setAnimation(google.maps.Animation.BOUNCE);
      infowindow.open(map,marker);
    }

  },
  error: function(XMLHttpRequest, textStatus, errorThrown) { 
    errorHandling();
  }       
});


}


function errorHandling() {
  alert("Check your connection");
}

function initMap()
{
 ko.applyBindings(new viewModel()); 
}


// show marker when click on specific name
function onClickList(name)
{
  var marker;
  for (i = 0; i < markers.length; i++) {
    if (markers[i].title == name){
      marker= markers[i];
    }
  }
  showInfo(marker);
}

