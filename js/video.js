document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".video-item");
  const lightbox = document.querySelector("#video-lightbox");
  const frame = document.querySelector("#video-lightbox-frame");
  const closeBtn = document.querySelector("#video-lightbox-close");

  if (!lightbox || !frame || !closeBtn || items.length === 0) return;

  const getYoutubeId = (value) => {
    if (!value) return "";
    const raw = value.trim();
    if (!raw) return "";

    if (!raw.includes("http")) return raw;

    try {
      const url = new URL(raw);
      if (url.hostname.includes("youtu.be")) {
        return url.pathname.replace("/", "");
      }
      if (url.hostname.includes("youtube.com")) {
        const byQuery = url.searchParams.get("v");
        if (byQuery) return byQuery;

        const parts = url.pathname.split("/").filter(Boolean);
        if (parts[0] === "shorts" && parts[1]) return parts[1];
        if (parts[0] === "embed" && parts[1]) return parts[1];
      }
    } catch (_) {
      return "";
    }
    return "";
  };

  const buildEmbedUrl = (youtubeValue) => {
    const id = getYoutubeId(youtubeValue);
    if (!id) return "";
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  };

  const openLightbox = (youtubeValue) => {
    const embedUrl = buildEmbedUrl(youtubeValue);
    if (!embedUrl) return;

    frame.src = embedUrl;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-locked");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.classList.remove("is-locked");
  };

  items.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(item.dataset.youtube || "");
    });
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target.closest(".lightbox__inner")) return;
    closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!lightbox.classList.contains("is-open")) return;
    closeLightbox();
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );

  items.forEach((item) => io.observe(item));
});
