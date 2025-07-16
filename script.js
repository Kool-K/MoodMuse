document.addEventListener("DOMContentLoaded", function () {
  const moodButtons = document.querySelectorAll(".mood-btn");
  const playlistEmbed = document.getElementById("playlist-embed");
  const placeholder = document.getElementById("placeholder");
  const canvas = document.getElementById("mood-bg");
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  const moodPlaylists = {
    happy: "37i9dQZF1DXdPec7aLTmlC",
    sad: "37i9dQZF1DX7qK8ma5wgG1",
    chill: "37i9dQZF1DX4WYpdgoIcn6",
    energetic: "37i9dQZF1DX0vHZ8elq0UK",
    focused: "37i9dQZF1DX9sIqqvKsjG8",
    romantic: "37i9dQZF1DX5IDTimEWoTd",
  };

  const moodElements = {
    happy: { symbols: ["🌞", "🌈", "😊"], color: "#FFD166" },
    sad: { symbols: ["🌧️", "☔", "😢"], color: "#6C8DFA" },
    chill: { symbols: ["🍃", "☁️", "🌊"], color: "#06D6A0" },
    energetic: { symbols: ["⚡", "💥", "🔥"], color: "#EF476F" },
    focused: { symbols: ["📚", "✏️", "🔍"], color: "#7B2CBF" },
    romantic: { symbols: ["❤️", "💕", "🌹"], color: "#FF70A6" },
  };

  function createMoodElements(mood) {
    const elements = moodElements[mood].symbols;
    const color = moodElements[mood].color;

    document.querySelectorAll(".floating-element").forEach((el) => el.remove());

    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const element = document.createElement("div");
        element.className = "floating-element";
        element.textContent =
          elements[Math.floor(Math.random() * elements.length)];
        element.style.color = color;
        element.style.left = `${Math.random() * 100}%`;
        element.style.top = "-50px";
        element.style.animationDuration = `${Math.random() * 5 + 5}s`;
        document.body.appendChild(element);
      }, i * 300);
    }
  }

  let particles = [];
  const particleCount = 100;

  class Particle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * 2 - 1;
      this.color = color;
      this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.size > 0.2) this.size -= 0.05;
      if (this.opacity > 0) this.opacity -= 0.005;
    }

    draw() {
      ctx.fillStyle = `${this.color
        .replace(")", `, ${this.opacity})`)
        .replace("rgb", "rgba")}`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles(color) {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push(new Particle(x, y, color));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].opacity <= 0 || particles[i].size <= 0.2) {
        particles.splice(i, 1);
        i--;
      }
    }

    if (particles.length < particleCount / 2) {
      const x =
        Math.random() > 0.5
          ? Math.random() * canvas.width
          : Math.random() > 0.5
          ? 0
          : canvas.width;
      const y = Math.random() * canvas.height;
      particles.push(new Particle(x, y, currentColor));
    }

    requestAnimationFrame(animateParticles);
  }

  let currentMood = "happy";
  let currentColor = "rgb(255, 209, 102)";

  function setActiveButton(activeButton) {
    moodButtons.forEach((button) => {
      button.classList.remove("active");
    });
    activeButton.classList.add("active");
    currentMood = activeButton.getAttribute("data-mood");
    currentColor = moodElements[currentMood].color;

    createParticles(currentColor);
    createMoodElements(currentMood);
  }

  function loadPlaylist(playlistId) {
    placeholder.style.display = "none";
    playlistEmbed.innerHTML = `
      <iframe src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0" 
              width="100%" 
              height="352" 
              frameborder="0" 
              allowfullscreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy">
      </iframe>
    `;
  }

  moodButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const mood = this.getAttribute("data-mood");
      setActiveButton(this);
      loadPlaylist(moodPlaylists[mood]);
      document
        .querySelector(".playlist-container")
        .scrollIntoView({ behavior: "smooth" });
    });
  });

  animateParticles();
});