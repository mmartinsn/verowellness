-- Generado por `npm run vw -- exportar sql` desde src/modelo (versión 2). No se edita a mano.
-- Dinero en centavos enteros (USD). Los ids son los slugs del modelo canónico.

CREATE TABLE productos (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('asesoria', 'guia', 'examen', 'oferta', 'cargo')),
  precio integer NOT NULL CHECK (precio >= 0),
  impuesto text NOT NULL CHECK (impuesto IN ('service-professional', 'digital-goods', 'standard-exempt', 'standard-taxable')),
  enviable boolean NOT NULL DEFAULT false,
  sku text NOT NULL,
  descripcion text,
  descarga text
);

CREATE TABLE asesorias (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  clave text NOT NULL,
  producto text NOT NULL REFERENCES productos (id),
  consultas text NOT NULL,
  etiqueta text NOT NULL,
  etiqueta_nota text,
  descripcion text NOT NULL,
  descripcion_corta text NOT NULL,
  incluye text[] NOT NULL DEFAULT '{}',
  incluye_checkout text[] NOT NULL DEFAULT '{}',
  nota_pie text,
  bonus text,
  confirmacion_titulo text NOT NULL,
  confirmacion_texto text NOT NULL,
  calendly_url text NOT NULL,
  calendly_etiqueta text NOT NULL,
  publica boolean NOT NULL DEFAULT false,
  orden integer NOT NULL
);

CREATE TABLE guias (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  producto text NOT NULL REFERENCES productos (id),
  oferta text REFERENCES productos (id),
  num text NOT NULL,
  paginas integer NOT NULL,
  titulo_portada text NOT NULL,
  portada text NOT NULL,
  mas_vendido boolean NOT NULL DEFAULT false,
  subtitulo text NOT NULL,
  gancho text NOT NULL,
  para_ti text[] NOT NULL DEFAULT '{}',
  incluye text[] NOT NULL DEFAULT '{}',
  cita text NOT NULL,
  cita_pagina integer,
  formato text NOT NULL,
  nota text,
  boton text NOT NULL,
  tono text NOT NULL CHECK (tono IN ('clay', 'sage', 'rose')),
  orden integer NOT NULL
);

CREATE TABLE ajustes (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  descuento_oferta integer NOT NULL,
  cargo_laboratorio text NOT NULL REFERENCES productos (id),
  wholescripts_registro text NOT NULL,
  wholescripts_codigo text,
  wholescripts_apellido text,
  wholescripts_pendiente boolean NOT NULL DEFAULT false,
  zelle_titular text NOT NULL,
  zelle_correo text NOT NULL
);

CREATE TABLE areas (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  color text NOT NULL CHECK (color IN ('clay', 'clay-deep', 'clay-rich', 'rose', 'rose-deep', 'sage', 'sage-deep', 'olive', 'sand', 'charcoal')),
  icono text NOT NULL,
  descripcion text NOT NULL,
  orden integer NOT NULL
);

CREATE TABLE tipos_de_muestra (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  orden integer NOT NULL
);

CREATE TABLE examenes (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  producto text NOT NULL REFERENCES productos (id),
  area text NOT NULL REFERENCES areas (id),
  laboratorio text CHECK (laboratorio IN ('Doctor''s Data', 'Alletess', 'US BioTek', 'DUTCH', 'Genova')),
  en_casa boolean NOT NULL DEFAULT false,
  descripcion text NOT NULL,
  instructivo text,
  gancho text NOT NULL,
  que_mide text[] NOT NULL DEFAULT '{}',
  por_que_importa text NOT NULL,
  ideal text[] NOT NULL DEFAULT '{}',
  obtienes text[] NOT NULL DEFAULT '{}',
  alimentos integer,
  mide text[] NOT NULL DEFAULT '{}',
  orden integer NOT NULL
);

CREATE TABLE sintomas (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  ejemplos text NOT NULL,
  color text NOT NULL CHECK (color IN ('clay', 'clay-deep', 'clay-rich', 'rose', 'rose-deep', 'sage', 'sage-deep', 'olive', 'sand', 'charcoal')),
  icono text NOT NULL,
  orientacion boolean NOT NULL DEFAULT false,
  orden integer NOT NULL
);

CREATE TABLE rutas_de_sintoma (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  sintoma text NOT NULL REFERENCES sintomas (id),
  pregunta text NOT NULL,
  orden integer NOT NULL
);

CREATE TABLE caminos_de_alimentos (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  pregunta text NOT NULL,
  ayuda text NOT NULL,
  orden integer NOT NULL
);

