import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

import './Error.scss';

const Error = (props) => {
	const { t } = useTranslation();
	return (
		<div className="Error">
			<div className="container-fluid px-1 py-6 ">
				<div className="row py-4 m-0 justify-content-center align-items-center">
					<div className="col-12 col-md-10">
						<h2 className="mb-2">{t('error_title')}</h2>
						<p className="mb-3">{t('error_message')}</p>
						<Link to="/lk" className="white-md-btn d-inline-block">{t('go_to_lk')}</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Error;
