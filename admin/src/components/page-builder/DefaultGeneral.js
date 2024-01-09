import { RichTextInput } from 'ra-input-rich-text';

export const fields = {
  classes: '',
  margin: '',
  display: '',
  padding: '',
  backgroundColor: '',
  textAlign: '',
  color: '',
  backgroundImage: '',
  position: '',
  right: '',
  left: '',
  bottom: '',
  top: '',
};
export const rules = [
  { name: 'classes', type: 'string' },
  { name: 'margin', type: 'string' },
  { name: 'display', type: 'string' },
  { name: 'padding', type: 'string' },
  { name: 'backgroundColor', type: 'string' },
  { name: 'textAlign', type: 'string' },
  { name: 'color', type: 'string' },
  { name: 'backgroundImage', type: 'image' },
  { name: 'position', type: 'string' },
  { name: 'left', type: 'string' },
  { name: 'top', type: 'string' },
  { name: 'right', type: 'string' },
  { name: 'bottom', type: 'string' },
  { name: 'showInDesktop', type: 'boolean', value: false },
  { name: 'showInMobile', type: 'boolean', value: false },
  //Added by me (below object)
  {
    name: 'richText',
    type: 'textarea',
  },
];