CREATE TABLE testimonios (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  lugar text,
  foto text,
  motivos text[] NOT NULL DEFAULT '{}',
  destacado text NOT NULL,
  texto text[] NOT NULL DEFAULT '{}',
  prioridad integer NOT NULL,
  en_asesorias boolean NOT NULL DEFAULT false
);

CREATE TABLE preguntas_frecuentes (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  pagina text NOT NULL CHECK (pagina IN ('inicio', 'examenes')),
  pregunta text NOT NULL,
  respuesta text NOT NULL,
  orden integer NOT NULL
);

CREATE TABLE layers (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  pregunta text NOT NULL,
  observa_texto text NOT NULL,
  observa text[] NOT NULL DEFAULT '{}',
  cita text NOT NULL,
  rol text NOT NULL,
  color text NOT NULL CHECK (color IN ('clay', 'clay-deep', 'clay-rich', 'rose', 'rose-deep', 'sage', 'sage-deep', 'olive', 'sand', 'charcoal')),
  oscuro boolean NOT NULL DEFAULT false,
  orden integer NOT NULL
);

CREATE TABLE suplementos (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  marca text NOT NULL,
  layer text NOT NULL REFERENCES layers (id),
  orden integer NOT NULL
);

CREATE TABLE bloques (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  pagina text NOT NULL CHECK (pagina IN ('sitio', 'inicio', 'sobre-mi', 'metodo', 'asesorias', 'examenes', 'tienda', 'suplementos', 'checkout')),
  seccion text NOT NULL,
  orden integer NOT NULL,
  etiqueta text,
  titulo text,
  texto text,
  items text[] NOT NULL DEFAULT '{}',
  nota text,
  cita text,
  tono text CHECK (tono IN ('clay', 'clay-deep', 'clay-rich', 'rose', 'rose-deep', 'sage', 'sage-deep', 'olive', 'sand', 'charcoal')),
  icono text,
  marcado boolean NOT NULL DEFAULT false,
  enlace text,
  enlace_texto text
);

CREATE TABLE clientes (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  email text NOT NULL,
  apellido text NOT NULL,
  telefono text,
  pais text,
  fuente text
);

CREATE TABLE pedidos (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  cliente text NOT NULL REFERENCES clientes (id),
  fecha timestamptz NOT NULL,
  estado text NOT NULL CHECK (estado IN ('iniciado', 'pendiente', 'pagado', 'cumplido', 'reembolsado')),
  metodo_pago text NOT NULL CHECK (metodo_pago IN ('tarjeta', 'apple-pay', 'google-pay', 'paypal', 'zelle')),
  moneda text NOT NULL CHECK (moneda IN ('USD')),
  subtotal integer NOT NULL CHECK (subtotal >= 0),
  impuesto integer NOT NULL CHECK (impuesto >= 0),
  envio integer NOT NULL CHECK (envio >= 0),
  total integer NOT NULL CHECK (total >= 0)
);

CREATE TABLE lineas_de_pedido (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nombre text NOT NULL,
  pedido text NOT NULL REFERENCES pedidos (id),
  producto text NOT NULL REFERENCES productos (id),
  cantidad integer NOT NULL,
  precio_unitario integer NOT NULL CHECK (precio_unitario >= 0)
);

CREATE TABLE ajustes__oferta_guias (
  origen text NOT NULL REFERENCES ajustes (id) ON DELETE CASCADE,
  destino text NOT NULL REFERENCES guias (id),
  posicion integer NOT NULL,
  PRIMARY KEY (origen, destino)
);

CREATE TABLE examenes__muestras (
  origen text NOT NULL REFERENCES examenes (id) ON DELETE CASCADE,
  destino text NOT NULL REFERENCES tipos_de_muestra (id),
  posicion integer NOT NULL,
  PRIMARY KEY (origen, destino)
);

CREATE TABLE rutas_de_sintoma__examenes (
  origen text NOT NULL REFERENCES rutas_de_sintoma (id) ON DELETE CASCADE,
  destino text NOT NULL REFERENCES examenes (id),
  posicion integer NOT NULL,
  PRIMARY KEY (origen, destino)
);

CREATE TABLE caminos_de_alimentos__examenes (
  origen text NOT NULL REFERENCES caminos_de_alimentos (id) ON DELETE CASCADE,
  destino text NOT NULL REFERENCES examenes (id),
  posicion integer NOT NULL,
  PRIMARY KEY (origen, destino)
);

CREATE TABLE layers__conecta (
  origen text NOT NULL REFERENCES layers (id) ON DELETE CASCADE,
  destino text NOT NULL REFERENCES layers (id),
  posicion integer NOT NULL,
  PRIMARY KEY (origen, destino)
);
