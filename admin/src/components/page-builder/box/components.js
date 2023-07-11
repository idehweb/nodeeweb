export default function(editor, opt = {}) {
  const c = opt;
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const textType = domc.getType('text');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;
  const textModel = textType.model;
  const textView = textType.view;
  const pfx = c.boxClsPfx;
  const BOX_TYPE = 'box';

  domc.addType(BOX_TYPE, {

    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        startfrom: c.startTime,
        endText: c.endText,
        droppable: false,
        traits: [{
          label: 'Start',
          name: 'startfrom',
          changeProp: 1,
          type: c.dateInputType,
        },{
          label: 'End text',
          name: 'endText',
          changeProp: 1,
        }],
        script: function() {

        }
      },
    }, {
      isComponent(el) {
        if(el.getAttribute &&
          el.getAttribute('data-gjs-type') == BOX_TYPE) {
          return {
            type: BOX_TYPE
          };
        }
      },
    }),


    view: defaultView.extend({
      init() {
        this.listenTo(this.model, 'change:startfrom change:endText', this.updateScript);
        const comps = this.model.get('components');

        // Add a basic box template if it's not yet initialized
        if (!comps.length) {
          comps.reset();
          comps.add(`
            <span data-js="box" class="${pfx}-cont">
            hjkjhj
              </span>`);
        }

      }
    }),
  });
}
