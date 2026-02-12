// ===== NAVEGACIÓN SUAVE =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== FUNCIÓN PARA MOSTRAR MENSAJES =====
function mostrarMensaje(texto, tipo = 'info') {
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    const colores = {
        error: { bg: '#dc3545', color: 'white' },
        exito: { bg: '#28a745', color: 'white' },
        info: { bg: '#0078d4', color: 'white' }
    };
    
    const estilo = colores[tipo] || colores.info;
    mensaje.style.background = estilo.bg;
    mensaje.style.color = estilo.color;
    
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        mensaje.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => mensaje.remove(), 300);
    }, 3000);
}

// ===== VALIDACIÓN DE FORMULARIO CON ASYNC =====
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        
        // Validar datos
        if (name.length < 3) {
            mostrarMensaje('El nombre debe tener al menos 3 caracteres', 'error');
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            mostrarMensaje('Por favor, ingresa un email válido', 'error');
            return;
        }
        
        // Llamar función asincrónica
        await enviarFormulario(name, email);
    });
}

// ===== ENVIAR FORMULARIO (ASYNC) =====
async function enviarFormulario(nombre, email) {
    try {
        mostrarMensaje('Enviando formulario...', 'info');
        
        // Simular delay de envío
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Guardar en localStorage
        const datos = { nombre, email, fecha: new Date().toLocaleString() };
        let registros = JSON.parse(localStorage.getItem('registros')) || [];
        registros.push(datos);
        localStorage.setItem('registros', JSON.stringify(registros));
        
        mostrarMensaje('¡Formulario enviado correctamente!', 'exito');
        form.reset();
    } catch (error) {
        mostrarMensaje('Error al enviar formulario', 'error');
        console.error('Error:', error);
    }
}

// ===== CONTADOR DE VISITAS =====
function inicializarContadorVisitas() {
    let visitas = localStorage.getItem('visitas') || 0;
    visitas = parseInt(visitas) + 1;
    localStorage.setItem('visitas', visitas);
    console.log(`📊 Número de visitas: ${visitas}`);
}

inicializarContadorVisitas();

// ===== TEMA OSCURO/CLARO =====
function inicializarTema() {
    const temaGuardado = localStorage.getItem('tema') || 'claro';
    document.documentElement.setAttribute('data-tema', temaGuardado);
    
    const botonTema = document.createElement('button');
    botonTema.id = 'boton-tema';
    botonTema.textContent = temaGuardado === 'claro' ? '🌙' : '☀️';
    botonTema.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: #0078d4;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    botonTema.addEventListener('mouseover', () => {
        botonTema.style.transform = 'scale(1.1)';
    });
    
    botonTema.addEventListener('mouseout', () => {
        botonTema.style.transform = 'scale(1)';
    });
    
    botonTema.addEventListener('click', () => {
        const temaActual = document.documentElement.getAttribute('data-tema');
        const nuevoTema = temaActual === 'claro' ? 'oscuro' : 'claro';
        document.documentElement.setAttribute('data-tema', nuevoTema);
        localStorage.setItem('tema', nuevoTema);
        botonTema.textContent = nuevoTema === 'claro' ? '🌙' : '☀️';
    });
    
    document.body.appendChild(botonTema);
}

inicializarTema();

// ===== OBSERVADOR DE ELEMENTOS (SCROLL) =====
function observarElementos() {
    const opciones = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease';
                observador.unobserve(entry.target);
            }
        });
    }, opciones);
    
    document.querySelectorAll('article, section').forEach(elemento => {
        observador.observe(elemento);
    });
}

observarElementos();

// ===== OBTENER DATOS DE API (ASYNC) =====
async function obtenerDatosAPI() {
    try {
        mostrarMensaje('Cargando datos de la API...', 'info');
        
        const respuesta = await fetch('https://jsonplaceholder.typicode.com/users?_limit=3');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }
        
        const usuarios = await respuesta.json();
        console.log('✅ Usuarios obtenidos:', usuarios);
        mostrarMensaje(`Se cargaron ${usuarios.length} usuarios`, 'exito');
        
        return usuarios;
    } catch (error) {
        mostrarMensaje('Error al obtener datos', 'error');
        console.error('Error:', error);
    }
}

// ===== CARGAR MÚLTIPLES DATOS EN PARALELO (ASYNC) =====
async function cargarTodosLosDatos() {
    try {
        console.log('⏳ Iniciando carga de datos...');
        
        const [usuarios, posts] = await Promise.all([
            fetch('https://jsonplaceholder.typicode.com/users?_limit=3').then(r => r.json()),
            fetch('https://jsonplaceholder.typicode.com/posts?_limit=3').then(r => r.json())
        ]);
        
        console.log('✅ Datos completos:', { usuarios, posts });
        mostrarMensaje('Todos los datos cargados exitosamente', 'exito');
        
        return { usuarios, posts };
    } catch (error) {
        mostrarMensaje('Error al cargar datos', 'error');
        console.error('Error:', error);
    }
}

// ===== BUSCAR CON DEBOUNCE (ASYNC) =====
function debounce(fn, delay) {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

const buscar = debounce(async (termino) => {
    if (termino.length < 2) return;
    
    try {
        console.log(`🔍 Buscando: "${termino}"`);
        mostrarMensaje(`Buscando "${termino}"...`, 'info');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        mostrarMensaje(`Búsqueda completada para "${termino}"`, 'exito');
    } catch (error) {
        console.error('Error en búsqueda:', error);
    }
}, 500);

// ===== ANIMACIONES CSS DINÁMICAS =====
const estilos = document.createElement('style');
estilos.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(20px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    [data-tema="oscuro"] {
        background-color: #1a1a1a;
        color: #f0f0f0;
    }
    
    [data-tema="oscuro"] header {
        background: linear-gradient(135deg, #0056b3, #0078d4);
    }
    
    [data-tema="oscuro"] article {
        background-color: #2a2a2a;
        color: #e0e0e0;
    }
    
    [data-tema="oscuro"] footer {
        background: linear-gradient(135deg, #0a0a0a, #0056b3);
    }
    
    [data-tema="oscuro"] input {
        background-color: #333;
        color: #f0f0f0;
        border-color: #444;
    }
`;

document.head.appendChild(estilos);

// ===== MARCADOR DE NAVEGACIÓN ACTIVA =====
function marcarNavegacionActiva() {
    const secciones = document.querySelectorAll('section');
    const enlaces = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let actualActivo = '';
        
        secciones.forEach(seccion => {
            const top = seccion.offsetTop;
            if (scrollY >= top - 200) {
                actualActivo = seccion.getAttribute('id');
            }
        });
        
        enlaces.forEach(enlace => {
            enlace.classList.remove('activo');
            if (enlace.getAttribute('href').slice(1) === actualActivo) {
                enlace.classList.add('activo');
            }
        });
    });
}

marcarNavegacionActiva();

// ===== API PÚBLICA PARA USAR EN CONSOLA =====
window.miApp = {
    obtenerDatosAPI,
    cargarTodosLosDatos,
    buscar,
    mostrarMensaje,
    enviarFormulario
};

console.log('🚀 Script cargado correctamente');
console.log('Usa: window.miApp.obtenerDatosAPI() o window.miApp.cargarTodosLosDatos()');