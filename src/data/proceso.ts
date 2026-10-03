export interface PasoProceso {
  titulo: string;
  dur?: string;
  marca?: string;
  texto: string;
}

export const pasosProceso: PasoProceso[] = [
  {
    titulo: 'Antes de tu Cita 1',
    marca: 'The Layer Assessment',
    texto: 'Historia, objetivos, alimentación, lifestyle, síntomas y laboratorios.',
  },
  {
    titulo: 'Cita 1 · Mapear + Priorizar',
    dur: '90 min',
    marca: 'The Layer Map · Top 3 Priorities · The Layer Plan',
    texto: 'Mapeas tus Layers, conectas la información y defines qué merece atención primero.',
  },
  {
    titulo: 'Entre Citas · Implementar',
    texto: 'Pones en práctica tu Layer Plan y observamos respuesta y obstáculos.',
  },
  {
    titulo: 'Cita 2 · Revisar + Ajustar',
    dur: '90 min',
    texto: 'Revisamos qué mejoró, qué falta, y actualizamos tu Layer Plan.',
  },
];
