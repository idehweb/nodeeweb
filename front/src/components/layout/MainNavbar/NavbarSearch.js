import React, {useState,useRef} from "react";
import {Form, FormInput, InputGroup, InputGroupAddon, InputGroupText, NavLink} from "shards-react";
// import { useTranslation } from 'react-i18next'
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
// import { useNavigate } from "react-router-dom";
// import {toggleSearch} from '#c/functions/index';
import {NavLink as RouteNavLink} from 'react-router-dom';
import {SearchIt,isClient} from '#c/functions/index';
import store from "#c/functions/store";
import {withTranslation} from 'react-i18next';
import {toggleSearch} from '#c/functions/index';
import {useSelector} from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
// class NavbarSearch extends React.Component {
// history = useNavigate();
function NavbarSearch({className, type = 'prepend', t,style={},classes=''}) {
  let url = isClient ? new URL( window.location.href) : '';
  let searchd = isClient ?  (url.searchParams.get("search") || "") : '';
  let [searchT, SetSearchText] = useState(searchd || '');
  let [load, SetLoad] = useState(false);
  let [openBox, SetOpenBox] = useState(false);
  let [data, SetData] = useState([]);
  let [lan, setLan] = useState(store.getState().store.lan || 'fa');
  const searchform = useSelector((st) => !!st.store.searchvisible);

  const handleClick = () => toggleSearch(searchform);

  // const formRef = useRef(null);
  // const searchform = useSelector((st) => !!st.store.searchvisible);
  //
  // useEffect(() => {
  //   console.log('useEffect', searchT);
  // }, [searchT]);

  // constructor(props) {
  //   super(props);
  //
  //   let url = new URL(window.location.href);
  //   let search = url.searchParams.get("search") || "";
  //   console.log('search', search);
  //   this.state = {
  //     search: search,
  //     t: false
  //   };
  //   // this.handleEvent = this.handleEvent.bind(this);
  // }
  //
  //
  // render() {
  //
  //   const {onChange,t}=this.props;
  //
  //   console.log('this.search', this.state.search,this.props);
  //   if (this.state.t) {
  //     // const history = useNavigate();
  //     // history.push("/?"+this.state.search);
  //   }
  const handleEvent = (T) => {
    // console.log('s', T);
    if (T) {
      SetSearchText(T);
      SetOpenBox(true);
      SearchIt(T).then((posts) => {
        // console.log('posts', posts);
        // if (posts.success)
        // this.setState({ load: true, searchT: s, data: posts });
        // if (posts.length > 0)
        SetData(posts);
        SetLoad(true);
      });
    } else {
      SetOpenBox(false);
      SetLoad(false);
      SetSearchText('');
    }

  };
  const va = () => {
    SetData([]);
    SetLoad(false);
    SetOpenBox(false);
  }
  const onClickX = () => {
    console.log('onClickX');
    SetData([]);
    SetLoad(false);
    SetOpenBox(false);

    SetSearchText('');
    // this.setState({searchT: ''});
  }
  const onCloseSearch = () => {
    console.log('onCloseSearch');
    SetData([]);
    SetLoad(false);
    SetOpenBox(false);

    SetSearchText('');
    handleClick();
    // this.setState({searchT: ''});
  }
  const loader = (
    <div className="loadNotFound loader ">
      {t('loading...')}
      <LoadingComponent height={30} width={30} type="spin" color="#3d5070"/>
    </div>
  );

  return (

    <Form style={style} action={isClient ? window.location.origin+'/products/0/12' : ''}
          className={"main-navbar__search w-100  d-md-flex d-lg-flex desktopnoned stf posrel mindfghj " + className + ' '+classes}>
      <InputGroup seamless className="">

        <FormInput
          className="navbar-search"
          placeholder={t('search please...')}
          value={searchT}
          name="search"
                   id={'themobilesearch'}
          onChange={event => {
            // onChange(event.target.value);
            handleEvent(event.target.value);
          }}

        />
        {openBox && <InputGroupAddon type="append" className={'clickable'} onClick={event => {
          onClickX()
        }}>

          <InputGroupText>
            <CloseIcon/>
          </InputGroupText>
        </InputGroupAddon>}
        <InputGroupAddon className={'frtyuioiuy'} type="append" onClick={event => {
          console.log('event',event);
        }}>
          <InputGroupText>
            <SearchIcon/>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {openBox && <div className={'sdfgde'}>
        {!load && loader}
        {load && data.length > 0 && [data.map((da, dai) => {
          return (<div className={'search_item'} key={dai}>
            <NavLink exact tag={RouteNavLink} to={da.url} onClick={()=>{va();onCloseSearch()}}>

              {da.photo && <div className={'search_image'}><img src={da.photo}/></div>}
              <div className={'search_title'}> {da.title[lan]}</div>
            </NavLink>
          </div>);
        }),<div className={'search_item textAlignCenter'}>
          <NavLink exact tag={RouteNavLink} to={'/products/0/20?search='+searchT} onClick={()=>{onCloseSearch()}}>
            <div className={'search_title'}> {t('show all')}</div>
          </NavLink>
        </div>]}
        {load && data.length < 1 && t('nothing found...')}
      </div>
      }
      <div className={'jhgfghj'} onClick={event => {
        onCloseSearch()
      }}></div>
    </Form>


  );
}

export default withTranslation()(NavbarSearch);
