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
    titulo: 'Resultados Electorales',
    curso: 'Sistema web tipo ONPE con reportes en PDF',
    ciclo: 'Proyecto académico',
    stack: ['ASP.NET Core MVC', 'EF Core', 'SQL Server', 'QuestPDF'],
    puntos: ['Registro y consulta de resultados electorales', 'Reportes en PDF'],
    noEncontrado: true,
  },
  {
    titulo: 'Data Warehouse y BI',
    curso: 'Esquemas estrella y copo de nieve, ETL y dashboards de ventas',
    ciclo: 'Proyecto académico',
    stack: ['SQL Server', 'BigQuery', 'Power BI', 'Python'],
    puntos: ['Procesos ETL', 'Dashboards de indicadores de ventas'],
    noEncontrado: true,
  },
  {
    titulo: 'Le Peruparfum',
    curso: 'E-commerce con panel administrativo y pagos',
    ciclo: 'Proyecto académico',
    stack: ['Laravel', 'MySQL', 'Stripe'],
    puntos: ['Arquitectura MVC y panel de productos', 'Pasarela de pagos Stripe'],
    noEncontrado: true,
  },
  {
    titulo: 'Chakray',
    curso: 'Marketplace agrícola B2B: modelo de negocio, arquitectura y nube',
    ciclo: 'Startup',
    stack: ['Next.js', 'Fastify', 'PostgreSQL', 'AWS'],
    puntos: ['Diseño del modelo de negocio', 'Arquitectura e infraestructura en la nube'],
    noEncontrado: true,
  },
]

export const CICLOS = ['2023', '2024', '2025', '2026']

export interface Habilidad {
  categoria: string
  nombre: string
  nivel: number
  detalles: string[]
  logos: string[]
}

export const HABILIDADES: Habilidad[] = [
  { categoria: 'Frontend', nombre: 'HTML + CSS', nivel: 5, detalles: ['Maquetación responsiva', 'Interfaces centradas en UX'], logos: ['/logos/html.svg', '/logos/css.svg'] },
  { categoria: 'Frontend', nombre: 'JavaScript', nivel: 4, detalles: ['Interactividad y DOM', 'Next.js'], logos: ['/logos/javascript.svg'] },
  { categoria: 'Backend', nombre: 'Java', nivel: 4, detalles: ['Programación orientada a objetos', 'Apps de escritorio'], logos: ['/logos/java.svg'] },
  { categoria: 'Backend', nombre: 'Laravel', nivel: 4, detalles: ['Arquitectura MVC', 'E-commerce con Stripe'], logos: ['/logos/laravel.svg', '/logos/php.svg'] },
  { categoria: 'Backend', nombre: 'ASP.NET Core', nivel: 3, detalles: ['C# y MVC', 'Entity Framework Core'], logos: ['/logos/csharp.svg'] },
  { categoria: 'Base de datos', nombre: 'SQL', nivel: 4, detalles: ['MySQL, SQL Server y PostgreSQL', 'Modelado y consultas'], logos: ['/logos/mysql.svg', '/logos/sql.svg'] },
  { categoria: 'Inteligencia de negocios', nombre: 'Power BI', nivel: 3, detalles: ['Data warehouse y ETL', 'BigQuery y Python'], logos: ['/logos/bi.svg'] },
  { categoria: 'Herramientas', nombre: 'Git', nivel: 3, detalles: ['Control de versiones', 'SAP S/4HANA (MM, PP)'], logos: ['/logos/git.svg'] },
]

export const APRENDIENDO = ['AWS', 'Cloud', 'DAX', 'Next.js', 'Inglés intermedio']

export const LOGOS_MARQUEE = ['html', 'css', 'javascript', 'react', 'nodejs', 'php', 'laravel', 'java', 'mysql', 'git', 'stripe', 'csharp', 'sql', 'bi']

export const SOBRE_MI = [
  { categoria: 'Educación', valor: 'TECSUP', detalles: ['Diseño y Desarrollo de Software', 'Egresado 2023 — 2026', 'Bachiller en trámite'] },
  {
    categoria: 'Experiencia',
    valor: 'GluGlu',
    detalles: ['Agua de Mesa · Grupo Auria S.R.L. (2025)', 'Producción, reparto y atención al cliente'],
  },
  { categoria: 'Idiomas', valor: 'ES / EN', detalles: ['Español — Nativo', 'Inglés — Intermedio (El Cultural, en curso)'] },
]

export const CIFRAS = [
  { valor: 4, etiqueta: 'Proyectos' },
  { valor: 4, etiqueta: 'Cursos' },
  { valor: 2023, etiqueta: 'Desde' },
]

export const CONTACTO = {
  correo: 'tonny.namoc@tecsup.edu.pe',
  telefono: '983 415 509',
  telefonoHref: 'tel:+51983415509',
  ciudad: 'Trujillo, Perú',
  linkedin: 'https://www.linkedin.com/in/tonny-namoc-b31107415',
  cv: '/CV-Tonny-Namoc.docx',
  nombreCompleto: 'Tonny Alexander Namoc Julca',
}
