import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import HeadBlock from "../blocks/HeadBlock/HeadBlock";

import './Principles.scss';

const Principles = (props) => {
	const { t } = useTranslation();
	return (
		<div className="Principles">
			<HeadBlock title={t('principles_title')}/>
			<div className="container-fluid px-1">
				<div className="row py-4 m-0 justify-content-center">
					<div className="col-12 col-md-10">
						<div className="Principles__text-block p-3 p-sm-4">
						<p>{t('paragraph_one')}</p>
						<p>{t('paragraph_two')}</p>

						<h3>{t('paragraph_header_one')}</h3>
						<p>{t('paragraph_three')}</p>

						<h3>{t('paragraph_header_two')}</h3>
						<p>{t('paragraph_four')}</p>
						<p>{t('paragraph_five')}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Principles;
