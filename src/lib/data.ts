/** Todo el contenido del portafolio en un solo lugar. */

export const SECCIONES = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'contacto', label: 'Contacto' },
]

export const FRASE = 'Código con intención. Diseño con detalle.'

export interface Proyecto {
  titulo: string
  curso: string
  ciclo: string
  stack: string[]
  puntos: string[]
  /** true mientras el código no esté disponible: se muestra con la cinta 404 */
  noEncontrado: boolean
  enlace?: string
}

export const PROYECTOS: Proyecto[] = [
  {
    titulo: 'Tienda de Ropa Online',
    curso: 'Diseño de Interfaces de Programación',
    ciclo: '2023-2',
    stack: ['HTML', 'CSS', 'JavaScript'],
    puntos: ['Página web responsiva desde cero', 'Interfaces centradas en la experiencia de usuario'],
    noEncontrado: true,
  },
  {
    titulo: 'Sistema de Almacén',
    curso: 'Programación Orientada a Objetos y Base de Datos',
    ciclo: '2024-1',
    stack: ['Java', 'MySQL'],
    puntos: ['App Java conectada a MySQL con CRUD completo', 'Inventario con filtros por producto, precio e ID'],
    noEncontrado: true,
  },
  {
    titulo: 'Le Peruparfum',
    curso: 'Desarrollo de Aplicaciones en Internet',
    ciclo: '2024-2',
    stack: ['Laravel', 'MySQL', 'Stripe'],
    puntos: ['Tienda virtual con arquitectura MVC', 'Pagos en línea con Stripe'],
    noEncontrado: true,
  },
]

export const CICLOS = ['23-2', '24-1', '24-2', 'Hoy']

export interface Habilidad {
  categoria: string
  nombre: string
  nivel: number
  detalles: string[]
  logos: string[]
}

export const HABILIDADES: Habilidad[] = [
  { categoria: 'Frontend', nombre: 'HTML + CSS', nivel: 5, detalles: ['Maquetación responsiva', 'Interfaces centradas en UX'], logos: ['/logos/html.svg', '/logos/css.svg'] },
  { categoria: 'Frontend', nombre: 'JavaScript', nivel: 4, detalles: ['Interactividad y DOM', 'Consumo de APIs'], logos: ['/logos/javascript.svg'] },
  { categoria: 'Backend', nombre: 'Java', nivel: 4, detalles: ['Programación orientada a objetos', 'Apps de escritorio'], logos: ['/logos/java.svg'] },
  { categoria: 'Backend', nombre: 'Laravel', nivel: 4, detalles: ['Arquitectura MVC', 'E-commerce con Stripe'], logos: ['/logos/laravel.svg', '/logos/php.svg'] },
  { categoria: 'Base de datos', nombre: 'MySQL', nivel: 4, detalles: ['Modelado de datos', 'CRUD y consultas'], logos: ['/logos/mysql.svg'] },
  { categoria: 'Herramientas', nombre: 'Git', nivel: 3, detalles: ['Control de versiones', 'Trabajo colaborativo'], logos: ['/logos/git.svg'] },
]

export const APRENDIENDO = ['ASP.NET', 'SQL Server', 'AWS', 'Scrum', 'Procesos BPM']

export const LOGOS_MARQUEE = ['html', 'css', 'javascript', 'react', 'nodejs', 'php', 'laravel', 'java', 'mysql', 'git', 'stripe']

export const SOBRE_MI = [
  { categoria: 'Educación', valor: 'TECSUP', detalles: ['Diseño y Desarrollo de Software', '2023 — Actualidad'] },
  { categoria: 'Idiomas', valor: 'ES / EN', detalles: ['Español — Nativo', 'Inglés — Intermedio 2 (en curso)'] },
  {
    categoria: 'Competencias',
    valor: '05',
    detalles: ['Pensamiento analítico', 'Resolución de problemas', 'Comunicación efectiva', 'Trabajo en equipo', 'Iniciativa e innovación'],
  },
]

export const CIFRAS = [
  { valor: 3, etiqueta: 'Proyectos' },
  { valor: 6, etiqueta: 'Tecnologías' },
  { valor: 2023, etiqueta: 'Desde' },
]

export const CONTACTO = {
  correo: 'tonny.namoc@tecsup.edu.pe',
  telefono: '983 415 509',
  telefonoHref: 'tel:+51983415509',
  ciudad: 'Trujillo, Perú',
  cv: '/CV-Tonny-Namoc.docx',
  nombreCompleto: 'Tonny Alexander Namoc Julca',
}
