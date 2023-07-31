export const isSSR = typeof window === "undefined";
export default isSSR
    ? {
        BASE_URL: process.env.BASE_URL,
        SHOP_URL: process.env.SHOP_URL,
        THEME_URL: process.env.THEME_URL,
        FRONT_ROUTE: process.env.BASE_URL + "/customer",
        setting: {
            separator: "|",
            siteName: process.env.SITE_NAME

        }
    }
    : {
        SHOP_URL: window.SHOP_URL,
        defaultImg: window.BASE_URL + "/site_setting/img/not-found.png",
        BASE_URL: window.BASE_URL,
        FRONT_ROUTE: window.FRONT_ROUTE,
        THEME_URL: window.THEME_URL,
        setting: {
            separator: "|",
            siteName: process.env.SITE_NAME
        }
    };
