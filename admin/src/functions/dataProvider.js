import { stringify } from 'query-string';
import { fetchUtils } from 'ra-core';
import Transform from './transform';

const getTotal = (json, headers) => {
  if (!Array.isArray(json)) json = [json];
  let total = json.length;
  if (headers.has('X-Total-Count'))
    total = parseInt(headers.get('X-Total-Count').split('/').pop(), 10);
  return total;
};

const httpClient = (url, options = {}) => {
  console.log('url', url);

  if (!options.headers)
    options.headers = new Headers({
      accept: 'application/json',
      response: 'json',
    });

  // add your own headers here
  options.headers.set(
    'Authorization',
    'Bearer ' + localStorage.getItem('token')
  );
  return fetchUtils.fetchJson(url, options);
};

export default (apiUrl) => ({
  getFromExtra: (resource, params) => {
    return new Promise(function (resolve, reject) {
      let url = `${resource}`;

      console.log('getFromExtra');
      return httpClient(url, {
        method: 'GET',
      }).then(({ headers, json = [] }) => {
        // let total = getTotal(json, headers);
        console.log(json);
      });
    });
  },
  createOne: (resource, params) => {
    console.log('createOne');
  },
  getList: (resource, params) => {
    // console.log("getOne,", resource, params);

    // return new Promise(function(resolve, reject) {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const t = {
      ...fetchUtils.flattenObject(params.filter),
      _sort: field,
      _order: order,
      // _start: (page - 1) * perPage,
      // _end: page * perPage,
    };

    // // const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const query = (page - 1) * perPage + '/' + perPage;
    let url = `${apiUrl}/${resource}/${query}?${stringify(t)}`;
    // if (params.filter && params.filter.search) {
    //     url += '/'+params.filter.search;
    // }
    // console.log('query',query);
    // console.log('resource',resource);
    // console.log('url',url);
    return httpClient(url).then(({ headers, json = [] }) => {
      let total = getTotal(json, headers);
      if (json && json.data[0]) {
        // console.log(json.map((r, t) => ({ ...r, id: r._id, t })));
        const x = {
          data: json.data,
          total,
        };

        switch (resource) {
          case 'product':
            x.data = Transform.getAllProduct(x.data);
            break;

          default:
            break;
        }

        x.data = x.data.map((r, t) => ({ ...r, id: r._id, t }));
        return x;
      } else {
        return {
          data: [],
          total: 0,
        };
        // return {
        //     data: [],
        //     total: 0
        // };
      }
    });
    // });
  },

  getOne: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}`).then(
      ({ json: { data } }) => {
        const result = {
          data: { ...data, id: data._id },
        };

        switch (resource) {
          case 'product':
            result.data = Transform.getOneProduct(result.data);
            break;

          default:
            break;
        }

        return result;
      }
    );
  },
  get: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`).then(({ json }) => ({
      data: json,
    })),

  getMany: (resource, params) => {
    return Promise.all(
      params.ids.map((id) => httpClient(`${apiUrl}/${resource}/${id}`))
    ).then((res) => {
      return {
        data: res.map(({ json }) => ({ ...json, id: json._id })),
      };
    });
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;
    // const query = {
    //   ...fetchUtils.flattenObject(params.filter),
    //   [params.target]: params.id,
    //   _sort: field,
    //   _order: order,
    //   _start: (page - 1) * perPage,
    //   _end: page * perPage,
    // };
    const query = (page - 1) * perPage + '/' + perPage;
    const url = `${apiUrl}/${resource}/${query}`;

    return httpClient(url).then(({ headers, json }) => {
      let total = getTotal(json, headers);
      return {
        data: json,
        total,
      };
    });
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json = [] }) => ({
      data: { id: json._id, ...json },
      // data: json.map((r) => ({ ...r, id: r._id }))
    })),

  // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
  updateMany: (resource, params) => {
    console.log('updateMany...', resource, params);
    return new Promise(function (resolve, reject) {
      // resolve([]);
      if (params.id) {
        httpClient(`${apiUrl}/${resource}/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify({ ...params.data, selectedIds: params.ids }),
        }).then(({ json = [] }) => {
          console.log('updateMany... then');

          return resolve({
            // data: json.map((r) => ({...r, id: r._id})),
            data: json,
          });
        });
      } else {
        httpClient(`${apiUrl}/${resource}/`, {
          method: 'PUT',
          body: JSON.stringify({ ...params.data, selectedIds: params.ids }),
        }).then(({ json = [] }) => {
          console.log('updateMany... then 2');

          return resolve({
            data: json,

            // data: json.map((r) => ({...r, id: r._id})),
          });
        });
      }
    });
  },
  // Promise.all(
  //     params.ids.map((id) =>
  //         httpClient(`${apiUrl}/${resource}/${id}`, {
  //             method: 'PUT',
  //             body: JSON.stringify(params.data),
  //         })
  //     )
  // ).then((res) => ({
  //     data: res.map(({json = []}) => json._id),
  // })),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    })
      .then(({ json }) => {
        return {
          data: { ...params.data, id: json._id },
        };
      })
      .catch((err) => {
        throw err;
      }),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => ({ data: json })),

  // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        })
      )
    ).then((res) => ({ data: res.map(({ json }) => json._id) })),
});
