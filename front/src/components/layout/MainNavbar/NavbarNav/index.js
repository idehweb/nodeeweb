import React from 'react';
import {logoImg} from '#c/assets/index';
import {NavLink as RouteNavLink} from 'react-router-dom';
import {Nav, NavItem, NavLink} from 'shards-react';
// import Logo from '#c/images/logo-256x512.png';
// import useWindowSize from '#c/components/common/useWindowSize';
import {useSelector} from 'react-redux';

Array.prototype.orderBy = function (selector, desc = false) {
  return [...this].sort((a, b) => {
    a = selector(a);
    b = selector(b);

    if (a == b) return 0;
    return (desc ? a > b : a < b) ? -1 : 1;
  });
}
export const containMainLink = (href) => {
  if (href)
    if ((href.indexOf("http") > -1)) {
      return true;
    }
}
export const CustomNavItem = (props) => {
  let {href='', text='', children, style,setStyles} = props;
  // console.log('CustomNavItem',text)
  // return JSON.stringify(props)
  return (
    <NavItem>
      {containMainLink(href) && <a className="nav-link" href={href} style={style} target={"_blank"}>
        {text}
      </a>}
      {!containMainLink(href) &&
      <NavLink style={style} tag={(props) => <RouteNavLink {...props} />} to={href} className="">
        {text}
      </NavLink>}

      {children && <ChildItem {...props} setStyles={setStyles}/>}
    </NavItem>
  );
}

export const ChildItem = (props) => {
  // return JSON.stringify(props);
  let {children,setStyles} = props;

  // const searchform = useSelector((st) => !!st.store.searchvisible);
  // let [width, height] = useWindowSize();

  // const [selectedCats, setSelectedCats] = useState(appAllCategories || []);
  return (<ul className={"children"}>
      {/*hghj*/}
      {children && children.map((ch, chx) => {
        let {settings} = ch;
        let {general = {}} = settings;
        let {fields = {}} = general;
        let {text = '', href='',link=''} = fields;
        let style=setStyles(fields);
if(!href && link){
  href=link
}
        return (<NavItem key={chx}>
          {containMainLink(href) && <a className="nav-link" href={href} style={style} target={"_blank"}>
            {text}
          </a>}
          {!containMainLink(href) &&
          <NavLink style={style} tag={(props) => <RouteNavLink {...props} />} to={href} className="">
            {text}
          </NavLink>}
          {ch.children && <ChildItem setStyles={setStyles} children={ch.children} setStyles={setStyles}/>}

        </NavItem>)
      })}


    </ul>
  );
}
export default () => {
  // const searchform = useSelector((st) => !!st.store.searchvisible);
  // let [width, height] = useWindowSize();
  let selectedCats = useSelector((st) => st.store.allCategories || []);

  // const [selectedCats, setSelectedCats] = useState(appAllCategories || []);
  let searchform = '';
  console.log('index logo');
  return (<Nav navbar className={"flex-row top-bar-menu stfwrap " + searchform}>
      {/*<NavItem className={"d-table m-auto oiuytrt tm-ksa-logo-parent2 nonestf" + searchform}>*/}
      {/*<Link to="/">{logoImg && <img style={{maxWidth: 58}} src={logoImg} alt="navbar logo"/>}</Link>*/}
      {/*</NavItem>*/}
      {/*<MainCats/>*/}
      {/*className={'mobilenone'}*/}
      {(selectedCats && selectedCats.length) && selectedCats.orderBy(h => parseFloat(h.order)).map((sc, key) => {

        return <CustomNavItem href={'/category/' + sc._id + '/' + sc.name.fa} text={sc.name.fa} key={key}>
          {(sc.children) && <ul className={'children'}>{sc.children.map((sc1, key2) => {
            return <CustomNavItem className={'theChild'} href={'/category/' + sc1._id + '/' + sc1.name.fa}
                                  text={sc1.name.fa} key={key2}>
              {(sc1.children) && <ul className={'children'}>{sc1.children.map((sc2, key3) => {
                return <CustomNavItem className={'theChild'} href={'/category/' + sc2._id + '/' + sc2.name.fa}
                                      text={sc2.name.fa} key={key3}>

                </CustomNavItem>
              })}</ul>}
            </CustomNavItem>
          })}</ul>}
        </CustomNavItem>
      })}
      {/*<NavItem>*/}

      {/*<NavbarSearch/>*/}
      {/*</NavItem>*/}
    </Nav>
  );
}
