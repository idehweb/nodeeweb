export type ProductIn = {
  description: {
    [key: string]: string;
  };
  story: boolean;
  requireWarranty: boolean;
  access: string;
  title: {
    [key: string]: string;
  };
  slug: string;
  metatitle?: {
    [key: string]: string;
  };
  metadescription?: { [key: string]: string };
  excerpt?: { [key: string]: string };
  miniTitle?: { [key: string]: string };
  productCategory: string[];
  attributes?: {
    attribute: string;
    values: string[];
  }[];
  photos: { _id: string; url: string }[];
  thumbnail?: string;
  extra_attr: {
    title: string;
    des: string;
  }[];
  labels: {
    title: string;
  }[];
  status: string;
  in_stock: boolean;
  quantity: number;
  weight: number;
  price: string;
  salePrice: string;
  files: string[];
} & (
  | {
      type: 'normal';
    }
  | {
      type: 'variable';
      options: {
        _id: string;
        name: string;
        values: {
          name: string;
          id: number;
        }[];
        isDisabled: boolean;
      }[];
      combinations: {
        id: number | string;
        options: {
          [key: string]: string;
        };
        in_stock: boolean;
        price: number;
        salePrice: number;
        quantity: number;
        weight: number;
        sku: string;
      }[];
    }
);
