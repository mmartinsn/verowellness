import type { ClienteWebflow } from './cliente.ts';
import type { CampoWf, ColeccionWf, ItemWf, ProductoWf } from './tipos.ts';

export interface NuevoCampo {
  type: string;
  displayName: string;
  helpText?: string;
  isRequired?: boolean;
  metadata?: Record<string, unknown>;
}

export interface NuevoItem {
  id?: string;
  isDraft?: boolean;
  fieldData: Record<string, unknown>;
}

export interface CuerpoProducto {
  product: { fieldData: Record<string, unknown> };
  sku: { fieldData: Record<string, unknown> };
}

const LOTE = 100;
const lotes = <T>(lista: T[]) =>
  Array.from({ length: Math.ceil(lista.length / LOTE) }, (_, i) =>
    lista.slice(i * LOTE, (i + 1) * LOTE)
  );

export class ApiWebflow {
  readonly c: ClienteWebflow;

  constructor(cliente: ClienteWebflow) {
    this.c = cliente;
  }

  async colecciones(): Promise<ColeccionWf[]> {
    const { collections } = await this.c.get<{ collections: { id: string }[] }>(
      `/sites/${this.c.sitio}/collections`
    );
    return Promise.all(collections.map((x) => this.coleccion(x.id)));
  }

  coleccion(id: string) {
    return this.c.get<ColeccionWf>(`/collections/${id}`);
  }

  crearColeccion(displayName: string, singularName: string, slug: string) {
    return this.c.post<ColeccionWf>(`/sites/${this.c.sitio}/collections`, {
      displayName,
      singularName,
      slug,
    });
  }

  crearCampo(coleccion: string, campo: NuevoCampo) {
    return this.c.post<CampoWf>(`/collections/${coleccion}/fields`, campo);
  }

  actualizarCampo(coleccion: string, campo: string, cambios: Partial<NuevoCampo>) {
    return this.c.patch<CampoWf>(`/collections/${coleccion}/fields/${campo}`, cambios);
  }

  items(coleccion: string, vivos = false) {
    return this.c.todas<ItemWf>(`/collections/${coleccion}/items${vivos ? '/live' : ''}`, 'items');
  }

  async crearItems(coleccion: string, items: NuevoItem[]): Promise<ItemWf[]> {
    const creados: ItemWf[] = [];
    for (const lote of lotes(items)) {
      const r = await this.c.post<{ items?: ItemWf[] } & Partial<ItemWf>>(
        `/collections/${coleccion}/items`,
        { items: lote.map((i) => ({ isDraft: false, ...i })) }
      );
      creados.push(...(r.items ?? (r.id ? [r as ItemWf] : [])));
    }
    return creados;
  }

  async actualizarItems(coleccion: string, items: (NuevoItem & { id: string })[]) {
    for (const lote of lotes(items))
      await this.c.patch(`/collections/${coleccion}/items`, {
        items: lote.map((i) => ({ isDraft: false, ...i })),
      });
  }

  async borrarItems(coleccion: string, ids: string[]) {
    for (const lote of lotes(ids))
      await this.c.delete(`/collections/${coleccion}/items`, { items: lote.map((id) => ({ id })) });
  }

  productos() {
    return this.c.todas<ProductoWf>(`/sites/${this.c.sitio}/products`, 'items');
  }

  crearProducto(cuerpo: CuerpoProducto) {
    return this.c.post<{ product: ItemWf; sku: ItemWf }>(`/sites/${this.c.sitio}/products`, {
      publishStatus: 'staging',
      ...cuerpo,
    });
  }

  actualizarProducto(id: string, fieldData: Record<string, unknown>) {
    return this.c.patch(`/sites/${this.c.sitio}/products/${id}`, {
      publishStatus: 'staging',
      product: { fieldData },
    });
  }

  actualizarSku(producto: string, sku: string, fieldData: Record<string, unknown>) {
    return this.c.patch(`/sites/${this.c.sitio}/products/${producto}/skus/${sku}`, {
      sku: { fieldData },
    });
  }

  crearAsset(fileName: string, fileHash: string) {
    return this.c.post<{ id: string; uploadUrl: string; uploadDetails: Record<string, string> }>(
      `/sites/${this.c.sitio}/assets`,
      { fileName, fileHash }
    );
  }

  asset(id: string) {
    return this.c.get<{ id: string; hostedUrl: string }>(`/assets/${id}`);
  }

  paginas() {
    return this.c.todas<{
      id: string;
      slug: string | null;
      title: string;
      draft: boolean;
      collectionId?: string | null;
    }>(`/sites/${this.c.sitio}/pages`, 'pages');
  }

  borradorPagina(id: string) {
    return this.c.pedir('PUT', `/pages/${id}`, { draft: true });
  }

  async codigoLibre(pagina: string, lugar: 'head' | 'footer'): Promise<string> {
    const bloques = await this.c.get<{ location: string; content: string }[]>(
      `/pages/${pagina}/custom_code/freeform`
    );
    return bloques.find((b) => b.location === lugar)?.content ?? '';
  }

  escribirCodigoLibre(pagina: string, lugar: 'head' | 'footer', content: string) {
    return this.c.pedir('PUT', `/pages/${pagina}/custom_code/freeform/${lugar}`, { content });
  }

  publicarSitio() {
    return this.c.post(`/sites/${this.c.sitio}/publish`, { publishToWebflowSubdomain: true });
  }

  sitio() {
    return this.c.get<{ lastPublished?: string | null; locales?: unknown }>(
      `/sites/${this.c.sitio}`
    );
  }
}
