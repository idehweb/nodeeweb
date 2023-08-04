import React, {useEffect, useState} from 'react';
import {Nav} from 'shards-react';
import {useSelector} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import SidebarCatItem from './SidebarCatItem';
import {savePost, toggleSidebar} from '#c/functions/index';

const SidebarAttrItems = ({t}) => {
  // console.clear();
  const {_id} = useParams();
  // console.log('_id', _id);
  const cat = useSelector((st) => st.store.cat);
  const menu = useSelector((st) => st.store.menuVisible);
  const handleClick = () => toggleSidebar(menu);

  // const appSelectedCats = useSelector((st) => st.store.selectedCats);
  // const appSelectedParents = useSelector((st) => st.store.selectedParents);
  const appAllCategories = useSelector((st) => st.store.allCategories);
  // let fghyuji = [];
  //
  // if (_id) {
  //   appAllCategories.map(jgf => {
  //     if (_id === jgf._id) {
  //       fghyuji = jgf.child;
  //     }
  //   });
  //
  // }
  let [selectedCats, setSelectedCats] = useState(appAllCategories || []);
  //
  // if (_id) {
  //   let fghyuji = [];
  //   appAllCategories.map(jgf => {
  //     if (_id == jgf._id) {
  //       fghyuji = jgf.child;
  //     }
  //   });
  //
  // } else {
  //   let [selectedCats, setSelectedCats] = useState(appAllCategories || []);
  // }
  let id = '', fid = '', sid = '', tid = '';
  // console.clear();


  // console.log('id', id);
  // console.log('fid', fid);
  // console.log('sid', sid);
  let [activeClass, setActiveClass] = useState('');
  let [activeFClass, setActiveFClass] = useState('');
  let [activeSClass, setActiveSClass] = useState('');
  let [activeTClass, setActiveTClass] = useState('');
  // const [selectedParents, setSelectedParents] = useState([]);
  // if (_id) {
  //   appAllCategories.map((hgfds) => {
  //     if (hgfds._id === _id) {
  //       setSelectedCats(hgfds.child);
  //     }
  //
  //   });
  // }

  useEffect(() => {
    // console.log('ch/ange selectedCats...');
    //   getCategoriesData();
    if (selectedCats && selectedCats.length>0)
      selectedCats.forEach((hgfds) => {
        // if (hgfds._id === _id) {
        //   console.log('parent is ',hgfds.name );
        //   setActiveClass(_id);
        // }
        // if (hgfds.child) {
        //   hgfds.child.map((hgfdg) => {
        //     if (hgfdg._id === _id) {
        //       console.log('parent s is ',hgfds.name );
        //       setActiveFClass(_id);
        //       setActiveClass(hgfds._id);
        //
        //     }
        //
        //   })
        // }
      });
  }, [selectedCats]);
  // useEffect(() => {
  //   console.log('change _id...');
  //   //   getCategoriesData();
  //   appAllCategories.map((hgfds) => {
  //     if (hgfds._id === _id) {
  //       setSelectedCats(hgfds.child);
  //       console.log(hgfds.child);
  //     }
  //
  //   });
  // }, [_id]);
  useEffect(() => {
    // console.clear();
    // console.log('useEffect cat', cat);
    // appAllCategories.map((asdf) => {
    //   if (asdf._id == cat) {
    //     console.log('asdfasdf', asdf);
    //     if (asdf.child)
    setSelectedCats(appAllCategories)

    // }
    // });
    // getCategoriesData();
  }, [cat]);
  //
  // useEffect(() => {
  //   console.log('selectedCats changedjj:', appSelectedCats);
  //   setSelectedCats(appSelectedCats || []);
  // }, [appSelectedCats]);
  //
  // useEffect(() => {
  //   console.log('selectedParents changed:', appSelectedParents);
  //   setSelectedParents(appSelectedParents || []);
  // }, [appSelectedParents]);

  const onClickF = (item, isParent, isNavItemClicked) => {
    if (activeFClass == '')
      setActiveFClass(item._id);
    else if (item._id == activeFClass)
      setActiveFClass('');
    else
      setActiveFClass(item._id);

  };
  const onClickS = (item, isParent, isNavItemClicked) => {
    if (activeSClass == '')
      setActiveSClass(item._id);
    else if (item._id == activeSClass)
      setActiveSClass('');
    else
      setActiveSClass(item._id);

  };
  const onClickT = (item, isParent, isNavItemClicked) => {

    if (activeTClass == '')
      setActiveTClass(item._id);
    else if (item._id == activeTClass)
      setActiveTClass('');
    else
      setActiveTClass(item._id);

  };
  const onClick = (item, isParent, isNavItemClicked) => {
    // console.log('on/Click');
    // handleClick();
    if (activeClass == '')
      setActiveClass(item._id);
    else if (item._id == activeClass)
      setActiveClass('');
    else
      setActiveClass(item._id);


    // let closeMenu = true;
    // if (isNavItemClicked) {
    //   savePost({
    //     selectedCats: appAllCategories,
    //     selectedParents: [],
    //     menuVisible: false,
    //   });
    //   console.log('isNavItemClicked ...', item, 'and', isNavItemClicked);
    //   setSelectedCats(appAllCategories);
    //   setSelectedParents([]);
    //   return;
    // }
    //
    // item.htmlAfter = "<i class='material-icons'>keyboard_arrow_left</i>";
    // let selectedArray = [...selectedCats];
    // let selectedParentArr = [...selectedParents];
    // if (isParent) {
    //   selectedArray.pop();
    //   selectedParentArr.pop();
    //   setSelectedParents(selectedParentArr);
    //   closeMenu = false;
    // } else {
    //   selectedArray.push(item.child);
    //   selectedParentArr.push(item);
    // }
    // savePost({
    //   selectedCats: selectedArray,
    //   selectedParents: selectedParentArr,
    //   menuVisible: closeMenu,
    // });
  };
  let ref = this;
  // console.log(activeCl/ass, selectedCats)
// return false;
  return (
    <div className="nav-wrapper">
      {/*<Nav className="nav--no-borders flex-column">*/}
      {/*{navItems().map((item, idx) => (*/}
      {/*<SidebarNavItem*/}
      {/*key={idx}*/}
      {/*item={item}*/}
      {/*onClick={() => onClick(item, null, true)}*/}
      {/*/>*/}
      {/*))}*/}
      {/*</Nav>*/}

      {/*<Button*/}

      {/*>home</Button>*/}
      {selectedCats.length > 0 && (
        <Nav className="nav--no-borders flex-column sizeless sidecategories">
          {/*{selectedParents.length > 0 && (*/}
          {/*<SidebarCatItem*/}
          {/*item={selectedParents[selectedParents.length - 1]}*/}
          {/*isSelected={true}*/}
          {/*parent={*/}
          {/*selectedParents[selectedParents.length - 2]*/}
          {/*? selectedParents[selectedParents.length - 2]*/}
          {/*: 'root'*/}
          {/*}*/}
          {/*onClick={() =>*/}
          {/*onClick(selectedParents[selectedParents.length - 1], true)*/}
          {/*}*/}
          {/*/>*/}
          {/*)}*/}
          {selectedCats && selectedCats.map((item, index) => (
            <SidebarCatItem
              key={index}
              item={item}
              className={activeClass}
              onHandle={() => handleClick()}
              onClick={() => onClick(item)}
            >

              {item.child &&
              <Nav className="nav--no-borders flex-column childern">{item.child.map((itemfchild, indexf) => (
                <SidebarCatItem
                  key={indexf}
                  item={itemfchild}
                  className={activeFClass}
                  onHandle={() => handleClick()}
                  onClick={() => onClickF(itemfchild)}
                >


                  {itemfchild.child &&
                  <Nav className="nav--no-borders flex-column childern">{itemfchild.child.map((itemschild, indexs) => (
                    <SidebarCatItem
                      key={indexs}
                      item={itemschild}
                      className={activeSClass}
                      onHandle={() => handleClick()}
                      onClick={() => onClickS(itemschild)}
                    >

                      {itemschild.child && <Nav
                        className="nav--no-borders flex-column childern">{itemschild.child.map((itemtchild, indext) => (
                        <SidebarCatItem
                          key={indext}
                          item={itemtchild}
                          className={activeTClass}
                          onHandle={() => handleClick()}
                          onClick={() => onClickT(itemschild)}
                        ></SidebarCatItem>
                      ))}</Nav>}
                    </SidebarCatItem>
                  ))}</Nav>}
                </SidebarCatItem>
              ))}</Nav>}
            </SidebarCatItem>
          ))}
        </Nav>
      )}
    </div>
  );
};

export default withTranslation()(SidebarAttrItems);
