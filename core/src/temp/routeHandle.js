// console.log("#f routeHandle");
import path from 'path';
// const __dirname = path.resolve();
// const publicFolder = path.join(__dirname, "./public");

// import AdminRT from "#routes/admin/index";
import {
  createPublicRoute,
  createRoute,
  returnDefaultModels,
} from '../routes/index.mjs';

// const router = express.Router();

// import BoyRT from "#routes/boy/index";
// import {the_public_route} from "#routes/public/p";

// createDefaultRoute();
let routeHandle = (app, props = {}) => {
  if (props?.front?.routes?.[2]) {
    let PR = createPublicRoute('', props.front.routes);
    app.use('/', PR);
  }

  let temp = [];
  let allRoutes = [],
    roles = [];
  props.entity.forEach((en) => {
    en.routes.forEach((rou) => {
      if (rou.access) {
        let access = rou.access.split(',');
        access.forEach((r) => {
          if (roles.indexOf(r.trim()) == -1) {
            roles.push(r.trim());
          }
        });
      }
      // allRoutes.push(rou);
    });

    // console.log('allRoutes', allRoutes,roles);
    // process.exit(0)
  });
  props.entity.forEach((en) => {
    if (temp.indexOf(en.name) == -1) {
      temp.push(en.name);
      // app.use("/" + en.name, rou.controller);

      if (en && en.routes) {
        // console.log('createRoute', en.modelName)

        let R = createRoute(en.modelName, en.routes, '/customer/');
        // console.log('app.use', "/" + en.name, en.modelName)

        app.use('/customer/' + en.name, R);
        if (props.admin) {
          let R2 = createRoute(en.modelName, en.routes, '/admin/');
          app.use('/admin/' + en.name, R2);
        }
        // let adminPR = createPublicRoute('/admin/',props.theme.routes);
        // let adminPR = createPublicRoute("/admin/", en.routes);

        // app.use("/admin/"+ en.name, adminPR);
      }
    }
  });
  if (props && props.admin && props.admin.routes) {
    // console.log('createAdmin')

    let PR2 = createPublicRoute('', props.admin.routes);
    app.use('/', PR2);
  }
  // console.log('app', app)
  // catch 404 and forward to error handler
  //     app.use(function(req, res, next) {
  //
  //       next(createError(404));
  //     });

  // error handler
  //     app.use(function(err, req, res, next) {
  //       // set locals, only providing error in development
  //       res.locals.message = err.message;
  //       res.locals.error = req.app.get("env") === "development" ? err : {};
  //
  //       // render the error page
  //       res.status(err.status || 500);
  //       if (err.status === 404) {
  //         return res.redirect("/errors");
  //
  //       } else
  //         return res.render("error");
  //     });
  // } else {
  //   app.get("/", function(err, req, res, next) {
  //     console.log("hell");
  //     return res.render({ "index": "s" });
  //   });
  // }

  // list(1);

  function list(id) {
    // console.log('run list...')
    // const path = require('path');

    const defaultOptions = {
      prefix: '',
      spacer: 7,
    };

    const COLORS = {
      yellow: 33,
      green: 32,
      blue: 34,
      red: 31,
      grey: 90,
      magenta: 35,
      clear: 39,
    };

    const spacer = (x) =>
      x > 0 ? [...new Array(x)].map(() => ' ').join('') : '';

    const colorText = (color, string) =>
      `\u001b[${color}m${string}\u001b[${COLORS.clear}m`;

    function colorMethod(method) {
      switch (method) {
        case 'POST':
          return colorText(COLORS.yellow, method);
        case 'GET':
          return colorText(COLORS.green, method);
        case 'PUT':
          return colorText(COLORS.blue, method);
        case 'DELETE':
          return colorText(COLORS.red, method);
        case 'PATCH':
          return colorText(COLORS.grey, method);
        default:
          return method;
      }
    }

    function getPathFromRegex(regexp) {
      return regexp
        .toString()
        .replace('/^', '')
        .replace('?(?=\\/|$)/i', '')
        .replace(/\\\//g, '/');
    }

    function combineStacks(acc, stack) {
      if (stack.handle.stack) {
        const routerPath = getPathFromRegex(stack.regexp);
        return [
          ...acc,
          ...stack.handle.stack.map((stack) => ({ routerPath, ...stack })),
        ];
      }
      return [...acc, stack];
    }

    function getStacks(app) {
      // Express 3
      if (app.routes) {
        // convert to express 4
        return Object.keys(app.routes)
          .reduce((acc, method) => [...acc, ...app.routes[method]], [])
          .map((route) => ({ route: { stack: [route] } }));
      }

      // Express 4
      if (app._router && app._router.stack) {
        return app._router.stack.reduce(combineStacks, []);
      }

      // Express 4 Router
      if (app.stack) {
        return app.stack.reduce(combineStacks, []);
      }

      // Express 5
      if (app.router && app.router.stack) {
        return app.router.stack.reduce(combineStacks, []);
      }

      return [];
    }

    function expressListRoutes(app, opts) {
      // console.log('expressListRoutes')
      const stacks = getStacks(app);
      const options = { ...defaultOptions, ...opts };

      if (stacks) {
        for (const stack of stacks) {
          // console.log('stack');

          if (stack.route) {
            const routeLogged = {};
            for (const route of stack.route.stack) {
              const method = route.method ? route.method.toUpperCase() : null;
              if (!routeLogged[method] && method) {
                const stackMethod = colorMethod(method);
                const stackSpace = spacer(options.spacer - method.length);
                const stackPath = path.resolve(
                  [
                    options.prefix,
                    stack.routerPath,
                    stack.route.path,
                    route.path,
                  ]
                    .filter((s) => !!s)
                    .join('')
                );
                console.info(stackMethod, stackSpace, stackPath);
                routeLogged[method] = true;
              }
            }
          }
        }
      }
    }

    expressListRoutes(app);
    console.log('end at:', new Date());
  }
};
export default routeHandle;
