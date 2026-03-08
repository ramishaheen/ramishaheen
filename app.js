const STORAGE_KEY = "camera-dashboard-v1";

function suggestTags(camera) {
  const text = `${camera.name} ${camera.location} ${camera.url}`.toLowerCase();
  const rules = {
    traffic: ["road", "highway", "intersection", "traffic"],
    weather: ["weather", "rain", "snow", "storm"],
    beach: ["beach", "coast", "bay", "ocean"],
    city: ["city", "downtown", "urban"],
    parking: ["parking", "garage", "lot"],
    transport: ["airport", "station", "rail", "metro"],
  };

  const tags = Object.entries(rules)
    .filter(([, words]) => words.some((word) => text.includes(word)))
    .map(([tag]) => tag);

  if (text.includes("youtube.com") || text.includes("youtu.be")) tags.push("youtube-stream");
  if (text.includes("m3u8")) tags.push("hls");

  return [...new Set(tags)].join(", ") || "public-camera";
}

function loadCameras() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCameras(cameras) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cameras));
}

function showFlash(message, isError = false) {
  const flash = document.getElementById("flash");
  flash.textContent = message;
  flash.classList.remove("hidden", "error", "success");
  flash.classList.add(isError ? "error" : "success");
  setTimeout(() => flash.classList.add("hidden"), 2400);
}

function normalizeYouTubeUrl(url) {
  if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
  if (url.includes("youtu.be/")) return url.replace("youtu.be/", "youtube.com/embed/");
  return url;
}

function createPreview(camera) {
  const wrapper = document.createElement("div");
  if (camera.tags.includes("youtube-stream")) {
    const iframe = document.createElement("iframe");
    iframe.src = normalizeYouTubeUrl(camera.url);
    iframe.title = camera.name;
    iframe.loading = "lazy";
    iframe.allowFullscreen = true;
    wrapper.appendChild(iframe);
  } else {
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "none";
    const source = document.createElement("source");
    source.src = camera.url;
    video.appendChild(source);
    wrapper.appendChild(video);
  }
  return wrapper;
}

function render() {
  const cameras = loadCameras();
  const grid = document.getElementById("camera-grid");
  const template = document.getElementById("camera-card-template");
  grid.innerHTML = "";

  if (!cameras.length) {
    grid.innerHTML = "<p>No cameras yet. Add a public link to get started.</p>";
    return;
  }

  cameras.forEach((camera) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelector(".camera-name").textContent = camera.name;
    fragment.querySelector(".camera-location").textContent = camera.location || "Not set";
    fragment.querySelector(".camera-tags").textContent = camera.tags;
    fragment.querySelector(".camera-notes").textContent = camera.notes;

    const link = fragment.querySelector(".camera-link");
    link.href = camera.url;
    link.textContent = camera.url;

    fragment.querySelector(".preview-slot").appendChild(createPreview(camera));

    fragment.querySelector(".delete-btn").addEventListener("click", () => {
      const updated = loadCameras().filter((item) => item.id !== camera.id);
      saveCameras(updated);
      render();
      showFlash("Camera removed.");
    });

    grid.appendChild(fragment);
  });
}

function initForm() {
  const form = document.getElementById("camera-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const camera = {
      id: crypto.randomUUID(),
      name: document.getElementById("name").value.trim(),
      url: document.getElementById("url").value.trim(),
      location: document.getElementById("location").value.trim(),
      notes: document.getElementById("notes").value.trim(),
    };

    if (!camera.name || !camera.url.startsWith("http")) {
      showFlash("Add a camera name and a valid http(s) URL.", true);
      return;
    }

    camera.tags = suggestTags(camera);
    const cameras = loadCameras();
    cameras.unshift(camera);
    saveCameras(cameras);

    form.reset();
    render();
    showFlash("Camera saved.");
  });
}

initForm();
render();
