/**
 * DÍA DE LAS FLORES AMARILLAS - LOGICA INTERACTIVA Y SECUENCIA
 * Tulipanes realistas, inicio con menú, animación secuencial y dedicatoria automática
 */

document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const canvas = document.getElementById('petalsCanvas');
    const ctx = canvas.getContext('2d');
    const startScreen = document.getElementById('startScreen');
    const btnStart = document.getElementById('btnStart');
    const mainExperience = document.getElementById('mainExperience');
    const bouquetContainer = document.getElementById('bouquetContainer');
    const dedicationOverlay = document.getElementById('dedicationOverlay');
    const dedicationCard = document.getElementById('dedicationCard');
    const cardBody = document.getElementById('cardBody');
    const poemP1 = document.getElementById('poemP1');
    const poemP2 = document.getElementById('poemP2');
    const poemFinal = document.getElementById('poemFinal');
    const btnCloseCard = document.getElementById('btnCloseCard');
    const btnViewBouquet = document.getElementById('btnViewBouquet');
    const btnReopenDedication = document.getElementById('btnReopenDedication');
    const btnAudioToggle = document.getElementById('btnAudioToggle');
    const audioIcon = document.getElementById('audioIcon');
    const audioStatusText = document.getElementById('audioStatusText');

    // =========================================================================
    // 1. SISTEMA DE PARTÍCULAS (PÉTALOS DE TULIPÁN Y DESTELLOS MÁGICOS)
    // =========================================================================
    let width, height;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Petal {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -35;
            this.size = 14 + Math.random() * 16;
            this.speedY = 1.2 + Math.random() * 1.8;
            this.speedX = -0.5 + Math.random() * 1.5;
            this.angle = Math.random() * Math.PI * 2;
            this.angularSpeed = (Math.random() - 0.5) * 0.035;
            this.oscillationSpeed = 0.02 + Math.random() * 0.02;
            this.oscillationCounter = Math.random() * 100;
            this.opacity = 0.65 + Math.random() * 0.35;

            // Paleta de pétalo de tulipán amarillo
            const colors = [
                { r: 255, g: 234, b: 0 },   // Amarillo sol
                { r: 255, g: 215, b: 0 },   // Oro
                { r: 254, g: 240, b: 138 }, // Amarillo pálido brillante
                { r: 245, g: 158, b: 11 }   // Ámbar
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.oscillationCounter += this.oscillationSpeed;
            this.x += this.speedX + Math.sin(this.oscillationCounter) * 0.9;
            this.angle += this.angularSpeed;

            if (this.y > height + 40 || this.x < -40 || this.x > width + 40) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.globalAlpha = this.opacity;

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-this.size / 2, -this.size * 0.8, -this.size / 2, -this.size * 1.6, 0, -this.size * 2);
            ctx.bezierCurveTo(this.size / 2, -this.size * 1.6, this.size / 2, -this.size * 0.8, 0, 0);

            const grad = ctx.createLinearGradient(0, 0, 0, -this.size * 2);
            grad.addColorStop(0, `rgb(${this.color.r - 20}, ${this.color.g - 30}, ${this.color.b})`);
            grad.addColorStop(0.7, `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`);
            grad.addColorStop(1, '#ffffff');

            ctx.fillStyle = grad;
            ctx.shadowColor = 'rgba(255, 234, 0, 0.4)';
            ctx.shadowBlur = 8;
            ctx.fill();

            ctx.restore();
        }
    }

    class Sparkle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 10;
            this.size = 1.5 + Math.random() * 2.5;
            this.speedY = -0.5 - Math.random() * 1.2;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.alpha = 0.1 + Math.random() * 0.8;
            this.alphaSpeed = 0.015 + Math.random() * 0.02;
            this.increasing = Math.random() > 0.5;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.increasing) {
                this.alpha += this.alphaSpeed;
                if (this.alpha >= 0.95) this.increasing = false;
            } else {
                this.alpha -= this.alphaSpeed;
                if (this.alpha <= 0.08) this.increasing = true;
            }

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = '#fff9c4';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }
    }

    const totalPetals = window.innerWidth < 768 ? 26 : 48;
    const totalSparkles = window.innerWidth < 768 ? 32 : 65;
    const petals = Array.from({ length: totalPetals }, () => new Petal());
    const sparkles = Array.from({ length: totalSparkles }, () => new Sparkle());

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        sparkles.forEach(s => {
            s.update();
            s.draw();
        });

        petals.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function triggerFlowerExplosion(x = width / 2, y = height / 3, count = 22) {
        for (let i = 0; i < count; i++) {
            const p = new Petal();
            p.x = x + (Math.random() - 0.5) * 160;
            p.y = y + (Math.random() - 0.5) * 120;
            p.speedY = 1.5 + Math.random() * 3.5;
            p.speedX = (Math.random() - 0.5) * 4;
            petals.push(p);
        }

        setTimeout(() => {
            if (petals.length > totalPetals) {
                petals.splice(totalPetals);
            }
        }, 7000);
    }

    // =========================================================================
    // 2. MÚSICA ROMÁNTICA (WEB AUDIO API - DULCE Y CONFIABLE)
    // =========================================================================
    let audioCtx = null;
    let isPlayingMusic = false;
    let musicInterval = null;

    function initAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playChime(freq = 440, duration = 1.3) {
        try {
            initAudioContext();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(0, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(0.16, audioCtx.currentTime + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
            console.log('Audio ambient', e);
        }
    }

    // Melodía romántica en arpegios de caja de música
    const romanticMelody = [
        { note: 261.63, time: 0 },    // C4
        { note: 329.63, time: 260 },  // E4
        { note: 392.00, time: 520 },  // G4
        { note: 523.25, time: 780 },  // C5
        { note: 659.25, time: 1040 }, // E5
        { note: 523.25, time: 1300 }, // C5
        
        { note: 196.00, time: 1560 }, // G3
        { note: 293.66, time: 1820 }, // D4
        { note: 392.00, time: 2080 }, // G4
        { note: 493.88, time: 2340 }, // B4
        { note: 587.33, time: 2600 }, // D5
        { note: 493.88, time: 2860 }, // B4

        { note: 220.00, time: 3120 }, // A3
        { note: 261.63, time: 3380 }, // C4
        { note: 329.63, time: 3640 }, // E4
        { note: 440.00, time: 3900 }, // A4
        { note: 523.25, time: 4160 }, // C5
        { note: 440.00, time: 4420 }, // A4

        { note: 174.61, time: 4680 }, // F3
        { note: 261.63, time: 4940 }, // C4
        { note: 349.23, time: 5200 }, // F4
        { note: 440.00, time: 5460 }, // A4
        { note: 523.25, time: 5720 }, // C5
        { note: 659.25, time: 5980 }, // E5
    ];

    const loopDuration = 6300;

    function startMusic() {
        initAudioContext();
        isPlayingMusic = true;
        updateMusicUI(true);

        function playLoop() {
            romanticMelody.forEach(item => {
                setTimeout(() => {
                    if (isPlayingMusic) {
                        playChime(item.note, 1.4);
                    }
                }, item.time);
            });
        }

        playLoop();
        musicInterval = setInterval(() => {
            if (isPlayingMusic) {
                playLoop();
            }
        }, loopDuration);
    }

    function stopMusic() {
        isPlayingMusic = false;
        if (musicInterval) clearInterval(musicInterval);
        updateMusicUI(false);
    }

    function toggleMusic() {
        if (isPlayingMusic) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function updateMusicUI(playing) {
        if (playing) {
            audioStatusText.textContent = 'Pausar Música';
            audioIcon.textContent = '🔊';
        } else {
            audioStatusText.textContent = 'Poner Música';
            audioIcon.textContent = '🎵';
        }
    }

    btnAudioToggle.addEventListener('click', toggleMusic);

    // =========================================================================
    // 3. SECUENCIA PRINCIPAL: INICIO -> ANIMACIÓN TULIPANES -> DEDICATORIA (3S)
    // =========================================================================
    btnStart.addEventListener('click', () => {
        // Iniciar audio
        startMusic();
        playChime(523.25);
        setTimeout(() => playChime(659.25), 180);
        setTimeout(() => playChime(783.99), 360);

        // Ocultar pantalla de inicio
        startScreen.classList.add('fade-out');

        // Mostrar pantalla principal del ramo
        mainExperience.classList.remove('hidden');

        // Los tulipanes van apareciendo secuencialmente mediante las clases CSS:
        // step-1 (0.4s), step-2 (0.9s), step-3 (1.4s), step-4 (1.9s),
        // step-5 (2.4s), step-6 (2.9s), step-7 (3.4s).
        // La animación del último tulipán concluye a los ~4.6 segundos.

        // REQUERIMIENTO: Tras terminar la floración, esperar exactamente 3 SEGUNDOS
        // y mostrar automáticamente la dedicatoria en pantalla (4.6s + 3.0s = 7.6s)
        setTimeout(() => {
            showDedication();
        }, 7600);
    });

    // Dedicatoria personalizada indicada por el usuario
    const dedicationText = {
        p1: "Aunque ahorita la distancia no me permita darte en persona estos tulipanes, quise encontrar una forma diferente de hacerte llegar este pequeño detalle.",
        p2: "Aunque tengamos poco tiempo de conocernos, te has convertido en una persona muy especial para mí, de esas que llegan a tu vida y, sin darte cuenta, terminan ocupando un lugar muy bonito en ella.",
        final: "¡Feliz Día de las Flores Amarillas! 💛✨"
    };

    let wordTimeouts = [];

    function clearWordTimeouts() {
        wordTimeouts.forEach(t => clearTimeout(t));
        wordTimeouts = [];
    }

    function showDedication() {
        dedicationOverlay.classList.remove('hidden');
        btnReopenDedication.classList.add('hidden');

        // Reiniciar la animación de zoom de la tarjeta (crece desde pequeño hasta su tamaño original)
        dedicationCard.style.animation = 'none';
        void dedicationCard.offsetWidth; // Reflow forzoso
        dedicationCard.style.animation = 'zoomCardIn 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

        triggerFlowerExplosion(width / 2, height / 2, 30);
        playChime(587.33);
        setTimeout(() => playChime(880), 220);

        // Iniciar la lectura / revelación palabra por palabra
        startWordByWordReveal();
    }

    function startWordByWordReveal() {
        clearWordTimeouts();

        // Convertir cada texto en spans individuales de palabras
        poemP1.innerHTML = dedicationText.p1.split(' ').map(w => `<span class="word-span">${w}</span>`).join(' ');
        poemP2.innerHTML = dedicationText.p2.split(' ').map(w => `<span class="word-span">${w}</span>`).join(' ');
        poemFinal.textContent = dedicationText.final;
        poemFinal.classList.remove('visible');

        const spans1 = poemP1.querySelectorAll('.word-span');
        const spans2 = poemP2.querySelectorAll('.word-span');

        let delay = 650; // Esperar a que la tarjeta complete su zoom
        const wordCadence = 90; // Cadencia natural de lectura (90ms por palabra)

        // Párrafo 1
        spans1.forEach((span, idx) => {
            const t = setTimeout(() => {
                span.classList.add('visible');
            }, delay + idx * wordCadence);
            wordTimeouts.push(t);
        });

        delay += spans1.length * wordCadence + 280; // Pausa natural entre ideas

        // Párrafo 2
        spans2.forEach((span, idx) => {
            const t = setTimeout(() => {
                span.classList.add('visible');
            }, delay + idx * wordCadence);
            wordTimeouts.push(t);
        });

        delay += spans2.length * wordCadence + 350;

        // Frase final con destellos
        const finalTimeout = setTimeout(() => {
            poemFinal.classList.add('visible');
            createHeartBurst(width / 2, height / 2);
            playChime(659.25);
            setTimeout(() => playChime(783.99), 180);
        }, delay);
        wordTimeouts.push(finalTimeout);
    }

    // Permitir clic para mostrar todo el texto inmediatamente si se desea saltar la animación
    cardBody.addEventListener('click', () => {
        clearWordTimeouts();
        poemP1.querySelectorAll('.word-span').forEach(s => s.classList.add('visible'));
        poemP2.querySelectorAll('.word-span').forEach(s => s.classList.add('visible'));
        poemFinal.classList.add('visible');
    });

    function hideDedication() {
        clearWordTimeouts();
        dedicationOverlay.classList.add('hidden');
        btnReopenDedication.classList.remove('hidden');
    }

    btnCloseCard.addEventListener('click', hideDedication);
    btnViewBouquet.addEventListener('click', hideDedication);
    btnReopenDedication.addEventListener('click', showDedication);

    // =========================================================================
    // 4. INTERACTIVIDAD AL TOCAR EL RAMO
    // =========================================================================
    bouquetContainer.addEventListener('click', (e) => {
        const rect = bouquetContainer.getBoundingClientRect();
        const clickX = e.clientX || (rect.left + rect.width / 2);
        const clickY = e.clientY || (rect.top + rect.height / 3);

        triggerFlowerExplosion(clickX, clickY, 18);
        createHeartBurst(clickX, clickY);

        playChime(523.25);
        setTimeout(() => playChime(659.25), 120);
        setTimeout(() => playChime(783.99), 240);

        bouquetContainer.style.transform = 'translateY(-10px) scale(1.04)';
        setTimeout(() => {
            bouquetContainer.style.transform = '';
        }, 320);
    });

    function createHeartBurst(x, y) {
        const icons = ['💛', '🌷', '✨', '⭐'];
        for (let i = 0; i < 6; i++) {
            const el = document.createElement('span');
            el.innerText = icons[Math.floor(Math.random() * icons.length)];
            el.style.position = 'fixed';
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.fontSize = `${20 + Math.random() * 14}px`;
            el.style.pointerEvents = 'none';
            el.style.zIndex = '9999';
            el.style.transition = 'all 1.3s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.transform = 'translate(-50%, -50%) scale(0.5)';
            el.style.opacity = '1';
            document.body.appendChild(el);

            const destX = (Math.random() - 0.5) * 160;
            const destY = -60 - Math.random() * 100;

            requestAnimationFrame(() => {
                el.style.transform = `translate(${destX}px, ${destY}px) scale(1.25) rotate(${(Math.random() - 0.5) * 30}deg)`;
                el.style.opacity = '0';
            });

            setTimeout(() => el.remove(), 1300);
        }
    }
});
