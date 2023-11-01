import React, { useState } from 'react';
import { Container, Row, Col, Nav, NavItem, NavLink } from 'shards-react';
import { withTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import DescriptionIcon from '@mui/icons-material/Description';
import ReviewsIcon from '@mui/icons-material/Reviews';
import UserAccountDetails from '#c/components/profile/UserAccountDetails';

const Profile = ({ t }) => {
  const [tab, setTab] = useState('profile');

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4"></Row>
      <div className="w-100">
        <Col lg="12" className="m-auto">
          <Nav
            justified={true}
            tabs={true}
            className={'post-product-nav profile-nav'}>
            <NavItem>
              <NavLink
                active={tab === 'profile'}
                href="#profile"
                onClick={() => setTab('profile')}>
                <EditAttributesIcon className={'ml-2'} />
                <span className={''}>{t('profile')}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <Link className={'nav-link'} to="/my-orders">
                <DescriptionIcon className={'ml-2'} />
                <span className={''}>{t('my orders')}</span>
              </Link>
            </NavItem>

            <NavItem>
              <NavLink
                active={tab === 'transactions'}
                href="#transactions"
                onClick={() => setTab('transactions')}>
                <ReviewsIcon className={'ml-2'} />

                <span className={''}>{t('transactions')}</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
        <Col lg="8" className="m-auto">
          {tab === 'profile' ? (
            <div className={'pt-5'} id={'description'}>
              <UserAccountDetails title={t('account details')} />
            </div>
          ) : null}
        </Col>
        <Col lg="12" className="m-auto"></Col>
      </div>
      <div style={{ height: '100px' }}></div>
    </Container>
  );
};

export default withTranslation()(Profile);
