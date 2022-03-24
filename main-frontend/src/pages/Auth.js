import { useState, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import Header from "../blocks/Header/Header";
import Footer from "../blocks/Footer/Footer";

import './Auth.scss';

const Auth = (props) => {
	// AUTH METHOD
	let auth = props.useAuth();
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(auth.userType !== "vizitor");
	// END OF AUTH METHOD
	const { t } = useTranslation();
	return (
		<div className="Auth">
		{userIsLoggedIn ? <Redirect to="/lk" /> : ""}
			<div className="container-fluid">
				<div className="row m-0 px-1 px-md-4 py-5 justify-content-center">
					<div className="col-12 col-sm-8 col-lg-6 Auth__content d-flex justify-content-center">
						<div className="content__holder text-center py-5 py-sm-6 px-2 px-sm-4">
							<h2 className="mb-2">{t('auth_title')}</h2>
							<p className="mb-4">{t('auth_subtitle')}</p>
							<Link to="/registation" className="main-btn d-block mb-1">{t('register')}</Link>
							<Link to="/login" className="content__link">{t('sign_in')}</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Auth;

