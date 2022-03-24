import { useState, useEffect } from 'react';
import { Redirect, Link, useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next'

// components
import API from '../utils/API';
import Header from "../blocks/Header/Header";
import Footer from "../blocks/Footer/Footer";
import InputPublic from '../atoms/InputPublic/InputPublic';
import Select from '../atoms/Select/Select';
import ControllerInput from '../atoms/InputPublic/ControllerInput';

// graphic
import ArrayBack from './img/ArrayBack.svg';

import './Registration.scss';

const Registration = (props) => {

	const { t } = useTranslation();
	
  	const { register: registerSignUp, handleSubmit: handleSubmitSignUp, errors: errorsSignUp, control: controlSignUp, setError: setErrorSignUp, clearErrors: clearErrorsSignUp} = useForm();
 	const { register: registerSignUpConfirm, handleSubmit: handleSubmitSignUpConfirm, errors: errorsSignUpConfirm, control: controlSignUpConfirm, setError: setErrorSignUpConfirm, clearErrors: clearErrorsSignUpConfirm} = useForm();
	
	const [methodRegistration, setMethodRegistration] = useState(null);
	const [stepRegistartion, setStepRegistartion] = useState(1);

	const [currency, setCurrency] = useState([{value: 'RUB', label: 'RUB'}, {value: 'USD', label: 'USD'}, {value: 'EUR', label: 'EUR'}, {value: 'KZT', label: 'KZT'}]);
	const [chooseCurrency, setChooseCurrency] = useState(null);

	let history = useHistory();

	// AUTH METHOD
	let auth = props.useAuth();
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(auth.userType !== "vizitor");
	// END OF AUTH METHOD

	const signUpRequest = async (data) => {
	    let userData = await API.post('/registration/players', data);
	    return await userData.data;
	};

  	let SingUp = (data) => {
	    if (methodRegistration === "phone") data.phone = String(data.phone.replace(/[^0-9+]+/g,""));
	    data.currency = chooseCurrency;
	    signUpRequest(data).then((result) => {
	    	console.log(result);
	    	if (result.success) setStepRegistartion(3);
	    	else {
	    		if (result.message == "That phone is already taken.") {
	    			console.log('fffff')
	    			setErrorSignUp("alreadyRegistered", {
	    				type: "manual",
	    				message: "You are already registered"
	    			});
	    		} else {
	    			setErrorSignUp("wrongDataSignUp", {
	    				type: "manual",
	    				message: "Incorrect username or password entered"
	    			});
	    		}
	    	}
	    },
	    (error) => {
      		alert("System error: "+ error)
    	})
  	}

  	let selectFunc = (name, value) => {
  		setChooseCurrency(value.value)
  	}

  	const signUpConfirmRequest = async (data) => {
  		let userData = await API.post('/registration/players', data);
  		return await userData.data;
  	};

  	let SingUpConfirm = (data) => {
  		console.log('data', data);
  		signUpConfirmRequest({code: data.code}).then((result) => {
  			console.log(result);
  			if(result.success) {
  				auth.signin(() => setUserIsLoggedIn(true));
  			}
  			else {
  				setErrorSignUpConfirm("wrongDataSignUpConfirm", {
  					type: "manual",
  					message: "Incorrect code"
  				});
  			}
  		},
  		(error) => {
  			alert("System error: "+ error)
  		})
  	}

	return (
		<div className="Registration">
			{userIsLoggedIn ? <Redirect to="/lk" /> : ""}
			<div className="container-fluid px-1">
				<div className="row m-0 px-md-4 pt-4 pb-5 justify-content-center">
					<div className="col-12 col-lg-11 offset-lg-1 mb-5">
						<Link to="/auth" className="d-flex align-items-center"><img src={ArrayBack} alt="" className="mr-2"/>{t('come_back')}</Link>
					</div>
					<div className={`col-12 col-sm-8 col-lg-6 Registration__content justify-content-center ${(stepRegistartion === 1) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-5 py-sm-6 px-2 px-sm-4">
							<h2 className="mb-2">{t('registration_title')}</h2>
							<p className="mb-3">{t('choose_method_text')}</p>
				            <div className="button-holder mb-2 text-left">
				                <button onClick={(e)=>{setStepRegistartion(2); setMethodRegistration("phone")}}>{t('phone')}</button>
				            </div>
              				<div className="button-holder text-left">
                				<button onClick={(e)=>{setStepRegistartion(2); setMethodRegistration("mail")}}>{t('email')}</button>
              				</div>
						</div>
					</div>


					<div className={`col-12 col-sm-8 col-lg-6 Registration__content justify-content-center ${(stepRegistartion === 2) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-5 py-sm-6 px-2 px-sm-4">
							<h2 className="mb-2">{t('registration_title')}</h2>
							{(methodRegistration === "phone") && <p className="mb-3">{t('rergistration_text_phone')}</p>}
							{(methodRegistration === "mail") && <p className="mb-3">{t('rergistration_text_mail')}</p>}
            				{errorsSignUp.wrongDataSignUp && <span className="content__span mb-3">{t('error_wrong_text')}</span>}
            				{errorsSignUp.alreadyRegistered && <span className="content__span mb-3">{t('error_already_registered')}</span>}
           					<form className="Registration__form" onSubmit={handleSubmitSignUp(SingUp)}>
           						<div className="form__input-holder text-left mb-2">
                					<Select setValue={(name, value)=>selectFunc(name, value)} value={0} options={currency} name="currency" label={t('registartion_label_currency')} />
              					</div>
				              	<div className="form__input-holder mb-2 text-left">
				              		{ 	(methodRegistration === "phone") &&
				                		<ControllerInput control={controlSignUp} refy={registerSignUp({required: true, minLength: 7})} errors={errorsSignUp} setError={setErrorSignUp} clearErrors={clearErrorsSignUp} mask="+7(999) 999-99-99" maskLength={11} name="phone" label={t('registartion_label_phone')} />
				                	}
				                	{
				                		(methodRegistration === "mail") &&
				                		<InputPublic refy={registerSignUp({required: true})} errors={errorsSignUp} setError={setErrorSignUp} clearErrors={clearErrorsSignUp} name="mail" label={t('registartion_label_mail')} />
				              		}
				              	</div>
              					<div className="form__input-holder text-left mb-2">
                					<InputPublic refy={registerSignUp({required: true, minLength: 7})} errors={errorsSignUp} name="password" type="password" label={t('registartion_label_password')}/>
              					</div>
              					<div className="form__checkbox d-flex align-items-center text-left mb-3">
					                <input type="checkbox" className="checkbox__input" name="check2" id="check2" ref={registerSignUp({required: true})} />
					                <label htmlFor="check2" className={`mb-0 ${errorsSignUp.check2 && 'no-valid'}`} >{t('registartion_label_agreement')}</label>
              					</div>
              					{ (methodRegistration === "phone")
              					?
              					<input type="submit" className="main-btn d-block w-100" value={t('btn_send_sms')} />
              					:
              					<input type="submit" className="main-btn d-block w-100" value={t('btn_send_mail')} />
              					}
            				</form>
						</div>
					</div>



					<div className={`col-12 col-sm-8 col-lg-6 Registration__content justify-content-center ${(stepRegistartion === 3) ? "d-flex" : "d-none"}`}>
						<div className="content__holder text-center py-6 px-4">
							<h2 className="mb-2">{t('registration_title')}</h2>
							<p className="mb-3">{t('code_text')}</p>
            				{errorsSignUp.wrongDataSignUp && <span className="content__span mb-3">{t('code_error')}</span>}
           					<form className="Registration__form" onSubmit={handleSubmitSignUpConfirm(SingUpConfirm)}>
				              	<div className="form__input-holder mb-2 text-left">
                					<ControllerInput onChangeFun={() => clearErrorsSignUpConfirm('wrongDataSignUpConfirm')} control={controlSignUpConfirm} refy={registerSignUpConfirm({required: true})} errors={errorsSignUpConfirm} setError={setErrorSignUpConfirm} clearErrors={clearErrorsSignUpConfirm} mask="999999" maskLength={6} name="code" label={t('code_label')} />
              					</div>
              					<input type="submit" className="main-btn d-block w-100" value={t('continue')} />
            				</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Registration;





