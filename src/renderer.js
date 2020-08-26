// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const { remote } = require("electron");
const { BrowserWindow } = remote;
const $ = require("jquery");
const moment = require("moment");
const path = require("path");
const nativeImage = require("electron").nativeImage;
const storage = require("electron-json-storage");

/* 
  ? Require Node module
*/
const os = require("os");
const fs = require("fs");

let progressBarWidth = 0;
let snoozeStartTime = null;
let snoozeFor;
let isTimerPopupOn = false;
const computerName = `${os.hostname()}-${os.userInfo().username}`;
const alreadyTimeShownFor = {
  eye: false,
  water: false,
  stretch: false,
};
const elem = document.getElementById("timeBar");
let courentTime = null;
const cardText = document.querySelector(".card-text");
const img = document.querySelector("img");
const headingText = document.querySelector(".text-dark");
const btn1 = document.getElementById("snooze-1-btn");
const btn2 = document.getElementById("snooze-2-btn");

let activeTypeBrake = "";
const textObj = {
  eye: "Take Eye Brake.",
  water: "Water Brake.",
  stretch: "Quick Stretch.",
};
var timeCounter = {
  backGroundTimer: null,
  modalTimeInterval: null,
  snoozeTimeInterval: null,
};

/*
 * *App Starts Here.⭐
 */
async function initApp() {
  console.log("hosted at", computerName);
  courentTime = moment().format();
  const dataPath = storage.getDataPath();
  console.log(dataPath);
  storage.get("expireAt", function (error, data) {
    if (error) throw error;
    if (!data.hasOwnProperty("appInstled")) {
      storage.set(
        "expireAt",
        { appInstled: courentTime, expire: moment().add(6, "months").format() },
        (err) => {
          if (err) throw error;
        }
      );
      allwaysBackProcess();
    } else {
      let appInsted = moment(data.appInstled);
      let expire = moment(data.expire);
      let curentdate = moment();
      if (curentdate.diff(appInsted, "month") > 6 && curentdate > expire) {
        crateSettingWindow();
      } else {
        allwaysBackProcess();
      }
      console.log(curentdate.diff(appInsted, "month"));
    }
  });
  localStorage.setItem("appOntime", courentTime);
}

$("#close-btn").on("click", (e) => {
  remote.getCurrentWindow().hide();
  elem.style.width = 0 + "%";
  clearInterval(timeCounter.modalTimeInterval);
  if (activeTypeBrake == "stretch") {
    courentTime = moment().format();
    allwaysBackProcess();
  }
});

btn1.addEventListener("click", (e) => {
  e.preventDefault();
  remote.getCurrentWindow().hide();
  snoozeStartTime = moment();
  elem.style.width = 0 + "%";
  snoozeFor = 1;
  clearInterval(timeCounter.modalTimeInterval);
  clearInterval(timeCounter.backGroundTimer);
  checkSnoozeTimeComplete();
});
btn2.addEventListener("click", (e) => {
  e.preventDefault();
  remote.getCurrentWindow().hide();
  snoozeStartTime = moment();
  elem.style.width = 0 + "%";
  snoozeFor = 2;
  clearInterval(timeCounter.modalTimeInterval);
  clearInterval(timeCounter.backGroundTimer);
  checkSnoozeTimeComplete();
});

function allwaysBackProcess() {
  // elem.style.width = 0 + "%";
  timeCounter.backGroundTimer = setInterval(() => {
    let end = moment();
    let duration = moment.duration(end.diff(courentTime));
    console.log("time deff", duration.asMinutes().toFixed(2) / 20);
    let timeDeff = (duration.asMinutes().toFixed(2) / 20).toFixed(1);
    if (timeDeff == 1.0) {
      if (!alreadyTimeShownFor.eye) {
        activeTypeBrake = "eye";
        remote.getCurrentWindow().show();
        showinterValWithTime(10);
        alreadyTimeShownFor.eye = true;
      }
      // clearInterval(backGroundTimer);
    } else if (timeDeff == 3.0) {
      if (!alreadyTimeShownFor.water) {
        activeTypeBrake = "water";
        remote.getCurrentWindow().show();
        showinterValWithTime(60);
        alreadyTimeShownFor.water = true;
      }
      // clearInterval(backGroundTimer);
    } else if (timeDeff == 6.0) {
      if (!alreadyTimeShownFor.stretch) {
        remote.getCurrentWindow().show();
        activeTypeBrake = "stretch";
        showinterValWithTime(120);
        clearInterval(timeCounter.backGroundTimer);
        alreadyTimeShownFor.stretch = true;
      }
    }
  }, 60000);
}

function showinterValWithTime(time) {
  let timeInterval = 100 / Number(time);
  let remainTime = 0;
  if (activeTypeBrake == "stretch") {
    let iconPath = path.join(__dirname, "../images/stretch.gif");
    const image = nativeImage.createFromPath(iconPath);

    img.src = iconPath;
  } else if (activeTypeBrake == "eye") {
    let iconPath = path.join(__dirname, "../images/tenor.gif");
    const image = nativeImage.createFromPath(iconPath);
    img.src = iconPath;
  } else {
    let iconPath = path.join(__dirname, "../images/drink-water.jpg");
    const image = nativeImage.createFromPath(iconPath);
    img.src = iconPath;
  }
  timeCounter.modalTimeInterval = setInterval(function () {
    headingText.innerText = textObj[activeTypeBrake];
    cardText.innerText = `Time Left: ${Number(time) - remainTime}Sec`;
    if (progressBarWidth >= 101) {
      clearInterval(timeCounter.modalTimeInterval);
      isTimerPopupOn = false;
      progressBarWidth = 0;
      elem.style.width = progressBarWidth + "%";
      remote.getCurrentWindow().hide();
      if (activeTypeBrake == "stretch") {
        console.log("Time reset..");
        alreadyTimeShownFor.water = false;
        alreadyTimeShownFor.eye = false;
        alreadyTimeShownFor.stretch = false;
        courentTime = moment().format();
        allwaysBackProcess();
      }
    } else {
      progressBarWidth = progressBarWidth + timeInterval;
      // console.log(progressBarWidth);

      elem.style.width = progressBarWidth + "%";
      remainTime++;
    }
  }, 1000);
}

function checkSnoozeTimeComplete() {
  timeCounter.snoozeTimeInterval = setTimeout(() => {
    let end = moment();
    let duration = moment.duration(end.diff(courentTime));
    console.log("snooze....", duration.asHours());
    console.log("snooze....for", snoozeFor);

    if (duration.asHours() == snoozeFor) {
      console.log("snooze....for casncel", duration.asHours());
      clearInterval(timeCounter.snoozeTimeInterval);
      initApp();
    }
  }, 60000);
}
function crateSettingWindow() {
  const settingsWindow = new BrowserWindow({
    width: 900,
    height: 700,
    frame: true,
    center: true,
    show: true,
    autoHideMenuBar: true,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  settingsWindow.loadFile(path.join(__dirname, "settings.html"));
  // Open the DevTools.
  // settingsWindow.webContents.openDevTools({ mode: "detach" });

  settingsWindow.on("closed", () => {
    console.log("Settings Colosed..");
  });
}
initApp();
