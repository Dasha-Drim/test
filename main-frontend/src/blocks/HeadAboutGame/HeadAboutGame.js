import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// graphic
import LogoBingo from './img/LogoBingo.svg';
import LogoRoulette from './img/LogoRoulette.svg';
import LogoBingoX from './img/LogoBingoX.svg';
import Array from './img/Array.svg';

import './HeadAboutGame.scss';

const HeadAboutGame = (props) => {
	const { t } = useTranslation();
	return (
		<div className={`HeadAboutGame ${props.game}`}>
			<div className="HeadAboutGame__background">
			<div className="container-fluid">
				<div className="HeadAboutGame__header row px-1 px-md-4 m-0 pt-4 pb-3 justify-content-center">
					<div className="col-12 col-sm-10 mb-3">
						<Link to="/games" className="d-flex align-items-center HeadAboutGame__link"><img src={Array} alt="" className="mr-2" />{t('header_game_back')}</Link>
					</div>
					<div className="col-12 col-sm-10">
						<div className="header__main-info d-flex flex-wrap flex-lg-nowrap justify-content-center justify-content-lg-between align-items-center my-5 p-2 p-sm-4">
							<div className="d-flex align-items-center justify-content-center justify-content-sm-start main-info__description mb-3 mb-lg-0 flex-wrap flex-sm-nowrap">
								{props.game == "bingo37" && <img src={LogoBingo} alt="" />}
								{props.game == "bingox" && <img src={LogoBingoX} alt="" />}
								<div className="ml-0 ml-sm-3 mt-2 mt-sm-0 description__text text-center text-sm-left">
									<h2>{props.title}</h2>
									{props.game === "bingo37" && <p className="mb-0">{t('header_game_bingo37')}</p>}
									{props.game === "bingox" && <p className="mb-0">{t('header_game_bingoX')}</p>}
								</div>
							</div>
							<div className="main-info__btns">
								{props.role === "user" 
								? 
								<Link to={{pathname: "/games/"+props.game, state: {demo: false}}} className="secondary-btn mb-1 mb-sm-0">{t('header_game_play')}</Link>
								:
								<Link to="/auth" className="secondary-btn mb-1 mb-sm-0">{t('header_game_play')}</Link>}

								<Link to={{pathname: "/games/"+props.game, state: {demo: true}}} className="third-btn ml-sm-1">{t('header_game_demo')}</Link>
							</div>
						</div>
					</div>
				</div>
			</div>

			</div>
			
		</div>
	);
};

export default HeadAboutGame;
/*to={{
    pathname: '/home/userDetails',
    state: {infoId: info.id},
  }}*/