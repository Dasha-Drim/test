import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'


// graphic

import './TopWins.scss';

const TopWins = (props) => {
	const { t } = useTranslation();
	let wins = [
		{id: 1, player: "1275..23", win: "138 000 ₽"},
		{id: 2, player: "1275..23", win: "120 000 ₽"},
		{id: 3, player: "1275..23", win: "101 000 ₽"},
		{id: 4, player: "1275..23", win: "80 000 ₽"},
		{id: 5, player: "1275..23", win: "78 000 ₽"},
	]
	return (
		<div className="TopWins p-3">
			<h4 className="mb-2">{t('top_wins')}</h4>
			{
				wins.map((item, key) => 
					<div className="d-flex justify-content-between align-items-center TopWins__line" key={key}>
						<div className="d-flex align-items-center">
							<span>{item.id}</span>
							<span className="ml-2">{item.player}</span>
						</div>
						<span>{item.win}</span>
					</div>
				)
			}
		</div>
	);
};

export default TopWins;
