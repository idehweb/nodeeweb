import axios from "axios";
import Types from "#c/functions/types";
import store, {storeAttrValue, storePosts, storeProduct, storeProducts} from "#c/functions/store";
import CONFIG from "#c/config";
import {createContext} from "react";
import {
  clearState,
  deleteAdminData,
  deleteData,
  getAdminData,
  getData,
  postAdminData,
  postData,
  PriceFormat,
  putAdminData,
  putData
} from "#c/functions/utils";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const DataContext = createContext(null);
export const isClient = (typeof window !== "undefined");
// clearState
console.log('CONFIG', CONFIG);
export const MainUrl = CONFIG.BASE_URL;
if (isClient) {
// import { createContext } from "react";

}
// export const MainUrl = "http://localhost:3003";
export const ApiUrl = CONFIG.BASE_URL + '/customer';
export const AdminRoute = CONFIG.BASE_URL + '/admin';
export const THEME_URL = CONFIG.THEME_URL || CONFIG.BASE_URL + 'customer';
// console.log("REACT_APP_FRONT_ROUTE",process.env);
// export const ApiUrl = "http://localhost:3003/customer";
export const token = (typeof window === "undefined") ? null : store.getState().store.user.token;
export const admin_token = (typeof window === "undefined") ? null : store.getState().store.admin.admin_token;
export const setStyles = (fields) => {
  let style = {};
  let {
    textAlign,
    position,
    top,
    bottom,
    right,
    border,
    left,
    boxShadow,
    zIndex,
    color, float, borderRadius, direction, width, maxWidth, height, maxHeight, backgroundColor, margin, padding, fontWeight, fontSize, lineHeight, display,
    paddingTop,
    paddingBottom
  } = fields
  if (paddingTop) {
    style['paddingTop'] = paddingTop;
  }
  if (paddingBottom) {
    style['paddingBottom'] = paddingBottom;
  }
  if (borderRadius) {
    style['borderRadius'] = borderRadius;
  }
  if (border) {
    style['border'] = border;
  }
  if (zIndex) {
    style['zIndex'] = zIndex;
  }
  if (color) {
    style['color'] = color;
  }
  if (textAlign) {
    style['textAlign'] = textAlign;
  }
  if (display) {
    style['display'] = display;
  }
  if (direction) {
    style['direction'] = direction;
  }

  if (width) {
    style['width'] = width;
  }
  if (maxWidth) {
    style['maxWidth'] = maxWidth;
  }
  if (height) {
    style['height'] = height;
  }
  if (maxHeight) {
    style['maxHeight'] = maxHeight;
  }

  if (float) {
    style['float'] = float;
  }
  if (backgroundColor) {
    style['backgroundColor'] = backgroundColor;
  }
  if (margin) {
    style['margin'] = margin;
  }
  if (padding) {
    style['padding'] = padding;
  }
  if (fontWeight) {
    style['fontWeight'] = fontWeight;
  }
  if (fontSize) {
    style['fontSize'] = fontSize;
  }
  if (lineHeight) {
    style['lineHeight'] = lineHeight;
  }
  if (position) {
    style['position'] = position;
  }
  if (bottom) {
    style['bottom'] = bottom;
  }
  if (boxShadow) {
    style['boxShadow'] = boxShadow;
  }

  if (right) {
    style['right'] = right;
  }
  if (left) {
    style['left'] = left;
  }
  if (top) {
    style['top'] = top;
  }
  return style;
}

