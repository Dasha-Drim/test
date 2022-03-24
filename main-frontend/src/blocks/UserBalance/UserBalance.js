import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import API from '../../utils/API';

import './UserBalance.scss';

const UserBalance = (props) => {
	const { t } = useTranslation();
	const [balance, setBalance] = useState("");
	const [currency, setCurrency] = useState("");

	const getBalanceRequest = async (data) => {
		let userData = await API.get('/players/balance');
		return await userData.data;
	};
	useEffect(() => {
		console.log('balance request')
		getBalanceRequest().then(
			(result) => {
				console.log(result);
				if(result.success) {
					setCurrency(result.currency);
					setBalance(result.balance);
				}
				if(props.getBalanceFromServer) {
					console.log('SEND BALANCE');
					props.getBalanceFromServer(result.balance);
				}
			},
			(error) => {
				console.log(error);
			}
			)
	}, [props])
	return (
		<div className="UserBalance p-4 text-center">
			<h4>{balance} {currency}</h4>
			<span>{t('header_balance')}</span>
		</div>
	);
};

export default UserBalance;
