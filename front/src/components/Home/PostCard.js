import React from 'react';
import { withTranslation } from 'react-i18next';
import _truncate from 'lodash/truncate';
import { Link } from 'react-router-dom';
import Theprice from '#c/components/single-post/Theprice';
import SidebarActions from '#c/components/single-post/SidebarActions';

import { combineUrl, dFormat, PriceFormat } from '#c/functions/utils';
import { addItem, MainUrl, removeItem } from '#c/functions/index';
import { defaultImg } from '#c/assets/index';
// import store from "#c/functions/store";
import AddToCardButton from '#c/components/components-overview/AddToCardButton';
import Transform from '@/functions/transform';

function PostCard({ onClick, item, method, t, entity }) {
  if (entity === 'product') item = Transform.getOneProduct(item);
  let date = dFormat(item.updatedAt, t);
  let price = null;
  let salePrice = null;
  if (item.price) price = PriceFormat(item.price);
  if (item.salePrice) salePrice = PriceFormat(item.salePrice);
  let backgroundImage = defaultImg;
  if (item.photos && item.photos[0])
    backgroundImage = combineUrl(MainUrl, item.photos[0]);
  if (item.thumbnail) backgroundImage = combineUrl(MainUrl, item.thumbnail);

  let slug = item.slug;
  let cat_inLink = slug;
  if (item.firstCategory) {
    cat_inLink = item.firstCategory.slug;
    if (item.secondCategory && item.secondCategory.slug)
      cat_inLink = item.secondCategory.slug;
    if (item.thirdCategory && item.thirdCategory.slug)
      cat_inLink = item.thirdCategory.slug;
  }
  cat_inLink = 'product/' + slug;

  return (
    <div className="mb-4 ad-card-col nbghjk">
      <div className="ad-card-main-div">
        {item.labels && item.labels.length > 0 && (
          <div className={'the-labels'}>
            {item.labels.map((lab, k) => {
              return (
                <div className={'the-label'} key={k}>
                  {lab && lab.title}
                </div>
              );
            })}
          </div>
        )}
        <div className="card-post__image" onClick={onClick}>
          <Link to={'/' + cat_inLink + '/'}>
            <img
              alt={item.title ? item.title['fa'] : ''}
              loading={'lazy'}
              src={backgroundImage || defaultImg}
            />
          </Link>
        </div>
        <div className={'post-content-style'}>
          <div className="ad-card-content">
            <div>
              {item.body && <p className="card-text">{item.body}</p>}
              <div className={'wer'}></div>

              {item.type === 'normal' && item.in_stock && (
                <Theprice price={price} salePrice={salePrice} single={false} />
              )}
              {item.type === 'variable' && (
                <Theprice
                  price={price}
                  salePrice={salePrice}
                  combinations={item.combinations}
                  type={item.type}
                  single={false}
                />
              )}
            </div>

            <span className="a-card-title">
              <Link to={'/' + cat_inLink + '/'}>
                {_truncate(item.title['fa'], { length: 120 })}
              </Link>
            </span>
            {/* add price to slidebar */}
            <span className="card-non-title-item">
              {item &&
              item.combinations &&
              item.combinations[0] &&
              item.combinations[0].price &&
              typeof item.combinations[0].price === 'number' ? (
                <Theprice price={item.combinations[0].price} />
              ) : (
                <Theprice price={''} />
              )}
            </span>
          </div>

          {method === 'list' && (
            <>
              {item.type === 'variable' && (
                <div className={'single-product mb-3'}>
                  <SidebarActions
                    product={item}
                    className={'mobilenone '}
                    add={false}
                    edit={true}
                    _id={item._id}
                    customer={item.customer}
                    updatedAt={item.updatedAt}
                    countryChoosed={item.countryChoosed}
                    type={item.type}
                    price={item.price}
                    firstCategory={item.firstCategory}
                    secondCategory={item.secondCategory}
                    photos={item.photos}
                    title={item.title}
                    combinations={item.combinations}
                    options={item.options}
                    in_stock={item.in_stock}
                    quantity={item.quantity}
                    thirdCategory={item.thirdCategory}
                    method={method}
                    single={false}
                  />
                </div>
              )}
            </>
          )}
          {method !== 'list' && (
            <>
              {item.type === 'variable' && (
                <AddToCardButton
                  product={item}
                  item={item}
                  text={t('options')}
                  variable={true}
                  redirectFlag>
                  مشاهده
                </AddToCardButton>
              )}
              {item.type === 'normal' && (
                <AddToCardButton
                  item={item}
                  product={item}
                  combination={item.combinations[0]}
                  redirectFlag
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default withTranslation()(PostCard);
