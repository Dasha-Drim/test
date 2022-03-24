import { useState } from "react";
import InputPublic from '../../atoms/InputPublic/InputPublic';
import { useForm } from "react-hook-form";
import API from '../../utils/API';
import { useTranslation } from 'react-i18next'

import UserGeneralModal from "../../utils/UserGeneralModal/UserGeneralModal";
import './UserPromocode.scss';

function UserPromocode(props){
	const { t } = useTranslation();
	
	const { register, handleSubmit, errors, control, setError, clearErrors, setValue, getValues, reset } = useForm({shouldUnregister: false});

	const [generalModalIsOpen, setGeneralModalIsOpen] = useState(false);
	const [generalModalHeader, setGeneralModalHeader] = useState("");
	const [generalModalText, setGeneralModalText] = useState("");

	const promocodeSendRequest = async (data) => {
		let userData = await API.put('/players', data);
		return await userData.data;
	};
	//function send promo code
	let PromocodeSend = (data) => {
		data.action = 'promocode';
		promocodeSendRequest(data).then((result) => {
			console.log(result);
			if(result.success) {
				reset();
				setGeneralModalHeader(t('user_promocode_modal_success'));
				setGeneralModalText(t('user_promocode_modal_success_text'));
				setGeneralModalIsOpen(true);
				if(props.updatePaymentsHistory) props.updatePaymentsHistory();
			} else if(result.success == false) {
				setGeneralModalHeader(t('user_promocode_modal_error'));
				setGeneralModalText(result.message);
				setGeneralModalIsOpen(true);
			} else {
				setGeneralModalHeader(t('user_promocode_modal_error'));
				setGeneralModalText(t('user_promocode_modal_error_text'));
				setGeneralModalIsOpen(true);
			}
		},
		(error) => { 
			setGeneralModalHeader(t('user_promocode_modal_error'));
			setGeneralModalText("System error: "+ error);
			setGeneralModalIsOpen(true);
		})
	}
  return (
    <div className="UserPromocode p-4 d-flex justify-content-between align-items-center align-content-center flex-wrap">
        <div className="UserPromocode__info mb-2 mb-sm-0">
        	<h4 className="mb-2">{t('user_promocode_header')}</h4>
        	<p>{t('user_promocode_text')}</p>
        </div>
        <form onSubmit={handleSubmit(PromocodeSend)}>
	        <div className="mb-2">
	        	<InputPublic refy={register({required: true})} errors={errors} name="promocode" type="text" label={t('user_promocode_label')} />
	        </div>
        	<input type="submit" value={t('user_promocode_apply')} className="secondary-btn w-100" />
        </form>
        <UserGeneralModal modalIsOpen={generalModalIsOpen} modalIsOpenCallback={(state) => setGeneralModalIsOpen(state)} modalHeader={generalModalHeader} modalText={generalModalText} />
    </div>
  )
}

export default UserPromocode;
