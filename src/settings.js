const remote = require("electron").remote;
const $ = require("jquery");
const jQuery = require("jquery");
const moment = require("moment");
require("popper.js");
require("bootstrap/dist/js/bootstrap");
const nativeImage = require("electron").nativeImage;
const firebaseConfig = require("./firebase");
const storage = require("electron-json-storage");

const os = require("os");
const fs = require("fs");

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
var emotionsArray = ["angry", "disappointed", "meh", "happy", "inlove"];
const computerName = `${os.hostname()}-${os.userInfo().username}`;
const feedbackSubmitBtn = document.getElementById("feedbackSubmit");
const dateValue = document.getElementById("updateDays");
$(document).ready(function () {
  $("#ratingMyapp").emotionsRating({
    emotions: emotionsArray,
    bgEmotion: "happy",
    count: 5,
    inputName: "ratings",
  });

  storage.get("expireAt", function (error, data) {
    // console.log(data);
    let expiredate = moment(data.expire);
    let curentdate = moment();
    dateValue.innerText = `${expiredate.diff(curentdate, "days")} Days`;
  });
});
feedbackSubmitBtn.addEventListener("click", (e) => {
  feedbackSubmitBtn.setAttribute("disabled", true);
  e.preventDefault();
  console.log("Sbmit clicked");

  let name = document.getElementById("feedbackName").value;
  let msg = document.getElementById("feedbackMsg").value;
  let rating = $("input[name=ratings]").val();
  let obj = {
    msg,
    pcName: `${computerName}----${name}`,
    rating,
  };
  db.collection("rating")
    .add(obj)
    .then((ref) => {
      feedbackSubmitBtn.removeAttribute("disabled");
      document.getElementById("feedbackFrm").reset();
      $("input[name=ratings]").val("0");
      $("#feedbackAlert").addClass("show");
      setTimeout(() => {
        $("#feedbackAlert").removeClass("show");
      }, 5000);
      console.log("Added document with ID: ", ref.id);
    });
  console.log(rating);
});
