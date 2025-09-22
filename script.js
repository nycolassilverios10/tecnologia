document.addEventListener('DOMContentLoaded', () => {

    // =================================== //
    // ====== CÓDIGO DO MENU LATERAL ====== //
    // =================================== //
    const btnMobile = document.getElementById('btn-mobile');
    if (btnMobile) {
        function toggleMenu(event) {
            if (event.type === 'touchstart') event.preventDefault();
            const nav = document.querySelector('.menu-fixo');
            nav.classList.toggle('ativo');
            document.body.classList.toggle('menu-aberto');
            const menuAtivo = nav.classList.contains('ativo');
            event.currentTarget.setAttribute('aria-expanded', menuAtivo);
            event.currentTarget.setAttribute('aria-label', menuAtivo ? 'Fechar Menu' : 'Abrir Menu');
        }
        btnMobile.addEventListener('click', toggleMenu);
        btnMobile.addEventListener('touchstart', toggleMenu);

        const linksDoMenu = document.querySelectorAll('#menu-lista a');
        linksDoMenu.forEach(link => {
            link.addEventListener('click', () => {
                const nav = document.querySelector('.menu-fixo');
                if (nav.classList.contains('ativo')) {
                    nav.classList.remove('ativo');
                    document.body.classList.remove('menu-aberto');
                    btnMobile.setAttribute('aria-expanded', 'false');
                    btnMobile.setAttribute('aria-label', 'Abrir Menu');
                }
            });
        });
    }

    // ============================================= //
    // ====== CÓDIGO DO CARROSSEL DE PROFISSÕES ====== //
    // ============================================= //
    const slides = document.querySelectorAll('.carrossel .slide');
    if (slides.length > 0) {
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        let indexAtivo = 0;

        function atualizarSlides() {
            slides.forEach((slide, i) => {
                slide.classList.remove('ativo', 'anterior', 'proximo');
                const anteriorIndex = (indexAtivo - 1 + slides.length) % slides.length;
                const proximoIndex = (indexAtivo + 1) % slides.length;

                if (i === indexAtivo) {
                    slide.classList.add('ativo');
                } else if (i === anteriorIndex) {
                    slide.classList.add('anterior');
                } else if (i === proximoIndex) {
                    slide.classList.add('proximo');
                }
            });
        }

        nextBtn.addEventListener('click', () => {
            indexAtivo = (indexAtivo + 1) % slides.length;
            atualizarSlides();
        });

        prevBtn.addEventListener('click', () => {
            indexAtivo = (indexAtivo - 1 + slides.length) % slides.length;
            atualizarSlides();
        });

        atualizarSlides();
    }
});

// =================================== //
// ====== LÓGICA DAS LINHAS DO CURSOR ====== //
// =================================== //
const canvas = document.getElementById('linhas-cursor');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height, mouse, particles;

    // Classe para representar cada partícula
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = 2;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.fillStyle = 'rgba(0, 247, 255, 0.5)'; // Cor ciano do nosso tema
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }
    }

    // Função para conectar as partículas com linhas
    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 35) { // Distância máxima para desenhar a linha
                    opacityValue = 1 - (distance / 35);
                    ctx.strokeStyle = `rgba(0, 247, 255, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Inicia e prepara tudo
    function init() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        mouse = { x: null, y: null, radius: (width / 80) * (height / 80) };
        particles = [];
        let numberOfParticles = (width * height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let x = (Math.random() * width);
            let y = (Math.random() * height);
            particles.push(new Particle(x, y));
        }
    }

    // Loop de animação
    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connect();
        requestAnimationFrame(animate);
    }
    
    window.addEventListener('resize', init);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    init();
    animate();
}