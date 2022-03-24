import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next'

// components
import API from '../../utils/API';
import Select from '../../atoms/Select/Select';
import InputPublic from '../../atoms/InputPublic/InputPublic';
import ControllerInput from '../../atoms/InputPublic/ControllerInput';
import MainButton from '../../atoms/MainButton/MainButton';

// graphics
import check from './icons/check.svg';
import checked from './icons/checked.svg';

import './UserPassport.scss';



function UserPassport(props){

  const { register, handleSubmit, errors, control, setError, clearErrors, setValue, getValues } = useForm({shouldUnregister: false});

  const { t } = useTranslation();

  const [ifNoPassport, setIfNoPassport] = useState(false);
  const [ifCheck, setIfCheck] = useState(false);
  const [ifChecked, setIfChecked] = useState(false);


  const getPassportRequest = async () => {
    let userData = await API.get('/players/passport');
    return await userData.data;
  };
  useEffect(() => {
    getPassportRequest().then((result) => {
      console.log(result);
      if(result.success) {
        if(result.passportStatus == 'no') setIfNoPassport(true);
        else if(result.passportStatus == 'notconfirmed') {
         setValue('surname', result.surname, { shouldDirty: true })
         setValue('name', result.name, { shouldDirty: true })
         setValue('patronymic', result.patronymic, { shouldDirty: true })
         setValue('dateBirth', result.dateBirth, { shouldDirty: true })
         setValue('number', result.number, { shouldDirty: true })
         setIfCheck(true);
       }
        else if(result.passportStatus == 'confirmed') setIfChecked(true);
      }
    },
    (error) => { alert("System error: "+ error) })
  }, [])



  const passportSendRequest = async (data) => {
    let userData = await API.post('/add-passport', data);
    return await userData.data;
  };
  let PassportSend = (data) => {
    data.passportSex = data.passportSex.value;
    passportSendRequest(data).then((result) => {
      console.log(result);
      if(result.success) {
        setIfNoPassport(false);
        setIfCheck(true);
      } else if(result.success == false) {
        alert("Error: "+result.message);
      } else {
        alert(t('user_passport_error_text'));
      }
    },
    (error) => { alert("System error: "+ error) })
  }


  return(
    <div className="section UserPasport p-4">
      <h4 className="mb-2">{t('user_passport_header')}</h4>
      <p className="mb-2">{t('user_passport_text')}</p>
      <form className={`justify-content-between flex-wrap ${ifNoPassport == false ? 'd-none' : 'd-flex'}`} onSubmit={handleSubmit(PassportSend)}>
        <div className="UserPasport__input-holder mb-2">
          <InputPublic refy={register({required: true})} errors={errors} name="surname" type="text" label={t('user_passport_label_surname')}/>
        </div>
        <div className="UserPasport__input-holder mb-2">
          <InputPublic refy={register({required: true})} errors={errors} name="name" label={t('user_passport_label_name')}/>
        </div>
        <div className="UserPasport__input-holder mb-2">
          <InputPublic refy={register({required: true})} errors={errors} name="patronymic" label={t('user_passport_label_patronymic')}/>
        </div>
        <div className="UserPasport__input-holder mb-2">
          <ControllerInput refy={register({required: true})} errors={errors} setError={setError} clearErrors={clearErrors} mask="99.99.9999" maskLength={8} name="dateBirth" label={t('user_passport_label_date')} />
        </div>
        <div className="UserPasport__input-holder mb-2">
          <InputPublic refy={register({required: true})} errors={errors} name="number" label={t('user_passport_label_number')}/>
        </div>
        <div className="UserPasport__input-holder mb-2 d-flex align-items-end">
          <input type="submit" value={t('user_passport_save')} className="main-btn w-100"/>
        </div>
    </form>
    <div className={`UserPasport__loading ${(ifNoPassport || ifChecked || ifCheck) ? 'd-none' : ''}`}>
      <p>{t('loading')}...</p>
    </div>

    <div className={`UserPasport__checked align-items-center ${ifChecked == false ? 'd-none' : 'd-flex'}`}>
      <img src={checked}/>
      <span className="ml-2">{t('user_passport_checked')}</span>
    </div>

    <div className={`UserPasport__check justify-content-between align-items-center ${ifCheck == false ? 'd-none': 'd-flex'}`}>
      <div className="d-flex align-items-center">
        <img src={check}/>
        <span className="ml-2">{t('user_passport_check')}</span>
      </div>
      <div className="btn_change">
        <button data-btn="change" onClick={() => {setIfCheck(false); setIfNoPassport(true)}}>{t('user_passport_change')}</button>
      </div>
    </div>

  </div>
  )
}

export default UserPassport;