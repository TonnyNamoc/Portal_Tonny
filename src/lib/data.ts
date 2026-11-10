/** Todo el contenido del portafolio en un solo lugar. */

export const SECCIONES = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'certificados', label: 'Certificados' },
  { id: 'contacto', label: 'Contacto' },
]

export const FRASE = 'Código con intención. Diseño con detalle.'

export interface Proyecto {
  titulo: string
  curso: string
  ciclo: string
  stack: string[]
  /** Una frase: qué es el proyecto */
  queEs: string
  /** Lo que hice yo, punto por punto */
  hice: string[]
  /** true si fue trabajo en equipo y aporté en una parte */
  participacion?: boolean
  /** true mientras el repositorio no sea público */
  codigoPrivado: boolean
  enlace?: string
}

export const PROYECTOS: Proyecto[] = [
  {
    titulo: 'Resultados Electorales',
    curso: 'Sistema web tipo ONPE con reportes en PDF',
    ciclo: 'Proyecto académico',
    stack: ['ASP.NET Core MVC', 'EF Core', 'SQL Server', 'QuestPDF'],
    queEs: 'Sistema web para registrar y consultar resultados electorales, al estilo del portal de la ONPE.',
    hice: [
      'Registro y consulta de resultados electorales',
      'Reportes en PDF generados con QuestPDF',
      'Acceso a datos con Entity Framework Core sobre SQL Server',
    ],
    codigoPrivado: true,
  },
  {
    titulo: 'Data Warehouse y BI',
    curso: 'Esquemas estrella y copo de nieve, ETL y dashboards de ventas',
    ciclo: 'Proyecto académico',
    stack: ['SQL Server', 'BigQuery', 'Power BI', 'Python'],
    queEs: 'Almacenes de datos y tableros para leer indicadores de ventas.',
    hice: [
      'Diseño de data warehouses con esquemas estrella y copo de nieve',
      'Procesos ETL para cargar y ordenar los datos',
      'Dashboards de indicadores de ventas',
    ],
    codigoPrivado: true,
  },
  {
    titulo: 'Le Peruparfum',
    curso: 'E-commerce con panel administrativo y pagos',
    ciclo: 'Proyecto académico',
    stack: ['Laravel', 'MySQL', 'Stripe'],
    queEs: 'Tienda en línea con panel administrativo y pagos en línea.',
    hice: ['Arquitectura MVC en Laravel', 'Panel administrativo de productos', 'Pasarela de pagos con Stripe'],
    codigoPrivado: true,
  },
  {
    titulo: 'Chakray',
    curso: 'Marketplace agrícola B2B: modelo de negocio, arquitectura y nube',
    ciclo: 'Startup',
    stack: ['Next.js', 'Fastify', 'PostgreSQL', 'AWS'],
    queEs: 'Marketplace agrícola B2B, trabajado en equipo como startup.',
    hice: ['Diseño del modelo de negocio', 'Arquitectura tecnológica', 'Infraestructura en la nube'],
    participacion: true,
    codigoPrivado: true,
  },
]

export const CICLOS = ['2023', '2024', '2025', '2026']

export interface Habilidad {
  categoria: string
  nombre: string
  detalles: string[]
  logos: string[]
  /** Proyectos donde la usé (títulos de PROYECTOS) */
  usadoEn: string[]
}

