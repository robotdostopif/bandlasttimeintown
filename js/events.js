let bandField = document.getElementById("band");
let cityField = document.getElementById("city");
var lat;
var long;
var lastID;
bandField.focus();
bandField.onkeydown = function(e) {
  if (e.keyCode === 13) {
    callBandAPI();
  }
};

cityField.onkeydown = function(e) {
  if (e.keyCode === 13) {
    callBandAPI();
  }
};

$(document).ready(function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      long = position.coords.longitude;
    });
  } else {
    console.log("geolocation not supported");
  }
});

$(document).ready(function() {
  $(".buttons ul").on("click", "li", function() {
    if (lastID === undefined) {
      lastID = 1;
    }
    $("#" + lastID).addClass("button-color");
    $("#" + this.value).removeClass("button-color");
    printEvents(this.value);
    if (this.value != lastID) {
      $(window).scrollTop($(".container").offset().top);
    }
    lastID = $(this).attr("id");
  });
});

function getDistance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
