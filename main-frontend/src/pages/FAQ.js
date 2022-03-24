import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import HeadBlock from "../blocks/HeadBlock/HeadBlock";
import FaqOneItem from "../elements/FaqOneItem/FaqOneItem";

// graphic
import FAQArray from './icons/FAQArray.svg';

import './FAQ.scss';

const FAQ = (props) => {
	let [openAnswer, setOpenAnswer] = useState(false);
	const { t } = useTranslation();
	return (
		<div className="FAQ">
			<HeadBlock title={t('faq_title')}/>
			<div className="container-fluid px-1">
				<div className="row px-md-4 m-0 py-5">
					<div className="col-12 col-lg-8 mb-3 mb-lg-0">
						<div className="row">
							<div className="col-12 mb-2">
								<FaqOneItem question={t('question_one')} answer={t('answer_one')} /> 
							</div>
							<div className="col-12 mb-2">
								<FaqOneItem question={t('question_two')} answer={t('answer_two')} /> 
							</div>
							<div className="col-12 mb-2">
								<FaqOneItem question={t('question_three')} answer={t('answer_three')} /> 
							</div>
							<div className="col-12 mb-2">
								<FaqOneItem question={t('question_four')} answer={t('answer_four')} /> 
							</div>
							<div className="col-12 mb-2">
								<FaqOneItem question={t('question_five')} answer={t('answer_five')} /> 
							</div>
							<div className="col-12">
								<FaqOneItem question={t('question_six')} answer={t('answer_six')} /> 
							</div>
						</div>
					</div>
					<div className="col-12 col-lg-4">
						<div className="FAQ__not-answer d-flex flex-wrap justify-content-center align-items-center py-6 text-center px-4">
							<h4 className="mb-1 w-100">{t('faq_subtitle')}</h4>
							<p className="mb-2 w-100">{t('faq_text')}</p>
							<Link to="/contacts" className="secondary-btn ">{t('contacts_title')}</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FAQ;
