// Layout Types
import { DefaultLayout,Nohf } from "#c/layouts/index";

import Home, { HomeServer, HomeServerArgument } from "#c/views/Home";
import Post, { PostServer, PostServerArgument } from "#c/views/Post";
import Product, { ProductServer, ProductServerArgument } from "#c/views/Product";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    element: Home,
    server: HomeServer,
    params: HomeServerArgument
  },
  {
    path: "/product/:_id/:title",
    layout: DefaultLayout,
    exact: true,
    element: Product,
    server: ProductServer,
    params: ProductServerArgument
  },
  {
    path: "/product/:_id/:title/:bowl",
    layout: DefaultLayout,
    exact: true,
    element: Product,
    server: ProductServer,
    params: ProductServerArgument
  },
  {
    path: "/post/:_id/:title",
    layout: DefaultLayout,
    exact: true,
    element: Post,
    server: PostServer,
    params: PostServerArgument
  },
  {
    path: "/post/:_id/:title/:bowl",
    layout: DefaultLayout,
    exact: true,
    element: Post,
    server: PostServer,
    params: PostServerArgument
  },
  {
    path: "/wizard",
    layout: Nohf,
    exact: true,
    element: Post,
    server: PostServer,
    params: PostServerArgument
  },
  {
    path: "/:_id",
    layout: DefaultLayout,
    exact: true,
    element: Post,
    server: PostServer,
    params: PostServerArgument
  },
  {
    path: '/:_firstCategory/:_product_slug',
    layout: DefaultLayout,
    exact: true,
    element: Product,
    server: ProductServer,
    params: ProductServerArgument
  },
];
