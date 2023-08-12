import React from 'react';
import {NavLink as RouteNavLink} from 'react-router-dom';
import {NavItem, NavLink} from 'shards-react';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
const SidebarCatItem = ({item, onClick, onHandle, parent, className, children}) => {
  // console.log('className',className);
  // console.log('item.htmlAfter',item.htmlAfter);
  if (item){
    const isActive=(className === item._id);
    return (
      <NavItem className={(isActive) ? 'active the-active-link' : ''}>
        {/*<div className={'nav-link-wrapper'}>*/}
          <NavLink
            className={!parent ? 'nav-link-child' : !item.parent ? '' : 'active'}
            // tag={RouteNavLink}
            tag={(props) => <RouteNavLink {...props} />}
            to={'/product-category/'+item.slug+'/0/10'}
          >
            {parent && (
              <div
                className="d-inline-block item-icon-wrapper"
                dangerouslySetInnerHTML={{__html: item.htmlBefore}}
              />
            )}
            {item.name && (
              <span
                onClick={onHandle}

                className={item.parent && !parent ? 'nav-link-child-text' : ''}>
              {item.name.fa}
            </span>
            )}
            {(item.child && item.child.length > 0) && (
              <div
                className="d-inline-block item-icon-wrapper rightbuttonmenu"
                onClick={() => onClick()}
              >
                {!isActive && <KeyboardArrowLeftIcon/>}
                {isActive && <KeyboardArrowDownIcon/>}

                </div>
            )}
          </NavLink>

        {/*</div>*/}
        {children}
        {/*{item.child && (*/}
        {/*<Nav className="nav--no-borders flex-column childern">*/}
        {/*{item.child.map((ch,ch1)=>{*/}
        {/*<SidebarCatItem*/}
        {/*key={ch1}*/}
        {/*item={ch}*/}
        {/*className={className}*/}
        {/*onClick={() => onClick(item)}*/}
        {/*/>*/}
        {/*})}*/}
        {/*</Nav>*/}
        {/*)}*/}
      </NavItem>
    );
  }
  else return <></>;
};

export default SidebarCatItem;
