import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import HeadBlock from "../blocks/HeadBlock/HeadBlock";

import './License.scss';

const License = (props) => {
	const { t } = useTranslation();
	return (
		<div className="License">
			<HeadBlock title={t('license_title')}/>
			<div className="container-fluid px-1">
				<div className="row py-4 m-0 justify-content-center">
					<div className="col-12 col-md-10">
						<div className="License__text-block p-3 p-sm-4">
							<p>{t('license_text')}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default License;
