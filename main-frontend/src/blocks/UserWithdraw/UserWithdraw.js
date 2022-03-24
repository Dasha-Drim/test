import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useForm } from "react-hook-form";

// components
import API from '../../utils/API';
import Input from '../../atoms/Input/Input';
import UserPaymentInfo from '../../elements/UserPaymentInfo/UserPaymentInfo';
import MainButton from '../../atoms/MainButton/MainButton';

import './UserWithdraw.scss';



function UserWithdraw(props) {
  const { register, handleSubmit, errors, reset } = useForm({shouldUnregister: false});

  let [balanceOperations, setBalanceOperations] = useState([]);
  let [limitOperations, setLimitOperations] = useState(2);
  let [allResults, setAllResults] = useState(0);
  const getBalanceOperationsRequest = async (data) => {
    let userData = await API.get('/get-user-last-balance-operations', {params: data});
    return await userData.data;
  };
  let balanceOperationsRequestLoad = (limit) => {
    getBalanceOperationsRequest({timeZone: DateTime.local().zoneName, limit: limit, type: "down"}).then(
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


  
  const submitWithdrawRequest = async (data) => {
    let userData = await API.post('/withdrow-balance', data);
    return await userData.data;
  };

  let onSubmitWithdraw = (data) => {
    submitWithdrawRequest(data).then(
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
    <div className="section UserWithdraw">
      <h2>Вывод средств</h2>
      <form className="section__balance-output" onSubmit={handleSubmit(onSubmitWithdraw)}>
          <div className="sum balance__output">
            <Input name="amount" refy={register({required: true})} errors={errors} label="Укажите сумму (тңг)"/>
          </div>
          <div className="btn balance__output">
            <MainButton name="Вывести"/>
          </div>
        </form>
        <div className="section__balance-data">
          <div className="balance-data__header">
            <span className="sp_text">№ платежа</span>
            <span className="sp_text">Сумма</span>
            <span className="sp_text">Дата платежа</span>
            <span className="sp_text condition">Состояние</span>
          </div>
          {balanceOperations.map((item, id) => 
            <UserPaymentInfo method={item.method == "cash" ? "Наличные" : item.method == "non-cash" ? "Онлайн" : "Коррекция"} type={item.type == "up" ? "Пополнение" : "Списание"} number={item.operationId} date={item.dateTime} sum={(item.type == "up" ? "+" : "-")+ item.amount}/>
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

export default UserWithdraw;
