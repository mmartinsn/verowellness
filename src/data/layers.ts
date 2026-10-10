import { todos, uno } from '../lib/datos/canonico';

export type LayerColor = 'clay' | 'sage' | 'sage-deep' | 'rose' | 'olive' | 'charcoal';

export interface Layer {
  num: '01' | '02' | '03' | '04' | '05';
  nombre: string;
  pregunta: string;
  observaTexto: string;
  observa: string[];
  cita: string;
  conecta: string[];
  rol: string;
  color: LayerColor;
  oscuro: boolean;
}

export const layers: Layer[] = todos('layer').map((l) => ({
  num: l.id as Layer['num'],
  nombre: l.nombre,
  pregunta: l.pregunta,
  observaTexto: l.observaTexto,
  observa: l.observa,
  cita: l.cita,
  conecta: l.conecta.map((id) => uno('layer', id).nombre),
  rol: l.rol,
  color: l.color as LayerColor,
  oscuro: l.oscuro,
}));
