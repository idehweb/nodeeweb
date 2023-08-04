import React, { useState, useEffect } from 'react';
import { Nav } from 'shards-react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';

import SidebarNavItem from './SidebarNavItem';
import SidebarCatItem from './SidebarCatItem';

import { getAllSidebarCategoriesData, savePost } from '#c/functions/index';

import navItems from '#c/data/sidebar-nav-items';
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

const SidebarNavItems = ({ t }) => {
  const appSelectedCats = useSelector((st) => st.store.selectedCats);
  const appSelectedParents = useSelector((st) => st.store.selectedParents);
  const appAllCategories = useSelector((st) => st.store.allCategories);

  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedParents, setSelectedParents] = useState([]);

  const getCategoriesData = () => {
    getAllSidebarCategoriesData().then((res = []) => {
      console.log('erere', res);
      if (!res.length) return;
      let parentsArray = [];
      res.forEach((item) => {
        if (item) {
          item.to = item._id;
          item.title = item.name;

          item.htmlAfter =<KeyboardArrowLeftIcon/>;
        }
      });
      res.forEach((item1) => {
        if (!item1.parent) {
          let parentItem = item1;
          parentItem.child = [];
          parentsArray.push(parentItem);
          res.forEach((item2) => {
            if (item2.parent === item1._id) {
              let firstChild = item2;
              firstChild.child = [];
              parentItem.child = [...parentItem.child, firstChild];
              res.forEach((item3) => {
                if (item3.parent === item2._id) {
                  let secondChild = item3;
                  secondChild.child = [];
                  firstChild.child = [...firstChild.child, secondChild];
                  res.forEach((item4) => {
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
      if (!appSelectedCats) {
        savePost({
          selectedCats: [parentsArray],
          allCategories: [parentsArray],
        });
        setSelectedCats([parentsArray]);
        setSelectedParents([]);
      }
    });
  };

  useEffect(() => {
    getCategoriesData();
  }, []);

  useEffect(() => {
    // console.log('selectedCats changedjj:', appSelectedCats);
    setSelectedCats(appSelectedCats || []);
  }, [appSelectedCats]);

  useEffect(() => {
    // console.log('selectedParents changed:', appSelectedParents);
    setSelectedParents(appSelectedParents || []);
  }, [appSelectedParents]);

  const onClick = (item, isParent, isNavItemClicked) => {
    let closeMenu = true;
    if (isNavItemClicked) {
      savePost({
        selectedCats: appAllCategories,
        selectedParents: [],
        menuVisible: false,
      });
      console.log('isNavItemClicked ...', item, 'and', isNavItemClicked);
      setSelectedCats(appAllCategories);
      setSelectedParents([]);
      return;
    }

    item.htmlAfter = <KeyboardArrowLeftIcon/>;
    let selectedArray = [...selectedCats];
    let selectedParentArr = [...selectedParents];
    if (isParent) {
      selectedArray.pop();
      selectedParentArr.pop();
      setSelectedParents(selectedParentArr);
      closeMenu = false;
    } else {
      selectedArray.push(item.child);
      selectedParentArr.push(item);
    }
    savePost({
      selectedCats: selectedArray,
      selectedParents: selectedParentArr,
      menuVisible: closeMenu,
    });
  };

  return (
    <div className="nav-wrapper">
      <Nav className="nav--no-borders flex-column">
        {navItems().map((item, idx) => (
          <SidebarNavItem
            key={idx}
            item={item}
            onClick={() => onClick(item, null, true)}
          />
        ))}
      </Nav>
      <hr className="hr" />

      {selectedCats.length > 0 && (
        <Nav className="nav--no-borders flex-column sizeless">
          {selectedParents.length > 0 && (
            <SidebarCatItem
              item={selectedParents[selectedParents.length - 1]}
              isSelected={true}
              parent={
                selectedParents[selectedParents.length - 2]
                  ? selectedParents[selectedParents.length - 2]
                  : 'root'
              }
              onClick={() =>
                onClick(selectedParents[selectedParents.length - 1], true)
              }
            />
          )}
          {selectedCats[selectedCats.length - 1].length > 0 &&
            selectedCats[selectedCats.length - 1].map((item, index) => (
              <SidebarCatItem
                key={index}
                item={item}
                onClick={() => onClick(item)}
              />
            ))}
        </Nav>
      )}
    </div>
  );
};

export default withTranslation()(SidebarNavItems);
