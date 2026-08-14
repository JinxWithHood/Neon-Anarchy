/* ==========================================================================
   NEON ANARCHY - JINX THEME INTERACTIVE LOGIC (app.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Audio Context variable
    let audioCtx = null;
    let globalCenterViewport = null;

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

            function executeTabSwitch(instant) {
                // Helper to perform tab state switch immediately
                function performStateSwitch() {
                    navLinks.forEach(l => l.classList.remove("active"));
                    link.classList.add("active");

                    tabPanes.forEach(pane => {
                        pane.classList.remove("active");
                        if (pane.id === `tab-${targetTab}`) {
                            pane.classList.add("active");
                        }
                    });
                }

                // Dynamic Hero updates (image, glowing eye, tag, title, and subtitle text)
                const heroBannerImg = document.querySelector(".hero-banner-img");
                const glowingEye = document.querySelector(".jinx-glowing-eye");
                
                const heroTag = document.getElementById("hero-tag");
                const heroTitle = document.getElementById("hero-title");
                const heroSubtitle = document.getElementById("hero-subtitle");

                let newSrc = "assets/banner.jpg";
                let hideGlowingEye = true;
                let tagText = "";
                let titleHTML = "";
                let subtitleText = "";

                if (targetTab === "home") {
                    newSrc = "assets/banner.jpg";
                    hideGlowingEye = false;
                    tagText = "WILLKOMMEN IM VERSTECK";
                    titleHTML = 'NEON <span class="pink-glow">ANARCHY</span>';
                    subtitleText = "Bist du bereit für das Chaos? Zocke mit uns, quatsche im Voice-Chat und erlebe spektakuläre Events im legendären Jinx-Hideout-Stil.";
                } else if (targetTab === "news") {
                    newSrc = "assets/news-banner.png";
                    hideGlowingEye = true;
                    tagText = "VERSTECK ANKÜNDIGUNGEN";
                    titleHTML = 'SPIELPLATZ <span class="pink-glow">NEWS</span>';
                    subtitleText = "Frische Ankündigungen und Infos direkt aus dem Jinx-Hideout.";
                } else if (targetTab === "events") {
                    newSrc = "assets/uno-banner.jpg";
                    hideGlowingEye = true;
                    tagText = "TERMINE & VERSTECK-SPIELE";
                    titleHTML = 'VERRÜCKTE <span class="pink-glow">EVENTS</span>';
                    subtitleText = "Die nächsten Highlights im Hideout! Schau dir den Live-Countdown an und trag die Termine fett in deinen Kalender ein.";
                } else if (targetTab === "restaurants") {
                    newSrc = "assets/dom-banner.png";
                    hideGlowingEye = true;
                    tagText = "KNALLHARTE ERGEBNISSE";
                    titleHTML = 'FOOD <span class="pink-glow">RANKINGS</span>';
                    subtitleText = "Melvin, Nicker und Daniel bewerten die besten Food-Spots der Stadt. Knallhart ehrlich, unzensiert und hungrig.";
                } else if (targetTab === "crew") {
                    newSrc = "assets/banner.jpg";
                    hideGlowingEye = true;
                    tagText = "";
                    titleHTML = "";
                    subtitleText = "";
                } else if (targetTab === "archive") {
                    newSrc = "assets/loose-cannon-2025.jpg";
                    hideGlowingEye = true;
                    tagText = "LEGENDÄRES CHAOS";
                    titleHTML = 'EVENT <span class="pink-glow">ARCHIV</span>';
                    subtitleText = "Ein Blick zurück auf unsere vergangenen Aktionen, Geburtstage und Weihnachtsfeiern im Jinx-Stil.";
                }

                if (instant) {
                    performStateSwitch();

                    if (targetTab === "crew" && typeof globalCenterViewport === "function") {
                        globalCenterViewport();
                    }

                    if (glowingEye) {
                        if (hideGlowingEye) glowingEye.classList.add("hidden");
                        else glowingEye.classList.remove("hidden");
                    }
                    if (heroTag) { heroTag.textContent = tagText; heroTag.style.opacity = 1; }
                    if (heroTitle) { heroTitle.innerHTML = titleHTML; heroTitle.style.opacity = 1; }
                    if (heroSubtitle) { heroSubtitle.textContent = subtitleText; heroSubtitle.style.opacity = 1; }

                    if (heroBannerImg) {
                        heroBannerImg.src = newSrc;
                        heroBannerImg.style.opacity = 0.7;
                    }
                } else {
                    if (heroBannerImg) {
                        // Start fading out the old banner immediately
                        heroBannerImg.style.opacity = 0;
                        if (heroTag) heroTag.style.opacity = 0;
                        if (heroTitle) heroTitle.style.opacity = 0;
                        if (heroSubtitle) heroSubtitle.style.opacity = 0;
                        
                        setTimeout(() => {
                            // Switch tab state ONLY after the old banner is completely transparent
                            performStateSwitch();

                            if (targetTab === "crew" && typeof globalCenterViewport === "function") {
                                globalCenterViewport();
                            }

                            if (glowingEye) {
                                if (hideGlowingEye) glowingEye.classList.add("hidden");
                                else glowingEye.classList.remove("hidden");
                            }
                            if (heroTag) heroTag.textContent = tagText;
                            if (heroTitle) heroTitle.innerHTML = titleHTML;
                            if (heroSubtitle) heroSubtitle.textContent = subtitleText;

                            // Fade in texts
                            if (heroTag) heroTag.style.opacity = 1;
                            if (heroTitle) heroTitle.style.opacity = 1;
                            if (heroSubtitle) heroSubtitle.style.opacity = 1;

                            // ONLY fade in image after the browser loads it
                            if (heroBannerImg.src.endsWith(newSrc)) {
                                heroBannerImg.style.opacity = 0.7;
                            } else {
                                heroBannerImg.onload = () => {
                                    heroBannerImg.style.opacity = 0.7;
                                };
                                heroBannerImg.src = newSrc;
                            }
                        }, 200);
                    } else {
                        performStateSwitch();
                    }
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
                        
                        executeTabSwitch(true);

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

    // ==========================================
    // INTERACTIVE CREW MAP DATABASE & WANTED REGISTER
    // ==========================================
    const crewData = {
        jinx: {
            name: "Jinx",
            alias: "Melvins Ehefrau / The Loose Cannon",
            bounty: "Melvins unendliche Liebe & 999.999 Hextech-Granaten",
            crime: "Unerlaubte Besetzung von Melvins Gedanken (24/7), Diebstahl von Hextech-Kernen aus dem Piltover-Tresor, exzessiver Graffiti-Vandalismus an städtischen Wänden und unaufhörliches Kuss-Spammen auf allen Discord-Kanälen.",
            strafe: "Lebenslänglicher Kuschel-Arrest mit Melvin im Jinx-Hideout (jeder Fluchtversuch wird gnadenlos mit einer Kuss-Attacke bestraft).",
            status: "Verliebt in Melvin",
            stats: {
                chaos: 100,
                hunger: 40,
                hacking: 85,
                loyalty: 100
            },
            image: "assets/jinx.png"
        },
        melvin: {
            name: "Melvin",
            alias: "Jinx' Ehemann / The Mastermind / Clan-Boss",
            bounty: "Jinx' unendliche Liebe & eine Kiste voll mit glitzernden Shards",
            crime: "Offizielle Liebeserklärung an eine fiktive Zeichentrickfigur, stundenlanges nächtliches Anschmachten von Jinx-Bildern, Klonen von Jinx-Webseiten-Datenbanken und stundenlanges Analysieren von Arcane-Episoden.",
            strafe: "Lebenslängliches Händchenhalten mit Jinx, Zwangsarbeit beim Kochen von Jinx' Lieblingsessen und wöchentliches gemeinsames Anschauen von Arcane (Staffel 1 & 2 in Dauerschleife).",
            status: "Verliebt in Jinx",
            stats: {
                chaos: 95,
                hunger: 98,
                hacking: 99,
                loyalty: 100
            },
            image: "assets/melvin.jpg"
        },
        daniel: {
            name: "Daniel",
            alias: "Daniel (Chief Meme Officer / Der Humor-Verweigerer)",
            bounty: "1.000.000 unlustige Altherren-Witze & 5 verstaubte Archiv-Ordner",
            crime: "Verbreitung von akut gesundheitsgefährdenden Flachwitzen der Stufe 5, illegales Schleusen von Windows-95-Memes in den Chat und das systematische Einfrieren der Voicechat-Stimmung durch beharrliches Nicht-Lachen bei guten Gags.",
            strafe: "Zwangsarbeit beim Verfassen einer 500-seitigen Analyse über „Warum Jinx witziger ist als Daniel“, oder wahlweise täglicher Humorunterricht unter persönlicher Anleitung von Melvin.",
            status: "Nicht witzig sein",
            stats: {
                chaos: 90,
                hunger: 70,
                hacking: 60,
                loyalty: 95
            },
            image: ""
        },
        noger: {
            name: "Noger",
            alias: "Das Nogger-Choc-Eis am Stiel / Frosty Critic",
            bounty: "50 Nogger-Choc-Eise am Stiel (gefroren halten!)",
            crime: "Heimliche Tarnung als Eis am Stiel, Zocken im Tiefkühlfach unter Androhung von Schmelzgefahr, sowie Verursachen von schwerem Gehirnfrost bei seinen Mitspielern durch eiskalte Kommentare.",
            strafe: "Lebenslanger Arrest in der Tiefkühltruhe des Jinx-Hideouts (Schmelzschutzstufe 5), um das sofortige Zerfließen seiner Schokoladen-Rüstung zu verhindern.",
            status: "Eine Ratte anschaffen",
            stats: {
                chaos: 85,
                hunger: 100,
                hacking: 70,
                loyalty: 90
            },
            image: ""
        },
        connor: {
            name: "Connor",
            alias: "Der zukünftige Harzer / BAföG-Hustler",
            bounty: "10 rote BAföG-Mahnungen & ein Stapel ungelesener Lehrbücher",
            crime: "Offizielle Planung einer glorreichen Karriere als professioneller Bürgergeld-Empfänger bereits während der Studienzeit. Illegales Ausschlafen bis 14:00 Uhr und chronisches Verpassen aller Vorlesungen.",
            strafe: "Zwangsarbeit beim handschriftlichen Ausfüllen von 100 komplizierten BAföG-Folgeanträgen ohne Kaffee-Unterstützung oder täglicher Weckdienst um Punkt 07:30 Uhr morgens.",
            status: "Als Student dem Staat Geld klauen und dann als Harzer leben",
            stats: {
                chaos: 85,
                hunger: 90,
                hacking: 95,
                loyalty: 98
            },
            image: ""
        }
    };

    const crewNodes = document.querySelectorAll(".crew-node");
    const crewDrawer = document.getElementById("drawer-crew-details");
    const closeCrewBtn = document.getElementById("close-crew-drawer-btn");
    const wantedContent = document.getElementById("wanted-poster-content");

    if (crewNodes.length > 0 && crewDrawer && wantedContent) {
        crewNodes.forEach(node => {
            node.addEventListener("click", () => {
                const memberId = node.getAttribute("data-member");
                const member = crewData[memberId];
                if (!member) return;

                // Play custom click sound
                playClickSound();

                // If already active and drawer is open, close it
                if (node.classList.contains("active") && !crewDrawer.classList.contains("collapsed")) {
                    crewDrawer.classList.add("collapsed");
                    node.classList.remove("active");
                    return;
                }

                // Remove active class from all nodes
                crewNodes.forEach(n => n.classList.remove("active"));
                node.classList.add("active");

                // Populate Wanted Poster Content
                wantedContent.innerHTML = `
                    <div class="wanted-poster font-mono">
                        <div class="wanted-poster-header">
                            <h2 class="font-marker" style="color: #ff3366; letter-spacing: 5px; margin: 0; text-shadow: 0 0 10px rgba(255, 51, 102, 0.4);">WANTED</h2>
                            <p class="wanted-sub text-cyan" style="font-size: 0.85rem; letter-spacing: 3px; font-weight: bold; margin-top: 5px;">DEAD OR ALIVE</p>
                        </div>
                        
                        <div class="wanted-poster-body">
                            <!-- Classified Stamp ABOVE the avatar image hexagon -->
                            <div class="wanted-stamp">CLASSIFIED</div>
                            
                            <div class="wanted-avatar-box">
                                ${member.image 
                                    ? `<img src="${member.image}" alt="${member.name}" class="wanted-avatar-img">`
                                    : `<div class="wanted-avatar-placeholder">?</div>`
                                }
                            </div>
                            
                            <div class="wanted-info-box" style="margin-top: 15px; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 15px;">
                                <p style="margin: 8px 0; font-size: 1rem;"><strong>NAME:</strong> <span class="text-pink">${member.name}</span></p>
                                <p style="margin: 8px 0; font-size: 1rem;"><strong>POSITION:</strong> <span class="text-cyan">${member.name === "Jinx" || member.name === "Melvin" ? "Boss" : "Lieutenant"}</span></p>
                                <p style="margin: 8px 0; font-size: 1rem;"><strong>STATUS:</strong> <span class="text-gold" style="color: #ffd700;">${member.status}</span></p>
                            </div>
                        </div>
                    </div>
                `;

                // Slide open drawer
                crewDrawer.classList.remove("collapsed");

                // Smooth scroll to drawer
                setTimeout(() => {
                    crewDrawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }, 150);
            });
        });

        if (closeCrewBtn) {
            closeCrewBtn.addEventListener("click", () => {
                playClickSound();
                crewDrawer.classList.add("collapsed");
                crewNodes.forEach(n => n.classList.remove("active"));
            });
        }
    }

    // ==========================================
    // MOUSE DRAG SCROLL PANNING FOR CONSOLE
    // ==========================================
    const consoleViewport = document.querySelector(".console-viewport");
    const tacticalConsole = document.querySelector(".tactical-console");

    if (consoleViewport && tacticalConsole) {
        let isDragging = false;
        let startX, startY;
        let scrollLeft, scrollTop;

        // Center viewport layout initially and on screen resize
        function centerViewport() {
            const vw = consoleViewport.clientWidth;
            const vh = consoleViewport.clientHeight;
            const cw = 1600;
            const ch = 1000;

            if (cw < vw) {
                tacticalConsole.style.left = `${(vw - cw) / 2}px`;
            } else {
                tacticalConsole.style.left = '0px';
            }

            if (ch < vh) {
                tacticalConsole.style.top = `${(vh - ch) / 2}px`;
            } else {
                tacticalConsole.style.top = '0px';
            }

            consoleViewport.scrollLeft = Math.max(0, (cw - vw) / 2);
            consoleViewport.scrollTop = Math.max(0, (ch - vh) / 2);
        }

        globalCenterViewport = centerViewport;

        setTimeout(centerViewport, 120);
        window.addEventListener("resize", centerViewport);

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                if (link.getAttribute("data-tab") === "crew") {
                    setTimeout(centerViewport, 250);
                }
            });
        });

        consoleViewport.addEventListener("mousedown", (e) => {
            if (e.target.closest(".crew-node")) return;

            isDragging = true;
            consoleViewport.classList.add("dragging");
            startX = e.pageX - consoleViewport.offsetLeft;
            startY = e.pageY - consoleViewport.offsetTop;
            scrollLeft = consoleViewport.scrollLeft;
            scrollTop = consoleViewport.scrollTop;
        });

        consoleViewport.addEventListener("mouseleave", () => {
            isDragging = false;
            consoleViewport.classList.remove("dragging");
        });

        consoleViewport.addEventListener("mouseup", () => {
            isDragging = false;
            consoleViewport.classList.remove("dragging");
        });

        consoleViewport.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - consoleViewport.offsetLeft;
            const y = e.pageY - consoleViewport.offsetTop;
            const walkX = (x - startX) * 1.5;
            const walkY = (y - startY) * 1.5;
            consoleViewport.scrollLeft = scrollLeft - walkX;
            consoleViewport.scrollTop = scrollTop - walkY;
        });
    }

    // ==========================================
    // CLAN HACK-DECK LOGIN & SHARING BLOG ENGINE
    // ==========================================
    const navLoginBtn = document.getElementById("nav-login-btn");
    const navProfileBadge = document.getElementById("nav-profile-badge");
    const navUsernameSpan = document.getElementById("nav-username");
    const navLogoutBtn = document.getElementById("nav-logout-btn");
    
    const loginModal = document.getElementById("login-modal");
    const closeLoginBtn = document.getElementById("close-login-btn");
    const loginForm = document.getElementById("login-form");
    const loginUsernameInput = document.getElementById("login-username");
    const loginPasswordInput = document.getElementById("login-password");
    const loginErrorMsg = document.getElementById("login-error-msg");

    const blogAdminControls = document.getElementById("blog-admin-controls");
    const btnCreatePost = document.getElementById("btn-create-post");
    const postEditorModal = document.getElementById("post-editor-modal");
    const closePostEditorBtn = document.getElementById("close-post-editor-btn");
    const postEditorForm = document.getElementById("post-editor-form");
    const postTitleInput = document.getElementById("post-title");
    const postCategorySelect = document.getElementById("post-category");
    const postContentInput = document.getElementById("post-content");
    const postImageInput = document.getElementById("post-image");
    const uploadDragArea = document.getElementById("upload-drag-area");
    const imagePreviewContainer = document.getElementById("image-preview-container");
    const postImagePreview = document.getElementById("post-image-preview");
    const btnRemoveImage = document.getElementById("btn-remove-image");
    
    const newsFeedList = document.getElementById("news-feed-list");
    const authorProfileModal = document.getElementById("author-profile-modal");
    const closeAuthorProfileBtn = document.getElementById("close-author-profile-btn");

    // Stable free database endpoint key
    const dbEndpoint = "https://kvdb.io/Mee4eeT7zoh8ohS3phaiPh/posts";

    const defaultPosts = [
        {
            id: "default-1",
            title: "STAR GUARDIAN JINX ONLINE!",
            category: "SERVER UPDATE",
            content: "Der News-Bereich wurde erfolgreich mit einem neuen magischen Star Guardian Jinx Banner ausgestattet! Das UI-Layout wurde stabilisiert, Cache-Muster wurden optimiert und die Navigation schaltet nun absolut flüssig ohne Flackern um. Anarchie pur! 💖✨",
            author: "Melvin",
            date: "12.08.2026",
            image: "assets/news-banner.png"
        },
        {
            id: "default-2",
            title: "DAS GROSSE HIDE-OUT EVENT: UNO CHAOS",
            category: "EVENT",
            content: "Wir planen das nächste wahnwitzige Event im Voice-Chat: Eine Knallharte Runde UNO mit Jinx-Regeln! Es wird brennen, Karten fliegen und Melvin wird wahrscheinlich wieder die Augen verdrehen. Haltet eure Decks bereit und tragt euch in den Kalender ein! 🃏💥",
            author: "Jinx",
            date: "10.08.2026",
            image: "assets/uno-banner.jpg"
        }
    ];

    let blogPosts = [];
    let attachedImageBase64 = "";

    // 1. Session state management
    function updateLoginStateUI() {
        const currentUser = localStorage.getItem("currentUser");
        const btnEditProfile = document.getElementById("btn-edit-profile");
        const profileViewMode = document.getElementById("profile-view-mode");
        const profileEditMode = document.getElementById("profile-edit-mode");

        if (currentUser) {
            if (navLoginBtn) navLoginBtn.classList.add("hidden");
            if (navProfileBadge) navProfileBadge.classList.remove("hidden");
            
            if (currentUser === "JinxWithHood") {
                if (blogAdminControls) blogAdminControls.classList.remove("hidden");
            } else {
                if (blogAdminControls) blogAdminControls.classList.add("hidden");
            }
            
            const navUsername = document.getElementById("nav-username");
            const navAvatar = navProfileBadge.querySelector("img");
            
            if (navUsername) {
                navUsername.textContent = currentUser;
            }
            if (navAvatar) {
                if (currentUser.toLowerCase() === "jinxwithhood") {
                    navAvatar.src = "assets/jinx-avatar.jpg";
                } else {
                    navAvatar.src = "assets/server-icon.png";
                }
            }
        } else {
            if (navLoginBtn) navLoginBtn.classList.remove("hidden");
            if (navProfileBadge) navProfileBadge.classList.add("hidden");
            if (blogAdminControls) blogAdminControls.classList.add("hidden");
            if (btnEditProfile) btnEditProfile.classList.add("hidden");
            if (profileViewMode) profileViewMode.classList.remove("hidden");
            if (profileEditMode) profileEditMode.classList.add("hidden");
        }
        // Force refresh post list to show/hide delete buttons
        renderPosts();
        
        // Refresh calendar view to show/hide admin pencil triggers
        if (typeof renderCalendar === "function") {
            renderCalendar();
        }
    }

    if (navLoginBtn) {
        navLoginBtn.addEventListener("click", () => {
            playClickSound();
            if (loginModal) {
                loginModal.classList.remove("hidden");
                if (loginUsernameInput) loginUsernameInput.value = "";
                if (loginPasswordInput) {
                    loginPasswordInput.value = "";
                    loginPasswordInput.type = "password";
                }
                const btnTogglePassword = document.getElementById("btn-toggle-password");
                if (btnTogglePassword) btnTogglePassword.textContent = "SHOW";
                if (loginErrorMsg) loginErrorMsg.classList.add("hidden");
            }
        });
    }

    if (closeLoginBtn) {
        closeLoginBtn.addEventListener("click", () => {
            playClickSound();
            if (loginModal) loginModal.classList.add("hidden");
        });
    }

    // Modal background close listener
    window.addEventListener("click", (e) => {
        if (e.target === loginModal) {
            loginModal.classList.add("hidden");
        }
        if (e.target === postEditorModal) {
            postEditorModal.classList.add("hidden");
        }
        if (e.target === authorProfileModal) {
            authorProfileModal.classList.add("hidden");
        }
    });

    // Password visibility toggle handler
    const btnTogglePassword = document.getElementById("btn-toggle-password");
    if (btnTogglePassword && loginPasswordInput) {
        btnTogglePassword.addEventListener("click", () => {
            playClickSound();
            if (loginPasswordInput.type === "password") {
                loginPasswordInput.type = "text";
                btnTogglePassword.textContent = "HIDE";
            } else {
                loginPasswordInput.type = "password";
                btnTogglePassword.textContent = "SHOW";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            playClickSound();
            const username = loginUsernameInput.value.trim();
            const password = loginPasswordInput.value;

            const userLower = username.toLowerCase();
            let matchedUser = null;

            if (userLower === "jinxwithhood" && password === "MyFavoriteJinx") {
                matchedUser = "JinxWithHood";
            } else if ((userLower === "kopper9472" || userLower === "kooper9472") && password === "DerLappen3") {
                matchedUser = "Kopper9472";
            } else if (userLower === "noger69" && password === "NoggerEisRatte") {
                matchedUser = "Noger69";
            }

            if (matchedUser) {
                localStorage.setItem("currentUser", matchedUser);
                if (loginModal) loginModal.classList.add("hidden");
                updateLoginStateUI();
                if (typeof renderBlogMembers === "function") renderBlogMembers();
            } else {
                if (loginErrorMsg) loginErrorMsg.classList.remove("hidden");
            }
        });
    }

    if (navLogoutBtn) {
        navLogoutBtn.addEventListener("click", () => {
            playClickSound();
            localStorage.removeItem("currentUser");
            updateLoginStateUI();
            if (typeof renderBlogMembers === "function") renderBlogMembers();
        });
    }

    // 2. Editor trigger and file dragging
    if (btnCreatePost) {
        btnCreatePost.addEventListener("click", () => {
            playClickSound();
            if (postEditorModal) {
                postEditorModal.classList.remove("hidden");
                postEditorForm.reset();
                attachedImageBase64 = "";
                if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
                if (postImagePreview) postImagePreview.src = "";
            }
        });
    }

    if (closePostEditorBtn) {
        closePostEditorBtn.addEventListener("click", () => {
            playClickSound();
            if (postEditorModal) postEditorModal.classList.add("hidden");
        });
    }

    // File selection / drag handling
    if (uploadDragArea && postImageInput) {
        uploadDragArea.addEventListener("click", () => {
            postImageInput.click();
        });

        // drag behaviors
        uploadDragArea.addEventListener("dragover", (e) => {
            e.preventDefault();
            uploadDragArea.classList.add("dragover");
        });

        uploadDragArea.addEventListener("dragleave", () => {
            uploadDragArea.classList.remove("dragover");
        });

        uploadDragArea.addEventListener("drop", (e) => {
            e.preventDefault();
            uploadDragArea.classList.remove("dragover");
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        postImageInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    function handleFileSelect(file) {
        if (!file.type.startsWith("image/")) {
            alert("Nur Bilddateien sind als Übertragung zugelassen!");
            return;
        }

        // We can allow files up to 10MB now because we compress them
        if (file.size > 10000000) {
            alert("Das Bild ist zu groß! Maximal 10MB zugelassen.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Scale down to a max width of 1600px (retaining aspect ratio)
                const maxDim = 1600;
                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to compressed Jpeg to save size
                attachedImageBase64 = canvas.toDataURL("image/jpeg", 0.8);
                
                if (postImagePreview) postImagePreview.src = attachedImageBase64;
                if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    if (btnRemoveImage) {
        btnRemoveImage.addEventListener("click", (e) => {
            e.stopPropagation();
            playClickSound();
            attachedImageBase64 = "";
            if (postImagePreview) postImagePreview.src = "";
            if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
            if (postImageInput) postImageInput.value = "";
        });
    }

    // 3. Cloud Database Engine
    async function loadPosts() {
        // Load optimistic local cache first
        const cached = localStorage.getItem("local_posts");
        if (cached) {
            try {
                blogPosts = JSON.parse(cached);
                renderPosts();
            } catch (err) {
                console.error("Local parse error", err);
            }
        } else {
            blogPosts = [...defaultPosts];
            renderPosts();
        }

        // Fetch updates from cloud
        try {
            const res = await fetch(dbEndpoint);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    blogPosts = data;
                    localStorage.setItem("local_posts", JSON.stringify(blogPosts));
                    renderPosts();
                }
            }
        } catch (err) {
            console.warn("Cloud connection offline, using offline database", err);
        }
    }

    async function syncPostsToCloud() {
        localStorage.setItem("local_posts", JSON.stringify(blogPosts));
        try {
            await fetch(dbEndpoint, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(blogPosts)
            });
        } catch (err) {
            console.error("Failed to upload posts to cloud database", err);
        }
    }

    // 4. Form Submit & Rendering
    if (postEditorForm) {
        postEditorForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            playClickSound();

            const title = postTitleInput.value.trim();
            const category = postCategorySelect.value;
            const content = postContentInput.value.trim();

            const newPost = {
                id: "post-" + Date.now(),
                title: title,
                category: category,
                content: content,
                author: "JinxWithHood",
                date: new Date().toLocaleDateString('de-DE'),
                image: attachedImageBase64 || ""
            };

            blogPosts.unshift(newPost);
            renderPosts();

            if (postEditorModal) postEditorModal.classList.add("hidden");
            postEditorForm.reset();
            attachedImageBase64 = "";
            if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");

            // Sync update
            await syncPostsToCloud();

            // Dispatch Webhook notification
            sendDiscordWebhook(newPost);
        });
    }

    function renderPosts() {
        if (!newsFeedList) return;
        newsFeedList.innerHTML = "";

        const currentUser = localStorage.getItem("currentUser");

        blogPosts.forEach(post => {
            const isJinxWithHood = post.author === "JinxWithHood";
            
            // Custom avatar based on author
            let avatarSrc = "assets/server-icon.png";
            if (post.author === "Melvin") avatarSrc = "assets/melvin.jpg";
            else if (post.author === "Jinx") avatarSrc = "assets/jinx.png";
            else if (post.author === "JinxWithHood") avatarSrc = "assets/jinx-avatar.jpg";

            let tagClass = "tag-server-update";
            let cardClass = "sector-update";
            if (post.category === "EVENT") {
                tagClass = "tag-event";
                cardClass = "sector-event";
            } else if (post.category === "NEWS") {
                tagClass = "tag-news";
                cardClass = "sector-news";
            }
            
            // Highlight name JinxWithHood or trigger others
            const isJinxAuthor = post.author.toLowerCase() === "jinxwithhood";
            const nameClass = isJinxAuthor ? "name-jinxwithhood name-profile-trigger" : "name-profile-trigger";
            const authorMarkup = `<span class="${nameClass} blog-author-name" data-user="${post.author.toLowerCase()}" style="cursor: pointer;">${post.author}</span>`;

            // Delete button markup (only for JinxWithHood logged in session)
            const deleteMarkup = (currentUser === "JinxWithHood")
                ? `<button class="btn-delete-post" data-id="${post.id}" style="background: none; border: none; color: #ff3366; font-size: 1.1rem; cursor: pointer; opacity: 0.6; padding: 0 5px;" title="Beitrag löschen">✕</button>`
                : "";

            const postCard = document.createElement("div");
            postCard.className = `blog-card ${cardClass}`;
            postCard.innerHTML = `
                <div class="blog-card-header">
                    <div class="blog-author-info">
                        <div class="blog-author-avatar">
                            <img src="${avatarSrc}" alt="${post.author}">
                        </div>
                        ${authorMarkup}
                    </div>
                    <div class="blog-meta-right">
                        <span class="blog-date font-mono">${post.date}</span>
                        <span class="blog-tag ${tagClass}">${post.category}</span>
                        ${deleteMarkup}
                    </div>
                </div>
                <h3>${post.title}</h3>
                <p class="blog-card-content">${post.content}</p>
                ${post.image ? `
                    <div class="blog-card-image">
                        <img src="${post.image}" alt="${post.title}">
                    </div>
                ` : ""}
            `;

            newsFeedList.appendChild(postCard);
        });

        // Attach event listeners to profile triggers
        document.querySelectorAll(".name-profile-trigger").forEach(btn => {
            btn.addEventListener("click", () => {
                playClickSound();
                const userId = btn.getAttribute("data-user");
                openProfileModal(userId);
            });
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".btn-delete-post").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                playClickSound();
                const id = btn.getAttribute("data-id");
                if (confirm("Möchtest du diesen Eintrag wirklich aus dem Datenspeicher löschen?")) {
                    blogPosts = blogPosts.filter(p => p.id !== id);
                    renderPosts();
                    await syncPostsToCloud();
                }
            });
        });
    }

    if (closeAuthorProfileBtn) {
        closeAuthorProfileBtn.addEventListener("click", () => {
            playClickSound();
            if (authorProfileModal) authorProfileModal.classList.add("hidden");
        });
    }

    // ==========================================
    // PROFILE TABS VIEWPORT LOGIC
    // ==========================================
    const profileTabBtns = document.querySelectorAll(".profile-tab-btn");
    const profileMetricsTabContent = document.getElementById("profile-metrics-tab-content");
    const profileScheduleTabContent = document.getElementById("profile-schedule-tab-content");

    profileTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            playClickSound();
            profileTabBtns.forEach(b => {
                b.classList.remove("active");
                b.style.borderBottom = "2px solid transparent";
                b.style.color = "var(--color-text-muted)";
            });
            btn.classList.add("active");
            btn.style.borderBottom = "2px solid var(--color-cyan)";
            btn.style.color = "var(--color-cyan)";

            const selectedTab = btn.getAttribute("data-profile-tab");
            const modalContent = authorProfileModal ? authorProfileModal.querySelector(".cyber-modal-content") : null;

            if (selectedTab === "metrics") {
                if (modalContent) modalContent.style.maxWidth = "550px";
                if (profileMetricsTabContent) profileMetricsTabContent.classList.remove("hidden");
                if (profileScheduleTabContent) profileScheduleTabContent.classList.add("hidden");
            } else if (selectedTab === "schedule") {
                if (modalContent) modalContent.style.maxWidth = "800px";
                if (profileMetricsTabContent) profileMetricsTabContent.classList.add("hidden");
                if (profileScheduleTabContent) profileScheduleTabContent.classList.remove("hidden");
                renderProfileCalendar();
            }
        });
    });

    // ==========================================
    // JINXWITHHOOD PROFILE EDITOR & SYNC ENGINE
    // ==========================================
    const btnEditProfile = document.getElementById("btn-edit-profile");
    const profileViewMode = document.getElementById("profile-view-mode");
    const profileEditMode = document.getElementById("profile-edit-mode");
    const profileEditForm = document.getElementById("profile-edit-form");
    const editProfileRole = document.getElementById("edit-profile-role");
    const editProfilePosition = document.getElementById("edit-profile-position");
    const editProfileStatus = document.getElementById("edit-profile-status");
    const editProfileWebhook = document.getElementById("edit-profile-webhook");
    const btnCancelEditProfile = document.getElementById("btn-cancel-edit-profile");
    
    const viewProfileRole = document.getElementById("view-profile-role");
    const viewProfilePosition = document.getElementById("view-profile-position");
    const viewProfileStatus = document.getElementById("view-profile-status");

    const profileDisplayName = document.getElementById("profile-display-name");
    const profileRoleTag = document.getElementById("profile-role-tag");
    const profileAvatarImg = document.getElementById("profile-avatar-img");
    const profilesEndpoint = "https://kvdb.io/Mee4eeT7zoh8ohS3phaiPh/profiles_database";

    // Profile state database (Defaults)
    let profilesDatabase = {
        "jinxwithhood": {
            role: "SERVER ADMIN",
            position: "TECHNICAL ENGINEER",
            status: "VERLIEBT IN JINX",
            webhookUrl: ""
        },
        "kopper9472": {
            role: "LIEUTENANT",
            position: "",
            status: "",
            webhookUrl: ""
        },
        "noger69": {
            role: "LIEUTENANT",
            position: "",
            status: "",
            webhookUrl: ""
        }
    };

    async function loadProfile() {
        const cached = localStorage.getItem("profiles_database");
        if (cached) {
            try {
                profilesDatabase = JSON.parse(cached);
                updateProfileDOM();
            } catch (e) {}
        }
        
        try {
            const res = await fetch(profilesEndpoint);
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === "object") {
                    profilesDatabase = Object.assign({
                        "jinxwithhood": { role: "SERVER ADMIN", position: "TECHNICAL ENGINEER", status: "VERLIEBT IN JINX", webhookUrl: "" },
                        "kopper9472": { role: "LIEUTENANT", position: "", status: "", webhookUrl: "" },
                        "noger69": { role: "LIEUTENANT", position: "", status: "", webhookUrl: "" }
                    }, data);
                    localStorage.setItem("profiles_database", JSON.stringify(profilesDatabase));
                    updateProfileDOM();
                    if (typeof renderBlogMembers === "function") renderBlogMembers();
                }
            }
        } catch (e) {
            console.warn("Offline loading profiles details", e);
        }
    }

    function updateProfileDOM() {
        const userProf = profilesDatabase[activeProfileUser];
        if (userProf) {
            if (viewProfileRole) viewProfileRole.textContent = userProf.role;
            if (viewProfilePosition) viewProfilePosition.textContent = userProf.position;
            if (viewProfileStatus) viewProfileStatus.textContent = userProf.status;
            if (profileRoleTag) profileRoleTag.textContent = userProf.role;
        }
    }

    function openProfileModal(userId) {
        activeProfileUser = userId;
        
        // Ensure user registry details exist
        if (!profilesDatabase[userId]) {
            profilesDatabase[userId] = {
                role: "LIEUTENANT",
                position: "",
                status: "",
                webhookUrl: ""
            };
        }

        const userProf = profilesDatabase[userId];
        
        // Reset tab buttons
        profileTabBtns.forEach(btn => {
            if (btn.getAttribute("data-profile-tab") === "metrics") {
                btn.classList.add("active");
                btn.style.borderBottom = "2px solid var(--color-cyan)";
                btn.style.color = "var(--color-cyan)";
            } else {
                btn.classList.remove("active");
                btn.style.borderBottom = "2px solid transparent";
                btn.style.color = "var(--color-text-muted)";
            }
        });
        
        // Show metrics tab, hide schedule tab
        const modalContent = authorProfileModal ? authorProfileModal.querySelector(".cyber-modal-content") : null;
        if (modalContent) modalContent.style.maxWidth = "550px";

        if (profileViewMode) profileViewMode.classList.remove("hidden");
        if (profileEditMode) profileEditMode.classList.add("hidden");
        if (profileMetricsTabContent) profileMetricsTabContent.classList.remove("hidden");
        if (profileScheduleTabContent) profileScheduleTabContent.classList.add("hidden");

        const btnEditProfile = document.getElementById("btn-edit-profile");
        const currentUser = localStorage.getItem("currentUser");
        
        // Toggle Webhook field for self
        const webhookInputGroup = document.getElementById("profile-webhook-input-group");
        if (webhookInputGroup) {
            const isSelf = currentUser && userId && currentUser.toLowerCase() === userId.toLowerCase();
            if (isSelf) {
                webhookInputGroup.classList.remove("hidden");
            } else {
                webhookInputGroup.classList.add("hidden");
            }
        }

        const isSelf = currentUser && userId && currentUser.toLowerCase() === userId.toLowerCase();
        const canEdit = currentUser === "JinxWithHood" || isSelf;

        if (canEdit) {
            if (btnEditProfile) btnEditProfile.classList.remove("hidden");
        } else {
            if (btnEditProfile) btnEditProfile.classList.add("hidden");
        }

        // Set Display Name and hex image
        let displayNameText = userId;
        let avatarSrc = "assets/server-icon.png";
        
        if (userId === "jinxwithhood") {
            displayNameText = "JinxWithHood";
            avatarSrc = "assets/jinx-avatar.jpg";
        } else if (userId === "kopper9472") {
            displayNameText = "Kopper9472";
            avatarSrc = "assets/server-icon.png";
        } else if (userId === "noger69") {
            displayNameText = "Noger69";
            avatarSrc = "assets/server-icon.png";
        } else {
            const member = crewData[userId];
            if (member) {
                displayNameText = member.name;
                avatarSrc = member.image || "assets/server-icon.png";
            }
        }

        if (profileDisplayName) profileDisplayName.textContent = displayNameText;
        if (profileRoleTag) profileRoleTag.textContent = userProf.role;
        if (profileAvatarImg) profileAvatarImg.src = avatarSrc;
        
        if (viewProfileRole) viewProfileRole.textContent = userProf.role;
        if (viewProfilePosition) viewProfilePosition.textContent = userProf.position;
        if (viewProfileStatus) viewProfileStatus.textContent = userProf.status;

        if (authorProfileModal) {
            authorProfileModal.classList.remove("hidden");
        }
    }

    if (btnEditProfile) {
        btnEditProfile.addEventListener("click", () => {
            playClickSound();
            if (profileViewMode && profileEditMode) {
                const userProf = profilesDatabase[activeProfileUser] || {};
                profileViewMode.classList.add("hidden");
                profileEditMode.classList.remove("hidden");
                if (editProfileRole) editProfileRole.value = userProf.role || "";
                if (editProfilePosition) editProfilePosition.value = userProf.position || "";
                if (editProfileStatus) editProfileStatus.value = userProf.status || "";
                if (editProfileWebhook) editProfileWebhook.value = userProf.webhookUrl || "";
            }
        });
    }

    if (btnCancelEditProfile) {
        btnCancelEditProfile.addEventListener("click", () => {
            playClickSound();
            if (profileViewMode && profileEditMode) {
                profileViewMode.classList.remove("hidden");
                profileEditMode.classList.add("hidden");
            }
        });
    }

    if (profileEditForm) {
        profileEditForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            playClickSound();
            
            if (!profilesDatabase[activeProfileUser]) {
                profilesDatabase[activeProfileUser] = {};
            }

            profilesDatabase[activeProfileUser].role = editProfileRole.value.trim();
            profilesDatabase[activeProfileUser].position = editProfilePosition.value.trim();
            profilesDatabase[activeProfileUser].status = editProfileStatus.value.trim();
            profilesDatabase[activeProfileUser].webhookUrl = editProfileWebhook.value.trim();

            updateProfileDOM();
            if (typeof renderBlogMembers === "function") renderBlogMembers();
            
            if (profileViewMode && profileEditMode) {
                profileViewMode.classList.remove("hidden");
                profileEditMode.classList.add("hidden");
            }

            // Sync to cloud
            localStorage.setItem("profiles_database", JSON.stringify(profilesDatabase));
            try {
                await fetch(profilesEndpoint, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(profilesDatabase)
                });
            } catch (err) {
                console.error("Profiles sync failed", err);
            }
        });
    }

    // ==========================================
    // DISCORD WEBHOOK BROADCASTER
    // ==========================================
    async function sendDiscordWebhook(post) {
        const authorKey = post.author ? post.author.toLowerCase() : "jinxwithhood";
        const authorProf = profilesDatabase[authorKey] || {};
        const webhookUrl = authorProf.webhookUrl;

        if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
            return;
        }

        let embedColor = 16777215; // default white
        const catUpper = (post.category || "").toUpperCase().trim();
        if (catUpper === "NEWS") {
            embedColor = 16711807; // Pink (#ff007f)
        } else if (catUpper === "SERVER UPDATE" || catUpper === "SERVER UPDATES") {
            embedColor = 22015; // Dunkelblau (#0055ff)
        } else if (catUpper === "EVENT" || catUpper === "EVENTS") {
            embedColor = 62463; // Türkis (#00f3ff)
        }

        let authorDisplayName = post.author;
        const role = (authorProf.role || "LIEUTENANT").toUpperCase();

        if (authorKey === "jinxwithhood") {
            authorDisplayName = "💥 JinxWithHood • SERVER ADMIN";
        } else if (authorKey === "kopper9472") {
            authorDisplayName = `Kopper9472 • ${role}`;
        } else if (authorKey === "noger69") {
            authorDisplayName = `Noger69 • ${role}`;
        } else {
            authorDisplayName = `${post.author} • ${role}`;
        }

        const hasImage = post.image && post.image.startsWith("data:image/");

        let avatarBlob = null;
        let avatarFilename = "avatar.png";
        let bannerBlob = null;

        try {
            const avatarLocalPath = authorKey === "jinxwithhood" ? "assets/jinx-avatar.jpg" : "assets/server-icon.png";
            avatarFilename = authorKey === "jinxwithhood" ? "avatar.jpg" : "avatar.png";
            const avatarRes = await fetch(avatarLocalPath);
            if (avatarRes.ok) {
                avatarBlob = await avatarRes.blob();
            }
        } catch (e) {
            console.error("Failed to load local avatar", e);
        }

        if (!hasImage) {
            try {
                const bannerRes = await fetch("assets/banner.jpg");
                if (bannerRes.ok) {
                    bannerBlob = await bannerRes.blob();
                }
            } catch (e) {
                console.error("Failed to load local banner", e);
            }
        }

        const embedObject = {
            author: {
                name: authorDisplayName,
                icon_url: avatarBlob ? `attachment://${avatarFilename}` : undefined
            },
            title: post.title,
            description: post.content,
            color: embedColor,
            image: {
                url: hasImage ? "attachment://upload.png" : (bannerBlob ? "attachment://banner.jpg" : undefined)
            },
            timestamp: new Date().toISOString(),
            footer: {
                text: post.category
            }
        };

        const payload = {
            username: "Neon Anarchy Broadcaster",
            embeds: [embedObject]
        };

        try {
            const formData = new FormData();
            formData.append("payload_json", JSON.stringify(payload));

            let fileIndex = 0;

            if (hasImage) {
                const parts = post.image.split(",");
                const byteString = atob(parts[1]);
                const mimeString = parts[0].split(":")[1].split(";")[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                formData.append(`files[${fileIndex}]`, blob, "upload.png");
                fileIndex++;
            } else if (bannerBlob) {
                formData.append(`files[${fileIndex}]`, bannerBlob, "banner.jpg");
                fileIndex++;
            }

            if (avatarBlob) {
                formData.append(`files[${fileIndex}]`, avatarBlob, avatarFilename);
                fileIndex++;
            }

            await fetch(webhookUrl, {
                method: "POST",
                body: formData
            });
        } catch (err) {
            console.error("Failed to trigger Discord Webhook", err);
        }
    }

    // ==========================================
    // CALENDAR SCHEDULER ENGINES (General & Profile calendars)
    // ==========================================
    
    // Main Calendar Nodes
    const calendarMonthYear = document.getElementById("calendar-month-year");
    const calendarViewport = document.getElementById("calendar-viewport");
    const btnCalPrev = document.getElementById("btn-cal-prev");
    const btnCalToday = document.getElementById("btn-cal-today");
    const btnCalNext = document.getElementById("btn-cal-next");
    const btnCalToggles = document.querySelectorAll(".btn-cal-toggle");

    // Profile Calendar Nodes
    const profileCalMonthYear = document.getElementById("profile-cal-month-year");
    const profileCalendarViewport = document.getElementById("profile-calendar-viewport");
    const btnProfCalPrev = document.getElementById("btn-prof-cal-prev");
    const btnProfCalToday = document.getElementById("btn-prof-cal-today");
    const btnProfCalNext = document.getElementById("btn-prof-cal-next");
    const btnProfCalToggles = document.querySelectorAll(".btn-prof-cal-toggle");

    // Editor Modals
    const calendarEditorModal = document.getElementById("calendar-editor-modal");
    const calendarEditorForm = document.getElementById("calendar-editor-form");
    const calendarEditDate = document.getElementById("calendar-edit-date");
    const calendarEventTitleInput = document.getElementById("calendar-event-title");
    const closeCalendarEditorBtn = document.getElementById("close-calendar-editor-btn");
    const btnClearCalendarEntry = document.getElementById("btn-clear-calendar-entry");

    // Range fields
    const calendarEditStartDate = document.getElementById("calendar-edit-start-date");
    const calendarEditEndDate = document.getElementById("calendar-edit-end-date");
    const calendarEditStartTime = document.getElementById("calendar-edit-start-time");
    const calendarEditEndTime = document.getElementById("calendar-edit-end-time");

    let activeEditingEventId = null;

    const calendarSchedulesEndpoint = "https://kvdb.io/Mee4eeT7zoh8ohS3phaiPh/calendar_schedules";

    // Calendar state mappings
    let calendarSchedules = {
        "general": [],
        "jinxwithhood": [],
        "melvin": [],
        "jinx": [],
        "daniel": [],
        "noger": [],
        "connor": []
    };

    // Calendar view controllers
    let currentCalDate = new Date();
    let currentCalView = "month";

    let profileCalDate = new Date();
    let profileCalView = "month";

    function getEventsForDate(scheduleArray, dateStr) {
        if (!Array.isArray(scheduleArray)) return [];
        return scheduleArray.filter(ev => dateStr >= ev.startDate && dateStr <= ev.endDate);
    }

    async function loadCalendar() {
        const cached = localStorage.getItem("local_calendar_schedules");
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                for (const user in parsed) {
                    if (parsed[user] && !Array.isArray(parsed[user])) {
                        const arr = [];
                        for (const key in parsed[user]) {
                            arr.push({
                                id: "migrated_" + Math.random().toString(36).substr(2, 9),
                                title: parsed[user][key],
                                startDate: key,
                                endDate: key,
                                startTime: "08:00",
                                endTime: "12:00"
                            });
                        }
                        parsed[user] = arr;
                    }
                }
                calendarSchedules = parsed;
                renderCalendar();
                renderProfileCalendar();
            } catch (e) {}
        }

        try {
            const res = await fetch(calendarSchedulesEndpoint);
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === "object") {
                    for (const user in data) {
                        if (data[user] && !Array.isArray(data[user])) {
                            const arr = [];
                            for (const key in data[user]) {
                                arr.push({
                                    id: "migrated_" + Math.random().toString(36).substr(2, 9),
                                    title: data[user][key],
                                    startDate: key,
                                    endDate: key,
                                    startTime: "08:00",
                                    endTime: "12:00"
                                });
                            }
                            data[user] = arr;
                        }
                    }
                    calendarSchedules = Object.assign({
                        "general": [], "jinxwithhood": [], "melvin": [], "jinx": [], "daniel": [], "noger": [], "connor": []
                    }, data);
                    localStorage.setItem("local_calendar_schedules", JSON.stringify(calendarSchedules));
                    renderCalendar();
                    renderProfileCalendar();
                }
            }
        } catch (err) {
            console.warn("Offline loading schedules database", err);
        }
    }

    async function syncCalendarToCloud() {
        localStorage.setItem("local_calendar_schedules", JSON.stringify(calendarSchedules));
        try {
            await fetch(calendarSchedulesEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(calendarSchedules)
            });
        } catch (err) {
            console.error("Failed to sync schedules online", err);
        }
    }

    // MAIN NAVIGATION CONTROLLERS
    if (btnCalPrev) btnCalPrev.addEventListener("click", () => { playClickSound(); navigateMainCalendar(-1); });
    if (btnCalNext) btnCalNext.addEventListener("click", () => { playClickSound(); navigateMainCalendar(1); });
    if (btnCalToday) btnCalToday.addEventListener("click", () => { playClickSound(); currentCalDate = new Date(); renderCalendar(); });

    btnCalToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            playClickSound();
            btnCalToggles.forEach(t => {
                t.classList.remove("active");
                t.style.background = "none";
                t.style.color = "var(--color-cyan)";
            });
            toggle.classList.add("active");
            toggle.style.background = "var(--color-cyan)";
            toggle.style.color = "black";

            currentCalView = toggle.getAttribute("data-view");
            renderCalendar();
        });
    });

    function navigateMainCalendar(dir) {
        if (currentCalView === "month") currentCalDate.setMonth(currentCalDate.getMonth() + dir);
        else if (currentCalView === "week") currentCalDate.setDate(currentCalDate.getDate() + (dir * 7));
        else if (currentCalView === "day") currentCalDate.setDate(currentCalDate.getDate() + dir);
        renderCalendar();
    }

    // PROFILE NAVIGATION CONTROLLERS
    if (btnProfCalPrev) btnProfCalPrev.addEventListener("click", () => { playClickSound(); navigateProfileCalendar(-1); });
    if (btnProfCalNext) btnProfCalNext.addEventListener("click", () => { playClickSound(); navigateProfileCalendar(1); });
    if (btnProfCalToday) btnProfCalToday.addEventListener("click", () => { playClickSound(); profileCalDate = new Date(); renderProfileCalendar(); });

    btnProfCalToggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            playClickSound();
            btnProfCalToggles.forEach(t => {
                t.classList.remove("active");
                t.style.background = "none";
                t.style.color = "var(--color-cyan)";
            });
            toggle.classList.add("active");
            toggle.style.background = "var(--color-cyan)";
            toggle.style.color = "black";

            profileCalView = toggle.getAttribute("data-prof-view");
            renderProfileCalendar();
        });
    });

    function navigateProfileCalendar(dir) {
        if (profileCalView === "month") profileCalDate.setMonth(profileCalDate.getMonth() + dir);
        else if (profileCalView === "week") profileCalDate.setDate(profileCalDate.getDate() + (dir * 7));
        else if (profileCalView === "day") profileCalDate.setDate(profileCalDate.getDate() + dir);
        renderProfileCalendar();
    }

    function getFormattedDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    // ==========================================
    // RENDER: MAIN EVENTS TAB CALENDAR
    // ==========================================
    function renderCalendar() {
        if (!calendarViewport) return;
        calendarViewport.innerHTML = "";

        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();

        const monthNames = [
            "JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI", 
            "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DEZEMBER"
        ];
        const weekdayNames = [
            "SONNTAG", "MONTAG", "DIENSTAG", "MITTWOCH", "DONNERSTAG", "FREITAG", "SAMSTAG"
        ];

        const activeSchedule = calendarSchedules["general"] || [];

        if (currentCalView === "month") {
            if (calendarMonthYear) calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
            renderMonthView(activeSchedule, calendarViewport, currentCalDate, false);
        } else if (currentCalView === "week") {
            const startOfWeek = new Date(currentCalDate);
            const dayOfWeek = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startOfWeek.setDate(diff);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);

            const startStr = `${String(startOfWeek.getDate()).padStart(2, "0")}.${String(startOfWeek.getMonth() + 1).padStart(2, "0")}`;
            const endStr = `${String(endOfWeek.getDate()).padStart(2, "0")}.${String(endOfWeek.getMonth() + 1).padStart(2, "0")}`;
            
            if (calendarMonthYear) calendarMonthYear.textContent = `WOCHE VOM ${startStr} - ${endStr}`;
            renderWeekView(startOfWeek, activeSchedule, calendarViewport, false);
        } else if (currentCalView === "day") {
            const dayStr = `${weekdayNames[currentCalDate.getDay()]}, ${String(currentCalDate.getDate()).padStart(2, "0")}.${String(currentCalDate.getMonth() + 1).padStart(2, "0")}.${year}`;
            if (calendarMonthYear) calendarMonthYear.textContent = dayStr;
            renderDayView(activeSchedule, calendarViewport, currentCalDate, false);
        }
    }

    // ==========================================
    // RENDER: PROFILE MODAL CALENDAR
    // ==========================================
    function renderProfileCalendar() {
        if (!profileCalendarViewport) return;
        profileCalendarViewport.innerHTML = "";

        const year = profileCalDate.getFullYear();
        const month = profileCalDate.getMonth();

        const monthNames = [
            "JANUAR", "FEBRUAR", "MÄRZ", "APRIL", "MAI", "JUNI", 
            "JULI", "AUGUST", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DEZEMBER"
        ];
        const weekdayNames = [
            "SONNTAG", "MONTAG", "DIENSTAG", "MITTWOCH", "DONNERSTAG", "FREITAG", "SAMSTAG"
        ];

        if (!calendarSchedules[activeProfileUser]) {
            calendarSchedules[activeProfileUser] = [];
        }
        const activeSchedule = calendarSchedules[activeProfileUser];

        if (profileCalView === "month") {
            if (profileCalMonthYear) profileCalMonthYear.textContent = `${monthNames[month]} ${year}`;
            renderMonthView(activeSchedule, profileCalendarViewport, profileCalDate, true);
        } else if (profileCalView === "week") {
            const startOfWeek = new Date(profileCalDate);
            const dayOfWeek = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            startOfWeek.setDate(diff);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);

            const startStr = `${String(startOfWeek.getDate()).padStart(2, "0")}.${String(startOfWeek.getMonth() + 1).padStart(2, "0")}`;
            const endStr = `${String(endOfWeek.getDate()).padStart(2, "0")}.${String(endOfWeek.getMonth() + 1).padStart(2, "0")}`;
            
            if (profileCalMonthYear) profileCalMonthYear.textContent = `WOCHE VOM ${startStr} - ${endStr}`;
            renderWeekView(startOfWeek, activeSchedule, profileCalendarViewport, true);
        } else if (profileCalView === "day") {
            const dayStr = `${weekdayNames[profileCalDate.getDay()]}, ${String(profileCalDate.getDate()).padStart(2, "0")}.${String(profileCalDate.getMonth() + 1).padStart(2, "0")}.${year}`;
            if (profileCalMonthYear) profileCalMonthYear.textContent = dayStr;
            renderDayView(activeSchedule, profileCalendarViewport, profileCalDate, true);
        }
    }

    // ==========================================
    // REUSABLE VIEW COMPONENT GENERATORS
    // ==========================================

    function renderMonthView(activeSchedule, targetContainer, referenceDate, isProfileCal) {
        const grid = document.createElement("div");
        grid.className = "cal-month-grid";

        const shortDays = ["MO", "DI", "MI", "DO", "FR", "SA", "SO"];
        shortDays.forEach(d => {
            const dLabel = document.createElement("div");
            dLabel.className = "cal-month-day-name";
            if (isProfileCal) {
                dLabel.style.padding = "4px 0";
                dLabel.style.fontSize = "0.7rem";
            }
            dLabel.textContent = d;
            grid.appendChild(dLabel);
        });

        const year = referenceDate.getFullYear();
        const month = referenceDate.getMonth();

        const firstDay = new Date(year, month, 1);
        let firstDayIndex = firstDay.getDay();
        firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDaysInMonth = new Date(year, month, 0).getDate();

        const totalSlots = 42;
        const currentUser = localStorage.getItem("currentUser");
        const isSelfCal = currentUser && activeProfileUser && currentUser.toLowerCase() === activeProfileUser.toLowerCase();
        const canEditCal = currentUser === "JinxWithHood" || (isProfileCal && isSelfCal);

        for (let i = 0; i < totalSlots; i++) {
            let dayNum;
            let cellDate;
            let isCurrentMonth = true;

            if (i < firstDayIndex) {
                dayNum = prevDaysInMonth - firstDayIndex + i + 1;
                cellDate = new Date(year, month - 1, dayNum);
                isCurrentMonth = false;
            } else if (i < firstDayIndex + daysInMonth) {
                dayNum = i - firstDayIndex + 1;
                cellDate = new Date(year, month, dayNum);
            } else {
                dayNum = i - firstDayIndex - daysInMonth + 1;
                cellDate = new Date(year, month + 1, dayNum);
                isCurrentMonth = false;
            }

            const dateKey = getFormattedDateKey(cellDate);
            const dayEvents = getEventsForDate(activeSchedule, dateKey);
            const eventText = dayEvents.length > 0 ? dayEvents[0].title : "";

            const cell = document.createElement("div");
            cell.className = "cal-month-day-cell";
            if (isProfileCal) {
                cell.style.minHeight = "60px";
                cell.style.padding = "4px";
            }
            if (!isCurrentMonth) cell.classList.add("other-month");

            const today = new Date();
            if (cellDate.toDateString() === today.toDateString()) {
                cell.classList.add("today");
            }

            const num = document.createElement("span");
            num.className = "cal-month-day-num";
            if (isProfileCal) num.style.fontSize = "0.75rem";
            num.textContent = dayNum;
            cell.appendChild(num);

            const ind = document.createElement("div");
            ind.className = "cal-month-event-indicator";
            if (isProfileCal) {
                ind.style.fontSize = "0.65rem";
                ind.style.padding = "1px 3px";
            }
            if (eventText) {
                ind.className += " indicator-event";
                ind.textContent = dayEvents.length > 1 ? `[${dayEvents.length} Slots]` : eventText;
            } else {
                ind.className += " indicator-free";
                ind.textContent = "FREE";
            }
            cell.appendChild(ind);

            if (canEditCal) {
                const editBtn = document.createElement("button");
                editBtn.className = "cal-edit-handle";
                if (isProfileCal) {
                    editBtn.style.width = "16px";
                    editBtn.style.height = "16px";
                    editBtn.style.fontSize = "0.55rem";
                }
                editBtn.innerHTML = "✏️";
                editBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openCalendarEditor(dateKey);
                });
                cell.appendChild(editBtn);
            }

            cell.addEventListener("click", () => {
                if (isProfileCal) {
                    profileCalDate = new Date(cellDate);
                    profileCalView = "day";
                    
                    btnProfCalToggles.forEach(t => {
                        if (t.getAttribute("data-prof-view") === "day") {
                            t.classList.add("active");
                            t.style.background = "var(--color-cyan)";
                            t.style.color = "black";
                        } else {
                            t.classList.remove("active");
                            t.style.background = "none";
                            t.style.color = "var(--color-cyan)";
                        }
                    });
                    renderProfileCalendar();
                } else {
                    currentCalDate = new Date(cellDate);
                    currentCalView = "day";
                    
                    btnCalToggles.forEach(t => {
                        if (t.getAttribute("data-view") === "day") {
                            t.classList.add("active");
                            t.style.background = "var(--color-cyan)";
                            t.style.color = "black";
                        } else {
                            t.classList.remove("active");
                            t.style.background = "none";
                            t.style.color = "var(--color-cyan)";
                        }
                    });
                    renderCalendar();
                }
            });

            grid.appendChild(cell);
        }

        targetContainer.appendChild(grid);
    }

    function renderWeekView(startOfWeek, activeSchedule, targetContainer, isProfileCal) {
        const list = document.createElement("div");
        list.className = "cal-week-list";

        const weekdayNames = [
            "MONTAG", "DIENSTAG", "MITTWOCH", "DONNERSTAG", "FREITAG", "SAMSTAG", "SONNTAG"
        ];

        const currentUser = localStorage.getItem("currentUser");
        const isSelfCal = currentUser && activeProfileUser && currentUser.toLowerCase() === activeProfileUser.toLowerCase();
        const canEditCal = currentUser === "JinxWithHood" || (isProfileCal && isSelfCal);

        for (let i = 0; i < 7; i++) {
            const cellDate = new Date(startOfWeek);
            cellDate.setDate(cellDate.getDate() + i);

            const dateKey = getFormattedDateKey(cellDate);
            const dayEvents = getEventsForDate(activeSchedule, dateKey);
            const eventText = dayEvents.length > 0 ? dayEvents[0].title : "";
            const eventTime = dayEvents.length > 0 ? ` (${dayEvents[0].startTime} - ${dayEvents[0].endTime})` : "";

            const row = document.createElement("div");
            row.className = "cal-week-row";
            if (isProfileCal) {
                row.style.padding = "8px 12px";
            }

            const today = new Date();
            if (cellDate.toDateString() === today.toDateString()) {
                row.classList.add("today");
            }

            const displayDateStr = `${String(cellDate.getDate()).padStart(2, "0")}.${String(cellDate.getMonth() + 1).padStart(2, "0")}`;

            row.innerHTML = `
                <div class="cal-week-date-wrap" ${isProfileCal ? 'style="width: 100px;"' : ''}>
                    <span class="cal-week-day-name" ${isProfileCal ? 'style="font-size: 0.85rem;"' : ''}>${weekdayNames[i]}</span>
                    <span class="cal-week-day-date font-mono" ${isProfileCal ? 'style="font-size: 0.75rem;"' : ''}>${displayDateStr}</span>
                </div>
                <div class="cal-week-content-wrap" ${isProfileCal ? 'style="font-size: 0.85rem;"' : ''}>
                    ${eventText ? `<span class="status-text-event">${eventText}${eventTime}${dayEvents.length > 1 ? ` (+${dayEvents.length - 1} Slots)` : ""}</span>` : `<span class="status-text-free">FREE</span>`}
                </div>
                <div class="cal-week-badge-wrap">
                    <span class="cal-week-status-badge ${eventText ? 'tag-event' : 'tag-server-update'}" ${isProfileCal ? 'style="font-size: 0.7rem; padding: 2px 8px;"' : ''}>
                        ${eventText ? 'BESETZT' : 'FREI'}
                    </span>
                </div>
            `;

            if (canEditCal) {
                const editBtn = document.createElement("button");
                editBtn.className = "cal-edit-handle";
                if (isProfileCal) {
                    editBtn.style.width = "16px";
                    editBtn.style.height = "16px";
                    editBtn.style.fontSize = "0.55rem";
                }
                editBtn.innerHTML = "✏️";
                editBtn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    openCalendarEditor(dateKey);
                });
                row.appendChild(editBtn);
            }

            row.addEventListener("click", () => {
                if (isProfileCal) {
                    profileCalDate = new Date(cellDate);
                    profileCalView = "day";
                    
                    btnProfCalToggles.forEach(t => {
                        if (t.getAttribute("data-prof-view") === "day") {
                            t.classList.add("active");
                            t.style.background = "var(--color-cyan)";
                            t.style.color = "black";
                        } else {
                            t.classList.remove("active");
                            t.style.background = "none";
                            t.style.color = "var(--color-cyan)";
                        }
                    });
                    renderProfileCalendar();
                } else {
                    currentCalDate = new Date(cellDate);
                    currentCalView = "day";
                    
                    btnCalToggles.forEach(t => {
                        if (t.getAttribute("data-view") === "day") {
                            t.classList.add("active");
                            t.style.background = "var(--color-cyan)";
                            t.style.color = "black";
                        } else {
                            t.classList.remove("active");
                            t.style.background = "none";
                            t.style.color = "var(--color-cyan)";
                        }
                    });
                    renderCalendar();
                }
            });

            list.appendChild(row);
        }

        targetContainer.appendChild(list);
    }

    // ==========================================
    // RENDERING THE 24-HOUR GRID FOR DAY VIEW
    // ==========================================
    function renderDayView(activeSchedule, targetContainer, referenceDate, isProfileCal) {
        const dateKey = getFormattedDateKey(referenceDate);
        const dayEvents = getEventsForDate(activeSchedule, dateKey);

        const card = document.createElement("div");
        card.className = "cal-day-detail-card";
        if (isProfileCal) {
            card.style.padding = "15px";
        }

        const currentUser = localStorage.getItem("currentUser");
        const isSelfCal = currentUser && activeProfileUser && currentUser.toLowerCase() === activeProfileUser.toLowerCase();
        const canEditCal = currentUser === "JinxWithHood" || (isProfileCal && isSelfCal);

        card.innerHTML = `
            <div class="cal-day-title-date font-mono" style="font-size: 0.9rem; margin-bottom: 15px; border-bottom: 1px solid rgba(0,243,255,0.15); padding-bottom: 8px;">
                DETAILANSICHT FÜR ${dateKey}
            </div>
            <div id="${isProfileCal ? 'prof-timeline-viewport' : 'main-timeline-viewport'}"></div>
        `;

        targetContainer.appendChild(card);

        const viewport = card.querySelector(isProfileCal ? '#prof-timeline-viewport' : '#main-timeline-viewport');
        if (!viewport) return;

        // Container scroll viewport
        const timelineContainer = document.createElement("div");
        timelineContainer.className = "cal-day-timeline-container";
        timelineContainer.style.cssText = "max-height: 380px; overflow-y: auto; border: 1px solid rgba(0, 243, 255, 0.15); background: rgba(0,0,0,0.5); border-radius: 4px; padding: 10px;";

        for (let h = 0; h < 24; h++) {
            const hourRow = document.createElement("div");
            hourRow.className = "cal-day-timeline-row";
            hourRow.style.cssText = "display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 6px 0; min-height: 38px;";

            const hourLabel = document.createElement("div");
            hourLabel.className = "cal-day-timeline-hour";
            hourLabel.style.cssText = "width: 55px; font-family: var(--font-mono); font-size: 0.8rem; color: var(--color-text-muted); flex-shrink: 0; text-align: right; padding-right: 12px; border-right: 1px solid rgba(0, 243, 255, 0.1);";
            hourLabel.textContent = `${String(h).padStart(2, "0")}:00`;
            hourRow.appendChild(hourLabel);

            const contentCol = document.createElement("div");
            contentCol.className = "cal-day-timeline-content";
            contentCol.style.cssText = "flex: 1; padding-left: 12px; display: flex; align-items: center; justify-content: space-between; min-width: 0;";

            // Check if any range covers this hour slot
            const activeHourEvent = dayEvents.find(ev => {
                const sh = parseFloat(ev.startTime.split(":")[0]) + parseFloat(ev.startTime.split(":")[1]) / 60;
                const eh = parseFloat(ev.endTime.split(":")[0]) + parseFloat(ev.endTime.split(":")[1]) / 60;
                return (h + 1) > sh && h < eh;
            });

            if (activeHourEvent) {
                const block = document.createElement("div");
                block.className = "timeline-block-event";
                block.style.cssText = "background: rgba(0, 243, 255, 0.05); border: 1px solid rgba(0, 243, 255, 0.3); color: var(--color-cyan); padding: 4px 12px; border-radius: 4px; font-size: 0.8rem; display: flex; align-items: center; justify-content: space-between; text-shadow: 0 0 5px rgba(0,243,255,0.3); width: 100%; min-width: 0;";
                
                const txt = document.createElement("span");
                txt.style.cssText = "overflow: hidden; text-overflow: ellipsis; white-space: nowrap;";
                txt.textContent = `${activeHourEvent.title} (${activeHourEvent.startTime} - ${activeHourEvent.endTime})`;
                block.appendChild(txt);

                if (canEditCal) {
                    const rowEditBtn = document.createElement("button");
                    rowEditBtn.className = "btn";
                    rowEditBtn.style.cssText = "background: none; border: none; color: var(--color-cyan); cursor: pointer; font-size: 0.75rem; padding: 2px 6px;";
                    rowEditBtn.innerHTML = "✏️";
                    rowEditBtn.addEventListener("click", (e) => {
                        e.stopPropagation();
                        openCalendarEditor(dateKey, activeHourEvent);
                    });
                    block.appendChild(rowEditBtn);
                }
                contentCol.appendChild(block);
            } else {
                const freeTxt = document.createElement("span");
                freeTxt.className = "timeline-block-free";
                freeTxt.style.cssText = "color: var(--color-green); font-size: 0.75rem; font-weight: bold; text-shadow: 0 0 5px rgba(0, 255, 102, 0.3);";
                freeTxt.textContent = "FREE";
                contentCol.appendChild(freeTxt);

                if (canEditCal) {
                    const addBtn = document.createElement("button");
                    addBtn.className = "btn";
                    addBtn.style.cssText = "background: rgba(0,243,255,0.05); border: 1px dashed rgba(0,243,255,0.3); color: var(--color-cyan); cursor: pointer; font-size: 0.65rem; padding: 2px 8px; border-radius: 3px; opacity: 0; transition: opacity 0.2s;";
                    addBtn.textContent = "+ ADD";
                    
                    hourRow.addEventListener("mouseenter", () => { addBtn.style.opacity = "1"; });
                    hourRow.addEventListener("mouseleave", () => { addBtn.style.opacity = "0"; });

                    addBtn.addEventListener("click", () => {
                        playClickSound();
                        const nextHourStr = `${String(h + 1).padStart(2, "0")}:00`;
                        const currentHourStr = `${String(h).padStart(2, "0")}:00`;
                        openCalendarEditor(dateKey, null, currentHourStr, nextHourStr);
                    });
                    contentCol.appendChild(addBtn);
                }
            }

            hourRow.appendChild(contentCol);
            timelineContainer.appendChild(hourRow);
        }

        viewport.appendChild(timelineContainer);
    }

    function openCalendarEditor(dateKey, existingEvent = null, defaultStartTime = "08:00", defaultEndTime = "12:00") {
        if (calendarEditorModal) {
            calendarEditorModal.classList.remove("hidden");
            if (calendarEditDate) calendarEditDate.value = dateKey;
            
            activeEditingEventId = existingEvent ? existingEvent.id : null;

            if (calendarEditStartDate) {
                calendarEditStartDate.value = existingEvent ? existingEvent.startDate : dateKey;
            }
            if (calendarEditEndDate) {
                calendarEditEndDate.value = existingEvent ? existingEvent.endDate : dateKey;
            }
            if (calendarEditStartTime) {
                calendarEditStartTime.value = existingEvent ? existingEvent.startTime : defaultStartTime;
            }
            if (calendarEditEndTime) {
                calendarEditEndTime.value = existingEvent ? existingEvent.endTime : defaultEndTime;
            }
            if (calendarEventTitleInput) {
                calendarEventTitleInput.value = existingEvent ? existingEvent.title : "";
            }
        }
    }

    if (closeCalendarEditorBtn) {
        closeCalendarEditorBtn.addEventListener("click", () => {
            playClickSound();
            if (calendarEditorModal) calendarEditorModal.classList.add("hidden");
        });
    }

    if (btnClearCalendarEntry) {
        btnClearCalendarEntry.addEventListener("click", async () => {
            playClickSound();
            const dateKey = calendarEditDate.value;
            if (dateKey) {
                const isProfileOpen = !authorProfileModal.classList.contains("hidden");
                const targetKey = isProfileOpen ? activeProfileUser : "general";

                if (calendarSchedules[targetKey]) {
                    calendarSchedules[targetKey] = calendarSchedules[targetKey].filter(ev => {
                        return !(dateKey >= ev.startDate && dateKey <= ev.endDate);
                    });
                }

                if (isProfileOpen) {
                    renderProfileCalendar();
                } else {
                    renderCalendar();
                }

                if (calendarEditorModal) calendarEditorModal.classList.add("hidden");
                await syncCalendarToCloud();
            }
        });
    }

    if (calendarEditorForm) {
        calendarEditorForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            playClickSound();

            const dateKey = calendarEditDate.value;
            const titleStr = calendarEventTitleInput.value.trim();
            const sDate = calendarEditStartDate.value;
            const eDate = calendarEditEndDate.value;
            const sTime = calendarEditStartTime.value;
            const eTime = calendarEditEndTime.value;

            if (dateKey && titleStr && sDate && eDate && sTime && eTime) {
                const isProfileOpen = !authorProfileModal.classList.contains("hidden");
                const targetKey = isProfileOpen ? activeProfileUser : "general";

                if (!calendarSchedules[targetKey]) {
                    calendarSchedules[targetKey] = [];
                }

                if (activeEditingEventId) {
                    const idx = calendarSchedules[targetKey].findIndex(ev => ev.id === activeEditingEventId);
                    if (idx !== -1) {
                        calendarSchedules[targetKey][idx].title = titleStr;
                        calendarSchedules[targetKey][idx].startDate = sDate;
                        calendarSchedules[targetKey][idx].endDate = eDate;
                        calendarSchedules[targetKey][idx].startTime = sTime;
                        calendarSchedules[targetKey][idx].endTime = eTime;
                    }
                } else {
                    const newEvent = {
                        id: "event_" + Math.random().toString(36).substr(2, 9),
                        title: titleStr,
                        startDate: sDate,
                        endDate: eDate,
                        startTime: sTime,
                        endTime: eTime
                    };
                    calendarSchedules[targetKey].push(newEvent);
                }

                if (isProfileOpen) {
                    renderProfileCalendar();
                } else {
                    renderCalendar();
                }

                if (calendarEditorModal) calendarEditorModal.classList.add("hidden");
                await syncCalendarToCloud();
            }
        });
    }

    function renderBlogMembers() {
        const list = document.getElementById("blog-members-list");
        if (!list) return;
        list.innerHTML = "";

        const userIds = ["jinxwithhood", "kopper9472", "noger69"];
        const currentUser = localStorage.getItem("currentUser");

        userIds.forEach(userId => {
            let name = userId;
            let avatar = "assets/server-icon.png";
            
            if (userId === "jinxwithhood") {
                name = "JinxWithHood";
                avatar = "assets/jinx-avatar.jpg";
            } else if (userId === "kopper9472") {
                name = "Kopper9472";
                avatar = "assets/server-icon.png";
            } else if (userId === "noger69") {
                name = "Noger69";
                avatar = "assets/server-icon.png";
            } else {
                const member = crewData[userId];
                if (member) {
                    name = member.name;
                    avatar = member.image || "assets/server-icon.png";
                }
            }

            const userProf = profilesDatabase[userId] || {};
            const position = userProf.role || "CREW MEMBER";

            const item = document.createElement("div");
            item.className = "blog-member-item font-mono";
            item.style.cssText = "display: flex; align-items: center; gap: 8px; padding: 4px 12px; border: 1px solid rgba(0, 243, 255, 0.2); border-radius: 4px; background: rgba(0, 0, 0, 0.4); cursor: pointer; transition: all 0.2s;";
            
            item.addEventListener("mouseenter", () => {
                item.style.borderColor = "var(--color-cyan)";
                item.style.background = "rgba(0, 243, 255, 0.08)";
                item.style.boxShadow = "0 0 8px rgba(0, 243, 255, 0.3)";
            });
            item.addEventListener("mouseleave", () => {
                item.style.borderColor = "rgba(0, 243, 255, 0.2)";
                item.style.background = "rgba(0, 0, 0, 0.4)";
                item.style.boxShadow = "none";
            });

            const avatarHTML = `
                <div style="width: 24px; height: 24px; border-radius: 50%; overflow: hidden; border: 1px solid var(--color-cyan); flex-shrink: 0;">
                    <img src="${avatar}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            `;

            const isJinxAuthor = userId === "jinxwithhood";
            const nameColor = isJinxAuthor ? "var(--color-cyan)" : "#fff";
            const textShadow = isJinxAuthor ? "0 0 5px rgba(0, 243, 255, 0.5)" : "none";

            const isUserOnline = currentUser && currentUser.toLowerCase() === userId.toLowerCase();
            const indicatorColor = isUserOnline ? "#00ff66" : "rgba(255, 255, 255, 0.15)";
            const indicatorShadow = isUserOnline ? "0 0 5px #00ff66" : "none";

            item.innerHTML = `
                ${avatarHTML}
                <div style="font-size: 0.8rem; font-weight: bold; color: ${nameColor}; text-shadow: ${textShadow}; margin-right: 5px;">${name}</div>
                <div class="online-indicator ${isUserOnline ? 'animate-pulse' : ''}" style="width: 5px; height: 5px; border-radius: 50%; background: ${indicatorColor}; box-shadow: ${indicatorShadow}; flex-shrink: 0;"></div>
            `;

            item.addEventListener("click", () => {
                playClickSound();
                openProfileModal(userId);
            });

            list.appendChild(item);
        });
    }

    // Load initialization values
    updateLoginStateUI();
    loadPosts();
    loadProfile().then(() => {
        renderBlogMembers();
    });
    loadCalendar();
});
