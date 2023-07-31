import React from "react";
import { Card, CardBody, CardHeader, ListGroup, ListGroupItem } from "shards-react";
import { LevelCategoriesData } from "#c/functions/index";
import store from "#c/functions/store";
import { withTranslation } from "react-i18next";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

class SidebarCategories extends React.Component {
  constructor(props) {
    super(props);
    const st = store.getState().store;
    this.state = {
      categories: st.categories,
      mainList: st.mainList,
      mainCategory: st.mainCategory,
      catChoosed: st.catChoosed || []
    };
    if ((st.categories && st.categories.length === 0) || !st.categories)
      this.getCategories();
  }

  getCategories(category = "") {
    let { catChoosed, mainCategory, mainList } = this.state;

    if (!(mainCategory && mainCategory._id && mainList && mainList[0])) {
      let _id = category["_id"];
      if (category && category["back"])
        if (category["parent"]) _id = category["parent"];
        else {
          _id = "";
          delete category["back"];
        }

      LevelCategoriesData(_id).then((categories) => {
        let mainCategory = {};
        if (categories && !categories.length) {
          mainCategory = category;
          console.log("it is empty...", mainCategory);
        }
        if (category) {
          if (catChoosed) catChoosed.push(category);
          else catChoosed = [category];

          //
          categories.reverse();
          categories[categories.length] = { ...category, back: true };
          categories.reverse();
        }

        if (!mainList) mainList = [];

        mainList.push(categories);
        let newCont = categories.forEach((cat) => {
          delete cat.loading;
          delete cat.disabled;
          return cat;
        });
        this.setState({
          categories: newCont,
          mainCategory: mainCategory,
          mainList: mainList,
          catChoosed: catChoosed
        });
      });
    }
  }

  render() {
    let { categories = [], mainCategory } = this.state;
    let { t } = this.props;

    return (
      <Card small={"true"} className="mb-3">
        <CardHeader className="border-bottom">
          <h6 className="m-0">{t("categories")}</h6>
        </CardHeader>
        <CardBody className="p-0">
          <ListGroup flush>
            {categories.map((category, idx) => (
              <ListGroupItem
                className={"px-3 pb-2 hov dikhdikh " + category["disabled"]}
                key={idx}>
                <div className="thisIsC">
                  {category.back && category._id !== mainCategory._id && (
                    <span className={"icon" + t("Right")}>
                    <KeyboardArrowLeftIcon/>
                    </span>
                  )}
                  <span className="name">{category.name}</span>

                  {!category.back && !category.loading && (
                    <span className={"icon" + t("Left")}>
                      <KeyboardArrowLeftIcon/>
                    </span>
                  )}
                </div>

                <hr className="dds"/>
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    );
  }
}

export default withTranslation()(SidebarCategories);
