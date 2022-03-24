import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import Header from "../blocks/Header/Header";
import HeadBlock from "../blocks/HeadBlock/HeadBlock";
import Footer from "../blocks/Footer/Footer";

// graphic
import Telegram from './icons/Telegram.svg';
import Facebook from './icons/Facebook.svg';

import './Contacts.scss';

const Contacts = (props) => {
	const { t } = useTranslation();
	return (
		<div className="Contacts">
			<HeadBlock title={t('contacts_title')}/>
			<div className="container-fluid">
				<div className="row px-md-4 m-0 py-5">
					<div className="col-12 col-lg-4 mb-3 mb-lg-0">
						<div className="Contacts__holder text-center py-6">
							<span className="mt-4">{t('contacts_header_email')}</span>
							<a href="mailto:support@lottolive.com" className="d-block mb-4">support@lottolive.com</a>
						</div>
					</div>
					<div className="col-12 col-lg-4 mb-3 mb-lg-0">
						<div className="Contacts__holder text-center py-6">
							<span className="mt-4">{t('contacts_header_phone')}</span>
							<a href="tel:+78009001001010" className="d-block mb-4">8 800 900 100 10 10</a>
						</div>
					</div>
					<div className="col-12 col-lg-4">
						<div className="Contacts__social-holder text-center d-flex flex-wrap justify-content-center align-items-center py-6">
							<div className="w-100">
								<a href="https://yandex.ru" className="secondary-btn mb-2 mb-lg-0"><img src={Telegram} alt="" className="mr-1" />Telegram</a>
							</div>
							<div className="w-100">
							 	<a href="https://yandex.ru" className="secondary-btn"><img src={Facebook} alt="" className="mr-1" />Facebook</a>
							 </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contacts;
