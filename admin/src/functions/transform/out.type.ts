export enum PriceType {
  Normal = 'normal',
  Variable = 'variable',
}

export enum PublishStatus {
  Published = 'published',
  Processing = 'processing',
}

export type ProductOut = {
  title: { [key: string]: string };
  miniTitle: { [key: string]: string };
  metatitle?: { [key: string]: string };
  metadescription?: { [key: string]: string };
  slug: string;
  excerpt?: { [key: string]: string };
  description?: { [key: string]: string };
  combinations: {
    options?: { [key: string]: string };
    price: number;
    salePrice?: number;
    weight?: number;
    quantity?: number;
    in_stock?: boolean;
    sku?: string;
  }[];
  options: {
    _id: string;
    name: string;
    values: { name: string }[];
  }[];
  productCategory?: string[];
  attributes: { attribute: string; values: string[] }[];
  labels: { title: string }[];
  data?: any;
  extra_attr: { title: string; des: string }[];
  price_type: PriceType;
  status: PublishStatus;
  relatedProducts?: string[];
  photos?: string[];
  thumbnail?: string;
  active?: boolean;
};
