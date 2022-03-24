import { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import Loader from '../../../../components/Loader';
import InputMoney from "../../../../components/InputMoney";
import InfoModal from '../../../../utils/modal/InfoModal';

import api from '../../../../packages/api';

const BalanceSection = (props) => {
	/* PROPS:
	props.balance
	props.accountCurrency
	*/
	//props.idUser
	const [balance, setBalance] = useState(null);

	let [isModalOpen, setIsModalOpen] = useState(false);
	let [modalData, setModalData] = useState(null);

	let closeModal = () => {
		setIsModalOpen(false);
	}

	let playersRequest = (params, { setSubmitting }) => {
		api.players.putPlayers(params).then(result => {
			setSubmitting(false);
			if (result.data.success) {
				setModalData({content: "<p>Баланс игрока успешно изменён</p>"});
				setIsModalOpen(true);
				setBalance(result.data.balance);
			} else {
				setModalData({content: "<p>" + result.data.message + "</p>"});
				setIsModalOpen(true);
			}
		});
	}

	const onSubmit = (values, { setSubmitting }) => {
		let formData = new FormData();
    	for (let key in values) formData.append(key, values[key]);
    	formData.append("idUser", props.idUser);
		playersRequest(formData, { setSubmitting });
	}

	let initialValues = { action: 'deposit', amount: '' };

	let validationSchema = Yup.object({
		amount: Yup.string().required('Обязательно'),
	})

	useEffect(() => {
		if (props.balance !== false) setBalance(props.balance);
	}, [props])

	return (
		<div className="BalanceSection">
			<h3 className="mb-3">Баланс</h3>
			{balance !== false && props.accountCurrency ? <>
				<div className="card mb-5">
						<div className="card-header py-3 d-flex justify-content-between">
							<span>Текущий баланс</span>
							<span>{balance} {props.accountCurrency}</span>
						</div>
				</div>

				<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} >
					{({ errors, touched, setFieldValue, values, isSubmitting }) => (
						<Form>
							<div className="btn-group mb-3 d-flex" role="group">
								<Field type="radio" className="btn-check" name="action" value="deposit" onClick={() => setFieldValue("action", "deposit")} id="deposit" autoComplete="off" checked={values.action === "deposit"} />
								<label className="btn btn-outline-secondary d-block" htmlFor="deposit">Пополнение</label>

								<Field type="radio" className="btn-check" name="action" value="withdraw" onClick={() => setFieldValue("action", "withdraw")} id="withdraw" autoComplete="off" checked={values.action === "withdraw"} />
								<label className="btn btn-outline-secondary d-block" htmlFor="withdraw">Списание</label>
							</div>

							<div className="mb-3">
								<Field 
									name="amount"
									component={InputMoney}
									label="Сумма *"
									id="amount"
									currency={props.accountCurrency}
								/>
							</div>

							<div className="pt-3">
								<button type="submit" className="btn btn-primary w-100">Произвести операцию</button>
							</div>
						</Form>
					)}
				</Formik>
			</> :
				<div><Loader /></div>
			}
			<InfoModal isOpen={isModalOpen} onCancel={() => closeModal()} {...modalData} />
		</div>
	);
}

export default BalanceSection;