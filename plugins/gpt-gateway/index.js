export default (props) => {
  // _.forEach()
  if (props && props.entity)
    props.entity.map((item, i) => {
      if (item.name === "gateway")
        if (item.routes)
          item.routes.push({
            path: "/chatgpt/chat/",
            method: "post",
            access: "customer_all",
            controller: (req, res, next) => {
              console.log("req", req.body);
              let verify = {};
              req
                .httpRequest({
                  method: "post",
                  url: "https://idehweb.com/chatgpt/index.php",
                  data: {
                    text: req.body.text,
                    username: req.body.username || "",
                  },
                  json: true,
                })
                .then(function (parsedBody) {
                  if (!parsedBody["data"]) {
                    return res.json({
                      success: false,
                      message: "",
                    });
                  }
                  return res.json(parsedBody["data"]);
                })
                .catch((e) => res.json({ e, requ: verify }));
            },
          });
      // }
    });
  // props['plugin']['gpt-gateway'] = [
  //   { name: 'merchant', value: '', label: 'merchant code' },
  // ];

  return props;
};
