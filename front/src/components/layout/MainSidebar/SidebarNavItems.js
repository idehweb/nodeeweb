import React, { useEffect, useState } from 'react';
import { Collapse, Nav, NavItem } from 'shards-react';
import { useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import SidebarCatItem from './SidebarCatItem';
import GuaranteeFilter from './GuaranteeFilter.js';
import Filters from './Filters';
import { savePost, toggleSidebar } from '#c/functions/index';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ConstructionIcon from '@mui/icons-material/Construction';
const SidebarNavItems = ({ t, appAllCategories, title }) => {
  const { _id } = useParams();
  const cat = useSelector((st) => st.store.cat);
  const menu = useSelector((st) => st.store.menuVisible);
  const handleClick = () => toggleSidebar(menu);
  // const appAllCategories = useSelector((st) => st.store.allCategories);
  console.log('appAllCategories', appAllCategories);
  let [selectedCats, setSelectedCats] = useState(appAllCategories || []);

  let id = '',
    fid = '',
    sid = '',
    tid = '';

  let [activeClass, setActiveClass] = useState('');
  let [activeFClass, setActiveFClass] = useState('');
  let [activeSClass, setActiveSClass] = useState('');
  let [activeTClass, setActiveTClass] = useState('');

  useEffect(() => {
    if (selectedCats && selectedCats.length > 0)
      selectedCats.forEach((hgfds) => {});
  }, [selectedCats]);

  useEffect(() => {
    setSelectedCats(appAllCategories);
  }, [cat]);

  const onClickF = (item, isParent, isNavItemClicked) => {
    if (activeFClass === '') setActiveFClass(item._id);
    else if (item._id === activeFClass) setActiveFClass('');
    else setActiveFClass(item._id);
  };
  const onClickS = (item, isParent, isNavItemClicked) => {
    if (activeSClass === '') setActiveSClass(item._id);
    else if (item._id === activeSClass) setActiveSClass('');
    else setActiveSClass(item._id);
  };
  const onClickT = (item, isParent, isNavItemClicked) => {
    if (activeTClass === '') setActiveTClass(item._id);
    else if (item._id === activeTClass) setActiveTClass('');
    else setActiveTClass(item._id);
  };
  const onClick = (item, isParent, isNavItemClicked) => {
    if (activeClass === '') setActiveClass(item._id);
    else if (item._id === activeClass) setActiveClass('');
    else setActiveClass(item._id);
  };
  return (
    <div className="nav-wrapper">
      <div className={'mt-2'}>
        {selectedCats && (
          <Nav className="nav--no-borders flex-column  sidecategories">
            {selectedCats.length > 0 &&
              selectedCats.map((item, index) => (
                <SidebarCatItem
                  key={index}
                  item={item}
                  className={activeClass}
                  onHandle={() => handleClick()}
                  onClick={() => onClick(item)}>
                  {item.child && (
                    <Nav className="nav--no-borders flex-column childern">
                      {item.child.map((itemfchild, indexf) => (
                        <SidebarCatItem
                          key={indexf}
                          item={itemfchild}
                          className={activeFClass}
                          onHandle={() => handleClick()}
                          onClick={() => onClickF(itemfchild)}>
                          {itemfchild.child && (
                            <Nav className="nav--no-borders flex-column childern">
                              {itemfchild.child.map((itemschild, indexs) => (
                                <SidebarCatItem
                                  key={indexs}
                                  item={itemschild}
                                  className={activeSClass}
                                  onHandle={() => handleClick()}
                                  onClick={() => onClickS(itemschild)}>
                                  {itemschild.child && (
                                    <Nav className="nav--no-borders flex-column childern">
                                      {itemschild.child.map(
                                        (itemtchild, indext) => (
                                          <SidebarCatItem
                                            key={indext}
                                            item={itemtchild}
                                            className={activeTClass}
                                            onHandle={() => handleClick()}
                                            onClick={() => onClickT(itemschild)}
                                          />
                                        )
                                      )}
                                    </Nav>
                                  )}
                                </SidebarCatItem>
                              ))}
                            </Nav>
                          )}
                        </SidebarCatItem>
                      ))}
                    </Nav>
                  )}
                </SidebarCatItem>
              ))}
          </Nav>
        )}
      </div>
    </div>
  );
};

export default withTranslation()(SidebarNavItems);
