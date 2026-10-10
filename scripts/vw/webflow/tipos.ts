export interface OpcionWf {
  id: string;
  name: string;
}

export interface CampoWf {
  id: string;
  slug: string;
  displayName: string;
  type: string;
  isRequired: boolean;
  helpText?: string | null;
  validations?: { options?: OpcionWf[]; collectionId?: string } | null;
}

export interface ColeccionWf {
  id: string;
  slug: string;
  displayName: string;
  singularName: string;
  fields: CampoWf[];
}

export interface ItemWf {
  id: string;
  isDraft?: boolean;
  isArchived?: boolean;
  lastPublished?: string | null;
  lastUpdated?: string;
  fieldData: Record<string, unknown> & { name: string; slug: string };
}

export interface ImagenWf {
  fileId: string;
  url: string;
  alt?: string | null;
}

export interface ProductoWf {
  product: ItemWf;
  skus: ItemWf[];
}

export interface PrecioWf {
  value: number;
  unit: string;
  currency?: string;
}
