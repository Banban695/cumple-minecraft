/*==================================================
    INVITACIÓN MINECRAFT
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==============================================
        ELEMENTOS
    ==============================================*/

    const curtain = document.getElementById("curtain");
    const enterButton = document.getElementById("enterButton");
    const invitation = document.getElementById("invitation");

    const music = document.getElementById("backgroundMusic");
    const musicToggle = document.getElementById("musicToggle");

    let invitationStarted = false;

    /*==============================================
        ICONO DE MÚSICA
    ==============================================*/

    function updateMusicIcon() {

        if (!music || !musicToggle) return;

        musicToggle.classList.toggle("muted", music.paused);

    }

    /*==============================================
        ENTRAR A LA INVITACIÓN
    ==============================================*/

    const clickSound = document.getElementById("clickSound");

    if (enterButton && curtain && invitation) {

        enterButton.addEventListener("click", () => {

            curtain.style.opacity = "0";
            curtain.style.pointerEvents = "none";

            // 1. Suena el efecto de 8 segundos, una sola vez
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(() => {
                    console.log("El navegador bloqueó el efecto de sonido.");
                });
            }

            setTimeout(() => {

                curtain.style.display = "none";
                invitation.style.display = "block";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

                // 2. Justo después, empieza la canción principal
                if (music) {
                    music.play().catch(() => {
                        console.log("El navegador bloqueó la reproducción automática.");
                    });
                }

                if (musicToggle) {
                    musicToggle.classList.add("visible");
                }

                invitationStarted = true;

                updateMusicIcon();

            }, 700);

        });

    }

    /*==============================================
        BOTÓN PLAY / PAUSE
    ==============================================*/

    if (music && musicToggle) {

        musicToggle.addEventListener("click", () => {

            if (!invitationStarted) return;

            if (music.paused) {

                music.play();

            } else {

                music.pause();

            }

        });

        music.addEventListener("play", updateMusicIcon);
        music.addEventListener("pause", updateMusicIcon);

    }

    /*==============================================
        CUENTA REGRESIVA
    ==============================================*/

    const eventDate = new Date("2026-08-09T15:00:00").getTime();

    const days = document.getElementById("days");
    const hours = document.getElementById("hours");
    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");

    function updateCountdown() {

        if (!days || !hours || !minutes || !seconds) return;

        const now = new Date().getTime();

        const difference = eventDate - now;

        if (difference <= 0) {

            days.textContent = "00";
            hours.textContent = "00";
            minutes.textContent = "00";
            seconds.textContent = "00";

            return;

        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        days.textContent = String(d).padStart(2, "0");
        hours.textContent = String(h).padStart(2, "0");
        minutes.textContent = String(m).padStart(2, "0");
        seconds.textContent = String(s).padStart(2, "0");

    }

    updateCountdown();

    setInterval(updateCountdown, 1000);

    /*==============================================
        ANIMACIÓN DE CARDS
    ==============================================*/

    const cards = document.querySelectorAll(".minecraft-card");

    if (cards.length) {

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        }, {

            threshold: 0.15

        });

        cards.forEach(card => {

            card.classList.add("hidden-card");

            observer.observe(card);

        });

    }

    /*==============================================
        TOAST "LOGRO DESBLOQUEADO" (estilo Xbox)
    ==============================================*/

    const achievementToast = document.getElementById("achievementToast");

    if (achievementToast) {

        const despedidaCard = document.querySelector(
            "#invitation section:last-of-type .minecraft-card"
        );

        if (despedidaCard) {

            let alreadyShown = false;

            const achievementObserver = new IntersectionObserver((entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting && !alreadyShown) {

                        alreadyShown = true;

                        achievementToast.classList.add("show");

                        // Se queda visible 4 segundos y luego se oculta
                        setTimeout(() => {
                            achievementToast.classList.remove("show");
                        }, 4000);

                        achievementObserver.disconnect();

                    }

                });

            }, { threshold: .5 });

            achievementObserver.observe(despedidaCard);

        }

    }

    /*==============================================
        SLIDER DEL IPHONE
    ==============================================*/

    const sliderTrack = document.getElementById("sliderTrack");
    const prevSlide = document.getElementById("prevSlide");
    const nextSlide = document.getElementById("nextSlide");
    const dotsContainer = document.getElementById("sliderDots");

    if (sliderTrack && dotsContainer) {

        const slides = sliderTrack.querySelectorAll(".slide");

        let currentIndex = 0;

        slides.forEach((_, index) => {

            const dot = document.createElement("button");

            dot.classList.add("slider-dot");

            if (index === 0)
                dot.classList.add("active");

            dot.addEventListener("click", () => {

                goToSlide(index);

            });

            dotsContainer.appendChild(dot);

        });

        const dots = dotsContainer.querySelectorAll(".slider-dot");

        function goToSlide(index) {

            currentIndex = (index + slides.length) % slides.length;

            sliderTrack.style.transform =
                `translateX(-${currentIndex * 100}%)`;

            dots.forEach(dot => {

                dot.classList.remove("active");

            });

            dots[currentIndex].classList.add("active");

        }

        if (prevSlide) {

            prevSlide.addEventListener("click", () => {

                goToSlide(currentIndex - 1);

            });

        }

        if (nextSlide) {

            nextSlide.addEventListener("click", () => {

                goToSlide(currentIndex + 1);

            });

        }

        /* Swipe */

        let startX = 0;

        sliderTrack.addEventListener("touchstart", e => {

            startX = e.touches[0].clientX;

        });

        sliderTrack.addEventListener("touchend", e => {

            const endX = e.changedTouches[0].clientX;

            const diff = startX - endX;

            if (Math.abs(diff) > 40) {

                if (diff > 0) {

                    goToSlide(currentIndex + 1);

                } else {

                    goToSlide(currentIndex - 1);

                }

            }

        });

    }

});
