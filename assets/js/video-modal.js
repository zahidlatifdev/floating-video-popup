
"use strict";
let popupWrapper = document.getElementById("popup_wrapper");
let popupVideo = document.getElementById("popup_video");
let popupToggler = document.querySelector(".popup_toggler");
let popupFullPlay = document.getElementById("popup_full-play");
let popupFullReplay = document.getElementById("popup_full-replay");
let popupFullVolume = document.getElementById("popup_full-volume");
let popupFullMute = document.getElementById("popup_full-mute");
let popupFullExpand = document.getElementById("popup_full-expand");
let popupFullBtn = document.getElementById("popup_full-btn");
let popupText = document.getElementById("popup_text");
let popupClose = document.querySelector(".popup_close");
let popupFullClose = document.querySelector(".popup_full-close");
let popupFormClose = document.querySelector(".popup_form-close");
let popupAddFrom = document.querySelector(".popup_add-form");
let emailForm = document.querySelector(".popup_email-form");
let popupEmailSubmit = document.querySelector(".popup_email-submit");

/* change video start */
let video = document.getElementById("playVideo");
/* change video end */

popupVideo.autoplay = true;
popupVideo.muted = true;
popupVideo.loop = true;
popupFullExpand.addEventListener("click", () => {
  popupVideo.requestFullscreen();
});

// Pause video on borwser tab switch
var frontend_scripts = { pause_on_switch: "1" };
if (frontend_scripts.pause_on_switch) {
  document.addEventListener("visibilitychange", () => {
    if (document["hidden"] || (emailForm && emailForm.classList.contains("email-form-active"))) {
      popupVideo.pause();
    } else {
      popupVideo.play();
      popupFullPlay.style.display = "none";
      popupWrapper.classList.add("play-video");
    }
  });
}

// REPLAY POPUP
popupFullReplay.addEventListener("click", () => {
  popupVideo.currentTime = 0;
});
// VOLUME UP
popupFullVolume.addEventListener("click", () => {
  popupFullMute.style.display = "flex";
  popupFullVolume.style.display = "none";
  popupVideo.muted = true;
});
// VOLUME MUTE
popupFullMute.addEventListener("click", () => {
  popupFullVolume.style.display = "flex";
  popupFullMute.style.display = "none";
  popupVideo.muted = false;
});
// VIDEO PLAY
popupFullPlay.addEventListener("click", () => {
  popupVideo.play();
  popupFullPlay.style.display = "none";
  popupWrapper.classList.toggle("play-video");
});
// CLOSE TOTAL POPUP
popupClose.addEventListener("click", () => {
  popupWrapper.style.display = "none";
});

// CLOSE FULL POPUP
popupFullClose.addEventListener("click", () => {
  popupWrapper.classList.remove("popup_wrapper-full");
  popupWrapper.classList.remove("play-video");
  popupVideo.muted = true;
  popupVideo.play();
  popupFullBtn.style.display = "none";
});
// OPEN FULL POPUP
const videoModal = () => {
  if (!popupWrapper.classList.contains("popup_wrapper-full")) {
    popupVideo.currentTime = 0;
  }
  popupWrapper.classList.add("popup_wrapper-full");
  popupWrapper.classList.toggle("play-video");
  popupVideo.muted = false;

  popupFullMute.style.display = "none";
  popupFullVolume.style.display = "flex";
  if (popupWrapper.classList.contains("play-video")) {
    popupVideo.play();
    popupFullPlay.style.display = "none";
  } else {
    popupVideo.pause();
    popupFullPlay.style.display = "flex";
  }
  popupFullBtn.style.display = "block";
};

popupVideo.addEventListener("click", () => {
  videoModal();
});
popupText.addEventListener("click", () => {
  videoModal();
});
/* change video start */
function videoChange(videoUrl) {
  video.setAttribute("src", videoUrl);
  popupVideo.load();
  popupVideo.play();
  popupFullPlay.style.display = "none";
  popupWrapper.classList.toggle("play-video");
}
/* change video end */

/* Email form */
if (popupAddFrom) {
  popupAddFrom.addEventListener("click", () => {
    emailForm.classList.add("email-form-active");
    popupVideo.pause();
  });
}
popupFullClose.addEventListener("click", () => {
  emailForm.classList.remove("email-form-active");
  popupVideo.play();
});

if (emailForm) {
  emailForm.addEventListener("submit", function (e) {
    const formData = new FormData(emailForm);
    e.preventDefault();
    let object = {};
    formData.forEach((value, key) => {
      object[key] = value;
    });
    let json = JSON.stringify(object);
    popupEmailSubmit.innerHTML = "Please wait...";

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: json,
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          popupEmailSubmit.innerHTML = json.message;
        } else {
          popupEmailSubmit.innerHTML = json.message;
        }
      })
      .catch((error) => {
        console.log(error);
        popupEmailSubmit.innerHTML = "Something went wrong!";
      })
      .then(function () {
        emailForm.reset();
        setTimeout(() => {
          popupEmailSubmit.innerHTML = "Send email";
        }, 5000);
      });
  });
}

// ON SCROLL SIZE CHANGE
window.addEventListener("scroll", function (event) {
  let scroll = scrollY;
  if (scroll > 1) {
    popupWrapper.classList.add("popup_wrapper-resize");
  } else {
    popupWrapper.classList.remove("popup_wrapper-resize");
  }
});