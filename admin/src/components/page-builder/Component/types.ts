export type ItemType = {
  id: string;
  label: string;
  name: string;
  addable: boolean;
  children: Array<ItemType>;
  settings: {
    general: {
      fields: any;
      rules: Array<any>;
    };
    design: Array<any>;
  };
};

export type OrderType = 'middle' | 'last';

export type OnDropType = (
  source: ItemType,
  destination: ItemType,
  order?: OrderType
) => void;
