import { Link, BrowserRouter, useHistory as Router, Route, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'

import './Footer.scss';

const Footer = (props) => {
	const { t } = useTranslation();
  return (
	<div className="Footer">
	<div className="container-fluid">
	  	<div className="row py-3 py-md-6 mx-1 mx-md-0 px-md-4">
			<div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-2 mb-md-0">
		  		<Link to="/" className="Footer__logo mb-1 d-block">Lottolive</Link>
		  		<span>License No. 217239273 dated March 29, 2022 Curacao.</span>
			</div>
			<div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-2 mb-md-0">
				<h4 className="mb-3  mt-3 mt-sm-0">{t('footer_information')}</h4>
				<div className="mb-1">
					<Link to="/license">{t('footer_license')}</Link>
				</div>
				<div className="mb-1">
					<Link to="/privacy">{t('footer_policy')}</Link>
				</div>
				<div className="mb-1">
					<Link to="/principles">{t('footer_principles')}</Link>
				</div>
			</div>
			<div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-2 mb-md-0">
				<h4 className="mb-3 mt-3 mt-md-0">{t('footer_navigation')}</h4>
				<div className="mb-1">
					<Link to="/">{t('footer_home')}</Link>
				</div>
				<div className="mb-1">
					<Link to="/games">{t('footer_games')}</Link>
				</div>
				<div className="mb-1">
					<Link to="/FAQ">FAQ</Link>
				</div>
			</div>
			<div className="col-12 col-sm-6 col-md-3 col-lg-3 mb-2 mb-md-0">
				<h4 className="mb-3 mt-3 mt-md-0">Contacts</h4>
				<div className="mb-1">
					<Link to="/contacts">{t('footer_contacts')}</Link>
				</div>
				<div className="mb-1">
					<Link to="/">Telegram</Link>
				</div>
				<div className="mb-1">
					<Link to="/">Facebook</Link>
				</div>
			</div>
			
	  	</div>
	  	<div className="row py-1 px-md-4 mx-1 mx-md-0">
	  		<div className="col-12 d-flex justify-content-between">
		  		<a href="https://amont.studio" className="Footer__studio mb-1 d-block">{t('footer_developer')}</a>
		  		<span>© AirTech Gamling, 2022</span>
			</div>
	  	</div>
  </div>
	</div>
  );
};

export default Footer;
