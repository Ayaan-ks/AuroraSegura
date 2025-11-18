// ===== FUNCIONALIDADES PRINCIPAIS =====

document.addEventListener('DOMContentLoaded', function() {
    // Navbar Shrink Function
    const navbarShrink = function () {
        const navbar = document.getElementById('mainNav');
        if (!navbar) return;
        
        if (window.scrollY === 0) {
            navbar.classList.remove('navbar-shrink');
        } else {
            navbar.classList.add('navbar-shrink');
        }
    };

    // Shrink navbar on scroll
    navbarShrink();
    document.addEventListener('scroll', navbarShrink);

    // Smooth scrolling para links do menu
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Fechar menu mobile se estiver aberto
                closeMobileMenu();
            }
        });
    });

    // Menu Mobile Toggle - CORREÇÃO COMPLETA
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Fechar menu ao clicar em um link (mobile)
    const mobileLinks = document.querySelectorAll('.nav-menu .nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        const isClickInsideNav = e.target.closest('.nav-container');
        const isMenuActive = navMenu?.classList.contains('active');
        
        if (!isClickInsideNav && isMenuActive) {
            closeMobileMenu();
        }
    });

    // Fechar menu ao redimensionar a janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Animações de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll(
        '.emergency-card, .procedure-item, .kit-card, .prevention-card, .contact-card'
    );
    animatedElements.forEach(el => observer.observe(el));

    // Inicializar botão voltar ao topo
    createBackToTopButton();
});

// ===== FUNÇÕES UTILITÁRIAS =====

function closeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    document.body.classList.remove('no-scroll');
}

// ===== FUNÇÃO DE LIGAÇÃO CORRIGIDA =====
function callEmergency(number) {
    // Remover caracteres especiais do número
    const cleanNumber = number.replace(/\D/g, '');
    
    // Verificar se é um dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Em dispositivos móveis, usar tel: para discagem real
        window.location.href = `tel:${cleanNumber}`;
    } else {
        // Em desktop, mostrar mensagem e simular discagem
        const emergencyNumbers = {
            '192': 'SAMU - Serviço de Atendimento Móvel de Urgência',
            '193': 'Bombeiros',
            '190': 'Polícia Militar', 
            '08007226001': 'Centro de Informação Toxicológica'
        };
        
        const serviceName = emergencyNumbers[number] || 'Serviço de Emergência';
        
        if (confirm(`🚨 EMERGÊNCIA!\n\nDeseja ligar para ${serviceName}?\nNúmero: ${number}\n\nEm um dispositivo móvel, esta ação discaria automaticamente.`)) {
            console.log(`Simulando discagem para: ${number}`);
            emergencyCallEffect();
            
            // Tentar usar a API de telefonia se disponível
            if (navigator.userAgent.includes('Android') || navigator.userAgent.includes('iPhone')) {
                window.open(`tel:${cleanNumber}`, '_self');
            }
        }
    }
}

function emergencyCallEffect() {
    const emergencyOverlay = document.createElement('div');
    emergencyOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(220, 38, 38, 0.3);
        z-index: 9999;
        animation: emergencyPulse 0.5s ease-out;
        pointer-events: none;
    `;
    
    document.body.appendChild(emergencyOverlay);
    
    setTimeout(() => {
        if (emergencyOverlay.parentNode) {
            document.body.removeChild(emergencyOverlay);
        }
    }, 500);
}

// Botão de voltar ao topo
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 45px;
        height: 45px;
        background: var(--primary-red);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.1rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
}

// Adicionar estilos CSS dinâmicos
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes emergencyPulse {
        0% { opacity: 0; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.02); }
        100% { opacity: 0; transform: scale(1); }
    }
    
    .back-to-top:hover {
        background: var(--bright-red) !important;
        transform: translateY(-2px) !important;
    }
`;

document.head.appendChild(dynamicStyles);