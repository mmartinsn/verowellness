/**
 * Patients' testimonials, in their own words (sent by Mari, 2026-10-03, with each patient's
 * permission as she confirms). Text verbatim; only the `destacado` line is chosen by Claude from
 * the text itself, and the `motivo` tags summarise what the patient says she came for.
 */
import type { ImageMetadata } from 'astro';
import fotoMargarita from '../assets/testimonios/margarita-medel.jpg';
import fotoSofia from '../assets/testimonios/sofia-molina.jpg';

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
    motivo: ['Digestión', 'Infecciones', 'Piel'],
    destacado:
      'Se eliminó por completo la dermatitis/eczema que tenía constantemente en las manos.',
    texto: [
      'Hace unos meses decidí iniciar este camino con Vero, y sin duda alguna ha sido una excelente decisión. A pesar de no ser un camino fácil, ella te hace sentir que lo puedes lograr, te habla con claridad, pero siempre con cariño, me encanta su manera de abordar las cosas, sientes que estás trabajando tu salud con una amiga que te entiende completamente y te ayuda a sanar con sus métodos totalmente personalizados.',
      'Mi historia es larga, pero básicamente por un exceso de antibióticos, estrés y muchas otras cosas, estaba pasándola mal en líneas generales (digestión, infecciones, alergias en la piel, etc). Uno de los cambios que más me ha impactado es el de mis manos. Después de desparasitarme correctamente y sanar el intestino, se eliminó por completo la dermatitis/eczema que tenía constantemente en las manos, y puede sonar algo sencillo, pero era doloroso, no podía hacer cosas básicas del hogar sin tener dolor y sangrado por la irritación de mis manos. Hoy en día las veo y no me lo creo.',
      'Agradezco tener a Vero como guía, ha sido clave en este camino. La recomiendo totalmente para quien realmente quiere sanar de raíz.',
      'Gracias Vero, eres lo máximo 🫶🏼',
    ],
    prioridad: 2,
  },
  {
    id: 'margarita-medel',
    nombre: 'Margarita Medel',
    lugar: 'USA',
    foto: fotoMargarita,
    motivo: ['Peso', 'Hábitos'],
    destacado:
      'Alimentarse bien no se trata de seguir una dieta temporal, sino de crear hábitos que realmente pueda mantener.',
    texto: [
      'Hace tres años comencé a trabajar con Veronica en mejorar mi alimentación y salud, y desde entonces he experimentado cambios que van más allá de la pérdida de peso. Este plan de alimentación diseñado específicamente para mis necesidades, me ha ayudado a perder y mantener mi peso de una manera sostenible, pero sobre todo, a sentirme mejor y prestar mucha más atención a lo que mi cuerpo necesita.',
      'Estoy muy agradecida con Vero por su acompañamiento profesional, conocimiento y por la manera cálida y personalizada en la que ha guiado mi proceso. Estos tres años me han enseñado que alimentarse bien no se trata de seguir una dieta temporal, sino de crear hábitos que realmente pueda mantener y que contribuyan a sentirme bien a largo plazo. Sin duda, ha sido una parte muy importante de mi camino hacia una vida más saludable y espero continuar aprendiendo de su experiencia!! 🩷🙏',
    ],
    prioridad: 4,
  },
  {
    id: 'lorena-gonzalez',
    nombre: 'Lorena González',
    lugar: 'USA',
    motivo: ['Embarazo', 'Eczema en su bebé'],
    destacado: 'Hoy mi niña tiene meses sin tener brotes.',
    texto: [
      'Soy paciente de Verónica desde el 2022. Quedé embarazada y ella me ayudó a llevar un embarazo sano para que tanto mi bebé como yo estuviéramos bien. Luego del embarazo hemos seguido trabajando juntas, siempre me he sentido apoyada y escuchada. En ella siempre he visto una persona real: más allá de enseñarme a mejorar cada etapa en la que he estado, he visto una persona que ha pasado por lo mismo y perfectamente se pone en mi puesto.',
      'He confiado tanto en ella y en sus conocimientos que cuando me dijeron que mi niña tenía eczema no dudé en tener una cita con ella y no me equivoqué: siguiendo todas sus recomendaciones, tanto en alimentación como en tratamientos, hoy mi niña tiene meses sin tener brotes.',
    ],
    prioridad: 1,
  },
  {
    id: 'sofia-molina',
    nombre: 'Sofía Molina',
    lugar: 'USA',
    foto: fotoSofia,
    motivo: ['Cándida'],
    destacado: 'Fuiste mi oración contestada.',
    texto: [
      'Hola Vero, quisiera dejar mi testimonio sin duda. Fuiste mi oración contestada. Mi intención inicial fue tratar el cándida albicans que estuve tratándolo por casi 3 años con medicina alternativa, tratamientos y muchas consultas que no tenían ningún resultado.',
      'Iniciamos el tratamiento y empezaron a verse los resultados de inmediato con mi cándida, gracias a la ayuda y a los tratamientos con intención y ajustándolo a mi estilo de vida. Yo estoy muy agradecida contigo porque me hicieron el examen de la cándida y me salió negativo. Y de verdad me siento muy feliz por eso. Batallé mucho para poder mejorar mi cándida. Y fuiste tú la que me pudo ayudar a que esté mejor.',
      'Gracias Vero. Creo en tu trabajo. Y de paso eres un ser increíble. Gracias Verito por tu magia 🙏',
    ],
    prioridad: 3,
  },
];
