let currentPage = 0;
const totalPages = document.querySelectorAll('.page').length;
const pages = document.querySelectorAll('.page');
const progressBar = document.getElementById('progress-bar');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');
const pageNameSpan = document.getElementById('page-name');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const book = document.getElementById('book');

// Configuración del libro
let isAnimating = false;
let startX = 0;
let isDragging = false;

// Nombres de páginas para el indicador
const pageNames = [
    "Portada",
    "Horno 4 Latas",
    "Horno 6 Latas",
    "Horno 9 Latas",
    "Horno 8 Latas",
    "Horno 6 Latas con Luz",
    "Horno 10 Latas",
    "Horno de Pizza",
    "Amasadora",
    "Cilindro Refinador",
    "Batidora",
    "Mesa de Trabajo",
    "Servicio Técnico"
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeCatalog();
    setupEventListeners();
    updateNavigation();
});

function initializeCatalog() {
    // Configurar páginas iniciales
    pages.forEach((page, index) => {
        page.style.zIndex = totalPages - index;
        if (index !== currentPage) {
            page.classList.remove('active', 'prev', 'next');
        }
    });
    
    // Mostrar primera página
    showPage(0);
    
    // Configurar páginas totales
    if (totalPagesSpan) {
        totalPagesSpan.textContent = totalPages;
    }
}

function setupEventListeners() {
    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault();
            nextPage();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            previousPage();
        }
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Eventos de arrastre para efecto libro
    if (book) {
        // PC
        book.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', dragPage);
        document.addEventListener('mouseup', endDrag);
        
        // Móvil
        book.addEventListener('touchstart', startDragTouch, { passive: false });
        book.addEventListener('touchmove', dragPageTouch, { passive: false });
        book.addEventListener('touchend', endDragTouch);
    }

    // Prevenir arrastre de imágenes
    document.querySelectorAll('.page img').forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });
}

function showPage(pageIndex) {
    if (isAnimating || pageIndex < 0 || pageIndex >= totalPages) return;
    
    isAnimating = true;
    
    // Ocultar todas las páginas
    pages.forEach(page => {
        page.classList.remove('active', 'prev', 'next', 'flipping');
    });

    // Configurar página actual
    if (pages[pageIndex]) {
        pages[pageIndex].classList.add('active');
        pages[pageIndex].style.zIndex = totalPages + 2;
    }

    // Configurar página anterior si existe
    if (pageIndex > 0 && pages[pageIndex - 1]) {
        pages[pageIndex - 1].classList.add('prev');
        pages[pageIndex - 1].style.zIndex = totalPages + 1;
    }

    // Configurar página siguiente si existe
    if (pageIndex < totalPages - 1 && pages[pageIndex + 1]) {
        pages[pageIndex + 1].classList.add('next');
        pages[pageIndex + 1].style.zIndex = totalPages;
    }

    currentPage = pageIndex;

    // Actualizar navegación después de un breve delay
    setTimeout(() => {
        updateNavigation();
        updateProgress();
        updatePageIndicator();
        isAnimating = false;
    }, 300);
}

function nextPage() {
    if (currentPage < totalPages - 1 && !isAnimating) {
        const nextPageIndex = currentPage + 1;
        
        // Animación de giro
        pages[currentPage].classList.add('flipping');
        
        setTimeout(() => {
            showPage(nextPageIndex);
        }, 400);
    }
}

function previousPage() {
    if (currentPage > 0 && !isAnimating) {
        const prevPageIndex = currentPage - 1;
        
        // Remover clase flipping de la página anterior
        pages[prevPageIndex].classList.remove('flipping');
        
        showPage(prevPageIndex);
    }
}

// Funciones de arrastre
function startDrag(e) {
    if (isAnimating) return;
    isDragging = true;
    startX = e.clientX;
    book.style.cursor = 'grabbing';
}

function startDragTouch(e) {
    if (isAnimating) return;
    isDragging = true;
    startX = e.touches[0].clientX;
}

function dragPage(e) {
    if (!isDragging || isAnimating) return;
    
    const currentX = e.clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) {
        if (diff > 0) {
            nextPage();
        } else {
            previousPage();
        }
        endDrag();
    }
}

function dragPageTouch(e) {
    if (!isDragging || isAnimating) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 30) {
        if (diff > 0) {
            nextPage();
        } else {
            previousPage();
        }
        endDragTouch();
        e.preventDefault();
    }
}

function endDrag() {
    isDragging = false;
    book.style.cursor = 'grab';
}

function endDragTouch() {
    isDragging = false;
}

function updateNavigation() {
    if (prevBtn) {
        prevBtn.disabled = currentPage === 0;
        prevBtn.style.opacity = currentPage === 0 ? '0.3' : '1';
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages - 1;
        nextBtn.style.opacity = currentPage === totalPages - 1 ? '0.3' : '1';
    }
}

function updateProgress() {
    if (progressBar) {
        const progress = ((currentPage + 1) / totalPages) * 100;
        progressBar.style.width = progress + '%';
    }
}

function updatePageIndicator() {
    if (currentPageSpan) {
        currentPageSpan.textContent = currentPage + 1;
    }
    if (pageNameSpan && pageNames[currentPage]) {
        pageNameSpan.textContent = pageNames[currentPage];
    }
}

// Función para abrir modal de imagen
function openModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalContent = document.getElementById('modal-content');
    
    if (modal && modalContent) {
        modalContent.innerHTML = '';
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = 'Imagen ampliada del producto';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '80vh';
        img.style.objectFit = 'contain';
        
        modalContent.appendChild(img);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Función para cerrar modal
function closeModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Función para solicitar información por WhatsApp
function solicitarInfoWhatsApp(producto) {
    const telefono = "50379254338";
    const mensaje = `¡Hola! Estoy interesado/a en el producto: ${producto}. ¿Podrían proporcionarme más información sobre disponibilidad, precios y tiempos de entrega?`;
    
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
}

// Notificación responsiva
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Detectar dispositivo y mostrar instrucciones
if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    showToast("📱 Desliza para pasar páginas");
} else {
    showToast("💻 Usa las flechas ← → o arrastra las páginas");
}

// Hacer funciones globales
window.nextPage = nextPage;
window.previousPage = previousPage;
window.openModal = openModal;
window.closeModal = closeModal;
window.solicitarInfoWhatsApp = solicitarInfoWhatsApp;
