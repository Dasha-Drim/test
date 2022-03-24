import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
// graphic
import arrow from './icons/arrow.svg';

import './Header.scss';



const Header = (props) => {
  const currentLanguageCode = localStorage.getItem('i18nextLng') || 'en';
  const { t } = useTranslation();

  /* 
  props.userIsLoggedIn
  */
  let [isOpenSelect, setIsOpenSelect] = useState(false);
  let [selectValue, setSelectValue] = useState(localStorage.getItem('i18nextLng') ? localStorage.getItem('i18nextLng') : "en");
  let select = useRef(null);
  let selectItem = (e) => {
    console.log(e.target.dataset.value);
    setSelectValue(e.target.dataset.value);
    i18next.changeLanguage(e.target.dataset.value);
  }

  useEffect(() => {
    document.addEventListener('click', (event) => {if (select.current && !select.current.contains(event.target)) setIsOpenSelect(false)}, false);
    return () => {
      document.removeEventListener('click', (event) => {if (select.current && !select.current.contains(event.target)) setIsOpenSelect(false)}, false)
    }
  })


  return ( 
    <>
    <div className="Header">
          <div className="container-fluid">
              <div className="row py-3 px-1 px-md-4 m-0 align-items-center justify-content-between">
                <div className="col-12 d-flex align-items-center justify-content-between">
                    <div className="Header__menu d-flex align-items-center justify-content-between w-100">
                      <div className="d-flex align-items-center">

                          <Link to="/" className="Header__logo mr-md-6">RealLoto</Link>
                          <nav className="ml-1 ml-md-4 ml-lg-6 d-none d-sm-block">
                            <Link to="/">{t('header_home_link')}</Link>
                            <Link to="/games">{t('header_games_link')}</Link>
                            <Link to="/FAQ">FAQ</Link>
                          </nav>
                      </div>
                      {
                          !props.userIsLoggedIn
                          ?
                          <div className="header__btn d-flex">
                            <div ref={select} className="header__select d-none d-sm-flex align-items-center justify-content-between position-relative" onClick={(e) => {isOpenSelect ? setIsOpenSelect(false) : setIsOpenSelect(true)}}>
                              <span>{selectValue}</span>
                              <img src={arrow} className={`${isOpenSelect && "transform"}`}/>
                              <div className={`${isOpenSelect ? "d-flex" : "d-none"} position-absolute select-list`}>
                                <span className="w-100 d-block select-list__item" data-value="ru" onClick={(e) => {selectItem(e)}}>Русский</span>
                                <span className="w-100 d-block select-list__item" data-value="en" onClick={(e) => {selectItem(e)}}>English</span>
                              </div>
                            </div>
                            <Link to="/auth" className="secondary-btn ml-3">{t('header_auth_link')}</Link>
                          </div>
                          :
                          <div className="d-flex ">
                            <div className="text-center mr-4 HeaderAuth__balance">
                                <span>{props.balance}</span>
                                <span>{t('header_balance')}</span>
                            </div>

                            <div ref={select} className="header__select mr-3 d-none d-sm-flex align-items-center justify-content-between position-relative" onClick={(e) => {isOpenSelect ? setIsOpenSelect(false) : setIsOpenSelect(true)}}>
                              <span>{selectValue}</span>
                              <img src={arrow} className={`${isOpenSelect && "transform"}`}/>
                              <div className={`${isOpenSelect ? "d-flex" : "d-none"} position-absolute select-list`}>
                                <span className="w-100 d-block select-list__item" data-value="ru" onClick={(e) => {selectItem(e)}}>Русский</span>
                                <span className="w-100 d-block select-list__item" data-value="en" onClick={(e) => {selectItem(e)}}>English</span>
                              </div>
                            </div>

                            <div className="HeaderAuth__btn">

                                <Link to="/lk" className="secondary-btn">{t('header_profile_link')}</Link>
                            </div>
                          </div>
                      }
                    </div>
                </div>
              </div>
          </div>
  </div> 
      </>
    

  );
};

export default Header;
