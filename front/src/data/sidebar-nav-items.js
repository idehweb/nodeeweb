import store from '#c/functions/store';

export default function SidebarItem() {
  const { token, phoneNumber, firstName, lastName } = store.getState().store;

  let profile = phoneNumber;
  if (firstName || lastName) profile = firstName + ' ' + lastName;

  if (token) {
    return [
      {
        title: 'my orders',
        htmlBefore: '<i class="material-icons mr-1">list_alt</i>',
        to: '/my-orders',
      },
    ];
  } else {
    return [
    ];
  }
}
