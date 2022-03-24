import { useState, useEffect } from 'react';

// graphic
import FAQArray from './icons/FAQArray.svg';

import './FaqOneItem.scss';

const FaqOneItem = (props) => {
	let [openAnswer, setOpenAnswer] = useState(false);
	return (
		<div className="FaqOneItem p-3 d-flex flex-wrap justify-content-between align-items-center" onClick={(e) => {!openAnswer ? setOpenAnswer(true) : setOpenAnswer(false)}}>
				<h4 className="mb-0">{props.question}</h4>
				<img src={FAQArray} alt="" className={`question__img ${!openAnswer ? "question__img--close " : "question__img--open"}`}/>
				<div className={`FAQ__answer w-100 ${openAnswer ? "FAQ__answer--open" : "FAQ__answer--close"}`}>
					<p className={`answer__text mt-2 mb-0 ${!openAnswer ? "answer__text--close " : "answer__text--open"}`} dangerouslySetInnerHTML={{ __html: props.answer }}></p>
				</div>
			</div>
	);
};

export default FaqOneItem;
