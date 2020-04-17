var dataArr = [];
var eventArr = [];
function createPages(entries) {
  for (let i = 1; i < entries / 50 + 1; i++) {
    document.getElementById(
      "btn"
    ).innerHTML += `<li value="${i}" id="${i}" class="button-items button-color"/>${i}</li>`;
  }
  var firstId = document.getElementById("1");
  firstId.classList.remove("button-color");
}

function printEvents(page = 1) {
  document.getElementById("event").innerHTML = "";
  document.getElementById("event").innerHTML = `<h1>Past Events<h1><hr>`;
  for (let i = 1 * page * 50 - 50; i < 50 * page; i++) {
    if (i != dataArr.length) {
      document.getElementById(
        "event"
      ).innerHTML += `<a href="${dataArr[i].uri}" target="_blank"><div class="event-item"> <span> ${dataArr[i].start.date}</span> <h1>${dataArr[i].displayName}</h1> <h3>${dataArr[i].venue.displayName}</h3> <p>${dataArr[i].location.city}</p> </div></a> <hr> `;
    } else {
      break;
    }
  }
}

function printUpEvents() {
  document.getElementById("up-event").innerHTML = "";
  if (eventArr.length != 0) {
    document.getElementById(
      "up-event"
    ).innerHTML = `<h1>Upcoming Events nearby<h1>`;

    for (let i = 0; i < 5 && i < eventArr.length; i++) {
      document.getElementById(
        "up-event"
      ).innerHTML += `<a href="${eventArr[i].uri}" target="_blank"><div class="up-event-item"> <span> ${eventArr[i].start.date}</span> <h2>${eventArr[i].displayName}</h2> <h3>${eventArr[i].venue.displayName}</h3> <p>${eventArr[i].location.city}</p> </div></a> <hr>`;
    }
  }
}
