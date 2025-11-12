let submitted = false;

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
   * 1. ΗΜΕΡΟΛΟΓΙΟ ΡΑΝΤΕΒΟΥ
   * ========================= */
  const calendarEl = document.getElementById("calendar");
  const bookingForm = document.getElementById("booking-form");
  const slotSelect = document.getElementById("slot");
  const confirmation = document.getElementById("confirmation");

  if (calendarEl && bookingForm && slotSelect && confirmation) {
    const startHour = 9;
    const endHour = 18;
    const days = 7;
    const today = new Date();

    // Δημιουργία grid ημερών + ωρών
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dateStr = date.toLocaleDateString("el-GR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const dayDiv = document.createElement("div");
      dayDiv.classList.add("day");

      const title = document.createElement("h3");
      title.textContent = dateStr;
      dayDiv.appendChild(title);

      const timesDiv = document.createElement("div");
      timesDiv.classList.add("times");

      for (let h = startHour; h < endHour; h++) {
        const time = `${h.toString().padStart(2, "0")}:00`;
        const btn = document.createElement("button");
        btn.textContent = time;
        btn.classList.add("slot-btn");
        btn.dataset.time = time;
        btn.dataset.date = dateStr;

        btn.addEventListener("click", () => {
          btn.classList.toggle("closed");
          updateSlotsDropdown();
        });

        timesDiv.appendChild(btn);
      }

      dayDiv.appendChild(timesDiv);
      calendarEl.appendChild(dayDiv);
    }

    function updateSlotsDropdown() {
      const openSlots = document.querySelectorAll(".slot-btn:not(.closed)");
      slotSelect.innerHTML = "";

      if (openSlots.length === 0) {
        const opt = document.createElement("option");
        opt.textContent = "Δεν υπάρχουν διαθέσιμες ώρες";
        opt.disabled = true;
        opt.selected = true;
        slotSelect.appendChild(opt);
        return;
      }

      openSlots.forEach((btn, index) => {
        const opt = document.createElement("option");
        opt.value = `${btn.dataset.date} - ${btn.dataset.time}`;
        opt.textContent = opt.value;
        if (index === 0) opt.selected = true;
        slotSelect.appendChild(opt);
      });
    }

    // Αρχική γέμιση του dropdown
    updateSlotsDropdown();

    // Υποβολή φόρμας ραντεβού
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const selectedSlot = slotSelect.value;

      if (!selectedSlot) {
        confirmation.textContent = "Παρακαλώ επιλέξτε διαθέσιμη ώρα.";
        confirmation.style.color = "red";
        return;
      }

      // === ΝΕΑ ΠΡΟΣΘΗΚΗ: Συνδυασμός ημερομηνίας & ώρας για Google Form ===
      const dateInput = document.getElementById("date");
      const timeInput = document.getElementById("time");
      const datetimeHidden = document.getElementById("datetime");

      if (dateInput && timeInput && datetimeHidden) {
        datetimeHidden.value = `${dateInput.value} ${timeInput.value}`;
      }

      // Εμφάνιση προσωρινού μηνύματος καταχώρησης
      submitted = true;
      confirmation.textContent = "🔄 Καταχωρούμε το ραντεβού σας...";
      confirmation.style.color = "orange";

      setTimeout(() => {
        confirmation.textContent = `💖 Ευχαριστούμε, ${name}! Το ραντεβού σας καταχωρήθηκε επιτυχώς για ${selectedSlot}.`;
        confirmation.style.color = "green";
        bookingForm.reset();
        updateSlotsDropdown();
        submitted = false;
      }, 1500);
    });
  }

  /* =========================
   * 2. GALLERY (FADE + AUTO-SLIDE)
   * ========================= */
  const galleryWrapper = document.querySelector(".gallery-wrapper");
  const prevBtn = document.querySelector(".gallery-btn.prev");
  const nextBtn = document.querySelector(".gallery-btn.next");

  if (galleryWrapper && prevBtn && nextBtn) {
    const images = galleryWrapper.querySelectorAll("img");
    if (images.length > 0) {
      let current = 0;
      let intervalId;

      function showImage(index) {
        images.forEach((img, i) => {
          img.classList.toggle("active", i === index);
        });
      }

      function nextImage() {
        current = (current + 1) % images.length;
        showImage(current);
      }

      function prevImageHandler() {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
      }

      function startAutoSlide() {
        intervalId = setInterval(nextImage, 5000);
      }

      function resetAutoSlide() {
        clearInterval(intervalId);
        startAutoSlide();
      }

      nextBtn.addEventListener("click", () => {
        nextImage();
        resetAutoSlide();
      });

      prevBtn.addEventListener("click", () => {
        prevImageHandler();
        resetAutoSlide();
      });

      showImage(current);
      startAutoSlide();
    }
  }
});

// ===== FADE-IN ON SCROLL =====
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

setTimeout(() => {
  document.querySelectorAll("section, header, footer").forEach(el => observer.observe(el));
}, 1200);
