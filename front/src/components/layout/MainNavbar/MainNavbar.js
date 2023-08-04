import React from 'react';
import clsx from 'clsx';
import {Navbar} from 'shards-react';
import MainSidebar from '#c/components/layout/MainSidebar/MainSidebar';
import MainSidebarMobile from "#c/components/layout/MainSidebar/MainSidebarMobile";

import {CustomNavItem} from './NavbarNav';
// import useWindowSize from '#c/components/common/useWindowSize';
let theItem = {
  "child": [],
  "parent": null,
  "slug": "dashboard",
  "title": {"fa": "", "en": "Dashboard"},
  "to": "",
  "_id": "Dashboard"
}
export default function MainNavbar({layout, element, style, setStyles, stickyTop = true, onChange}) {
  // const classes = clsx('main-navbar', 'bg-white', stickyTop && 'sticky-top');
  const classess = clsx('navbar', 'p-0');
  // let [width] = useWindowSize();
  // let {children = [],classes=''} = element;
  let {children = [], type, components, settings} = element;
  let {general} = settings;
  let {fields} = general;
  let {text, iconFont, direction, link, display, classes, target = "_blank"} = fields;
  let menu = [];
  if (children && children instanceof Array && (classes && classes.indexOf('responsive-menu')!==-1))
    children.forEach((ch, cx) => {
      let childMenu=[];
      // let {children = [],type, components, settings} = ch;
      let allFields = ch.settings.general.fields;
      let allFieldsChildren = ch.children;
      // console.log('children', allFields)
      if (allFieldsChildren) {
        allFieldsChildren.forEach((ch2, cx2) => {
          let allFields2 = ch2.settings.general.fields;
          let childMenu2=[];

          let allFieldsChildren2 = ch2.children;
          if (allFieldsChildren2) {
            allFieldsChildren2.forEach((ch3, cx3) => {
              let allFields3 = ch3.settings.general.fields;
              childMenu2.push({
                "child": [],
                "parent": cx2,
                "slug": "dashboard",
                "title": {"fa": allFields3.text, "en": allFields3.text},
                "to": allFields3.link,
                "_id": cx3
              })
            })
          }

          childMenu.push({
            "child": childMenu2,
            "parent": cx,
            "slug": "dashboard",
            "title": {"fa": allFields2.text, "en": allFields2.text},
            "to": allFields2.link,
            "_id": cx2
          })
        })
      }
      menu.push({
        "child": childMenu,
        "parent": null,
        "slug": "dashboard",
        "title": {"fa": allFields.text, "en": allFields.text},
        "to": allFields.link,
        "_id": cx
      })
    });
// return JSON.stringify(classes);
  return (
    <>
      <div className={' ' + classess + ' ' + classes}>
        <Navbar type="light" className=" align-items-stretch flex-md-nowrap p-0 top-bar-menu" style={style}>
          {(children && children instanceof Array) && children.map((ch, cx) => {
            // return child.map((ch,cx)=>{
            // console.log('ch', ch);
            let {settings = {}, children} = ch;
            let {general = {}} = settings;
            let {fields = {}} = general;
            let {text = '', link = ''} = fields;
            let style = setStyles(fields);
            // console.log('text',text)
            // return text;
            return <CustomNavItem key={cx} children={children} setStyles={setStyles} text={text} href={link}
                                  style={style}/>
            // })
          })}
        </Navbar>
      </div>

      
      {(classes && classes.indexOf('responsive-menu')!==-1) && <MainSidebar>
        <MainSidebarMobile items={menu}/>
      </MainSidebar>}
      
      
      </>
  );
}

