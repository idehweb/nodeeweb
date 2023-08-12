import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import busboy from 'connect-busboy';
import path from 'path';
import _ from 'lodash';
import expressSitemapXml from 'express-sitemap-xml';
import siteMapHandle from '../app/siteMapHandle.mjs';

const __dirname = path.resolve();

const filesFolder = path.join(__dirname, './files');
const adminFolder = path.join(__dirname, './admin');
const themeFolder = path.join(__dirname, './theme');

let configHandle = async (express, app, props = {}) => {
  await siteMapHandle(express, app, props);
  await app.use(expressSitemapXml(getUrls, process.env.BASE_URL));
  async function getUrls() {
    let g = [];
    for (var i = 0; i < props.entity.length; i++) {
      if (props.entity[i].sitemap) {
        let Model = mongoose.model(props.entity[i].modelName);
        await allAsXml(Model).then(async (d) => {
          console.log('d is here', d.length);
          g = [...g, ...d];
        });
      }
    }

    // Model = mongoose.model('Page');
    //
    // await allAsXml(Model).then(async (d) => {
    //     console.log('d is here', d.length);
    //     g = [...g,...d];
    // });
    await console.log('x', g);
    return await g;
  }
};
export const allAsXml = async function (Model) {
  console.log('allAsXml');
  let XTL = [
      {
        url: '/',
        lastMod: new Date(),
        changefreq: 'hourly',
      },
    ],
    offset = 0,
    search = {};
  return new Promise(async function (resolve, reject) {
    console.log('Promis');
    search['status'] = 'published';
    // console.log('Model', Model)
    Model.find({}, '_id slug updatedAt', function (err, posts) {
      // console.log(err)
      // console.log(posts)
      if (err || !posts.length) {
        console.log('return');
        return resolve(XTL);
      }
      console.log('length', posts.length, XTL.length);
      _.forEach(posts, (p) => {
        // console.log('p',p)
        let the_base = '/' + Model.modelName.toLowerCase();
        if ('page' == Model.modelName.toLowerCase()) {
          the_base = '';
        }
        XTL.push({
          url: the_base + '/' + p.slug + '/',
          lastMod: p.updatedAt,
          id: p._id,
          changefreq: 'hourly',
        });
        // console.log(posts.length + 1, '===', XTL.length);
        if (posts.length + 1 === XTL.length) {
          // console.log('xtl', XTL.length);
          resolve(XTL);
        }
      });
    })
      .skip(offset)
      .sort({ _id: -1 });
    // resolve(XTL)
  });
};
export const allAsXmlRules = async function (Model, slug = null) {
  console.log('allAsXmlRules');
  let f = [],
    counter = 0;
  let XTL = [],
    offset = 0,
    search = {};
  return new Promise(async function (resolve, reject) {
    search['status'] = 'published';
    Model.find(
      {},
      '_id slug updatedAt thumbnail photos status',
      function (err, posts) {
        if (err || !posts.length) {
          // console.log('return')
          return resolve(XTL);
        }
        // console.log('length', posts.length, XTL.length)
        _.forEach(posts, (p) => {
          counter++;
          if (f.indexOf(p.slug) > -1) {
            // console.log('found duplicate',f.indexOf(p.slug));
            //founded
          } else {
            // console.log('found duplicate? ',f.indexOf(p.slug));
            f.push(p.slug);
            let gy = '/' + (slug ? slug : Model.modelName.toLowerCase());

            if (slug == 'page') {
              gy = '';
            }
            console.log('gy', gy, 'slug', p.slug);
            let tobj = {
              id: p._id,
              url: gy + '/' + p.slug + '/',
              lastMod: p.updatedAt,
              changefreq: 'hourly',
            };
            if (p.photos && p.photos[0]) {
              tobj['image:image'] = p.photos[0];
            }
            if (p.thumbnail) {
              tobj['image:image'] = p.thumbnail;
            }
            XTL.push(tobj);
            // console.log(posts.length, '===', XTL.length)
            if (posts.length === counter) {
              // console.log('xtl', counter)
              resolve(XTL);
            }
          }
        });
      }
    )
      .skip(offset)
      .sort({ _id: -1 });
  });
};

export default configHandle;

const updatePublicMediaConfig = function () {
  global.updateFile(
    './files/site_setting/',
    'config.js',
    "window.BASE_URL='" +
      process.env.BASE_URL +
      "';\n" +
      "window.ADMIN_URL='" +
      process.env.ADMIN_URL +
      "';\n" +
      "window.THEME_URL='" +
      process.env.BASE_URL +
      "/theme';\n" +
      "window.ADMIN_ROUTE='" +
      process.env.BASE_URL +
      '/admin' +
      "';\n" +
      "window.SHOP_URL='" +
      process.env.SHOP_URL +
      "';",
    __dirname
  );
};
const updateAdminConfig = function () {
  global.updateFile(
    './admin/site_setting/',
    'config.js',
    "window.BASE_URL='" +
      process.env.BASE_URL +
      "';\n" +
      "window.ADMIN_URL='" +
      process.env.ADMIN_URL +
      "';\n" +
      "window.THEME_URL='" +
      process.env.BASE_URL +
      "/theme';\n" +
      "window.ADMIN_ROUTE='" +
      process.env.BASE_URL +
      '/admin' +
      "';\n" +
      "window.SHOP_URL='" +
      process.env.SHOP_URL +
      "';",
    __dirname
  );
};
