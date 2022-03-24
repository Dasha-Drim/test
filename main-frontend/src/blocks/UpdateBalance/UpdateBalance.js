import { useState, useRef } from "react";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import UserGeneralModal from "../../utils/UserGeneralModal/UserGeneralModal";

//components
import InputPublic from '../../atoms/InputPublic/InputPublic';
import API from '../../utils/API';
import { useTranslation } from 'react-i18next'

import './UpdateBalance.scss';

const UpdateBalance = (props) => {
	const { t } = useTranslation();
	const [generalModalIsOpen, setGeneralModalIsOpen] = useState(false);
	const [generalModalHeader, setGeneralModalHeader] = useState("");
	const [generalModalText, setGeneralModalText] = useState("");

	const { register, handleSubmit, errors, reset } = useForm({shouldUnregister: false});
	const [amount, setAmount] = useState("");
	let [method, setMethod] = useState(null);

	let [isRequest, setIsRequest] = useState(false);

	const updateBalanceForm = useRef(null);
	let history = useHistory();

	let updateInput = (e) => {
		setAmount(e);
	}

	const submitWithdrawRequest = async (data) => {
		let userData = await API.post('/withdraw', data);
		return await userData.data;
	};

	const submitDepositRequest = async (data) => {
		let userData = await API.post('/payments', data);
		return await userData.data;
	};

	let onSumbitUpdateBalance = async (e) => {
		if(method == "deposit") {
			e.preventDefault();
			setIsRequest(true)
			submitDepositRequest({amount: amount}).then((response) => {
				updateBalanceForm.current.elements["amount"].value = "";
				console.log("response", response);
				if (response.success) {
					history.push({pathname: "/payment", state: {methods: response.methods, amount: amount, type: "deposit"}});
				} else {
					console.log("error333");
					setGeneralModalHeader(t('update_balance_modal_error'));
					setGeneralModalText(response.message);
					setGeneralModalIsOpen(true);
				}
			}).catch(function(error) {
				console.log("error", error);
				setGeneralModalHeader(t('update_balance_modal_error'));
				setGeneralModalText(t('update_balance_modal_error_text'));
				setGeneralModalIsOpen(true);
				
			})
		}
		if(method == "withdraw") {
			e.preventDefault();
			submitWithdrawRequest({amount: amount}).then((response) => {
				console.log("response", response);
				updateBalanceForm.current.elements["amount"].value = "";
				if (response.success) {
					//props.getBalance();
					//setGeneralModalHeader("Успешно");
					//setGeneralModalText("Вы создали заявку на вывод. Ожидайте, вывод может занимать до 48 часов. Если что-то пойдёт не так — свяжитесь с техподдержкой");
					//setGeneralModalIsOpen(true);
					history.push({pathname: "/payment", state: {methods: response.methods, amount: response.payment.amount.value, type: "withdraw"}});
				} else {
					console.log("error2");
					setGeneralModalHeader(t('update_balance_modal_error'));
					setGeneralModalText(response.message);
					setGeneralModalIsOpen(true);
				}
			}).catch(function(error) {
				console.log("error1", error);
				setGeneralModalHeader(t('update_balance_modal_error'));
				setGeneralModalText(t('update_balance_modal_error_text'));
				setGeneralModalIsOpen(true);
			})
		}
	}

	return (
		<div className="UpdateBalance p-4">
			<div className={`loader-payment ${isRequest ? "d-flex" : "d-none"}`}><p>Request being processed</p><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
			<h4 className="mb-2">{t('update_balance_header')}</h4>
			<p>{t('update_balance_text')}</p>
			<div className="d-flex flex-wrap justify-content-center mt-3 UpdateBalance__form-holder">				
				<form name="payment" method="post" onSubmit={onSumbitUpdateBalance} encType="utf-8" ref={updateBalanceForm}>
					<InputPublic name="amount" refy={register({required: true})} errors={errors} label={t('update_balance_label')} updateInput={updateInput}/>
					<input type="submit" className="mt-2 w-100 main-btn" value={t('update_balance_btn_replenish')} onClick={() => setMethod("deposit")}/>
					<input type="submit" className="mt-1 w-100 third-btn" value={t('update_balance_btn_withdraw')} onClick={() => setMethod("withdraw")}/>
				</form>
			</div>

			<UserGeneralModal modalIsOpen={generalModalIsOpen} modalIsOpenCallback={(state) => setGeneralModalIsOpen(state)} modalHeader={generalModalHeader} modalText={generalModalText} />
		</div>
	);
};

export default UpdateBalance;
