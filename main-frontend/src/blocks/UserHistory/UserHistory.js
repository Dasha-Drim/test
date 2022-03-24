import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useTranslation } from 'react-i18next'

import './UserHistory.scss';

// components
import API from '../../utils/API';

// graphic
import Bonus from './icons/Bonus.svg';
import Debiting from './icons/Debiting.svg';
import Replenishment from './icons/Replenishment.svg';
import Pending from './icons/Pending.svg';
import Canceled from './icons/Canceled.svg';

const UserHistory = (props) => {
	const { t } = useTranslation();
	let [balanceOperations, setBalanceOperations] = useState(null);
	let [limitOperations, setLimitOperations] = useState(4);
	let [allResults, setAllResults] = useState(0);
	const getBalanceOperationsRequest = async (data) => {
		let userData = await API.get('/players/operations', {params: data});
		return await userData.data;
	};
	let balanceOperationsRequestLoad = (limit) => {
		getBalanceOperationsRequest({timeZone: DateTime.local().zoneName, limit: limit}).then(
			(result) => {
				if(result.operations) {
					setBalanceOperations(result.operations);
					setAllResults(result.allResults);
					console.log('result', result.operations)
					console.log('allResults', result.allResults)
				}
			},
			(error) => {
				alert(error);
			}
			)
	}
	useEffect(() => {
		setAllResults(0);
		setBalanceOperations(null);
		setLimitOperations(4);
		balanceOperationsRequestLoad(limitOperations);
	}, [props])

	return (
		
		<div className="UserHistory p-4">
			<h4 className="mb-2">{t('user_history_header')}</h4>
			{balanceOperations ? 
				allResults !== 0 ?
				<>
					{balanceOperations.map((item, id) => 
						<div className="d-flex align-items-center justify-content-between mb-2" key={id}>
							<div className="d-flex align-items-center">
								{((item.type === "up") && (item.method === "bonus")) && <img src={Bonus} alt="" />}
								{((item.type === "up") && (item.method !== "bonus") && (item.status !== "pending") && (item.status !== "canceled")) && <img src={Replenishment} alt="" />}
								{((item.type === "up") && (item.status === "pending") && (item.method !== "bonus")) && <img src={Pending} alt="" />}
								{((item.type === "up") && (item.status === "canceled") && (item.method !== "bonus")) && <img src={Canceled} alt="" />}

								{(item.type === "down" && (item.status !== "pending") && (item.status !== "canceled")) && <img src={Debiting} alt="" />}
								{(item.type === "down" && (item.status === "pending")) && <img src={Pending} alt="" />}
								{(item.type === "down" && (item.status === "canceled")) && <img src={Canceled} alt="" />}
								
								<div className="ml-2">
									<h5>{item.type === "up" ? "Replenishment" : "Debit"} {(item.status === "canceled") && t('user_history_status_canceled')}</h5>
									<span>{item.method === "non-cash" ? t('user_history_type_you') : item.method === "bonus" ? t('user_history_type_bonus') : t('user_history_type_admin')}</span>
								</div>
							</div>
							<div className="text-right">
								<h5>{item.type === "up" ? "+"+item.amount : "-"+item.amount}</h5>
								<span>{item.dateTime}</span>
							</div>
						</div>
					)}
					{allResults > limitOperations ? 
			          <div className="d-flex justify-content-center">
			            <button className="secondary-btn" onClick={() => {balanceOperationsRequestLoad(limitOperations+4); setLimitOperations(limitOperations+4);}}>{t('user_history_show_more')}</button>
			          </div>
	          		: ""}
				</>
				:
				<span>{t('user_history_no_operations')}</span>
				
				:
				<div className="w-100 text-center">
					<h2>{t('loading')}</h2>
				</div>
			}
		</div>
	);
};

export default UserHistory;
