import { Link } from "react-router-dom";
import {useEffect, useState} from "react"

// graphic
import Сard from './img/Сard.svg';
import Sun from './img/Sun.svg';
import Up from './img/Up.svg';


import Lottomachine from './img/Lottomachine.svg';
import License from './img/License.svg';
import Rules from './img/rules.svg';

// styles
import "./AdvantageCard.scss";

let AdvantageCard = (props) => {
	let [titleAdventage] = useState(props.title.split(''));
	return (
		<div className="AdvantageCard col-12 col-sm-6 col-lg-4 mb-3 mb-lg-0">
			<div className="AdvantageCard__content p-4 d-flex">
					{props.icon === "rules" && <img src={Rules} alt="" />}
					{props.icon === "license" && <img src={License} alt="" />}
					{props.icon === "lottomachine" && <img src={Lottomachine} alt="" />}
					<div>
						<h4 className="ml-3 mb-2">{titleAdventage.map((item, id) => <span key={id}>{item}</span>)}</h4>
						<p className="ml-3 mb-0">{props.text}</p>
					</div>
			</div>
		</div>
	);
}

export default AdvantageCard; 