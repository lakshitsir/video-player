let current = null;
let hls = null;

const video = document.getElementById("video");
const audio = document.getElementById("audio");
const iframe = document.getElementById("iframe");
const statusText = document.getElementById("status");

function reset() {
  if (hls) {
    hls.destroy();
    hls = null;
  }

  [video, audio].forEach(p => {
    p.pause();
    p.src = "";
    p.style.display = "none";
  });

  iframe.src = "";
  iframe.style.display = "none";

  current = null;
  statusText.innerText = "";
}

function loadMedia() {
  const url = document.getElementById("urlInput").value.trim();
  if (!url) return statusText.innerText = "Enter URL";

  reset();

  try {
    // 🔥 YOUTUBE EMBED
    if (url.includes("youtube") || url.includes("youtu.be")) {
      iframe.style.display = "block";
      iframe.src = getYT(url);
      return;
    }

    // 🔥 OTHER EMBED SITES
    if (url.includes("vimeo") || url.includes("dailymotion")) {
      iframe.style.display = "block";
      iframe.src = url;
      return;
    }

    // 🔥 HLS STREAM
    if (url.includes(".m3u8")) {
      video.style.display = "block";
      current = video;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      playWithSound(video);
      return;
    }

    // 🎬 VIDEO FILE
    if (url.match(/\.(mp4|webm|mov|mkv)$/i)) {
      video.style.display = "block";
      video.src = url;
      current = video;
      playWithSound(video);
      return;
    }

    // 🎵 AUDIO FILE
    if (url.match(/\.(mp3|wav|aac|ogg)$/i)) {
      audio.style.display = "block";
      audio.src = url;
      current = audio;
      playWithSound(audio);
      return;
    }

    // 🧠 FALLBACK
    video.style.display = "block";
    video.src = url;
    current = video;
    playWithSound(video);

  } catch (e) {
    statusText.innerText = "Playback failed";
    console.error(e);
  }
}

// 🔊 AUDIO FIX (important)
function playWithSound(player) {
  player.muted = false;

  player.play().catch(() => {
    // autoplay blocked → user click required
    statusText.innerText = "Tap play to start audio";
  });
}

// ⏩ SEEK
function seek(sec) {
  if (!current) return;
  current.currentTime += sec;
}

// ⏯ PLAY/PAUSE
function togglePlay() {
  if (!current) return;
  current.paused ? current.play() : current.pause();
}

// 🎬 YT PARSER
function getYT(url) {
  try {
    if (url.includes("youtu.be")) {
      return "https://www.youtube.com/embed/" + url.split("youtu.be/")[1] + "?autoplay=1";
    } else {
      const id = new URL(url).searchParams.get("v");
      return "https://www.youtube.com/embed/" + id + "?autoplay=1";
    }
  } catch {
    return "";
  }
                                      }
