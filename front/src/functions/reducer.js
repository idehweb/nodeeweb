console.log('#f reducer');
import {combineReducers} from "redux";
import Types from "./types";
// import {getAllSidebarCategoriesData} from '#c/functions/index';

const initialState = {
    menuVisible: false,
    data: {},
    loading: true,
    searchvisible: false,
    address: [],
    settings: [],
    billingAddress: {},
    allCategories: [],
    cat: "",
    siteStatus: {},
    siteStatusMessage: "",
    // billingAddresses:[],
    // shippingAddress:{},
    // shippingAddresses:[],
    user: localStorage.getItem('user') || {},
    admin: {},
    productSliderData: [],
    postSliderData: [],
    product: {},
    post: {},
    page: {},
    sum: 0,
    attr: "",
    value: "",
    postCardMode: "grid",
    defaultSort: "datedesc",
    themeData: {},
    homeData: {}
    // phoneNumber: null,
    // firstName: '',
    // lastName: '',
    // token: null,
};

const reducer = (state = initialState, {type, data, payload}) => {
    // console.log('dispatch type:',type);
    // console.log('dispatch state:',state);
    // console.log('dispatch payload:',payload);

    switch (type) {
        case Types.Home: {
          console.log("Types.Home",state);

          return Object.assign({}, state, {
            data: {},
            loading: true
          });
        }
        case Types.Receive: {
          console.log("Types.Receive",state);

          return Object.assign({}, state, {
            data,
            loading: false
          });
        }
        case Types.Error: {
          console.log("Types.Error",state);

          return Object.assign({}, state, {
            loading: false
          });
        }
        case Types.SaveData: {
            console.log("Types.SaveData",state);
            return Object.assign({}, state, data);
        }
        case "cats/catsLoaded": {
            console.log('dispatch',"cats/catsLoaded");

            // Replace the existing state entirely by returning the new value
            return {...state, allCategories: payload.allCategories, cat: payload.cat, searchvisible: false};
        }
        case "theme/themeLoaded": {
            console.log("theme/themeLoaded");

            return {...state, themeData: payload.themeData};
        }
        // case "data/homeLoaded": {
        //     console.log("data/homeLoaded");
        //
        //     return {...state, homeData: payload.homeData};
        // }
        case "site/status": {
            return {
                ...state,
                siteStatus: payload.success,
                siteStatusMessage: payload.siteStatusMessage,
                activeCategory: payload.activeCategory
            };
        }
        case "STORE_ATTR_VALUE": {
            return {
                ...state,
                attr: payload.attr,
                value: payload.value
            };
        }
        case "STORE_PRODUCTS": {
            initialState.productSliderData[payload.id] = payload.data;

            return {...state, productSliderData: initialState.productSliderData};
        }
        case "STORE_POSTS": {
            if (payload.data)
            // console.log('xxxx',payload.data.length,payload.id);
                initialState.postSliderData[payload.id] = payload.data;

            return {...state, postSliderData: initialState.postSliderData};
        }
        case "STORE_PRODUCT": {

            initialState.product = payload.data;

            return {...state, product: initialState.product};
        }
        case "persist/REHYDRATE": {
          // initialState.product = payload;

           if(payload) {
            delete payload.store.themeData;
             console.log('************* persist/REHYDRATE ************',state,payload.store)

             return {...state, ...payload.store};
           }
        }
        default:
            return state
    }
};

export default combineReducers({
    store: reducer
});
