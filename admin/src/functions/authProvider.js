const url = window.ADMIN_ROUTE ;

export default {
  // called when the user attempts to log in
  login: ({ username, password }) => {
    const request = new Request(url + '/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        identifier: username,
        password: password,
      }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });
    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((obj) => {
        // console.log('obj', obj.user.token);
        localStorage.setItem('email', obj.user.email);
        localStorage.setItem('active', obj.user.active);
        localStorage.setItem('nickname', obj.user.nickname);
        localStorage.setItem('username', obj.user.username);
        localStorage.setItem('token', obj.user.token);
        localStorage.setItem('user_id', obj.user._id);
        return Promise.resolve();

      });
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem('email');
    localStorage.removeItem('active');
    localStorage.removeItem('nickname');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem('token')
      ? Promise.resolve({ redirectTo: '/post' })
      : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => Promise.resolve(),
};
