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
                    newSrc = "assets/news-banner.jpg";
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
});
