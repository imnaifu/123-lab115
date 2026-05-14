// ─── Animated Background ───
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
            const force = (150 - dist) / 150 * 0.5;
            this.x -= dx / dist * force;
            this.y -= dy / dist * force;
        }
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 92, 231, ${this.opacity})`;
        ctx.fill();
    }
}

const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

let lastTime = 0;
function animate(time) {
    const dt = time - lastTime;
    lastTime = time;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let p of particles) {
        p.update();
        p.draw();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(108, 92, 231, ${(1 - dist / 120) * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}
animate(0);

document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

document.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
});

document.addEventListener('touchend', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// ─── Clock ───
function pad(n) { return String(n).padStart(2, '0'); }

function updateTime() {
    const now = new Date();
    const h = pad(now.getHours());
    const m = pad(now.getMinutes());
    const s = pad(now.getSeconds());
    document.getElementById('clock').textContent = `${h}:${m}:${s}`;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    document.getElementById('date').textContent = `${dayName}, ${month} ${day}, ${year}`;
}

updateTime();
setInterval(updateTime, 1000);

// Uptime - calculate from page load
const startTime = Date.now();
function updateUptime() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    document.getElementById('uptime').textContent = `${h}h ${pad(m)}m ${pad(s)}s`;
    document.querySelector('.stat-detail').textContent = 'Session active';
}
updateUptime();
setInterval(updateUptime, 1000);

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// ─── Cool entry animation ───
document.addEventListener('DOMContentLoaded', () => {
    const els = document.querySelectorAll('.badge, h1, .subtitle, .time-section, .stat-card, .link-card, footer');
    els.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 80 * i);
    });
});
