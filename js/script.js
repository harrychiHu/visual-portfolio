document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".masonry__item");
  const lightbox = document.querySelector(".lightbox");
  const lbImg = document.querySelector(".lightbox__img");
  const closeBtn = document.querySelector(".lightbox__close");

  const openLightbox = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || "Artwork preview";
    lightbox.classList.add("is-open");
    document.body.classList.add("is-locked");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lbImg.src = "";
    lbImg.alt = "";
    document.body.classList.remove("is-locked");
  };

  lightbox.addEventListener("click", (e) => {
    if (e.target.closest(".lightbox__inner")) return;
    closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!lightbox.classList.contains("is-open")) return;
    closeLightbox();
  });

  closeBtn.addEventListener("click", closeLightbox);

  items.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();

      const thumbImg = a.querySelector("img");
      if (!thumbImg) return;

      const full = a.dataset.full || thumbImg.src;
      openLightbox(full, thumbImg.alt);
    });
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
