/* ==========================================================================
   NEON ANARCHY - JINX THEME INTERACTIVE LOGIC (app.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Audio Context variable
    let audioCtx = null;

    // DOM Elements - Loader
    const loadingScreen = document.getElementById("loading-screen");
    const appContent = document.getElementById("app-content");
    const progressBar = document.getElementById("progress-bar");
    const statusText = document.querySelector(".server-status");
    const skipBtn = document.getElementById("skip-loading-btn");
    
    // DOM Elements - Navigation
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const tabPanes = document.querySelectorAll(".tab-pane");
    const scrollToContentBtn = document.querySelector(".scroll-to-content");
    


    // DOM Elements - Restaurant drawers
    const drawerToggleBtns = document.querySelectorAll(".btn-drawer-toggle");

    // DOM Elements - Countdown Timer
    const cdDays = document.getElementById("cd-days");
    const cdHours = document.getElementById("cd-hours");
    const cdMinutes = document.getElementById("cd-minutes");
    const cdSeconds = document.getElementById("cd-seconds");


    // ==========================================
    // QUIET MODERN UI CLICK AUDIO SYNTHESIZER
    // ==========================================
    function initAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    }

    function playClickSound() {
        try {
            initAudioContext();
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = "sine";
            // Fast slide from 650Hz down to 120Hz to simulate a mechanical snap/click
            osc.frequency.setValueAtTime(650, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
            
            // Quiet volume trigger! (0.010 gain is subtle and satisfies "leise" click sound)
            gainNode.gain.setValueAtTime(0.010, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.05);
        } catch (e) {
            // Fallback if browser blocks audio
        }
    }

    // Trigger terminal sounds helper (for self destruct alarm tones)
    function triggerTerminalSpark(startFreq, duration, isExplosion = false) {
        try {
            initAudioContext();
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = isExplosion ? "sawtooth" : "sine";
            osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
            
            if (isExplosion) {
                osc.frequency.exponentialRampToValueAtTime(25, audioCtx.currentTime + duration);
                gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // controlled volume
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            } else {
                osc.frequency.exponentialRampToValueAtTime(startFreq * 0.25, audioCtx.currentTime + duration);
                gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            }
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration + 0.1);
        } catch (e) {}
    }

    // Bind quiet click sound to all interactive elements automatically
    const interactiveElements = document.querySelectorAll("a, button, .btn, .btn-drawer-toggle");
    interactiveElements.forEach(el => {
        el.addEventListener("click", () => {
            // Detonate radio button will handle its own loud alarm sequence, so don't stack clicking sound on it
            if (el.id !== "synth-sound-btn") {
                playClickSound();
            }
        });
    });


    // ==========================================
    // CLAN HACK-DECK STARTUP LOADER (Simple Ticker)
    // ==========================================
    let currentProgress = 0;
    let loadingFinished = false;

    // Loading update loop
    let simInterval = setInterval(() => {
        if (loadingFinished) return;

        if (currentProgress < 85) {
            currentProgress += Math.random() * 3 + 1.2;
            if (currentProgress > 85) currentProgress = 85;
            
            const floorPrg = Math.floor(currentProgress);
            progressBar.style.width = `${floorPrg}%`;
            statusText.textContent = `ESTABLISHING CLAN LINK... ${floorPrg}%`;
        }
    }, 70);

    setTimeout(() => {
        skipBtn.classList.remove("hidden");
    }, 2500);

    skipBtn.addEventListener("click", () => {
        finishLoading("Forced by User");
    });

    // Automatic loading finish trigger (fixes stuck loader/scroll lock bug!)
    setTimeout(() => {
        finishLoading("Simulated Complete");
    }, 3500);
    // Calculate dynamic progress along the 3-event horizontal timeline and grid based on date
    function initTimeline() {
        const dynamicTimeline = document.getElementById("dynamic-timeline");
        const dynamicPlannedGrid = document.getElementById("dynamic-planned-grid");
        
        if (!dynamicTimeline || !dynamicPlannedGrid) return;
        
        // Define exact timestamps and configurations for all 6 events
        const milestones = [
            { date: new Date("2026-07-29T20:00:00").getTime(), name: "Trapped in Crazyness", desc: "Passed Event 🌀" },
            { date: new Date("2026-10-10T20:00:00").getTime(), name: "The Loose Cannon", desc: "Jinx' Geburtstag 🎂" },
            { date: new Date("2026-10-31T20:00:00").getTime(), name: "Halloween", desc: "TBA 🎃" },
            { date: new Date("2026-12-07T20:00:00").getTime(), name: "Meme Energy", desc: "TBA 🤪" },
            { date: new Date("2026-12-24T20:00:00").getTime(), name: "Weihnachten", desc: "TBA 🎄" },
            { date: new Date("2027-02-26T20:00:00").getTime(), name: "MONSTER YOU CREATED", desc: "Melvins Geburtstag! 💥" }
        ];
        
        const now = Date.now();
        
        // Find the index of the next upcoming event (first event with date > now)
        let nextEventIdx = -1;
        for (let i = 0; i < milestones.length; i++) {
            if (milestones[i].date > now) {
                nextEventIdx = i;
                break;
            }
        }
        
        // Identify indices for: Last Event, Next Event, Following Event
        let lastIdx = -1;
        let activeIdx = -1;
        let followingIdx = -1;
        
        if (nextEventIdx === -1) {
            // All events are in the past
            lastIdx = milestones.length - 2;
            activeIdx = milestones.length - 1;
            followingIdx = -1;
        } else if (nextEventIdx === 0) {
            // No events in the past yet
            lastIdx = -1;
            activeIdx = 0;
            followingIdx = 1 < milestones.length ? 1 : -1;
        } else {
            lastIdx = nextEventIdx - 1;
            activeIdx = nextEventIdx;
            followingIdx = nextEventIdx + 1 < milestones.length ? nextEventIdx + 1 : -1;
        }
        
        // Render horizontal timeline HTML structure
        let timelineHTML = `
            <!-- The background track and animated progress line -->
            <div class="timeline-track-container">
                <div class="timeline-track"></div>
                <div class="timeline-progress-line" id="timeline-progress"></div>
        `;
        
        const timelinePositions = [];
        if (lastIdx !== -1) timelinePositions.push({ idx: lastIdx, left: 0, status: "completed" });
        if (activeIdx !== -1) timelinePositions.push({ idx: activeIdx, left: 50, status: "active" });
        if (followingIdx !== -1) timelinePositions.push({ idx: followingIdx, left: 100, status: "future" });
        
        timelinePositions.forEach(pos => {
            const item = milestones[pos.idx];
            const dateStr = new Date(item.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
            
            let descText = item.desc;
            if (pos.status === "completed") {
                if (pos.idx === 0) descText = "Passed Event 🌀";
                else if (pos.idx === 1) descText = "Passed Event 🎂";
                else descText = "Passed Event ✅";
            }
            
            timelineHTML += `
                <div class="timeline-node ${pos.status}" style="left: ${pos.left}%;">
                    <div class="next-event-tooltip">
                        <span class="tooltip-text">NÄCHSTES EVENT</span>
                        <div class="tooltip-arrow"></div>
                    </div>
                    <div class="timeline-dot"></div>
                    <div class="timeline-meta">
                        <div class="timeline-date">${dateStr}</div>
                        <h4>${item.name}</h4>
                        <p class="timeline-desc">${descText}</p>
                    </div>
                </div>
            `;
        });
        
        timelineHTML += `</div>`;
        dynamicTimeline.innerHTML = timelineHTML;
        
        // Calculate the green progress line width
        const timelineProgress = document.getElementById("timeline-progress");
        if (timelineProgress) {
            let targetWidth = 0;
            if (lastIdx !== -1 && activeIdx !== -1) {
                const startVal = milestones[lastIdx].date;
                const endVal = milestones[activeIdx].date;
                const totalInt = endVal - startVal;
                const elapsed = now - startVal;
                const fraction = Math.min(1.0, Math.max(0.0, elapsed / totalInt));
                
                // Active interval is between 0% (lastIdx) and 50% (activeIdx)
                targetWidth = fraction * 50;
            } else if (lastIdx === -1 && activeIdx !== -1) {
                targetWidth = 0;
            } else {
                targetWidth = 100;
            }
            
            // Allow animation to trigger on next tick
            setTimeout(() => {
                timelineProgress.style.width = `${targetWidth}%`;
            }, 100);
        }
        
        // Render remaining/planned events list below
        const shownIndices = [lastIdx, activeIdx, followingIdx];
        const remainingMilestones = milestones.filter((_, index) => !shownIndices.includes(index) && index > lastIdx);
        
        let gridHTML = "";
        remainingMilestones.forEach(item => {
            const dateStr = new Date(item.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            });
            
            gridHTML += `
                <div class="planned-card">
                    <span class="planned-date">${dateStr}</span>
                    <h5>${item.name}</h5>
                    <p class="planned-desc">${item.desc}</p>
                </div>
            `;
        });
        
        if (remainingMilestones.length === 0) {
            gridHTML = `<p class="font-mono text-muted" style="font-size: 0.85rem; padding-left: 10px;">Keine weiteren Events geplant.</p>`;
        }
        
        dynamicPlannedGrid.innerHTML = gridHTML;
    }

    function finishLoading(reason) {
        if (loadingFinished) return;
        loadingFinished = true;
        clearInterval(simInterval);
        
        progressBar.style.width = "100%";
        statusText.textContent = "LINK ESTABLISHED!";
        
        loadingScreen.classList.add("glitch-exit");
        
        setTimeout(() => {
            loadingScreen.classList.add("hidden");
            appContent.classList.remove("hidden");
            
            // Explicitly enable scrolling on body and html
            document.body.style.overflowY = "auto";
            document.documentElement.style.overflowY = "auto";
            
            // Animate timeline progress line based on current date on startup!
            setTimeout(() => {
                initTimeline();
            }, 600);

        }, 500);
    }


    // ==========================================
    // NAVIGATION & TAB SWITCHING (Hero updates & Simulated theme transition loader)
    // ==========================================
    let navSimInterval = null;
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetTab = link.getAttribute("data-tab");
            if (!targetTab) return;
            
            e.preventDefault();

            // Get current active tab
            const currentActiveLink = document.querySelector(".nav-link.active");
            const currentTab = currentActiveLink ? currentActiveLink.getAttribute("data-tab") : "home";

            // If target tab is already active, do nothing
            if (currentTab === targetTab) return;

            // Only trigger loading screen when switching to/from the Archive tab
            const needsLoader = (currentTab === "archive" && targetTab !== "archive") || (currentTab !== "archive" && targetTab === "archive");

            function executeTabSwitch() {
                // Switch tab active states
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                tabPanes.forEach(pane => {
                    pane.classList.remove("active");
                    if (pane.id === `tab-${targetTab}`) {
                        pane.classList.add("active");
                    }
                });

                // Dynamic Hero updates (image, glowing eye, tag, title, and subtitle text)
                const heroBannerImg = document.querySelector(".hero-banner-img");
                const glowingEye = document.querySelector(".jinx-glowing-eye");
                
                const heroTag = document.getElementById("hero-tag");
                const heroTitle = document.getElementById("hero-title");
                const heroSubtitle = document.getElementById("hero-subtitle");

                if (heroBannerImg) {
                    heroBannerImg.style.opacity = 0;
                    if (heroTag) heroTag.style.opacity = 0;
                    if (heroTitle) heroTitle.style.opacity = 0;
                    if (heroSubtitle) heroSubtitle.style.opacity = 0;
                    
                    setTimeout(() => {
                        if (targetTab === "home") {
                            heroBannerImg.src = "assets/banner.jpg";
                            if (glowingEye) glowingEye.classList.remove("hidden");
                            if (heroTag) heroTag.textContent = "WILLKOMMEN IM VERSTECK";
                            if (heroTitle) heroTitle.innerHTML = 'NEON <span class="pink-glow">ANARCHY</span>';
                            if (heroSubtitle) heroSubtitle.textContent = "Bist du bereit für das Chaos? Zocke mit uns, quatsche im Voice-Chat und erlebe spektakuläre Events im legendären Jinx-Hideout-Stil.";
                        } else if (targetTab === "events") {
                            heroBannerImg.src = "assets/uno-banner.jpg";
                            if (glowingEye) glowingEye.classList.add("hidden");
                            if (heroTag) heroTag.textContent = "TERMINE & VERSTECK-SPIELE";
                            if (heroTitle) heroTitle.innerHTML = 'VERRÜCKTE <span class="pink-glow">EVENTS</span>';
                            if (heroSubtitle) heroSubtitle.textContent = "Die nächsten Highlights im Hideout! Schau dir den Live-Countdown an und trag die Termine fett in deinen Kalender ein.";
                        } else if (targetTab === "restaurants") {
                            heroBannerImg.src = "assets/dom-banner.png";
                            if (glowingEye) glowingEye.classList.add("hidden");
                            if (heroTag) heroTag.textContent = "KNALLHARTE ERGEBNISSE";
                            if (heroTitle) heroTitle.innerHTML = 'FOOD <span class="pink-glow">RANKINGS</span>';
                            if (heroSubtitle) heroSubtitle.textContent = "Melvin, Nicker und Daniel bewerten die besten Food-Spots der Stadt. Knallhart ehrlich, unzensiert und hungrig.";
                        } else if (targetTab === "archive") {
                            heroBannerImg.src = "assets/loose-cannon-2025.jpg";
                            if (glowingEye) glowingEye.classList.add("hidden");
                            if (heroTag) heroTag.textContent = "LEGENDÄRES CHAOS";
                            if (heroTitle) heroTitle.innerHTML = 'EVENT <span class="pink-glow">ARCHIV</span>';
                            if (heroSubtitle) heroSubtitle.textContent = "Ein Blick zurück auf unsere vergangenen Aktionen, Geburtstage und Weihnachtsfeiern im Jinx-Stil.";
                        }
                        
                        // Fade back in
                        heroBannerImg.style.opacity = 0.7;
                        if (heroTag) heroTag.style.opacity = 1;
                        if (heroTitle) heroTitle.style.opacity = 1;
                        if (heroSubtitle) heroSubtitle.style.opacity = 1;
                    }, 100);
                }

                // Scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }

            if (needsLoader) {
                // Lock scroll and show loading screen
                document.body.style.overflowY = "hidden";
                document.documentElement.style.overflowY = "hidden";
                loadingScreen.classList.remove("hidden");
                loadingScreen.classList.remove("glitch-exit");
                progressBar.style.width = "0%";

                // Apply theme switch and loader styles depending on target tab
                const loaderAvatar = document.querySelector(".loader-avatar");
                const loaderTitle = document.getElementById("loader-title");
                const loadingSubtext = document.querySelector(".loading-subtext");
                
                if (targetTab === "archive") {
                    document.body.classList.add("archive-theme");
                    loadingScreen.classList.add("archive-loading");
                    if (loaderAvatar) loaderAvatar.src = "assets/monster-2025.png";
                    if (loaderTitle) {
                        loaderTitle.textContent = "DECRYPTING EVENT ARCHIVES";
                        loaderTitle.setAttribute("data-text", "DECRYPTING EVENT ARCHIVES");
                    }
                    statusText.textContent = "MOUNTING RETRO SECTORS...";
                    if (loadingSubtext) loadingSubtext.textContent = "Durchstöbere die Archive unserer vergangenen Aktionen und Highlights.";
                } else {
                    document.body.classList.remove("archive-theme");
                    loadingScreen.classList.remove("archive-loading");
                    if (loaderAvatar) loaderAvatar.src = "assets/loader-jinx.jpg";
                    if (loaderTitle) {
                        loaderTitle.textContent = "ACCESSING HIDE-OUT SYSTEMS";
                        loaderTitle.setAttribute("data-text", "ACCESSING HIDE-OUT SYSTEMS");
                    }
                    statusText.textContent = "ESTABLISHING CLAN LINK...";
                    if (loadingSubtext) loadingSubtext.textContent = "Willkommen im Hideout. Entdecke unsere aktuellen Events und Restaurant-Rankings.";
                }

                // Simulate progress bar loading animation (quick 1.0s transition)
                let prg = 0;
                if (navSimInterval) clearInterval(navSimInterval);
                navSimInterval = setInterval(() => {
                    prg += 10;
                    progressBar.style.width = `${prg}%`;

                    if (prg >= 100) {
                        clearInterval(navSimInterval);
                        
                        executeTabSwitch();

                        // Hide loading screen and enable scroll
                        loadingScreen.classList.add("glitch-exit");
                        setTimeout(() => {
                            loadingScreen.classList.add("hidden");
                            document.body.style.overflowY = "auto";
                            document.documentElement.style.overflowY = "auto";
                        }, 400);
                    }
                }, 60);
            } else {
                // Instant switch (no loader)
                if (targetTab === "archive") {
                    document.body.classList.add("archive-theme");
                } else {
                    document.body.classList.remove("archive-theme");
                }
                executeTabSwitch();
            }

            if (navMenu.classList.contains("mobile-open")) {
                navMenu.classList.remove("mobile-open");
                menuToggle.classList.remove("open");
            }
        });
    });

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-open");
        menuToggle.classList.toggle("open");
    });

    if (scrollToContentBtn) {
        scrollToContentBtn.addEventListener("click", () => {
            const homeTab = document.getElementById("tab-home");
            if (homeTab) {
                homeTab.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }





    // ==========================================
    // FULL RESTAURANT ACCORDION DRAWERS
    // ==========================================
    drawerToggleBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const drawerId = btn.getAttribute("data-drawer");
            const drawer = document.getElementById(drawerId);
            
            if (!drawer) return;
            
            const isCollapsed = drawer.classList.contains("collapsed");
            
            if (isCollapsed) {
                drawer.classList.remove("collapsed");
                drawer.classList.add("expanded");
                btn.textContent = "Detailbewertungen ausblenden ↩";
            } else {
                drawer.classList.remove("expanded");
                drawer.classList.add("collapsed");
                btn.textContent = "Bewertungen im Detail anzeigen ➔";
            }
        });
    });


    // ==========================================
    // LIVE COUNTDOWN TIMER (Featured Next Event)
    // ==========================================
    // Target: October 10, 2026 00:00:00 CEST (Loose Cannon event date)
    const targetDate = new Date("2026-10-10T00:00:00+02:00").getTime();

    function updateCountdown() {
        if (!cdDays || !cdHours || !cdMinutes || !cdSeconds) return;

        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            updateTimeElement(cdDays, "00");
            updateTimeElement(cdHours, "00");
            updateTimeElement(cdMinutes, "00");
            updateTimeElement(cdSeconds, "00");
            document.querySelector(".countdown-title").textContent = "EVENT AKTIV!";
            return;
        }

        // Calculate time parts
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update elements with smooth animations
        updateTimeElement(cdDays, String(days).padStart(2, "0"));
        updateTimeElement(cdHours, String(hours).padStart(2, "0"));
        updateTimeElement(cdMinutes, String(minutes).padStart(2, "0"));
        updateTimeElement(cdSeconds, String(seconds).padStart(2, "0"));
    }

    // Helper to update text digits with a fade out/in transition effect
    function updateTimeElement(el, newVal) {
        if (el.textContent !== newVal) {
            el.classList.add("changing");
            setTimeout(() => {
                el.textContent = newVal;
                el.classList.remove("changing");
            }, 120); // Syncs with 0.12s transition duration in CSS
        }
    }

    // Run countdown updates every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Run immediately
});
