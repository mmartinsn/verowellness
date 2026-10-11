import { PAGO, SITIO } from '../../../src/lib/despliegue.ts';

export type Tipo = 'A' | 'AAAA' | 'CNAME' | 'TXT' | 'MX';

export interface Registro {
  tipo: Tipo;
  nombre: string;
  valores: string[];
  intocable: boolean;
}

export const DOMINIO = new URL(SITIO).host;
export const SUBDOMINIO_PAGO = new URL(PAGO).host.replace(`.${DOMINIO}`, '');
export const USUARIO_PAGES = 'mmartinsn';

const nuevo = (tipo: Tipo, nombre: string, valores: string[]): Registro => ({
  tipo,
  nombre,
  valores,
  intocable: false,
});

const deVeronica = (tipo: Tipo, nombre: string, valores: string[]): Registro => ({
  tipo,
  nombre,
  valores,
  intocable: true,
});

export const REGISTROS: Registro[] = [
  nuevo('A', '@', ['185.199.108.153', '185.199.109.153', '185.199.110.153', '185.199.111.153']),
  nuevo('AAAA', '@', [
    '2606:50c0:8000::153',
    '2606:50c0:8001::153',
    '2606:50c0:8002::153',
    '2606:50c0:8003::153',
  ]),
  nuevo('CNAME', 'www', [`${USUARIO_PAGES}.github.io`]),
  nuevo('TXT', `_github-pages-challenge-${USUARIO_PAGES}`, ['3735b19e494bcb0eb0f0682534cfba']),
  nuevo('CNAME', SUBDOMINIO_PAGO, ['cdn.webflow.com']),
  nuevo('TXT', `_webflow.${SUBDOMINIO_PAGO}`, [
    'one-time-verification=f8a168c3-b1dd-4587-a39c-567bdde99c00',
  ]),
  deVeronica('MX', '@', [
    '1 aspmx.l.google.com',
    '5 alt1.aspmx.l.google.com',
    '5 alt2.aspmx.l.google.com',
    '10 alt3.aspmx.l.google.com',
    '10 alt4.aspmx.l.google.com',
  ]),
  deVeronica('TXT', '@', [
    'google-site-verification=FyyB7oXDcSYpIRzSp2YadM2DVTZWQuz6nu7VboZm_q8',
    `v=spf1 include:dc-aa8e722993._spfm.${DOMINIO} ~all`,
  ]),
  deVeronica('TXT', 'dc-aa8e722993._spfm', ['v=spf1 include:_spf.google.com ~all']),
  deVeronica('TXT', '_dmarc', [`v=DMARC1; p=none; rua=mailto:info@${DOMINIO}`]),
  deVeronica('A', 'mail', ['3.13.222.255', '3.13.246.91', '3.130.60.26']),
  deVeronica('CNAME', 'si14175901', ['inbound.systeme.io']),
  deVeronica('CNAME', 'systemeio1._domainkey', ['key1.systeme.io']),
  deVeronica('CNAME', 'systemeio2._domainkey', ['key2.systeme.io']),
];

export const fqdn = (nombre: string) => (nombre === '@' ? DOMINIO : `${nombre}.${DOMINIO}`);
