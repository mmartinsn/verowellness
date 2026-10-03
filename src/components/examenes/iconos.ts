import type { Muestra } from '../../data/examenes';

export const iconoMuestra: Record<Muestra, string> = {
  heces: 'M5 9h14l-1.5 9.5a2 2 0 0 1-2 1.5h-7a2 2 0 0 1-2-1.5L5 9zM8 9V6a4 4 0 0 1 8 0v3',
  orina: 'M9 3h6M10 3v4l-4 9a4 4 0 0 0 3.6 5.7h4.8A4 4 0 0 0 18 16l-4-9V3M7.5 14h9',
  sangre: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  saliva: 'M8 3h8v5a4 4 0 0 1-8 0V3zM12 12v9M9 21h6',
  aliento: 'M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7',
  hisopo: 'M5 19L17 7M17 7l2.5-2.5a1.5 1.5 0 0 1 2 2L19 9M5 19l-1 2 2-1',
  ambiente: 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5',
};

export const iconoCasa = 'M4 11l8-7 8 7M6 9.5V20h12V9.5M10 20v-5h4v5';