export const loadProductItems = (cat_id = null, filter = {}) => {
  console.log("======> loadProductItems");
  return new Promise(function (resolve, reject) {
    // if (cat_id)
    //   getPostsByCat(0, 8, cat_id, "", {}, include).then((resp) => {
    //     resolve(resp);
    //   });
    // else
    getEntities('product', 0, 12, "", filter).then((resp) => {
      // setLoadingMoreItems(false);
      // afterGetData(resp);
      resolve(resp);

    });
    // getPosts(0, 12, "").then((resp) => {
    //   // setLoadingMoreItems(false);
    //   // afterGetData(resp);
    //   resolve(resp);
    //
    // });
  });
};
export const loadPostItems = (cat_id = null, include = null) => {
  console.log("======> loadPostItems");
  return new Promise(function (resolve, reject) {
    if (cat_id)
      getBlogPostsByCat(0, 8, cat_id, "", {}, include).then((resp) => {
        resolve(resp);
      });
    else
      getBlogPosts(0, 12, "").then((resp) => {
        resolve(resp);

      });
  });
};
export const loadEntityItems = (entity, cat_id = null, include = null) => {
  console.log("======> loadPostItems");
  if (!entity) {
    return;
  }
  return new Promise(function (resolve, reject) {
    // if (cat_id)
    //   getEntities(0, 8, cat_id, "", {}, include).then((resp) => {
    //     resolve(resp);
    //   });
    // else
    getEntities(0, 12, "").then((resp) => {
      resolve(resp);

    });
  });
};
export const loadItem = (_id = null) => {
  console.log("======> loadItem");
  return new Promise(function (resolve, reject) {
    getPost(_id).then((resp) => {
      resolve(resp);
    });
  });
};
export const loadBlogItem = (_id = null) => {
  console.log("======> loadBlogItem");
  return new Promise(function (resolve, reject) {
    getBlogPost(_id).then((resp) => {
      resolve(resp);
    });
  });
};
// export const fetchData = () => async (dispatch) => {
//   console.log("fetchData************");
//   await loadProductItems().then(async res => {
//     return await dispatch(storeProducts(res));
//   });
// //
// };
export const SearchIt = (_id) => {
  return new Promise(function (resolve, reject) {
    let c = [];
    getData(`${ApiUrl}/product/0/15/${_id}`)
      .then((res) => {
        res.data.map((ir, i) => {
          let ph = "";
          if (ir.photos && ir.photos[0]) {
            ph = MainUrl + "/" + ir.photos[0];
          }
          if (ir.thumbnail) {
            ph = MainUrl + "/" + ir.thumbnail;
          }
          let title = encodeURIComponent(ir.title.fa.replace(/\\|\//g, ""));
          let slug = encodeURIComponent(ir.slug.replace(/\\|\//g, ""));

          c.push({title: ir.title, photo: ph, url: "/product/" + ir.slug + "/" });

        });

        resolve(c);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};
export const Home = () => ({
  type: Types.Home
});

export const receive_data = (data) => ({
  type: Types.Receive,
  data
});

export const receive_error = (data) => ({
  type: Types.Error,
  data
});

export const SaveData = (data) => {
  if (data) {
    console.log('SaveData', data)
    return store.dispatch({
      type: Types.SaveData,
      data
    });
  }
}
const handleErr = (err) => {
  console.error('err => ', err);
  store.dispatch(receive_error(err));
};

export const Logout = () => {
  clearState();
  window.location.replace("/");
};
export const clearAdminState = () => {
  clearState();
};

export const LevelCategoriesData = (i = "") =>
  getData(`${ApiUrl}/category/level/${i}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const LevelCountriesData = (i = "") =>
  getData(`${ApiUrl}/country/level/${i}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const handleTitles = (combination) => {
  // const { t, options } = this.props;
  let arr = [];

  if (combination && combination.options) {
    Object.keys(combination.options).forEach(function (op, index) {
      arr.push(combination.options[op]);
    });
  }
  if (arr.join(","))
    return arr;
};
export const getMinPrice = (combinations) => {
  let array_price = [];
  if (combinations && combinations.length > 0) {
    let price = null;
    let salePrice = null;
    combinations.map((comb) => {
      let pri = parseInt(comb.price);
      let spri = parseInt(comb.salePrice);
      if (comb.in_stock)
        if (spri && spri != null && spri > 0)
          array_price.push((spri));
        else if (pri && pri != null && pri > 0)
          array_price.push((pri));

    });
    // console.log(array_price);
    // return 'از' + arrayMin(array_price);
    let min = arrayMin(array_price);
    if (min) {
      price = PriceFormat(min);
    }

    return price;
  }
};
export const getAllSidebarCategoriesData = (i = "") =>
  getData(`${ApiUrl}/category/all/0/300`, {}, true)
    .then(({data}) => {
      if (!data.length) return;
      let parentsArray = [];
      data.forEach((item) => {
        if (item) {
          item.to = item._id;
          item.title = item.name;

          item.htmlAfter =
            <KeyboardArrowLeftIcon/>;
          item.htmlBefore =
            <KeyboardArrowLeftIcon/>;
        }
      });
      data.forEach((item1) => {
        if (!item1.parent) {
          let parentItem = item1;
          parentItem.child = [];
          parentsArray.push(parentItem);
          data.forEach((item2) => {
            if (item2.parent === item1._id) {
              let firstChild = item2;
              firstChild.child = [];
              parentItem.child = [...parentItem.child, firstChild];
              data.forEach((item3) => {
                if (item3.parent === item2._id) {
                  let secondChild = item3;
                  secondChild.child = [];
                  firstChild.child = [...firstChild.child, secondChild];
                  data.forEach((item4) => {
                    if (item4.parent === item3._id) {
                      let thirdChild = item4;
                      thirdChild.child = [];
                      secondChild.child = [...secondChild.child, thirdChild];
                    }
                  });
                }
              });
            }
          });
        }
      });
      return parentsArray || [];
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const loadProduct = (_id = null) => async (dispatch) => {

  console.log("======> loadProduct", _id);
  await loadItem(_id).then(async res => {
    return await dispatch(storeProduct({data: res, _id: _id}));
  });
};
export const loadPost = (_id = null) => async (dispatch) => {

  console.log("======> loadPost", _id);
  // return new Promise(function (resolve, reject) {
  await loadBlogItem(_id).then(async res => {
    return await dispatch(storeProduct({data: res, _id: _id}));
  });
};
export const loadProducts = (cat_id = null, include = null) => async (dispatch) => {
  console.log("======> loadProducts", cat_id, include);
  await loadProductItems(cat_id).then(async res => {
    return await dispatch(storeProducts({data: res, id: cat_id}));
  });

};
export const loadPosts = (cat_id = null, include = null) => async (dispatch) => {
  console.log("======> loadPosts", cat_id, include);
  await loadPostItems(cat_id).then(async res => {
    return await dispatch(storePosts({data: res, id: cat_id}));
  });
};

export const setAttrValue = (attr = null, value = null) => async (dispatch) => {
  console.log("======> setAttrValue", attr, value);
  await dispatch(storeAttrValue({attr: attr, value: value}));

}

export const fetchCats = () => async (dispatch) => {
  console.log("fetchCats");
  let allCategories = store.getState().store.allCategories;
  // console.log('allCategories', allCategories);
  if (allCategories && !allCategories.length) {
    // console.log('awaiting... getAllSidebarCategoriesData');

    const response = await getAllSidebarCategoriesData();
    // console.log('response... getAllSidebarCategoriesData', response);

    let cat = "";
    if (response && response[0] && response[0]._id)
      cat = response[0]._id;
    return await dispatch({
      type: "cats/catsLoaded",
      payload: {allCategories: response, cat: cat, searchvisible: false}
    });

  }
};
export const fetchTheme = () => async (dispatch) => {
  console.log("fetchTheme");
  let themeData = store.getState().store.themeData;
  // console.log('allCategories', allCategories);
  if (themeData && !themeData.length) {

    const response = await getThemeData();

    return await dispatch({
      type: "theme/themeLoaded",
      payload: {themeData: response}
    });

  }
};
export const fetchHome = () => async (dispatch) => {
  console.log("fetchHome");
  let homeData = store.getState().store.homeData;
  // console.log('allCategories', allCategories);
  if (homeData && !homeData.length) {

    const response = await getHomeData();

    return await dispatch({
      type: "data/homeLoaded",
      payload: {homeData: response}
    });

  }
};
export const SidebarCategoriesData = (i = "") =>
  getData(`${ApiUrl}/category/sidebar/${i}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const getThemeData = (i = "") =>
  window.theme || getAdminData(`${THEME_URL}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const getModelsData = (i = "") =>
  getAdminData(`${AdminRoute}/settings/db`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const getHomeData = (i = "") => {
  return {
    title: "hello",
    text: "text",
    des: "desdz",
  };
  // getData(`${THEME_URL}`, {}, true)
  //     .then((res) => {
  //         return res.data;
  //     })
  //     .catch((err) => {
  //         handleErr(err);
  //         return err;
  //     });
}

export const isStringified = (jsonValue) => {
  try {
    console.log("need to parse");
    return JSON.parse(jsonValue);
  } catch (err) {
    console.log("not need to parse");

    return jsonValue;
  }
}
export const getCombination = async (combinations, condition) => {
  let r = await combinations.forEach(async (comb) => {
    // console.log('condition',condition,Object.is(comb.options,condition));

    if (await isEqual(comb.options, condition)) {
      console.log('comb', comb);
      return comb;
    }
  })
  console.log('r', r);
};
export const isEqual = (obj1, obj2) => {
  let props1 = Object.getOwnPropertyNames(obj1);
  let props2 = Object.getOwnPropertyNames(obj2);
  if (props1.length != props2.length) {
    return false;
  }
  for (let i = 0; i < props1.length; i++) {
    let val1 = obj1[props1[i]];
    let val2 = obj2[props1[i]];
    let isObjects = isObject(val1) && isObject(val2);
    if (isObjects && !isEqual(val1, val2) || !isObjects && val1 !== val2) {
      return false;
    }
  }
  return true;
}
export const isObject = (object) => {
  return object != null && typeof object === 'object';
}

export const getMyPost = (_id) =>
  getData(`${ApiUrl}/course/myPost/${_id}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const getMyPosts = (offset = 0, limit = 100) =>
  getData(`${ApiUrl}/course/myPosts/mine/${offset}/${limit}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const getContacts = () => {
  console.log('getContacts')
  return new Promise(function (resolve, reject) {
    let c = [];
    getData(`${ApiUrl}/session/contacts/mine`, {}, true)
      .then(({data = {}}) => {
        console.clear()
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });

  });
};
export const addToMyContacts = (phoneNumber) => {
  console.log('getContacts')
  return new Promise(function (resolve, reject) {
    let c = [];
    putData(`${ApiUrl}/session/contacts/mine`, {phoneNumber: phoneNumber}, true)
      .then(({data = {}}) => {
        console.clear()
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });

  });
};
export const startChat = (phoneNumber, from) => {
  console.log('startChat from', from, 'with', phoneNumber)
  return new Promise(function (resolve, reject) {
    let c = [];

    getData(`${ApiUrl}/session/` + phoneNumber, true)
      .then(({data = {}}) => {
        console.clear()
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });

  });
};
export const SaveBuilder = (model = 'page', _id = null, data, headers) => {
  console.log('SaveBuilder', _id, data)
  return new Promise(function (resolve, reject) {
    let c = [];
    if (_id)
      putAdminData(`${AdminRoute}/${model}/` + _id, data, true)
        .then(({data = {}}) => {
          // console.clear()
          // let mainD = data["data"];
// console.log('data',data)
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    // else
    //   postData(`${AdminRoute}/page/`, {title: '1', slug: '1', elements: data}, true)
    //     .then(({data = {}}) => {
    //       let mainD = data["data"];
    //
    //       resolve(mainD);
    //     })
    //     .catch(err => {
    //       reject(err);
    //     });
  });
};
export const GetBuilder = (model = 'page', _id) => {
  // console.log('GetBuilder()==>')

  return new Promise(function (resolve, reject) {
    let c = [];
    getData(`${AdminRoute}/${model}/${_id}`).then(({data = {}}) => {
      // console.log('resolve GetBuilder')

      //     let mainD = data["data"];
      // console.log('mainD',data)

      // if (mainD.success) {
      //     // savePost({order_id: null, card: []});
      // }
      resolve(data);
    })
      .catch(err => {
        // console.log('reject GetBuilder')

        reject(err);
      });
  });
};


export const getTheData = (role = 'admin', model, headers, offset = 0, limit = 50) => {
  console.log('getTheData header...', headers)
  return getAdminData(`${AdminRoute}/${model}/${offset}/${limit}`, {headers: headers}, true)
    .then((res) => {
      // console.clear();
      // console.log('res', res)
      return {data: res.data, headers: res.headers};
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
}
export const getTheSingleData = (role = 'admin', model, _id) =>
  getAdminData(`${AdminRoute}/${model}/${_id}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const updateTransactionStatus = (method, S) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/transaction/status/${method}`, S, false)
      .then(data => {
        let mainD = data["data"];
        if (mainD.success) {
          savePost({order_id: null, card: []});
        }
        resolve(mainD);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const updateStatus = (S, A) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/transaction/status/`, {
      Status: S,
      Authority: A

    }, false)
      .then(data => {
        let mainD = data["data"];
        if (mainD.success) {
          savePost({order_id: null, card: []});
        }
        resolve(mainD);
      })
      .catch(err => {
        reject(err);
      });
  });
};
export const getMyOrders = (offset = 0, limit = 100) =>
  getData(`${ApiUrl}/order/myOrders/mine/${offset}/${limit}`, {}, true)
    .then((res) => {
      if (res.data.success == false)
        return [];
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const getMyOrder = (_id) =>
  getData(`${ApiUrl}/order/myOrder/onlyMine/${_id}`, {}, true)
    .then((res) => {
      if (res.data.success == false)
        return [];
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const getStoryList = (offset = 0, limit = 24) =>
  getData(`${ApiUrl}/product/story/${offset}/${limit}`, {}, true)
    .then((res) => res.data)
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const PlaceOrderF = (token, _id) =>
  getData(`${ApiUrl}/transaction/order/${token}/${_id}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const getMySells = (offset = 0, limit = 100) =>
  getData(`${ApiUrl}/order/mySells/mine/${offset}/${limit}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const getLink = (i) =>
  getData(`${ApiUrl}/link/view/${i}`, {}, false)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });

export const getLinks = (offset = 0, limit = 100) =>
  getData(`${ApiUrl}/link/myLinks/mine/${offset}/${limit}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
export const siteStatus = async (dispatch, getState) => {
  // console.log('get site Status');
  getData(`${ApiUrl}/settings/status`, {}, true)
    .then((res) => {
      if (!res.data)
        return;
      let obj = {
        siteStatus: res.data.success
      };
      if (res.data.message)
        obj["siteStatusMessage"] = res.data.message;

      // console.log('siteStatus res.data',obj);


      dispatch({type: "site/status", payload: res.data});
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
      return err;
    });
};


export const getPosts = (offset = 0, limit = 24, search, filter = {}) => {
  return new Promise(function (resolve, reject) {
    console.log('filter...', filter)
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }
    if (filter) {
      if (filter["type"]) params["type"] = filter["type"];
      if (filter["attr"]) params["attr"] = filter["attr"];
      if (filter["value"]) params["value"] = filter["value"];
    }
    getData(`${ApiUrl}/product/${offset}/${limit}/${search}`, {params}, true)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};
export const getBlogPosts = (offset = 0, limit = 24, search, filter = {}) => {
  return new Promise(function (resolve, reject) {
    // console.log('getPosts...',store.getState().store.country)
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }
    if (filter) {
      if (filter["type"]) params["type"] = filter["type"];
    }
    getData(`${ApiUrl}/post/${offset}/${limit}/${search}`, {params}, true)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};
export const getDiscountCode = (code = null, order_id) => {
  console.log('==> getDiscountCode(', code, ',', order_id, ')')
  return new Promise(function (resolve, reject) {

    getData(`${ApiUrl}/discount/set/${order_id}/${code}`, {}, true)
      .then((res) => {
        if (res.data.success == false)
          reject(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        // handleErr(err);
        reject(err);

      });
  })
}

export const getPath = (path) => {
  return new Promise(function (resolve, reject) {
    getData(`${ApiUrl}/${path}`, {}, true)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        handleErr(err);
      });
  });
};
export const postPath = (path) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/${path}`, {}, true)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        handleErr(err);
      });
  });
};
export const getEntity = (entity, _id) => {
  return new Promise(function (resolve, reject) {
    getData(`${ApiUrl}/${entity}/${_id}`, {}, true)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        handleErr(err);
      });
  });
};
export const getEntities = (entity, offset = 0, limit = 24, search = false, filter, populate) => {
  return new Promise(function (resolve, reject) {
    console.log('filter', filter)
    // console.log('getPosts...',store.getState().store.country)
    // if(typeof filter!='object'){
    //   filter=false
    // }
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }

    let url = `${ApiUrl}/${entity}/${offset}/${limit}/`;

    if (search)
      url += search;
    // if (filter) {

    // if (filter["type"]) params["type"] = filter["type"];
    // }
    console.log('filter', filter)

    if (filter) {
      url += "?filter=" + filter;
      // if (filter["type"]) params["type"] = filter["type"];
    }
    if (filter && populate) {
      url += "&populate=" + populate;
    }
    if (!filter && populate) {
      url += "?populate=" + populate;
    }
    getData(url, {params}, true)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};
export const getEntitiesWithCount = (entity, offset = 0, limit = 24, search = false, filter, populate) => {
  return new Promise(function (resolve, reject) {
    // console.log('filter', filter)
    // console.log('getPosts...',store.getState().store.country)
    // if(typeof filter!='object'){
    //   filter=false
    // }
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }

    let url = `${ApiUrl}/${entity}/${offset}/${limit}/`;

    if (search)
      url += search;
    // if (filter) {

    // if (filter["type"]) params["type"] = filter["type"];
    // }
    // console.log('filter', filter)

    if (filter) {
      url += "?filter=" + filter;
      // if (filter["type"]) params["type"] = filter["type"];
    }
    if (filter && populate) {
      url += "&populate=" + populate;
    }
    if (!filter && populate) {
      url += "?populate=" + populate;
    }
    getData(url, {params}, true)
      .then((d) => {
        let {data, headers} = d;
        resolve({
          items: data, count: headers ? headers['x-total-count'] : 0
        });
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};
export const getEntitiesForAdmin = (entity, offset = 0, limit = 24, search = false, filter = {}) => {
  return new Promise(function (resolve, reject) {
    // console.log('getPosts...',store.getState().store.country)
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }
    if (filter) {
      if (filter["type"]) params["type"] = filter["type"];
    }
    let url = `${AdminRoute}/${entity}/${offset}/${limit}/`;
    if (search)
      url += search;
    getAdminData(url, {params}, true)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};

export const getPostsByCat = (
  offset = 0,
  limit = 24,
  _id,
  search,
  filter = {},
  include = []
) => {
  return new Promise(function (resolve, reject) {
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }
    if (filter) {
      if (filter["type"]) params["type"] = filter["type"];
      if (filter["attr"]) params["attr"] = filter["attr"];
      if (filter["value"]) params["value"] = filter["value"];
    }
    if (include && include.length > 0) {
      params["include"] = include;
    }
    getData(
      `${ApiUrl}/product/productsByCat/${_id}/${offset}/${limit}/${search}`,
      {params},
      true
    )
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success === false) {
          mainD = [];
        }
        resolve(mainD);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};

export const getBlogPostsByCat = (
  offset = 0,
  limit = 24,
  _id,
  search,
  filter = {},
  include = []
) => {
  return new Promise(function (resolve, reject) {
    let params = {};
    const {country} = store.getState().store;
    if (country) {
      params = {
        country: country
      };
    }
    if (filter) {
      if (filter["type"]) params["type"] = filter["type"];
    }
    if (include && include.length > 0) {
      params["include"] = include;
    }
    getData(
      `${ApiUrl}/post/postsByCat/${_id}/${offset}/${limit}/${search}`,
      {params},
      true
    )
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success === false) {
          mainD = [];
        }
        resolve(mainD);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};

export const sendExtra = (d, obj) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/course/${d}`, obj, false)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const submitForm = (_id, obj) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/form/entry/${_id}`, obj, false)
      .then((data) => {
        let mainD = data["data"];
        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const createRecord = (model, obj) => {
  return new Promise(function (resolve, reject) {
    console.log('obj', obj)
    postAdminData(`${AdminRoute}/${model}`, obj, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const restartSystem = () => {
  return new Promise(function (resolve, reject) {
    // console.log('obj', obj)
    postAdminData(`${AdminRoute}/settings/restart`, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const editRecord = (model, _id, obj) => {
  console.log('editRecord')
  console.log('obj', obj)

  return new Promise(function (resolve, reject) {
    putAdminData(`${AdminRoute}/${model}/${_id}`, obj, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const contactBoy = (d, obj) => {
  return new Promise(function (resolve, reject) {
    getData(`${MainUrl}/${d}`, obj, false)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const addBookmark = (_id) => {
  return new Promise(function (resolve, reject) {
    let {token} = store.getState().store.user;
    console.log("token", token);
    if (!token) {
      reject({
        success: false,
        message: "You need to sign in!"
      });
    }
    postData(`${ApiUrl}/customer/wishlist/${_id}`, {}, true)
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success)
          resolve({
            success: true,
            message: "successfully done!"
          });
        else
          reject({
            success: false,
            message: mainD.message
          });

      })
      .catch((err) => {
        reject({
          success: false,
          message: "There is some problem!",
          err: err
        });
      });
  });
};
export const getBookmarks = () => {
  return new Promise(function (resolve, reject) {
    // let { token } = store.getState().store.user;
    // console.log("token", token);
    // if (!token) {
    //   reject({
    //     success: false,
    //     message: "You need to sign in!"
    //   });
    // }
    getData(`${ApiUrl}/customer/wishlist`, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);

      })
      .catch((err) => {
        reject({
          success: false,
          message: "There is some problem!",
          err: err
        });
      });
  });
};
export const updateNotifToken = (_id) => {
  return new Promise(function (resolve, reject) {
    //  postData(`${ApiUrl}/customer/updateNotifToken/${_id}`, {}, false)
    //  .then((data) => {
    //  let mainD = data['data'];

    resolve({});
    //})
    // .catch((err) => {
    // reject(err);
    //});
  });
};

export const updatetStatus = (status) => {
  return new Promise(async function (resolve, reject) {
    let {order_id, user} = await store.getState().store;
    // let token = store.getState().store.user.token;

    let sendAuth = false;
    if (user && user.token) {
      sendAuth = true;
    }
    let order = {
      // deliveryDay: setting,
      // billingAddress: the_address,

      // customer_data: user,
      // sum: sum,
      // amount: sum,
      status: status
      // deliveryPrice: deliveryPrice,
      // total: sum,
      // customer: user._id
    };
    let The_id = "";
    if (order_id) {
      The_id = order_id;
    }
    // console.log('postData');

    postData(`${ApiUrl}/order/cart/${The_id}`, order, sendAuth)
      .then((data) => {
        let mainD = data["data"];
        resolve(mainD)
        // console.log('mainD');


      })
      .catch((err) => {
        reject(err);
      });
    // resolve({});
  });
};
export const updateCard = (card, sum = 0) => {
  console.log('updateCard')
  return new Promise(async function (resolve, reject) {
    let {order_id, user} = await store.getState().store;
    // let token = store.getState().store.user.token;
    console.log('order_id:', order_id)
    await SaveData({card, sum});
    sum = 0;
    let sendAuth = false;
    if (user && user.token) {
      sendAuth = true;
    }
    card.map((item, idx2) => {

      sum += (item.salePrice || item.price) * item.count;

    });
    let packaged = [];
    card.map((cc) => {
      packaged.push({
        "product_id": cc._id,
        "product_name": cc.title.fa,
        "price": cc.salePrice || cc.price,
        "quantity": cc.count,
        "total_price": cc.count * (cc.salePrice || cc.price)
      });
    });
    let order = {
      // deliveryDay: setting,
      // billingAddress: the_address,
      card: card,
      // customer_data: user,
      sum: sum,
      amount: sum,
      package: packaged,
      // deliveryPrice: deliveryPrice,
      // total: sum,
      status: "cart"
    };
    if (user) {
      order["customer_data"] = user;
    }
    let The_id = "";
    if (order_id) {
      The_id = order_id;
    }
    // console.log('postData');

    postData(`${ApiUrl}/order/cart/${The_id}`, order, sendAuth)
      .then((data) => {
        let mainD = data["data"];
        // console.log('mainD');

        SaveData({order_id: mainD._id});

      })
      .catch((err) => {
        reject(err);
      });
    resolve({});
  });
};
export const addItem = (item) => {
  return new Promise(async function (resolve) {
    // console.log('item.price', item);

    let {card, sum} = await store.getState().store;
    let price = null;
    let salePrice = null;

    // console.log('item', item);
    if (item && item.salePrice)
      salePrice = parseInt(item.salePrice.toString().replace(/,/g, "-"));
    if (item && item.price) {
      price = parseInt(item.price.toString().replace(/,/g, ""));
    } else {

      return false;
    }

    // console.log('salePrice', salePrice);
    // console.log('price', price);
    // console.clear();

    console.log("item", item);
// return;
    sum = 0;
    if (!card) {
      card = [{
        price: price,
        salePrice: salePrice,
        _id: item._id,
        photos: item.photos,
        title: item.title,
        count: 0
      }];
    }
    let arr = [], notInside = false;
    // console.log('cardddd', card);

    await card.map(async (c, i) => {
      if (c.salePrice) {
        sum += c.salePrice * c.count;

      } else if (c.price) {
        sum += c.price * c.count;
      }
      if (item._id === c._id) {
        notInside = true;
        // console.log(i, item._id);
        c.count = c.count + 1;
        if (c.salePrice) {
          sum += c.salePrice * c.count;

        } else if (c.price) {
          sum += c.price * c.count;
        }
      }
      // console.log(c);
      await arr.push(c);

      // return;
    });
    if (!notInside) {
      arr.push({
        price: price,
        salePrice: salePrice,
        _id: item._id,
        photos: item.photos,
        title: item.title,
        count: 1
      });
    }
    // console.log('cardddd', arr);

    updateCard(arr, sum).then(() => {
      resolve(arr);

    });
  });

};
export const removeItem = (item) => {
  return new Promise(async function (resolve) {

    let {card, sum} = await store.getState().store;

    sum = 0;
    if (!card) {
      resolve();
      return;
    }
    let arr = [], notInside = false;
    // console.log('cardddd', card);

    await card.map(async (c, i) => {
      notInside = false;
      if (c.salePrice) {
        sum += c.salePrice * c.count;

      } else if (c.price) {
        sum += c.price * c.count;
      }
      if (item._id === c._id) {
        // console.log(i, item._id);
        if (c.count > 1) {
          c.count = c.count - 1;
          if (c.salePrice) {
            sum += c.salePrice * c.count;

          } else if (c.price) {
            sum += c.price * c.count;
          }
        } else {
          notInside = true;

        }
      }
      // console.log(c);
      if (!notInside)
        await arr.push(c);

      // return;
    });

    // console.log('cardddd', arr);

    updateCard(arr, sum).then(() => {
      resolve(arr);

    });
  });

};
export const addToCard = (_id) => {
  return new Promise(async function (resolve, reject) {
    await getData(`${ApiUrl}/product/f/${_id}`, {}, true)
      .then(async (data) => {
        let mainD = await data["data"];
        let {card} = await store.getState().store;
        if (!card) {
          card = [];
        }
        // let card = [];
        let sum = 0;
        let found = false;
        await card.map(async (item) => {
          if (item.salePrice) {
            sum += (item.salePrice * item.count);

          } else if (item.price && !item.salePrice) {
            sum += (item.price * item.count);
          }
          if (item._id === _id) {
            found = true;
            item.count = item.count++;
          }
          return;
        });
        if (!found) {
          await card.push({...mainD, count: 1});
          if (mainD.salePrice) {
            sum += (mainD.salePrice);

          } else if (mainD.price && !mainD.salePrice) {
            sum += (mainD.price);
          }
        }
        // console.log('sum');
        // console.log(card);
        // console.log(sum);
        await SaveData({card, sum});

        await resolve(card);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};
export const loveIt = (_id) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/product/like/` + _id, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const createLink = () => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/link`, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const createOrder = (obj) => {
  return new Promise(function (resolve, reject) {
    let packaged = [];
    if (obj.card) {
      obj.card.map((cc) => {
        packaged.push({
          "product_id": cc._id,
          "product_name": cc.title.fa,
          "price": cc.salePrice || cc.price,
          "quantity": cc.count,
          "total_price": cc.count * (cc.salePrice || cc.price)
        });
      });
    }
    let the_order = {
      // "click_trans_id": 14566027,
      "amount": obj.total || obj.sum,
      // "total": obj.sum,
      "package": packaged
    };
    // console.log(the_order);

    // return 0;
    postData(`${ApiUrl}/order/createByCustomer`, {...obj, ...the_order}, true)
      .then((data) => {
        let mainD = data["data"];

        // if (mainD && mainD.success) {
        //   savePost({card: []});
        //
        // }
        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getOrder = (obj) => {
  return new Promise(function (resolve, reject) {
    getData(`${ApiUrl}/order/view/${obj}`, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const sendSms = (obj) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/sms`, obj, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const buy = (_id, obj = {}, price = 0) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/transaction/buy/${_id}/` + (price != 0 ? price : ''), obj, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const buyWithClick = (_id, obj = {}) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/transaction/buywithclick/${_id}`, obj, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const sendPaymePrepare = (obj = {}) => {
  // 60df08856508de80a7a07ada
  return new Promise(function (resolve, reject) {
    postData(`https://test.paycom.uz`, obj, false, {
      "content-type": "application/x-www-form-urlencoded",
      "authority": "checkout.paycom.uz",
      "Access-Control-Allow-Origin": "*",
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
    }, true)
      .then((data) => {
        let mainD = data["data"];
        // console.log('mainD', mainD);
        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const updateTransaction = (_id, obj = {}) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/transaction/update/${_id}`, obj, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const getPost = (i) =>
  getData(`${ApiUrl}/product/${i}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
    });
export const getBlogPost = (i) =>
  getData(`${ApiUrl}/post/${i}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
    });

export const getPage = (i) =>
  getData(`${ApiUrl}/page/${i}`, {}, true)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      handleErr(err);
    });

export const getContactData = (i) => {
  return new Promise(function (resolve, reject) {
    getData(`${ApiUrl}/course/getContactData/${i}`, {}, true)
      .then((data) => {
        resolve(data["data"]);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};

export const uploadMedia = (file = {}, onUploadProgress, id) => {
  return new Promise(function (resolve, reject) {

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", file.type);

    let cancel;

    const config = {
      headers: {
        "content-type": "multipart/form-data",
        token: store.getState().store.token
      },
      cancelToken: new axios.CancelToken((c) => {
        cancel = c;
      }),
      onUploadProgress: (ev) => {
        const percent = (ev.loaded / ev.total) * 100;
        onUploadProgress(percent, id, cancel);
      }
    };
    return axios
      .post(`${AdminRoute}/media/fileUpload`, formData, config)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        console.error("err in axios => ", err);
        return reject(err);
      });
  });

};

export const CameFromPost = (bool) => {
  return new Promise(async function (resolve, reject) {
    await SaveData({CameFromPost: bool});
    await resolve(true);
  });
};

export const enableAgent = (enableAgent) => {
  return new Promise(async function (resolve, reject) {
    await SaveData({enableAgent: enableAgent});
    window.location.replace("/make-money");

    await resolve(true);
  });
};

export const enableAdmin = (enableAdmin) => {
  return new Promise(async function (resolve, reject) {
    await SaveData({enableAdmin: enableAdmin});

    await resolve(true);
  });
};
export const enableSell = (enableSell) => {
  return new Promise(async function (resolve, reject) {
    await SaveData({enableSell: enableSell});
    window.location.reload();
    await resolve(true);
  });
};
export const updateAgent = (agent_id, link_id) => {
  return new Promise(async function (resolve, reject) {
    // console.log('agent_id', agent_id);
    await SaveData({agent: agent_id, link: link_id});
    await resolve(true);
  });
};
export const goToProduct = (bool) => {
  return new Promise(async function (resolve, reject) {
    // console.log('set goToProduct ' + bool);
    await SaveData({goToProduct: bool});
    await resolve(true);
  });
};
export const setLanguage = (lan) => {
  return new Promise(async function (resolve, reject) {
    SaveData({lan: "fa"});
  });
};
export const setCountry = (country, d = true) => {
  return new Promise(async function (resolve, reject) {
    await SaveData({country: country});
    if (d) await window.location.reload();
  });
};
export const setCat = (cat, d = true) => {
  return new Promise(async function (resolve, reject) {
    await SaveData({cat: cat});
    if (d) await window.location.reload();
  });
};
export const addToDataArray = (obj) => {
  return new Promise(async function (resolve, reject) {
    let arr = (await store.getState().store.allPostData) || {};
    arr[obj.name] = obj.value;
    await SaveData({allPostData: arr});
  });
};
export const pushArrayToDataArray = (obj) => {
  return new Promise(async function (resolve, reject) {
    let arr = (await store.getState().store.allPostData) || {};

    if (arr[obj.name] && arr[obj.name].length) {
      if (!arr[obj.name].includes(obj.value)) arr[obj.name].push(obj.value);
      else {
        const index = arr[obj.name].indexOf(obj.value);
        if (index > -1) {
          arr[obj.name].splice(index, 1);
        }
      }
      // console.log('arr[obj.name] exist',arr[obj.name]);
    } else {
      arr[obj.name] = [obj.value];
    }
    await SaveData({allPostData: arr});
  });
};
export const savePost = (obj) => SaveData({...obj});

export const toggleSidebar = (menuVisible) =>
  SaveData({menuVisible: !menuVisible});
export const toggleSearch = (searchvisible) => {

  SaveData({searchvisible: !searchvisible});
  if (searchvisible) {

    // let themobilesearch = document.getElementById('themobilesearch');
    // if (themobilesearch) {
    //   console.log('focus',themobilesearch);
    //   // themobilesearch.focus();
    // }

  }
};
export const toggleCardbar = (cardVisible) =>
  SaveData({cardVisible: !cardVisible});

export const saveCountryPost = (obj) => {
  const {countries, mainCountryList, mainCountry, countryChoosed} = obj;

  SaveData({
    countries,
    mainCountryList,
    mainCountry,
    countryChoosed
  });
};

export const clearPost = () =>
  SaveData({
    mainList: [],
    mainCategory: {},
    files: [],
    catChoosed: [],
    title: "",
    description: "",
    countryChoosed: [],
    mainCountryList: [],
    mainCountry: {},
    countries: [],
    price: "",
    type: "",
    virtual: "",
    categories: []
  });

export const clearPP = (obj) => {
  return new Promise(async function (resolve, reject) {
    SaveData({...obj});

    await resolve({});
  });
};
export const submitPost = () => {
  let {
    mainCategory,
    catChoosed,
    mainList,
    categories,
    mainCountry,
    countryChoosed,
    mainCountryList,
    countries,
    description,
    title,
    files,
    _id,
    country,
    type,
    price,
    allPostData
  } = store.getState().store;

  let req = {
    description,
    title,
    mainCategoryId: mainCategory,
    mainCategory: mainCategory,
    catChoosed,
    mainList,
    categories,
    // mainCountry: mainCountry,
    // countryChoosed: countryChoosed,
    // mainCountryList: mainCountryList,
    // countries: countries,
    // country:country,

    firstCategory: catChoosed[0],
    secondCategory: catChoosed[1],
    thirdCategory: catChoosed[2],
    files,
    price
  };

  return new Promise(function (resolve, reject) {
    // console.log('hytrfgh', mainCategory);

    if (mainCategory && mainCategory._id) {
      if (_id) {
        putData(`${ApiUrl}/course/${_id}`, req, true)
          .then((data) => {
            let mainD = data["data"];

            SaveData({
              description: "",
              title: "",
              mainCategory: {},
              categories: [],
              mainList: [],
              catChoosed: [],
              price: ""
            });

            // }
            resolve(mainD);
          })
          .catch((err) => {
            // console.log('sdf', err);
            handleErr(err);
            reject(err);
          });
      } else {
        postData(
          `${ApiUrl}/post`,
          {
            description,
            title,
            mainCategoryId: mainCategory,
            mainCategory,
            catChoosed,
            mainList,
            categories,
            firstCategory: catChoosed[0],
            secondCategory: catChoosed[1],
            thirdCategory: catChoosed[2],
            mainCountry,
            countryChoosed,
            mainCountryList,
            countries,
            country,
            files,
            type,
            price,
            data: allPostData
          },
          true
        )
          .then((data) => {
            let mainD = data["data"];

            SaveData({
              description: "",
              title: "",
              mainCategory: {},
              categories: [],
              mainList: [],
              catChoosed: [],
              price: "",
              allPostData: {}
            });

            // }
            resolve(mainD);
          })
          .catch((err) => {
            // console.log('sdf', err);
            handleErr(err);
            reject(err);
          });
      }
    } else {
      reject({
        success: false
      });
    }
  });
};
export const deleteModel = (model, id) => {
  let _id = id;

  if (!id) _id = store.getState().store._id;

  return new Promise(function (resolve, reject) {
    if (_id) {
      deleteAdminData(`${AdminRoute}/${model}/${_id}`, true)
        .then((data) => {
          let mainD = data["data"];

          // SaveData({
          //   description: "",
          //   title: "",
          //   mainCategory: {},
          //   categories: [],
          //   mainList: [],
          //   catChoosed: []
          // });

          // }
          resolve(mainD);
        })
        .catch((err) => {
          // console.log('sdf', err);
          handleErr(err);
          reject(err);
        });
    } else {
      reject({
        success: false
      });
    }
  });
};

export const register = (number, fd, method = "sms") => {
  let {user} = store.getState().store;
  return postData(`${ApiUrl}/customer/authCustomer`, {phoneNumber: number, countryCode: fd, method: method})
    .then(({data}) => {
      user = {...user, ...{phoneNumber: number, countryCode: fd}};
      if (data.success) SaveData({user: user});

      return data;
    })
    .catch((err) => {
      // console.log('sdf', err);
      handleErr(err);
      return err;
    });
};
export const loginAdmin = (username, password) => {
  console.log('loginAdmin')
  return new Promise(function (resolve, reject) {

    let {admin} = store.getState().store;
    postData(`${AdminRoute}/admin/login`, {identifier: username, password: password})
      .then(({data}) => {
        if (data && data.user) {
          admin = {...admin, ...{username: username, admin_token: data.user.token}};
          if (data.success) SaveData({admin: admin});
        }
        return resolve(data);
      })
      .catch((err) => {
        // console.log('sdf', err);
        // handleErr(err);
        return reject(err);
      });
  });
};
export const authCustomerForgotPass = (number, fd, method = "sms") => {
  let {user} = store.getState().store;
  return postData(`${ApiUrl}/customer/authCustomerForgotPass`, {phoneNumber: number, countryCode: fd, method: method})
    .then(({data}) => {
      user = {...user, ...{phoneNumber: number, countryCode: fd}};
      if (data.success)
        SaveData({user: user});

      return data;
    })
    .catch((err) => {
      // console.log('sdf', err);
      handleErr(err);
      return err;
    });
};

export const setPassWithPhoneNumber = (data) => {
  return new Promise(function (resolve, reject) {
    let {user} = store.getState().store;
    postData(`${ApiUrl}/customer/setPassword`, data, true)
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success) {
          user = {...user, ...mainD.customer};

          SaveData({
            // phoneNumber: mainD.customer.phoneNumber,
            user: user
            // token: mainD.customer.token,
          });
        }
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};
export const updateAddress = (data) => {
  return new Promise(function (resolve, reject) {
    let {user} = store.getState().store;
    let {address} = store.getState().store;
    if (!address) {
      address = [];
    }
    address.push(data);
    putData(`${ApiUrl}/customer/updateAddress`, {address: address}, true)
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success) {
          user = {...user, ...mainD.customer.address};
          SaveData({
            // phoneNumber: mainD.customer.phoneNumber,
            address: mainD.customer.address,
            user: user
          });
        }
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};
export const sendComment = (id, data) => {
  return new Promise(function (resolve, reject) {
    postData(`${ApiUrl}/comment/` + id, data, true)
      .then((data) => {
        let mainD = data["data"];
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};
export const getComments = (id) => {
  console.log("getComments====>");
  return new Promise(function (resolve, reject) {
    getData(`${ApiUrl}/comment/` + id, false)
      .then((data) => {
        let mainD = data["data"];
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};
export const getTheSettings = () => {
  return new Promise(function (resolve, reject) {

    getData(`${ApiUrl}/settings`, {}, true)
      .then((data) => {
        let mainD = data["data"];
        // if (mainD.success) {
        // console.log('data', data);
        SaveData({
          // phoneNumber: mainD.customer.phoneNumber,
          settings: []
        });
        // }
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};
export const getTheChaparPrice = (destination = 0, value = 0, weight = 1) => {
  return new Promise(function (resolve, reject) {
    const formData = new FormData();
    formData.append("input", "{\n" +
      "   \"order\":{\n" +
      "      \"origin\":\"10866\",\n" +
      "      \"destination\":\"" + destination + "\",\n" +
      "      \"method\":\"11\",\n" +
      "      \"value\":\"" + value + "\",\n" +
      "      \"weight\":\"" + weight + "\"\n" +
      "   }\n" +
      "}");
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };
    return axios
      .post(`https://api.krch.ir/v1/get_quote`, formData, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        console.error("err in axios => ", err);
        reject(err);
      });

  });
};
export const changeAddressArr = (data) => {
  return new Promise(function (resolve, reject) {
    let {user} = store.getState().store;
    putData(`${ApiUrl}/customer/updateAddress`, {address: data}, true)
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success) {
          user = {...user, ...mainD.customer.address};
          SaveData({
            // phoneNumber: mainD.customer.phoneNumber,
            address: mainD.customer.address,
            user: user
          });
        }
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};

export const authCustomerWithPassword = (data) => {
  // console.log('==> authCustomerWithPassword()');
  return new Promise(function (resolve, reject) {
    let {user} = store.getState().store;
    postData(`${ApiUrl}/customer/authCustomerWithPassword`, data)
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success) {
          user = {...user, ...mainD.customer};
          SaveData({
            address: mainD.customer.address,
            user: user
          });
        }
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};

export const submitProfile = (obj) => {
  return new Promise(function (resolve, reject) {
    let {user} = store.getState().store;

    putData(`${ApiUrl}/customer`, obj, true)
      .then((data) => {
        let mainD = data["data"];
        if (mainD.success) {
          user = {...user, ...obj};
          SaveData({user: user});
        }
        resolve(mainD);
      })
      .catch((err) => {
        // console.log('sdf', err);
        handleErr(err);
        reject(err);
      });
  });
};

export const active = (req) => {

  return postData(`${ApiUrl}/customer/activateCustomer`, req)
    .then(({data = {}}) => {
      let {user} = store.getState().store;
      // console.log('data', data);
      if (data.success) {
        const {token, address, firstName, lastName, invitation_code, internationalCode, _id} = data;
        user = {
          ...user, ...{
            token: token,
            address: address,
            firstName: firstName,
            lastName: lastName,
            invitation_code: invitation_code,
            internationalCode: internationalCode,
            _id: _id
          }
        };

        SaveData({user: user, address: address});
      }

      return data;
    })
    .catch((err) => {
      handleErr(err);
    });
};

export const arrayMin = (arr) => {
  if (arr && arr.length > 0)
    return arr.reduce(function (p, v) {
      return (p < v ? p : v);
    });
};


export const checkCodeMeli = (code) => {
  if (!code) return;
  let L = code.length;

  if (L < 8 || parseInt(code, 10) == 0) return false;
  code = ("0000" + code).substr(L + 4 - 10);
  if (parseInt(code.substr(3, 6), 10) == 0) return false;
  let c = parseInt(code.substr(9, 1), 10);
  let s = 0;
  for (let i = 0; i < 9; i++)
    s += parseInt(code.substr(i, 1), 10) * (10 - i);
  s = s % 11;
  return (s < 2 && c == s) || (s >= 2 && c == (11 - s));
  return true;
};
