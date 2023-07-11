import grapesjs from 'grapesjs';


import loadComponents from './components';
import loadBlocks from './blocks';
import {
  boxRef
} from './consts';

export default grapesjs.plugins.add('gjs-component-box', (editor, opts = {}) => {

  let c = opts;

  let defaults = {
    blocks: [boxRef],

    // Default style
    defaultStyle: true,

    // Default start time, eg. '2018-01-25 00:00'
    startTime: '',

    // Text to show when the box is ended
    endText: 'EXPIRED',

    // Date input type, eg, 'date', 'datetime-local'
    dateInputType: 'date',

    // Box class prefix
    boxClsPfx: 'box',

    // Box label
    labelBox: 'Box',

    // Box category label
    labelBoxCategory: 'Extra',

    // Days label text used in component
    labelDays: 'days',

    // Hours label text used in component
    labelHours: 'hours',

    // Minutes label text used in component
    labelMinutes: 'minutes',

    // Seconds label text used in component
    labelSeconds: 'seconds',
  };

  // Load defaults
  for (let name in defaults) {
    if (!(name in c))
      c[name] = defaults[name];
  }

  // Add components
  loadComponents(editor, c);

  // Add components
  loadBlocks(editor, c);

});
