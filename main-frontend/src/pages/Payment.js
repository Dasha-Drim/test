import { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import { useTranslation } from 'react-i18next'
import InputPublic from '../atoms/InputPublic/InputPublic';
import API from '../utils/API';
import PaymentGeneralModal from "../utils/PaymentGeneralModal/PaymentGeneralModal";

//graphics
import cross from './icons/cross.svg';

import './Payment.scss';

const Payment = (props) => {
	const { t } = useTranslation();

	const [cookieToken, setCookieToken] = useState("");
	let location = useLocation();
	let history = useHistory();
	
	const [methods, setMethodth] = useState(null);
	const [methodInfo, setMethodInfo] = useState(null);
	const [amount, setAmount] = useState(null);
	const [wallet, setWallet] = useState(null);
	const [phone, setPhone] = useState(null);
	const [card, setCard] = useState(null);
	const [type, setType] = useState(null);

	const [generalModalIsOpen, setGeneralModalIsOpen] = useState(false);
	const [generalModalHeader, setGeneralModalHeader] = useState("");
	const [generalModalText, setGeneralModalText] = useState("");

	const [modalOpen, setModalIsOpen] = useState(false);
	let closeModal = () => setModalIsOpen(false);
	const [modalInterkassaOpen, setModalInterkassaIsOpen] = useState(false);
	let closeModalInterkassa = () => setModalInterkassaIsOpen(false);
	const { register, handleSubmit, errors, reset } = useForm({shouldUnregister: false});

	let updateInput = (e) => setWallet(e)
	let updateInputPhone = (e) => setPhone(e)
	let updateInputCard = (e) => setCard(e)

	useEffect(() => {
		console.log("location.state", location.state);
		setCookieToken(Cookies.get("token"));
		(location.state && location.state.methods) ? setMethodth(location.state.methods) : history.push("/lk");
		(location.state && location.state.amount) ? setAmount(location.state.amount) : history.push("/lk");
		(location.state && location.state.type) ? setType(location.state.type) : history.push("/lk");
	})

	const submitWithdrawRequest = async (data) => {
		let userData = await API.post('/withdraw', data);
		return await userData.data;
	};

	let withdrawRequest = async (e) => {
		e.preventDefault();
		//setIsRequest(true)
		console.log("method", methodInfo);
		if (methodInfo.type === "paykassapro") {
			let info = {
				method: {
					name: methodInfo.type,
					data: {
						wallet: wallet,
						currency: methodInfo.data.currency,
						amount: amount
					}
				}
			}
			submitWithdrawRequest(info).then((response) => {
				//updateBalanceForm.current.elements["amount"].value = "";
				console.log("response", response);
				if (response.success) {
					//history.push({pathname: "/payment", state: {methods: response.methods, amount: response.payment.amount.value, type: "deposit"}});
					setGeneralModalHeader(t('model_success_title'));
					setGeneralModalText(t('model_success_text'));
					setGeneralModalIsOpen(true);
					setModalIsOpen(false)
				} else {
					console.log("error333");
					setGeneralModalHeader(t('model_error_title'));
					setGeneralModalText(response.message);
					setGeneralModalIsOpen(true);
				}
			}).catch(function(error) {
				console.log("error", error);
				/*setGeneralModalHeader("Ошибка");
				setGeneralModalText("Ой! Что-то пошло не так. Похоже сервер недоступен, обновите страницу и попробуйте снова.");
				setGeneralModalIsOpen(true);*/

			})
		}
		if (methodInfo.type === "interkassa") {
			let info = {
				method: {
					name: methodInfo.type,
					data: {
						card: card,
						phone: phone,
						//currency: methodInfo.currency,
						amount: amount,
					}
				}
			}
			submitWithdrawRequest(info).then((response) => {
				//updateBalanceForm.current.elements["amount"].value = "";
				console.log("response", response);
				if (response.success) {
					//history.push({pathname: "/payment", state: {methods: response.methods, amount: response.payment.amount.value, type: "deposit"}});
					setGeneralModalHeader(t('model_success_title'));
					setGeneralModalText(t('model_success_text'));
					setGeneralModalIsOpen(true);
					setModalInterkassaIsOpen(false)
				} else {
					console.log("error333");
					setGeneralModalHeader(t('model_error_title'));
					setGeneralModalText(response.message);
					setGeneralModalIsOpen(true);
				}
			}).catch(function(error) {
				console.log("error", error);
				/*setGeneralModalHeader("Ошибка");
				setGeneralModalText("Ой! Что-то пошло не так. Похоже сервер недоступен, обновите страницу и попробуйте снова.");
				setGeneralModalIsOpen(true);*/

			})
		}
	}


	return (
		<>
		<div className="Payment">
			<div className="container-fluid">
				<div className="row justify-content-center m-0">
					<div className="col-12 col-lg-8">
						<div className="text-center mb-6 mt-2">
							<h1>Lotolive</h1>
						</div>
						<div className="mb-4 d-flex justify-content-between align-items-center">
							<h2>{t('payment_text')}</h2>
							<span>{t('payment_sum')}: {amount}</span>
						</div>
						<div className="row">
						{
							methods
							?
							
								methods.length
								?
								methods.map((item, id) => 
								<div className="col-12 col-sm-6 col-lg-4 mb-2" key={id}>
								{
									(type === "withdraw")
									?
									<div className="d-block text-center py-2 Payment__item" onClick={() => {(item.type === "interkassa") ? setModalInterkassaIsOpen(true) : setModalIsOpen(true); setMethodInfo(item)}}>
										<img className="mb-1" src={item.logotype} alt="" />
										<h3>{item.name}</h3>
									</div>
									:
										item.way["request_type"] === "GET"
										?
										<a href={item.way.url} className="d-block text-center py-2 Payment__item">
											<img className="mb-1" src={item.logotype} alt="" />
											<h3>{item.name}</h3>
										</a>
										:
										<form action={item.way.url} className="text-center py-2 Payment__item">
											{
												Object.keys(item.way.data).map(key => 
													<input type="hidden" name={key} value={item.way.data[key]} />
												)
											}
											<input type="hidden" name="ik_x_token" value={cookieToken}/>
											<input type="hidden" name="ik_x_domainName" value={document.domain+(window.location.port ? ":"+window.location.port : "")}/>
											<button type="submit">
												<img className="mb-1" src={item.logotype} alt="" />
												<h3>{item.name}</h3>
											</button>
										</form>
									
								}
								</div>
							)
								:
								<div className="col-12 d-flex flex-wrap justify-content-center mt-6">
									<p className="d-flex w-100 justify-content-center mb-5">{t('no_methods_text')}</p>
									<Link to="/lk" className="white-md-btn d-inline-block">{t('go_to_lk')}</Link>
								</div>
							:
							"загрузка"
						}
						</div>
					</div>
				</div>
			</div>
		</div>
		<Modal
	        isOpen={modalOpen}
	        onRequestClose={closeModal}
	        className="Modal-payment"
	        overlayClassName="OverlayModal"
	      >
        <div className="modal_inner">
	        <button className="crossBtn" onClick={()=> closeModal()}> <img src={cross} /> </button>
	        <h2>{t('modal_withdraw_title')}</h2>
	        <p>{t('modal_withdraw_text')}</p>
	        <form>
	        	<InputPublic name="wallet" refy={register({required: true})} errors={errors} label={t('modal_withdraw_label_wallet')} updateInput={updateInput}/>
	        	<div className="text-center">
	        		<button onClick={(e) => {withdrawRequest(e)}}>{t('withdraw_btn')}</button>
	        	</div>
	        </form>
        </div>
      </Modal>
      <Modal
	        isOpen={modalInterkassaOpen}
	        onRequestClose={closeModalInterkassa}
	        className="Modal-payment"
	        overlayClassName="OverlayModal"
	      >
        <div className="modal_inner">
	        <button className="crossBtn" onClick={()=> closeModalInterkassa()}> <img src={cross} /> </button>
	        <h2>{t('modal_withdraw_title')}</h2>
	        <p>{t('modal_withdraw_text')}</p>
	        <form>
	        	<InputPublic name="card" refy={register({required: true})} errors={errors} label={t('modal_withdraw_label_card')} updateInput={updateInputCard}/>
	        	<InputPublic name="phone" refy={register({required: true})} errors={errors} label={t('modal_withdraw_label_phone')} updateInput={updateInputPhone}/>
	        	<div className="text-center">
	        		<button onClick={(e) => {withdrawRequest(e)}}>{t('withdraw_btn')}</button>
	        	</div>
	        </form>
        </div>
      </Modal>
      <PaymentGeneralModal modalIsOpen={generalModalIsOpen} modalIsOpenCallback={(state) => setGeneralModalIsOpen(state)} modalHeader={generalModalHeader} modalText={generalModalText} />
      </>
	);
};

export default Payment;
