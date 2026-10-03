/**
 * Patients' testimonials, in their own words (sent by Mari, 2026-10-03, with each patient's
 * permission as she confirms). Text verbatim; only the `destacado` line is chosen by Claude from
 * the text itself, and the `motivo` tags summarise what the patient says she came for.
 */
import type { ImageMetadata } from 'astro';
import fotoMouna from '../assets/testimonios/mouna-harbie.jpg';

export interface Testimonio {
  id: string;
  nombre: string;
  lugar: string;
  foto?: ImageMetadata;
  motivo: string[];
  /** A sentence from the testimonial, set large. */
  destacado: string;
  /** The full testimonial, one string per paragraph. */
  texto: string[];
  /** Order on the page: most powerful first (Mari: «prioriza los más potentes»). Lower = first. */
  prioridad: number;
}

export const testimonios: Testimonio[] = [
  {
    id: 'mouna-harbie',
    nombre: 'Mouna Harbie',
    lugar: 'Venezuela',
    foto: fotoMouna,
    motivo: ['Digestión', 'Infecciones', 'Piel'],
    destacado:
      'Se eliminó por completo la dermatitis/eczema que tenía constantemente en las manos.',
    texto: [
      'Hace unos meses decidí iniciar este camino con Vero, y sin duda alguna ha sido una excelente decisión. A pesar de no ser un camino fácil, ella te hace sentir que lo puedes lograr, te habla con claridad, pero siempre con cariño, me encanta su manera de abordar las cosas, sientes que estás trabajando tu salud con una amiga que te entiende completamente y te ayuda a sanar con sus métodos totalmente personalizados.',
      'Mi historia es larga, pero básicamente por un exceso de antibióticos, estrés y muchas otras cosas, estaba pasándola mal en líneas generales (digestión, infecciones, alergias en la piel, etc). Uno de los cambios que más me ha impactado es el de mis manos. Después de desparasitarme correctamente y sanar el intestino, se eliminó por completo la dermatitis/eczema que tenía constantemente en las manos, y puede sonar algo sencillo, pero era doloroso, no podía hacer cosas básicas del hogar sin tener dolor y sangrado por la irritación de mis manos. Hoy en día las veo y no me lo creo.',
      'Agradezco tener a Vero como guía, ha sido clave en este camino. La recomiendo totalmente para quien realmente quiere sanar de raíz.',
      'Gracias Vero, eres lo máximo 🫶🏼',
    ],
    prioridad: 1,
  },
  {
    id: 'margarita-medel',
    nombre: 'Margarita Medel',
    lugar: 'USA',
    motivo: ['Peso', 'Hábitos'],
    destacado:
      'Alimentarse bien no se trata de seguir una dieta temporal, sino de crear hábitos que realmente pueda mantener.',
    texto: [
      'Hace tres años comencé a trabajar con Veronica en mejorar mi alimentación y salud, y desde entonces he experimentado cambios que van más allá de la pérdida de peso. Este plan de alimentación diseñado específicamente para mis necesidades, me ha ayudado a perder y mantener mi peso de una manera sostenible, pero sobre todo, a sentirme mejor y prestar mucha más atención a lo que mi cuerpo necesita.',
      'Estoy muy agradecida con Vero por su acompañamiento profesional, conocimiento y por la manera cálida y personalizada en la que ha guiado mi proceso. Estos tres años me han enseñado que alimentarse bien no se trata de seguir una dieta temporal, sino de crear hábitos que realmente pueda mantener y que contribuyan a sentirme bien a largo plazo. Sin duda, ha sido una parte muy importante de mi camino hacia una vida más saludable y espero continuar aprendiendo de su experiencia!! 🩷🙏',
    ],
    prioridad: 2,
  },
];
