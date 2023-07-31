import React, {Suspense, useState,useEffect} from 'react';
import {useSelector} from 'react-redux';

import {withTranslation} from 'react-i18next';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink} from "shards-react";
import {savePost, setCat} from "#c/functions/index";
import {store} from "#c/functions/store";

// class MainCats extends React.Component {
const MainCats = ({t}) => {
  let cat = useSelector((st) => st.store.cat);
  // const appSelectedCats = useSelector((st) => st.store.selectedCats);
  // const appSelectedParents = useSelector((st) => st.store.selectedParents);
  const cats = useSelector((st) => st.store.allCategories);
  const lan = useSelector((st) => st.store.lan);

  const [visible, setvisible] = useState(false);
  // const [selectedParents, setSelectedParents] = useState([]);
  useEffect(() => {
    console.log('useEffect',cat);
    changeCat(cat);
  }, [cat]);
  // constructor(props) {
  //   super(props);
  //   console.log('mainCats');
  //   this.state = {
  //     visible: false,
  //     cat: store.getState().store.cat,
  //     cats: store.getState().store.allCategories,
  //     lan: store.getState().store.lan,
  //   };
  //   // savePost({cat:this.state.cats[0]._id});
  //   this.toggleUserActions = this.toggleUserActions.bind(this);
  // }

  const toggleUserActions = () => {
    // localstorage.getItem('token');
    console.log('set State');
    setvisible(!visible);

  }

  const showCatName = (cat_id) => {
    // console.clear();
    // let {cats, lan} = this.state;
    let name = '';
    console.log('cat_id', cat_id);
    if (cats)
      cats.forEach(async (ca) => {
        console.log('ca._id', ca);

        if (ca._id === cat_id) {

          name = ca.name[lan];
        }
      });
    console.log('name', name);
    return name;
  };
  const changeCat = (cat_id) => {
    console.log('changeCat', cat_id);
    setCat(cat_id, false);
    // savePost({cat: cat_id});

    // this.setState({
    //   cat: cat_id
    // })
    // console.log('change language');
  };

  // return() {
  // const {t, i18n} = this.props;
  // const {cat, cats, lan} = this.state;
  // console.clear();

  console.log('cats', cats);
  return (
    <Suspense fallback={() => {
      console.log('gfdes')
    }}>
      <Dropdown className={"ytrdf "} toggle={toggleUserActions}>

        <DropdownToggle caret={true} tag={NavLink} className="text-nowrap px-3 helldone">
          {!cat &&
          <span className={'mr-2'}>
          <span className="d-md-inline-block">{t('Select Category')}</span></span>
          }

          {cat &&
          <span className={'mr-2'}>
          <span className="d-md-inline-block">{showCatName(cat)}</span></span>
          }

        </DropdownToggle>
        <DropdownMenu open={visible}>
          {(cats && cats.length > 0) && cats.map((cate, t) => {
            // console.log('cate', cate);
            return (<DropdownItem
              key={t}
              className={'dropdown-item'}
              to={'/category/' + cate._id + '/' + cate.name[lan]}
              onClick={() => {
                changeCat(cate._id)
              }}>

              {cate.title[lan]}
            </DropdownItem>);
          })}
        </DropdownMenu>


      </Dropdown>
    </Suspense>
  );
  // }
};

export default withTranslation()(MainCats);
