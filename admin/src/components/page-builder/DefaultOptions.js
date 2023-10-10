import { fields, rules } from './DefaultGeneral';

const DefaultOptions = [
  {
    label: 'Login',
    name: 'login',
    addable: true,
    settings: {
      general: {
        fields: {
          active: 'true',
          title: '',
          subTitle: '',
          width: '',
          height: '',
          ...fields,
        },
        rules: [
          { name: 'active', type: 'boolean' },
          { name: 'title', type: 'string' },
          { name: 'subTitle', type: 'string' },
          { name: 'height', type: 'string' },
          { name: 'width', type: 'string' },
          ...rules,
        ],
      },
      design: [],
    },
  },
  {
    label: 'ChatGPT Support',
    name: 'chatgpt',
    addable: true,
    settings: {
      general: {
        fields: {
          active: 'true',
          title: '',
          subTitle: '',
          width: '',
          height: '',
          ...fields,
        },
        rules: [
          { name: 'active', type: 'boolean' },
          { name: 'title', type: 'string' },
          { name: 'subTitle', type: 'string' },
          { name: 'height', type: 'string' },
          { name: 'width', type: 'string' },
          ...rules,
        ],
      },
      design: [],
    },
  },
  {
    label: 'Condition Steps',
    name: 'conditionsteps',
    addable: true,
    settings: {
      general: {
        fields: {
          title: '',
          width: '',
          align: '',
          maxWidth: '',
          height: '',
          maxHeight: '',
          ...fields,
        },
        rules: [
          { name: 'title', type: 'string' },
          { name: 'align', type: 'string' },
          { name: 'width', type: 'string' },
          { name: 'maxWidth', type: 'string' },
          { name: 'height', type: 'string' },
          { name: 'maxHeight', type: 'string' },
          ...rules,
        ],
      },
      design: [],
    },
  },
  {
    label: 'Condition Step',
    name: 'conditionstep',
    addable: true,
    settings: {
      general: {
        fields: {
          title: '',
          slug: '',
          width: '',
          maxWidth: '',
          height: '',
          maxHeight: '',
          ...fields,
        },
        rules: [
          { name: 'title', type: 'string' },
          { name: 'slug', type: 'string' },
          { name: 'width', type: 'string' },
          { name: 'maxWidth', type: 'string' },
          { name: 'height', type: 'string' },
          { name: 'maxHeight', type: 'string' },
          ...rules,
        ],
      },
      design: [],
    },
  },
  {
    label: 'Image',
    name: 'image',
    addable: false,
    settings: {
      general: {
        fields: {
          src: '',
          link: '',
          width: '',
          maxWidth: '',
          height: '',
          maxHeight: '',
          title: '',
          ...fields,
        },
        rules: [
          { name: 'src', type: 'image' },
          { name: 'link', type: 'string' },
          { name: 'width', type: 'string' },
          { name: 'maxWidth', type: 'string' },
          { name: 'height', type: 'string' },
          { name: 'maxHeight', type: 'string' },
          { name: 'title', type: 'string' },
          { name: 'border', type: 'string' },
          { name: 'borderRadius', type: 'string' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Button',
    name: 'button',
    addable: false,
    settings: {
      general: {
        fields: {
          text: '',
          action: '',
          link: '',
          float: '',
          borderRadius: '',
          fontSize: '13px',
          lineHeight: '1',
          iconImage: '',
          imgWidth: '',
          imgHeight: '',
          imgMargin: '',
          iconFont: '',
          iconPosition: 'top',
          iconColor: '',
          fontWeight: 'normal',
          border: '',
          ...fields,
        },
        rules: [
          { name: 'text', type: 'string' },
          { name: 'action', type: 'string' },
          { name: 'link', type: 'string' },
          { name: 'float', type: 'string' },
          { name: 'fontSize', type: 'string' },
          { name: 'lineHeight', type: 'string' },
          { name: 'iconImage', type: 'image' },
          { name: 'imgWidth', type: 'string' },
          { name: 'imgHeight', type: 'string' },
          { name: 'imgMargin', type: 'string' },
          { name: 'iconFont', type: 'string' },
          { name: 'iconColor', type: 'string' },
          { name: 'iconPosition', type: 'string' },
          { name: 'fontWeight', type: 'string' },
          { name: 'borderRadius', type: 'string' },
          { name: 'border', type: 'string' },

          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Slider',
    name: 'slider',
    addable: true,
    settings: {
      general: {
        fields: {
          entity: '',
          include: '',
          category: '',
          arrows: 'true',
          perPage: 1,
          breakpoints: {},
          classess: '',
          customQuery: {},
          ...fields,
        },
        rules: [
          { name: 'entity', type: 'string' },
          { name: 'include', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'arrows', type: 'boolean' },
          { name: 'perPage', type: 'number' },
          { name: 'breakpoints', type: 'string' },
          { name: 'customQuery', type: 'object' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Row',
    name: 'row',
    addable: true,
    settings: {
      general: {
        fields: { height: '', ...fields },
        rules: [
          { name: 'height', type: 'string' },
          { name: 'maxWidth', type: 'string' },
          { name: 'border', type: 'string' },
          { name: 'borderRadius', type: 'string' },
          { name: 'boxShadow', type: 'string' },

          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Col',
    name: 'col',
    addable: true,
    settings: {
      general: {
        fields: { width: '', ...fields },
        rules: [
          { name: 'width', type: 'string' },
          { name: 'border', type: 'string' },
          { name: 'borderRadius', type: 'string' },
          { name: 'boxShadow', type: 'string' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Html',
    name: 'html',
    addable: true,
    settings: {
      general: {
        fields: { colCount: 1, ...fields },
        rules: [{ name: 'colCount', type: 'number' }, ...rules],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Text',
    name: 'text',
    addable: false,
    settings: {
      general: {
        fields: {
          text: '',
          tag: 'p',
          direction: '',
          fontSize: '13px',
          lineHeight: '1',
          fontWeight: 'normal',
          ...fields,
        },
        rules: [
          { name: 'text', type: 'textarea' },
          { name: 'tag', type: 'string' },
          { name: 'direction', type: 'string' },
          { name: 'fontSize', type: 'string' },
          { name: 'lineHeight', type: 'string' },
          { name: 'fontWeight', type: 'string' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Header',
    name: 'header',
    addable: false,
    settings: {
      general: {
        fields: {
          element: 'h1',
          fontSize: '20px',
          lineHeight: '1',
          fontWeight: 'normal',
          ...fields,
        },
        rules: [
          { name: 'element', type: 'string' },
          { name: 'fontSize', type: 'string' },
          { name: 'lineHeight', type: 'string' },
          { name: 'fontWeight', type: 'string' },

          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Line',
    name: 'hr',
    addable: false,
    settings: {
      general: {
        fields: { type: 'solid', width: '100%', height: '100%', ...fields },
        rules: [
          { name: 'color', type: 'textarea' },
          { name: 'width', type: 'string' },
          { name: 'height', type: 'string' },
          { name: 'type', type: 'string' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Navigation bar',
    name: 'navigation',
    settings: {
      addable: true,
      general: {
        fields: { colCount: 1, type: 'simple', ...fields },
        rules: [
          { name: 'colCount', type: 'number' },
          { name: 'type', type: 'string' },
          { name: 'backgroundColor', type: 'string' },
          { name: 'color', type: 'string' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Navigation item',
    name: 'navigationitem',
    addable: true,
    settings: {
      general: {
        fields: {
          text: '',
          link: 'simple',
          lineHeight: '1',
          borderRadious: '0',
          border: '',
          boxShadow: '',
          fontWeight: '',
          hoverColor: '',
          hoverBackgroundColor: '',
          activeBackgroundColor: '',
          ...fields,
        },
        rules: [
          { name: 'text', type: 'string' },
          { name: 'link', type: 'string' },
          { name: 'lineHeight', type: 'string' },
          { name: 'borderRadius', type: 'string' },
          { name: 'border', type: 'string' },
          { name: 'boxShadow', type: 'string' },
          { name: 'fontWeight', type: 'string' },
          { name: 'padding', type: 'string' },
          { name: 'margin', type: 'string' },
          { name: 'hoverColor', type: 'string' },
          { name: 'hoverBackgroundColor', type: 'string' },
          { name: 'activeBackgroundColor', type: 'string' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Tabs',
    name: 'tabs',
    addable: true,
    settings: {
      general: {
        fields: { ...fields },
        rules: [...rules],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Tab',
    name: 'tab',
    addable: true,
    settings: {
      general: {
        fields: { ...fields },
        rules: [...rules],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Search bar',
    name: 'searchbar',
    addable: false,
    settings: {
      general: {
        fields: { colCount: 1, ...fields },
        rules: [{ name: 'colCount', type: 'number' }, ...rules],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Load More',
    name: 'loadmore',
    addable: false,
    settings: {
      general: {
        fields: {
          entity: '',
          include: '',
          perPage: 1,
          breakpoints: {},
          classess: '',
          customQuery: {},
          populateQuery: {},
          ...fields,
        },
        rules: [
          { name: 'entity', type: 'string' },
          { name: 'include', type: 'string', class: 'ltr' },
          { name: 'perPage', type: 'number' },
          { name: 'breakpoints', type: 'object' },
          { name: 'customQuery', type: 'object' },
          { name: 'populateQuery', type: 'object' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Pagination',
    name: 'pagination',
    addable: false,
    settings: {
      general: {
        fields: {
          entity: '',
          include: '',
          perPage: 1,
          offset: 0,
          limit: 10,
          breakpoints: {},
          classess: '',
          customQuery: {},
          populateQuery: {},
          ...fields,
        },
        rules: [
          { name: 'entity', type: 'string' },
          { name: 'include', type: 'string', class: 'ltr' },
          { name: 'perPage', type: 'number' },
          { name: 'offset', type: 'number' },
          { name: 'limit', type: 'number' },
          { name: 'breakpoints', type: 'object' },
          { name: 'customQuery', type: 'object' },
          { name: 'populateQuery', type: 'object' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Grid',
    name: 'grid',
    addable: false,
    settings: {
      general: {
        fields: {
          entity: '',
          include: '',
          perPage: 1,
          offset: 0,
          limit: 10,
          breakpoints: {},
          classess: '',
          customQuery: {},
          populateQuery: {},
          ...fields,
        },
        rules: [
          { name: 'entity', type: 'string' },
          { name: 'include', type: 'string', class: 'ltr' },
          { name: 'perPage', type: 'number' },
          { name: 'offset', type: 'number' },
          { name: 'limit', type: 'number' },
          { name: 'breakpoints', type: 'object' },
          { name: 'customQuery', type: 'object' },
          { name: 'populateQuery', type: 'object' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },

  {
    label: 'Side Menu',
    name: 'sidemenu',
    addable: false,
    settings: {
      general: {
        fields: {
          entity: '',
          showPriceFilter: true,
          include: '',
          perPage: 1,
          offset: 0,
          limit: 10,
          breakpoints: {},
          classess: '',
          customQuery: {},
          populateQuery: {},
          ...fields,
        },
        rules: [
          { name: 'entity', type: 'string' },
          { name: 'showPriceFilter', type: 'boolean', value: true },
          { name: 'include', type: 'string', class: 'ltr' },
          { name: 'perPage', type: 'number' },
          { name: 'offset', type: 'number' },
          { name: 'limit', type: 'number' },
          { name: 'breakpoints', type: 'object' },
          { name: 'customQuery', type: 'object' },
          { name: 'populateQuery', type: 'object' },
          ...rules,
        ],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'Galleries',
    name: 'galleries',
    addable: false,
    settings: {
      general: {
        fields: {},
        rules: [],
      },
      design: [],
    },
  },
  {
    label: 'Sort',
    name: 'sort',
    addable: false,
    settings: {
      general: {
        fields: {},
        rules: [],
      },
      design: [],
    },
  },
  {
    label: 'ChooseLayout',
    name: 'chooselayout',
    addable: false,
    settings: {
      general: {
        fields: {},
        rules: [],
      },
      design: [],
    },
  },
  {
    label: 'form',
    name: 'form',
    addable: false,
    settings: {
      general: {
        fields: { _id: '', showSubmitButton: 'true', ...fields },
        rules: [
          { name: '_id', type: 'string' },
          { name: 'showSubmitButton', type: 'boolean', value: true },

          ...rules,
        ],
      },
      design: [],
    },
  },
  {
    label: 'Prices',
    name: 'prices',
    addable: false,
    settings: {
      general: {
        fields: {},
        rules: [],
      },
      design: [],
    },
  },
  {
    label: 'AddToCartButton',
    name: 'addtocartbutton',
    addable: false,
    settings: {
      general: {
        fields: {},
        rules: [],
      },
      design: [],
    },
  },
  {
    label: 'ProductCategories',
    name: 'productcategories',
    addable: false,
    settings: {
      general: {
        fields: {},
        rules: [],
      },
      design: [],
    },
  },
  {
    label: 'category description',
    name: 'description',
    addable: false,
    settings: {
      general: {
        fields: { entity: '' },
        rules: [{ name: 'entity', type: 'string' }],
      },
      design: [{ name: 'padding', type: 'string' }],
    },
  },
  {
    label: 'currency',
    name: 'currency',
    addable: false,
    settings: {
      general: {
        fields: { ...fields },
        rules: [...rules],
      },
      design: [],
    },
  },
  {
    label: 'tsc',
    name: 'tsc',
    addable: false,
    settings: {
      general: {
        fields: { ...fields },
        rules: [...rules],
      },
      design: [],
    },
  },
  {
    label: 'gomrokform',
    name: 'gomrokform',
    addable: false,
    settings: {
      general: {
        fields: { ...fields },
        rules: [...rules],
      },
      design: [],
    },
  },
];
export default DefaultOptions;
