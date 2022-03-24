import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'

// components
import GameCard from "../blocks/GameCard/GameCard";
import AdvantageCard from "../blocks/AdvantageCard/AdvantageCard";

// graphic
import youWin from './img/youWin.svg';
import arrayLink from './img/arrayLink.svg';
import personBlack from './img/personBlack.svg';
import miniLogo from './img/miniLogo.svg';


import gradient from './img/gradient.svg';

import mainPic from './img/mainPic.svg';
import Lottoball1 from './img/Lottoball1.svg';
import Lottoball2 from './img/Lottoball2.svg';
import Lottoball3 from './img/Lottoball3.svg';
import Lottoball4 from './img/Lottoball4.svg';
import Lottoball5 from './img/Lottoball5.svg';
import Lottoball6 from './img/Lottoball6.svg';

import './Home.scss';



const Home = (props) => {
	let auth = props.useAuth();
	const { t } = useTranslation()
	
	
	return (
		<div className="Home">
		<div className="gradient__holder"><img src={gradient} /></div>
			<div className="container-fluid">
				<div className="Home__main-container row px-1 px-md-4 m-0">
					<div className="col-12 pt-6 pb-5 d-flex justify-content-between align-items-center flex-wrap flex-lg-no-wrap">
						<div className="pt-5 order-1 order-lg-0">
							<h1 className="mb-3" dangerouslySetInnerHTML={{ __html: t("title") }}></h1>
							<p className="mb-3">{t('subtitle')}</p>
							<Link to="/auth" className="main-btn">{t('registration_btn')}</Link>
						</div>
						<div className="position-relative order-0 order-lg-1 d-none d-md-flex d-lg-block justify-content-center image__holder">

								<img src={mainPic} alt="" className="pr-xl-6 mr-lg-3 chips__img"/>
								<img src={Lottoball1} className="position-absolute lottoball lottoball__one" alt="" />
								<img src={Lottoball2} className="position-absolute lottoball lottoball__two" alt=""/>
								<img src={Lottoball3} className="position-absolute lottoball lottoball__three" alt=""/>
								<img src={Lottoball4} className="position-absolute lottoball lottoball__four" alt=""/>
								<img src={Lottoball6} className="position-absolute lottoball lottoball__five" alt=""/>

						</div>
					</div>
				</div>
				<div className="Home__adventage-container row px-1 px-md-4 py-5 m-0">
					<AdvantageCard title={t('title_advantage_card_one')} text={t('text_advantage_card_one')} icon="lottomachine"/>
					<AdvantageCard title={t('title_advantage_card_two')} text={t('text_advantage_card_two')} icon="license"/>
					<AdvantageCard title={t('title_advantage_card_three')} text={t('text_advantage_card_three')} icon="rules"/>
				</div>
				<div className="Home__games-container row px-1 px-md-4 py-5 m-0">
					<div className="col-12 mb-4">
						<h2>{t('header_games')}</h2>
					</div>
					<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0">
						<GameCard game="bingoX" title={t('bingo_x_title')} role={auth.userType}/>
					</div>
					<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0">
						<GameCard game="bingo37" title={t('bingo_37_title')} role={auth.userType}/>
					</div>
					<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0 d-none d-lg-block">
						<GameCard  />
					</div>
					<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0  d-none d-lg-block">
						<GameCard  />
					</div>
					<div className="col-12 mt-4 text-center">
						<Link to="/games" className="third-btn">{t('link_to_games')}</Link>
					</div>
				</div>
				<div className="Home__bonus-container row px-1 px-md-4 py-5 pt-6 m-0">
					<div className="col-12 position-relative">
						<img src={Lottoball5} alt="" className="position-absolute lottoball lottoball__five"/>
						<img src={Lottoball2} alt="" className="position-absolute lottoball lottoball__two"/>
						<img src={Lottoball1} alt="" className="position-absolute lottoball lottoball__one"/>
						<img src={Lottoball3} alt="" className="position-absolute lottoball lottoball__three"/>
						<img src={Lottoball4} alt="" className="position-absolute lottoball lottoball__four"/>
						<div className="bonus-container__holder d-flex justify-content-center flex-wrap text-center p-3 p-sm-5 row">
							<h1 className="col-12 mb-3">{t('welcome_bonus_header')}</h1>
							<p className="col-12 mb-3" dangerouslySetInnerHTML={{ __html: t("welcome_bonus_text") }}></p>
							<div className="col-12 col-sm-6 col-lg-4 p-3 holder__bonus">
								<div className="d-flex justify-content-between mb-1">
									<span className="bonus__span-bold">START</span>
									<span className="bonus__span-bold">3$</span>
								</div>
								<div className="d-flex justify-content-between mb-3">
									<span>{t('welcome_bonus_span_one')}</span>
									<span>{t('welcome_bonus_span_two')}</span>
								</div>
								<Link to="/auth" className="main-btn w-100">{t('registration_btn')}</Link>
							</div>
						</div>
					</div>
				</div>
				<div className="Home__adventage-two-container row px-1 px-md-4 pt-6 pb-4 m-0">
					<div className="col-12 col-sm-6 col-lg-4 mb-4 mb-lg-0">
						<h4 className="mb-3">{t('title_advantage_one')}</h4>
						<p>{t('text_advantage_one')}</p>
					</div>
					<div className="col-12 col-sm-6 col-lg-4 mb-4 mb-lg-0">
						<h4 className="mb-3">{t('title_advantage_two')}</h4>
						<p>{t('text_advantage_two')}</p>
					</div>
					<div className="col-12 col-sm-6 col-lg-4 mb-4 mb-lg-0">
						<h4 className="mb-3">{t('title_advantage_three')}</h4>
						<p>{t('text_advantage_three')}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
