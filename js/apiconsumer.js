document.getElementById("submit").addEventListener("click", callBandAPI);

function callBandAPI() {
  document.getElementById("image").style.visibility = "hidden";
  document.getElementById("ontour").innerHTML = "";
  document.getElementById("bandtag").innerHTML = "";
  let band = bandField.value;
  let city = cityField.value;
  let url =
    "https://api.songkick.com/api/3.0/search/artists.json?apikey=APIKEY&query=" +
    band;

  let request = new XMLHttpRequest();
  request.open("GET", url);
  request.onload = function () {
    let data = JSON.parse(request.responseText);
    let mbidUrl = `https://musicbrainz.org/ws/2/artist/${data.resultsPage.results.artist[0].identifier[0].mbid}?inc=url-rels&fmt=json`;
    let mbidId = data.resultsPage.results.artist[0].identifier[0].mbid;
    getEvents(data, city);
    document.getElementById(
      "bandtag"
    ).innerHTML = `<a href="${data.resultsPage.results.artist[0].uri}" target="blank_">${data.resultsPage.results.artist[0].displayName}</a>`;
    if (data.resultsPage.results.artist[0].onTourUntil != null) {
      document.getElementById("ontour").innerHTML =
        "On tour until: <br>" + data.resultsPage.results.artist[0].onTourUntil;
    }
    getImage(mbidUrl);
    getUpEvents(mbidId, city);
  };
  request.send();
  resetElements();
}

function getEvents(data, city = "") {
  let resultUrl = `https://api.songkick.com/api/3.0/artists/${data.resultsPage.results.artist[0].id}/gigography.json?page=1&apikey=APIKEY&query`;
  var entries;
  fetch(resultUrl)
    .then((response) => {
      return response.json();
    })
    .then(async (json) => {
      return new Promise(function (resolve, reject) {
        entries = json.resultsPage.totalEntries;

        var count = 0;
        var loopCount = 0;
        for (let i = 1; i < entries / 50 + 1; i++) {
          getBandAsync(data, i).then((data) => {
            for (var j = 0; j < data.resultsPage.results.event.length; j++) {
              if (
                data.resultsPage.results.event[j].location.city.includes(city)
              ) {
                dataArr[count] = data.resultsPage.results.event[j];
                count++;
              }
              loopCount++;
            }
            if (loopCount === entries) {
              resolve(dataArr);
            }
          });
        }
      }).then((data) => {
        dataArr.sort(function (a, b) {
          var dateA = new Date(a.start.date),
            dateB = new Date(b.start.date);
          return dateA - dateB;
        });
        printEvents();
        createPages(data.length);
      });
    });
}

function getUpEvents(url, city) {
  let eventUrl = `https://api.songkick.com/api/3.0/artists/mbid:${url}/calendar.json?page1&apikey=APIKEY`;
  var entries;

  fetch(eventUrl)
    .then((response) => {
      return response.json();
    })
    .then(async (json) => {
      return new Promise(function (resolve, reject) {
        entries = json.resultsPage.totalEntries;
        var loopCount = 0;
        var count = 0;

        for (let i = 1; i < entries / 50 + 1; i++) {
          getEventAsync(url, i).then((data) => {
            for (var j = 0; j < data.resultsPage.results.event.length; j++) {
              var distance = getDistance(
                lat,
                long,
                data.resultsPage.results.event[j].location.lat,
                data.resultsPage.results.event[j].location.lng,
                "K"
              );
              if (
                distance <= 400 ||
                (data.resultsPage.results.event[j].location.city.includes(
                  city
                ) &&
                  city.length < 0)
              ) {
                eventArr[count] = data.resultsPage.results.event[j];
                count++;
              }

              loopCount++;
              if (loopCount === entries) {
                resolve(eventArr);
              }
            }
          });
        }
      });
    })
    .then((data) => {
      printUpEvents();
    });
}

function getImage(url) {
  let bandImgRequest = new XMLHttpRequest();
  bandImgRequest.open("GET", url);
  bandImgRequest.onload = function () {
    let bandImgData = JSON.parse(bandImgRequest.responseText);

    var relations = bandImgData.relations;
    for (var i = 0; i < relations.length; i++) {
      document.getElementById("image").src = "";
      let imageUrl = relations[i].url.resource;
      if (relations[i].type === "image") {
        if (imageUrl.startsWith("https://commons.wikimedia.org/wiki/File:")) {
          var filename = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

          imageUrl =
            "https://commons.wikimedia.org/wiki/Special:Redirect/file/" +
            filename;
          let img = (document.getElementById("image").src = imageUrl);
          document.getElementById("image").style.visibility = "visible";
          break;
        }
      } else if (
        (relations.length - 1 === i) &
        (relations[i].type != "image")
      ) {
        let img = (document.getElementById("image").src = "/img/no-photo7.png");
        document.getElementById("image").style.visibility = "visible";
        break;
      }
    }
  };

  bandImgRequest.send();
}

async function getBandAsync(bandData, i) {
  let response = await fetch(
    `https://api.songkick.com/api/3.0/artists/${bandData.resultsPage.results.artist[0].id}/gigography.json?page=${i}&apikey=APIKEY`
  );
  let data = await response.json();
  return data;
}

async function getEventAsync(eventData, i) {
  let response = await fetch(
    `https://api.songkick.com/api/3.0/artists/mbid:${eventData}/calendar.json?page=${i}&apikey=APIKEY`
  );
  let data = await response.json();
  return data;
}

function resetElements() {
  document.getElementById("event").innerHTML = "";
  document.getElementById("btn").innerHTML = "";
  document.getElementById("up-event").innerHTML = "";
  bandField.value = "";
  cityField.value = "";
  bandField.focus();
  dataArr = [];
  eventArr = [];
}
