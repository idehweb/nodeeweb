import DefaultGeneral from './DefaultGeneral'
let {fields,rules}=DefaultGeneral;
const DefaultOptions = [
  {
    "label": "Image",
    "name": "image",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"src": "","link": "","width": "","maxWidth": "","height": "","maxHeight": "", "title": "",...fields},
        "rules": [
          {"name": "src", "type": "image"},
          {"name": "link", "type": "string"},
          {"name": "width", "type": "string"},
          {"name": "maxWidth", "type": "string"},
          {"name": "height", "type": "string"},
          {"name": "maxHeight", "type": "string"},
          {"name": "title", "type": "string"},
          ...rules
        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Slider",
    "name": "slider",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"entity": "", "include": "", "category": "","arrows":"true","pagination":"false","perPage":1,"breakpoints":{},"classess":"","customQuery":{},...fields},
        "rules": [
          {"name": "entity", "type": "string"},
          {"name": "include", "type": "string"},
          {"name": "category", "type": "string"},
          {"name": "pagination", "type": "boolean"},
          {"name": "arrows", "type": "boolean"},
          {"name": "perPage", "type": "number"},
          {"name": "breakpoints", "type": "string"},
          {"name": "customQuery", "type": "object"},
          ...rules
        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },{
    "label": "Button",
    "name": "button",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"text": "", "action": "","float": "","borderRadius": "","fontSize":"13px","lineHeight":"1","iconImage":"","iconFont":"","iconPosition":"top","iconColor":"","fontWeight":"normal","border":"",...fields},
        "rules": [
          {"name": "text", "type": "string"},
          {"name": "action", "type": "string"},
          {"name": "float", "type": "string"},
          {"name": "fontSize", "type": "string"},
          {"name": "lineHeight", "type": "string"},
          {"name": "iconImage", "type": "image"},
          {"name": "iconFont", "type": "string"},
          {"name": "iconColor", "type": "string"},
          {"name": "iconPosition", "type": "string"},
          {"name": "fontWeight", "type": "string"},
          {"name": "borderRadius", "type": "string"},
          {"name": "border", "type": "string"},

          ...rules
        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },  {
    "label": "Row",
    "name": "row",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"height":"",...fields},
        "rules": [
          {"name": "height", "type": "string"},

          ...rules
        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Col",
    "name": "col",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"width": "",...fields},
        "rules": [
          {"name": "width", "type": "string"},
          ...rules
        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Html",
    "name": "html",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"colCount": 1,...fields},
        "rules": [
          {"name": "colCount", "type": "number"},
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Text",
    "name": "text",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"text": "","direction": "","target": "","link": "","fontSize":"13px","lineHeight":"1","iconImage":"","iconFont":"","iconPosition":"top","iconColor":"","fontWeight":"normal",...fields},
        "rules": [
          {"name": "text", "type": "textarea"},
          {"name": "direction", "type": "string"},
          {"name": "target", "type": "string"},
          {"name": "link", "type": "string"},
          {"name": "fontSize", "type": "string"},
          {"name": "lineHeight", "type": "string"},
          {"name": "iconImage", "type": "image"},
          {"name": "iconFont", "type": "string"},
          {"name": "iconPosition", "type": "string"},
          {"name": "fontWeight", "type": "string"},
          {"name": "iconColor", "type": "string"},

          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Header",
    "name": "header",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"element": "h1","fontSize":"20px","lineHeight":"1","fontWeight":"normal",...fields},
        "rules": [
          {"name": "element", "type": "string"},
          {"name": "fontSize", "type": "string"},
          {"name": "lineHeight", "type": "string"},
          {"name": "fontWeight", "type": "string"},

          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Line",
    "name": "hr",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"type":"solid","width":"100%","height":"100%",...fields},
        "rules": [
          {"name": "color", "type": "textarea"},
          {"name": "width", "type": "string"},
          {"name": "height", "type": "string"},
          {"name": "type", "type": "string"},
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Navigation bar",
    "name": "navigation",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"colCount": 1,"type":"simple",...fields},
        "rules": [
          {"name": "colCount", "type": "number"},
          {"name": "type", "type": "string"},
          {"name": "backgroundColor", "type": "string"},
          {"name": "color", "type": "string"},
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }, {
    "label": "Navigation item",
    "name": "navigationitem",
    "addable": true,
    "settings": {
      "general": {
        "fields": {"text": "","link":"simple","lineHeight":"1","borderRadious":"0","border":"","boxShadow":"","fontWeight":"","hoverColor":"","hoverBackgroundColor":"","activeBackgroundColor":"",...fields},
        "rules": [
          {"name": "text", "type": "string"},
          {"name": "link", "type": "string"},
          {"name": "lineHeight", "type": "string"},
          {"name": "borderRadius", "type": "string"},
          {"name": "border", "type": "string"},
          {"name": "boxShadow", "type": "string"},
          {"name": "fontWeight", "type": "string"},
          {"name": "padding", "type": "string"},
          {"name": "margin", "type": "string"},
          {"name": "hoverColor", "type": "string"},
          {"name": "hoverBackgroundColor", "type": "string"},
          {"name": "activeBackgroundColor", "type": "string"},
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },
  {
    "label": "Tabs",
    "name": "tabs",
    "addable": true,
    "settings": {
      "general": {
        "fields": {...fields},
        "rules": [
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },{
    "label": "Tab",
    "name": "tab",
    "addable": true,
    "settings": {
      "general": {
        "fields": {...fields},
        "rules": [
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },
  {
    "label": "Search bar",
    "name": "searchbar",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"colCount": 1,...fields},
        "rules": [
          {"name": "colCount", "type": "number"},
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },
  {
    "label": "Grid Entity",
    "name": "grid",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"colCount": 1,...fields},
        "rules": [
          {"name": "colCount", "type": "number"},
          ...rules

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },
  {
    "label": "category description",
    "name": "description",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"entity": ""},
        "rules": [
          {"name": "entity", "type": "string"},

        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  },
  {
    "label": "Load More",
    "name": "loadmore",
    "addable": false,
    "settings": {
      "general": {
        "fields": {"entity": "", "include": "","perPage":1,"breakpoints":{},"classess":"","customQuery":{},"populateQuery":{},...fields},
        "rules": [
          {"name": "entity", "type": "string"},
          {"name": "include", "type": "string","class":"ltr"},
          {"name": "perPage", "type": "number"},
          {"name": "breakpoints", "type": "object"},
          {"name": "customQuery", "type": "object"},
          {"name": "populateQuery", "type": "object"},
          ...rules
        ]
      },
      "design": [{"name": "padding", "type": "string"}],
    }
  }

  ];
export default DefaultOptions
