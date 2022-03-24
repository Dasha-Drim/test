import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import Header from "../blocks/Header/Header";
import Footer from "../blocks/Footer/Footer";
import GameCard from "../blocks/GameCard/GameCard";

import './Games.scss';

const Games = (props) => {
	// AUTH METHOD
	let auth = props.useAuth();
	// END OF AUTH METHOD
	const { t } = useTranslation();
	return (
		<div className="Games">
			<div className="container-fluid">
				<div className="row px-1 px-md-4 m-0 py-3 py-lg-5">
					<div className="col-12">
						<h2>{t('header_games')}</h2>
					</div>
					<div className="col-12 my-4">
						<div className="row">
							<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0">
								<GameCard game="bingoX" title={t('bingo_x_title')} role={auth.userType}/>
							</div>
							<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0">
								<GameCard game="bingo37" title={t('bingo_37_title')} role={auth.userType}/>
							</div>
							<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0 d-none d-lg-block">
								<GameCard  />
							</div>
							<div className="col-12 col-sm-6 col-lg-3 mb-3 mb-sm-0 d-none d-lg-block">
								<GameCard  />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Games;
