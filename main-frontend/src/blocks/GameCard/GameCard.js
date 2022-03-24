import { useState } from 'react';
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'

// graphic
import BingoX from './img/BingoX.svg';
import Bingo37 from './img/Bingo37.svg';

// styles
import "./GameCard.scss";

let GameCard = (props) => {
	let [clicked, setClicked] = useState(false);
	const { t } = useTranslation();

	return (
		<div className="GameCard">
			{
				!props.game
				?
				<div className="GameCard__content justify-content-center">
					<div className="h-100 d-none d-lg-flex align-items-center justify-content-center">
						<span className="content__span">{t('gamecard_soon')}</span>
					</div>
				</div>
				:
				<>
				<button className="GameCard__content" onClick={(e) => clicked ? setClicked(false) : setClicked(true)}>
					<span className="flare"></span>
					<div className={`GameCard__icon position-relative d-flex align-items-center justify-content-center ${props.game}`}>
							{
								clicked
								? 
								<>
								<div className="GameCard_links">
									{props.role === "user" 
									? 
									<Link to={{pathname: "/games/"+props.game, state: {demo: false}}} className="third-btn mb-1 d-flex justify-content-center align-items-center">{t('gamecard_play')}</Link>
									:
									<Link to="/auth" className="third-btn mb-1 d-flex justify-content-center align-items-center">{t('gamecard_play')}</Link>}
									<Link to={{pathname: "/games/"+props.game, state: {demo: true}}} className="third-btn d-flex justify-content-center align-items-center">{t('gamecard_demo')}</Link>
								</div>
								<Link to={"/games/about/" + props.game} className="about-btn position-absolute">?</Link>
								</>
								:
								<>
								{props.game === "bingoX" && <img src={BingoX} alt=""/>}
								{props.game === "bingo37" && <img src={Bingo37} alt=""/>}
								</>
							}

					</div>
					<div className="px-2 py-3 text-left">
						<h3 className="d-block">{props.title}</h3>
						<span>{t('gamecard_span')}</span>
					</div>
				</button>
				</>
			}
		</div>
	);
}

export default GameCard;