export const HABILIDADES: Habilidad[] = [
  { categoria: 'Frontend', nombre: 'HTML + CSS', detalles: ['Maquetación responsiva', 'Interfaces centradas en UX'], logos: ['/logos/html.svg', '/logos/css.svg'], usadoEn: ['Le Peruparfum', 'Resultados Electorales'] },
  { categoria: 'Frontend', nombre: 'JavaScript', detalles: ['Interactividad y DOM', 'Next.js'], logos: ['/logos/javascript.svg'], usadoEn: ['Chakray'] },
  { categoria: 'Backend', nombre: 'Java', detalles: ['Programación orientada a objetos', 'Apps de escritorio'], logos: ['/logos/java.svg'], usadoEn: [] },
  { categoria: 'Backend', nombre: 'Laravel', detalles: ['Arquitectura MVC', 'E-commerce con Stripe'], logos: ['/logos/laravel.svg', '/logos/php.svg'], usadoEn: ['Le Peruparfum'] },
  { categoria: 'Backend', nombre: 'ASP.NET Core', detalles: ['C# y MVC', 'Entity Framework Core'], logos: ['/logos/csharp.svg'], usadoEn: ['Resultados Electorales'] },
  { categoria: 'Base de datos', nombre: 'SQL', detalles: ['MySQL, SQL Server y PostgreSQL', 'Modelado y consultas'], logos: ['/logos/mysql.svg', '/logos/sql.svg'], usadoEn: ['Resultados Electorales', 'Le Peruparfum', 'Chakray'] },
  { categoria: 'Inteligencia de negocios', nombre: 'Power BI', detalles: ['Data warehouse y ETL', 'BigQuery y Python'], logos: ['/logos/bi.svg'], usadoEn: ['Data Warehouse y BI'] },
  { categoria: 'Herramientas', nombre: 'Git', detalles: ['Control de versiones', 'SAP S/4HANA (MM, PP)'], logos: ['/logos/git.svg'], usadoEn: [] },
]

export const APRENDIENDO = ['AWS', 'Cloud', 'DAX', 'Next.js', 'Inglés intermedio']

export const LOGOS_MARQUEE = ['html', 'css', 'javascript', 'react', 'nodejs', 'php', 'laravel', 'java', 'mysql', 'git', 'stripe', 'csharp', 'sql', 'bi']

export const SOBRE_MI: { categoria: string; valor: string; logo?: string; detalles: string[] }[] = [
  { categoria: 'Educación', valor: 'TECSUP', logo: '/img/logo-tecsup.webp', detalles: ['Diseño y Desarrollo de Software', 'Egresado 2023 — 2026', 'Bachiller en trámite'] },
  {
    categoria: 'Experiencia',
    valor: 'GluGlu',
    logo: '/img/logo-gluglu.webp',
    detalles: ['Agua de Mesa · Grupo Auria S.R.L. (2025)', 'Producción, reparto y atención al cliente'],
  },
  { categoria: 'Idiomas', valor: 'ES / EN', detalles: ['Español — Nativo', 'Inglés — Intermedio (El Cultural, en curso)'] },
]

export const CIFRAS = [
  { valor: 4, etiqueta: 'Proyectos' },
  { valor: 4, etiqueta: 'Cursos' },
  { valor: 2023, etiqueta: 'Desde' },
]

export interface Certificado {
  titulo: string
  emisor: string
  modalidad: string
  fecha: string
  horas: number
  img: string
  pdf: string
}

export const CERTIFICADOS: Certificado[] = [
  { titulo: 'Introducción a la Nube', emisor: 'Platzi', modalidad: 'Online', fecha: '26 sep 2026', horas: 20, img: '/certificados/nube.webp', pdf: '/certificados/nube.pdf' },
  { titulo: 'Análisis y Modelado de Datos con DAX y Power BI', emisor: 'Platzi', modalidad: 'Online', fecha: '8 oct 2026', horas: 19, img: '/certificados/power-bi-dax.webp', pdf: '/certificados/power-bi-dax.pdf' },
  { titulo: 'Claude Code para Programadores', emisor: 'Platzi', modalidad: 'En vivo', fecha: '11 oct 2026', horas: 3, img: '/certificados/claude-code.webp', pdf: '/certificados/claude-code.pdf' },
  { titulo: 'Introducción a AWS: Fundamentos del Cloud Computing', emisor: 'Platzi', modalidad: 'Online', fecha: '15 oct 2026', horas: 14, img: '/certificados/aws.webp', pdf: '/certificados/aws.pdf' },
]

export const CONTACTO = {
  correo: 'tonny.namoc@tecsup.edu.pe',
  telefono: '+51 983 415 509',
  telefonoHref: 'tel:+51983415509',
  ciudad: 'Trujillo, Perú',
  linkedin: 'https://www.linkedin.com/in/tonny-namoc-b31107415',
  cv: '/CV-Tonny-Namoc.pdf',
  /** Cambia a false cuando ya no busques oportunidades */
  disponible: true,
  disponibleTexto: 'Disponible para nuevas oportunidades',
  nombreCompleto: 'Tonny Alexander Namoc Julca',
}
