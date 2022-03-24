import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";


//components
import API from '../../utils/API';
import MainButton from '../../atoms/MainButton/MainButton';
import Input from '../../atoms/Input/Input';
import UserPaymentInfo from '../../elements/UserPaymentInfo/UserPaymentInfo';


import './UserDeposit.scss';


 function UserDeposit(props){
  const { register, handleSubmit, errors, reset } = useForm({shouldUnregister: false});


  let [balanceOperations, setBalanceOperations] = useState([]);
  let [limitOperations, setLimitOperations] = useState(2);
  let [allResults, setAllResults] = useState(0);
  const getBalanceOperationsRequest = async (data) => {
    let userData = await API.get('/get-user-last-balance-operations', {params: data});
    return await userData.data;
  };
  let balanceOperationsRequestLoad = (limit) => {
    getBalanceOperationsRequest({timeZone: DateTime.local().zoneName, limit: limit, type: "up"}).then(
      (result) => {
        if(result.operations) {
          setBalanceOperations(result.operations);
          setAllResults(result.allResults);
        }
      },
      (error) => {
        alert(error);
      }
    )
  }
  useEffect(() => {
    setAllResults(0);
    setBalanceOperations([]);
    setLimitOperations(2);
    balanceOperationsRequestLoad(limitOperations);
  }, [props])


  const submitDepositRequest = async (data) => {
    let userData = await API.post('/adding-balance', data);
    return await userData.data;
  };

  let onSubmitDeposit = (data) => {
    submitDepositRequest(data).then(
      (result) => {
        console.log(result);
        if(result.success) {
          props.updateBalance();
          alert("Баланс успешно изменён");
          reset();
        } else if(result.success == false) {
          alert("Ошибка: "+result.message);
        } else {
          alert('Неопознанная ошибка. Попробуйте позже.');
        }
      },
      (error) => {
        alert("Системная ошибка: "+ error);
      }
    )
  }


   return(
     <div className="section UserDeposit">
       <h2>Пополнить баланс</h2>
       <form className="section__balance-input" onSubmit={handleSubmit(onSubmitDeposit)}>
         <div className="sum balance__input">
          <Input name="amount" refy={register({required: true})} errors={errors} label="Укажите сумму (тңг)"/>
         </div>
         <div className="promo balance__input">
         <Input name="promo" label="Промокод (если есть)"/>
         </div>
         <div className="btn balance__input">
           <MainButton name="Пополнить"/>
         </div>
       </form>
       <div data-balance="input" className="section__balance-data">
         <div className="balance-data__header">
           <span className="sp_text">№ платежа</span>
           <span className="sp_text">Сумма</span>
           <span className="sp_text">Дата платежа</span>
           <span className="sp_text condition">Метод</span>
         </div>
          {balanceOperations.map((item, id) => 
            <UserPaymentInfo method={item.method == "cash" ? "Наличные" : item.method == "non-cash" ? "Онлайн" : "Бонус"} type={item.type == "up" ? "Пополнение" : "Списание"} number={item.operationId} date={item.dateTime} sum={(item.type == "up" ? "+" : "-")+ item.amount}/>
          )}
          {allResults > limitOperations ? 
          <div className="read_more">
            <button onClick={() => {balanceOperationsRequestLoad(limitOperations+2); setLimitOperations(limitOperations+2);}}>Показать ещё</button>
          </div>
          : ""}
         </div>
     </div>
   )
 }

 export default UserDeposit;

/*
<UserPaymentInfo number={props.numberfirst} sum={props.sumfirst} date={props.datefirst} condition={props.conditionfirst}/>
         <UserPaymentInfo number={props.numbersecond} sum={props.sumsecond} date={props.datesecond} condition={props.conditionsecond}/>
*/