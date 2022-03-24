import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

import './Success.scss';

const Success = (props) => {
	const { t } = useTranslation();
	return (
		<div className="Success">
			<div className="container-fluid px-1 py-6 ">
				<div className="row py-4 m-0 justify-content-center align-items-center">
					<div className="col-12 col-md-10">
						<h2 className="mb-2">{t('success_title')}</h2>
						<p className="mb-3">{t('success_text')}</p>
						<Link to="/lk" className="white-md-btn d-inline-block">Go to personal account</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Success;
