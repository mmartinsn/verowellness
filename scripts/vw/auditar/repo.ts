import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { hallazgo, medir, npm, ok, type Auditoria, type Verificacion } from './tipos.ts';

const R = 'repo y seguridad';
const REPO = 'mmartinsn/verowellness';

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();

function archivos(carpeta: string): string[] {
  if (!existsSync(carpeta)) return [];
  return readdirSync(carpeta).flatMap((n) => {
    const r = path.join(carpeta, n);
    return statSync(r).isDirectory() ? archivos(r) : [r];
  });
}

function atraso(): Verificacion[] {
  const remoto = git('ls-remote', 'origin', 'refs/heads/main').split(/\s+/)[0];
  const local = git('rev-parse', 'main');
  const conocido = (() => {
    try {
      git('cat-file', '-e', remoto);
      return true;
    } catch {
      return false;
    }
  })();
  const sinCommit = git('status', '--porcelain').split('\n').filter(Boolean).length;
  return [
    remoto === local
      ? ok(R, 'main al día con origin', local.slice(0, 7))
      : hallazgo(
          R,
          'main al día con origin',
          conocido
            ? `origin/main está en ${remoto.slice(0, 7)}, main local en ${local.slice(0, 7)}`
            : `origin/main tiene commits que no están aquí (${remoto.slice(0, 7)}): git pull`,
          remoto.slice(0, 7)
        ),
    sinCommit === 0
      ? ok(R, 'árbol de trabajo limpio', 0)
      : hallazgo(R, 'árbol de trabajo limpio', `${sinCommit} archivo(s) sin commit`, sinCommit),
  ];
}

function despliegue(): Verificacion {
  const salida = execFileSync(
    'gh',
    [
      'api',
      `repos/${REPO}/actions/runs?branch=main&per_page=1`,
      '--jq',
      '.workflow_runs[0] | "\\(.conclusion) \\(.head_sha[0:7]) \\(.created_at)"',
    ],
    { encoding: 'utf8' }
  ).trim();
  const [conclusion, sha, fecha] = salida.split(' ');
  return conclusion === 'success'
    ? ok(R, 'último deploy de main', sha, fecha)
    : hallazgo(R, 'último deploy de main', `${conclusion} en ${sha} (${fecha})`, sha);
}

function auditoriaNpm(): string {
  try {
    return execFileSync(process.execPath, [npm(), 'audit', '--json'], { encoding: 'utf8' });
  } catch (e) {
    return (e as { stdout?: string }).stdout ?? '{}';
  }
}

function dependencias(): Verificacion {
  const v = JSON.parse(auditoriaNpm()).metadata?.vulnerabilities ?? {};
  const graves = (v.high ?? 0) + (v.critical ?? 0);
  return graves === 0
    ? ok(
        R,
        'dependencias sin vulnerabilidades graves',
        v.total ?? 0,
        `${v.total ?? 0} en total, 0 altas o críticas`
      )
    : hallazgo(
        R,
        'dependencias sin vulnerabilidades graves',
        `${v.high ?? 0} altas, ${v.critical ?? 0} críticas: npm audit`,
        graves
      );
}

function secretos(): Verificacion[] {
  const rastreados = git('ls-files').split('\n');
  const envRastreado = rastreados.filter(
    (f) => /(^|\/)\.env(\.|$)/.test(f) && !f.endsWith('.env.example')
  );
  const token = process.env.WEBFLOW_SITE_TOKEN;
  const expuestos = token
    ? [
        ...archivos('dist'),
        ...archivos(path.join('src', 'data', 'canonico')),
        path.join('webflow', 'pedido.html'),
      ].filter((f) => existsSync(f) && readFileSync(f, 'utf8').includes(token))
    : [];
  return [
    envRastreado.length === 0
      ? ok(R, '.env fuera de git', 0)
      : hallazgo(R, '.env fuera de git', envRastreado.join(', '), envRastreado.length),
    expuestos.length === 0
      ? ok(
          R,
          'token fuera de lo publicado',
          0,
          token ? 'dist, snapshot y puente revisados' : 'sin token en el entorno'
        )
      : hallazgo(R, 'token fuera de lo publicado', expuestos.join(', '), expuestos.length),
  ];
}

export const auditarRepo: Auditoria = async () => [
  ...(await medir(R, 'main al día con origin', async () => atraso())),
  ...(await medir(R, 'último deploy de main', async () => despliegue())),
  ...(await medir(R, 'dependencias', async () => dependencias())),
  ...(await medir(R, 'secretos', async () => secretos())),
];
