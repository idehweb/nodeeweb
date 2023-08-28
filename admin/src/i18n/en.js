import englishMessages from 'ra-language-english';

console.log('running english language...');

const customEnglishMessages = {
  ...englishMessages,
  websiteName: 'Gameboss',
  direction: 'ltr',
  _id: '_id',
  lan: 'en',
  dir: 'ltr',
  comma: ',',
  logout: 'logout',
  logoutMessage: 'Are you sure to logout?',
  sign_out: 'yes, sign out',

  undefined: 'undefined',
  pos: {
    profile: 'profile',
    logout: 'logout',

    title: 'title',
    search: 'search',
    configuration: 'configuration',
    language: 'language',
    theme: {
      name: 'theme',
      light: 'light',
      dark: 'dark',
    },

    menu: {
      category: 'category',
      discount: 'discount',
      addDiscount: 'add discount',
      allDiscounts: 'all discounts',
      allGateways: 'all gateways',
      addGateway: 'add gateway',
      allEntries: 'all entries',
      addEntry: 'add entry',
      addForm: 'add form',
      allForms: 'all forms',
      forms: 'forms',
      restart: 'restart',
      shop: 'shop',
      notification: 'notification',
      allNotification: 'all notifications',
      allCustomerGroup: 'all customer groups',
      addCustomerGroup: 'add customer group',
      sendNotification: 'send notification',
      templates: 'templates',
      createPage: 'create page',
      allPage: 'all pages',
      dashboard: 'dashboard',
      sections: 'sections',
      attributes: 'attributes',
      addAttribute: 'add attribute',
      allAttributes: 'all attributes',
      allMenus: 'all menus',
      addMenu: 'add menu',
      addCategory: 'add category',
      allCategories: 'all categories',
      categories: 'categories',
      medias: 'medias',
      addMedia: 'add media',
      allMedias: 'all medias',
      products: 'products',
      addProduct: 'add product',
      allProducts: 'all products',
      allOrders: 'all orders',
      cart: 'shopping cart',
      addOrder: 'add order',
      addCustomer: 'add customer',
      createPost: 'create post',
      customers: 'customers',
      allCustomers: 'all customers',
      orders: 'orders',
      transactions: 'transactions',
      addTransaction: 'add order',
      allTransactions: 'all transactions',
      allSms: 'all Messages',
      sendSms: 'send SMS',
      sms: 'SMS',
      post: 'Post/Page',
      posts: 'Posts/Pages',
      allPost: 'All Posts/Pages',
      more: 'more',
      users: 'users',
      allUsers: 'all users',
      addUser: 'add user',
      plugin:'plugin',
      addPlugin:'add plugin',
      localPlugins:'local plugins',
      siteActions: 'Site activities',
      siteSettings: 'site settings',
      settings: 'settings',
      actions: 'actions',
    },
    currency: {
      toman: 'toman',
      rial: 'rial',
      dollar: '$',
    },
    paymentStatus: {
      SuccessfulOperation: 'Successful operation',
      CanceledByTheUser: 'Canceled by the user',
      UnsuccessfulPayment: 'Unsuccessful payment',
      ExcessiveEffortInAShortPeriodOfTime:
        'Excessive effort in a short period of time',
      ValidationError: 'Validation error',
      PaidApproved: 'Paid approved',
      PaidNotApproved: 'Paid not approved',
      InternalError: 'Internal error',
      WaitingForPayment: 'Waiting for payment',
    },
    OrderPaymentStatus: {
      notpaid: 'not paid',
      unsuccessful: 'unsuccessful',
      paid: 'paid',
    },
    OrderStatus: {
      cart: 'cart',
      checkout: 'checkout',
      processing: 'processing',
      indoing: 'indoing',
      makingready: 'makingready',
      inpeyk: 'inpeyk',
      complete: 'complete',
      cancel: 'cancel',
    },
  },
  resources: {
    menu: {
      name: 'name',
      slug: 'slug',
      link: 'link',
      order: 'order',
    },
    dashboard: {
      monthly_revenue: 'Monthly Revenue',
      month_history: '30 Day Revenue History',
      new_orders: 'New Orders',
      pending_reviews: 'Pending Reviews',
      all_reviews: 'See all reviews',
      new_customers: 'New Customers',
      all_customers: 'See all customers',
      pending_orders: 'Pending Orders',
      order: {
        items:
          'by %{customer_name}, one item |||| by %{customer_name}, %{nb_items} items',
      },
      welcome: {
        hi: 'Hi',
        title: 'Welcome to the admin panel',
        subtitle:
          "This is the admin of an imaginary poster shop. Feel free to explore and modify the data - it's local to your computer, and will reset each time you reload.",
        ra_button: 'react-admin site',
        demo_button: 'Source for this demo',
      },
      yourActions: 'your actions',
      priceAnnLast30Days: 'Income for the last 30 days',
      countOrdersSuccess30Days:
        'Number of successful orders in the last 30 days',
      countUsers: 'number of users',
      dollarPrice: 'price of Dollar',
      orders: 'orders',
      countAnnLast30Days: 'Revenue in the last 30 days',
      countPayedLast30Days: 'Number of successful payments in the last 30 days',
    },
    notification: {
      customerGroup: 'customer group',
      source: 'source',
      phoneNumber: 'phone number',
      limit: 'limit',
      offset: 'offset',
      message: 'message',
    },
    customers: {
      _id: '_id',
      countryCode: 'countryCode',
      phoneNumber: 'phone number',
      activationCode: 'activation code',
      firstName: 'first name',
      lastName: 'last name',
      email: 'email',
      companyName: 'company name',
      companyTelNumber: 'company tel number',
      birthdate: 'birthday',
      male: 'male',
      female: 'female',
      sex: 'sex',
      source: 'source',
      WEBSITE: 'WEBSITE',
      CRM: 'CRM',
      internationalCode: 'international code',
      createdAt: 'created at',
      updatedAt: 'updated at',
      active: 'active/deactive',
      customerGroup: 'customer group',
      message: 'message',
      actions: 'actions',
    },
    user: {
      _id: '_id',
      countryCode: 'countryCode',
      phoneNumber: 'phone number',
      activationCode: 'activation code',
      firstName: 'first name',
      lastName: 'last name',
      email: 'email',
      internationalCode: 'international code',
      createdAt: 'created at',
      updatedAt: 'updated at',
      active: 'active/deactive',
      nickname: 'nickname',
      password: 'password',
      username: 'username',
      firstName: 'firstname',
      lastName: 'lastname',
    },

    attributes: {
      slug: 'slug',
      name: 'attribute name',
      values: 'values',
      type: 'type',
      metatitle: 'meta title',
      metadescription: 'meta description',
      useInFilter: 'filter',
      normal: 'normal',
      color: 'color',
    },
    category: {
      menu_label: 'categories',
      slug: 'slug',
      name: 'category name',
      values: 'values',
      parent: 'parent category',
      order: 'order (sort)',
      addxpercent: 'Add X percent',
      minusxpercent: 'Subtract X percent',
      addxprice: 'Add X amount',
      minusxprice: 'Subtract X amount',
    },
    order: {
      orderNumber: '#',
      customerData: 'customer data',
      customer: 'customer',
      total: 'total',
      paid: 'paid',
      status: 'status',
      sum: 'total items',
      amount: 'total',
      amountToPay: 'amount you want to pay',
      paymentStatus: 'payment status',
      date: 'date',
      createdAt: 'created at',
      updatedAt: 'updated at',
      customerFirstName: 'customer first name',
      customerLastName: 'customer last name',
      allOrders: 'all orders',
      processing: 'processing',
      confirmed: 'confirmed',
      makingready: 'making ready',
      inpeyk: 'sent',
      complete: 'completed',
      canceled: 'canceled',
      orderNumberOrMobileNumber: 'order number or mobile number',
    },
    post: {
      actions: 'actions',
      pagebuilder: 'page builder',
      firstCategory: 'first category',
      secondCategory: 'second category',
      thirdCategory: 'third category',
      search: 'post name...',
      category: 'category',
      image: 'image',
      title: 'title',
      excerpt: 'excerpt',
      description: 'description',
      price: 'price',
      salePrice: 'sale price',
      label: 'label',
      labels: 'labels',
      story: 'story',
      miniTitle: 'Short title',
      type: 'type',
      photo: 'photo',
      extra_attr: 'extra attributes',
      sources: 'Robot Sources',
      status: 'status',
      processing: 'processing',
      published: 'published',
      deleted: 'deleted',
      addAttr: 'add attribute',
      slug: 'slug',
      createComb: 'create combinations',
      stock: 'stock status',
      quantity: 'quantity',
      combinations: 'combinations',
      url: 'url',
      prices: 'prices',
      date: 'date',
      copy: 'copy',
      createdAt: 'created at',
      updatedAt: 'updated at',
      activities: 'activities',
      viewsCount: 'number of visits',
      updated: 'updated',
      created: 'created',
      categories: 'categories',
      inStock: 'in stock',
      post: 'post',
      page: 'page',
      kind: 'kind',
    },

    product: {
      firstCategory: 'first category',
      secondCategory: 'second category',
      thirdCategory: 'third category',
      search: 'product name...',
      category: 'category',
      image: 'image',
      title: 'title',
      excerpt: 'excerpt',
      description: 'description',
      price: 'price',
      salePrice: 'sale price',
      label: 'label',
      labels: 'labels',
      story: 'story',
      miniTitle: 'Short title',
      type: 'type',
      photo: 'photo',
      extra_attr: 'extra attributes',
      sources: 'Robot Sources',
      status: 'status',
      processing: 'processing',
      published: 'published',
      deleted: 'deleted',
      addAttr: 'add attribute',
      slug: 'slug',
      createComb: 'create combinations',
      stock: 'stock status',
      quantity: 'quantity',
      combinations: 'combinations',
      url: 'url',
      prices: 'prices',
      date: 'date',
      copy: 'copy',
      createdAt: 'created at',
      updatedAt: 'updated at',
      activities: 'activities',
      viewsCount: 'number of visits',
      updated: 'updated',
      created: 'created',
      categories: 'categories',
      inStock: 'in stock',
      outOfStock: 'out of stock',
      normal: 'normal',
      variable: 'variable',
      metadescription: 'meta description',
      metatitle: 'meta title',
      keywords: 'keywords',
      requireWarranty: 'require warrenty',
      is: 'exist',
      isnt: 'not exist',
      weight: 'weight',
      sku: 'SKU',
      count: 'count',
    },
    discount: {
      code: 'code',
      amount: 'amount',
      usageLimit: 'usage limit',
    },
    template: {
      actions: 'actions',
      pagebuilder: 'page builder',
      search: 'search...',
      category: 'category',
      image: 'image',
      title: 'title',
      excerpt: 'excerpt',
      description: 'description',
      label: 'label',
      labels: 'labels',
      type: 'type',
      photo: 'photo',
      status: 'status',
      processing: 'processing',
      published: 'published',
      deleted: 'deleted',
      slug: 'slug',
      url: 'url',
      date: 'date',
      copy: 'copy',
      createdAt: 'created at',
      updatedAt: 'updated at',
      activities: 'activities',
      viewsCount: 'views count',
      updated: 'updated',
      created: 'created',
      categories: 'categories',
      page: 'page',
      post: 'post',
      header: 'header',
      footer: 'footer',
      product: 'product',
      checkout: 'checkout',
      kind: 'kind',
    },
    reviews: {},

    settings: {
      UpdatedSuccessfully: 'Updated successfully',
      home: 'home',
      currentLogo: 'current logo',
      uploadLogo: 'upload logo',
      primaryColor: 'primary color',
      secondaryColor: 'secondary color',
      bgColor: 'background color',
      footerBgColor: 'footer background color',
      textColor: 'text color',
      siteStatus: 'site status',
      activeCategory: 'active categories',
      siteActiveMessage:
        'Message for showing user that site is active/deactive',
      siteActive: 'site status',
      title: 'Title',
      theid: '_id',
      description: 'description',
      city: 'city',
      is_isnt: 'is / is not',
      priceLessThanCondition: 'price less than condition',
      condition: 'condition',
      priceMoreThanCondition: 'price more than condition',
      welcome: 'welcome',
      register: 'register',
      submitOrderNotPaying: 'submit order not paying',
      submitOrderSuccessPaying: 'submit order success paying',
      onSendProduct: 'on send product',
      onGetProductByCustomer: 'on get product by customer',
      submitReview: 'submit review',
      onCancel: 'on cancel',
    },

    action: {
      user: 'user',
      title: 'title',
      customer: 'customer',
      product: 'product',
      phoneNumber: 'phone number',
      firstName: 'first name',
      lastName: 'lastName',
      nickname: 'nickname',
      username: 'username',
      difference: 'differences',
      createdAt: 'created at',
    },

    sms: {
      user: 'user',
      message: 'message',
      status: 'status',
      sender: 'sender',
      receiver: 'receiver',
      updatedAt: 'updated at',
      createdAt: 'created at',
      phoneNumber: 'phoneNumber',
    },
    transaction: {
      date: 'date',
      amount: 'amount',
      statusCode: 'status code',
      authority: 'authority',
      status: 'status',
      referenceId: 'reference id',
      orderNumber: 'order number',
      updatedAt: 'updated at',
      createdAt: 'created at',
    },
  },
};

export default customEnglishMessages;
