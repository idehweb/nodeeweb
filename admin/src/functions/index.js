import authProvider from './authProvider';
import theme from './theme';
import moment from 'jalali-moment';
import data from './dataProvider';
import {useTranslate} from 'react-admin';
// import {MainUrl, savePost} from "../../../main/src/client/functions";
import API from "./API";
import API_BASE_URL from "./API_BASE_URL";
import axios from 'axios';

const ADMIN_ROUTE = window.ADMIN_ROUTE;
export const MainUrl = window.BASE_URL;
const dataProvider = data(ADMIN_ROUTE);

export {dataProvider, authProvider, theme};
export const ItemTypes = {
  KNIGHT: 'knight'
}
export const getDays = (startDate, endDate)=> {
  let dates = [];
  if(startDate){
    let currDate = moment(startDate).startOf('day');
    let lastDate = moment(new Date()).startOf('day');

    while(currDate.add(1, 'days').diff(lastDate) <= 0) {
      dates.push(currDate.clone().toDate());
    }
    if(endDate){
      dates = []
      let currDate = moment(startDate).startOf('day');
      let lastDate = moment(endDate).startOf('day');

      while(currDate.add(1, 'days').diff(lastDate) <= 0) {
        dates.push(currDate.clone().toDate());
      }
    }
  }

  return dates;
};

export const jToM = (date) =>{
  const newDate = moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
  console.log('newDateeeeeee',newDate);
  return  newDate;
}
export const dateFormat = (d, f = 'YYYY/MM/DD HH:mm') => {
    // console.log('d', d);
    if (d)
        var t = moment(d, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa').format(f);
    if (t)
        return t;
    else return false;
}
export const dateFormatter = (date) => {
  return dateFormat(new Date(date), "YYYY/MM/DD");
};
export const numberWithCommas = (x) => {
    if (x)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_LOCALE = 'CHANGE_LOCALE';
export const CHANGE_THEMEDATA = 'CHANGE_THEMEDATA';

export const changeTheme = (theme) => ({
    type: CHANGE_THEME,
    payload: theme,
});
export const unicID = () => {
  let abc = "abcdefghijklmnopqrstuvwxyz1234567890".split("");
  var token = "";
  for (let i = 0; i < 32; i++) {
    token += abc[Math.floor(Math.random() * abc.length)];
  }
  return token;
};
export const changeLocale = (locale) => {
    console.log('changeLocale',locale);
    return({
    type: CHANGE_LOCALE,
    payload: locale,
})};
export const changeThemeDataFunc = () => {
    console.log('changeThemeDataFunc');
  return new Promise(function (resolve, reject) {
    let c = [];
    API_BASE_URL.get("/theme/").then(({data = {}}) => {

      resolve(data)
    })
      .catch(err => {
        reject(err);
      });
  });


};
export const restartSystem = () => {
  return new Promise(function (resolve, reject) {
    API.post(`/settings/restart`, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const upgradeSystem = () => {
  return new Promise(function (resolve, reject) {
    API.post(`/settings/update`, {}, true)
      .then((data) => {
        let mainD = data["data"];

        resolve(mainD);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export const changeThemeData = (payload) => {
console.log('changeThemeData')
      return ({
        type: CHANGE_THEMEDATA,
        payload: payload,
      })


};
export const SaveBuilder = (model, _id = null, data, headers) => {
    return new Promise(function (resolve, reject) {
        let c = [];
        API.put("/"+model+"/" + _id, JSON.stringify(data))
            .then(({data = {}}) => {
                // let mainD = data["data"];

                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
};
export const GetBuilder = (model,_id) => {
    console.log('GetBuilder()==>',_id)

    return new Promise(function (resolve, reject) {
        let c = [];
        API.get("/"+model+"/" + _id).then(({data = {}}) => {
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
    API.get(url, {params}, true)
      .then((data) => {
        resolve(data.data);
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
        token: localStorage.getItem('token')
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
      .post(`${ADMIN_ROUTE}/media/fileUpload`, formData, config)
      .then((res) => {
        return resolve(res.data);
      })
      .catch((err) => {
        console.error("err in axios => ", err);
        return reject(err);
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
    API.get(url, {params}, true)
      .then((data) => {
        resolve(data.data);
      })
      .catch((err) => {
        handleErr(err);
        reject(err);
      });
  });
};

const old = Number.prototype.toLocaleString;
Number.prototype.toLocaleString = function (locale) {
    const translate=useTranslate();
  let result = old.call(this, locale);
  if (locale === 'fa-IR') {
    result = result.replace(/\٬/g, ",‬");
  }
  return result + ' '+translate('pos.currency.toman');
};