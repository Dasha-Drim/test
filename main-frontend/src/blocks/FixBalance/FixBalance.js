import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import Modal from 'react-modal';

// components
import API from '../../utils/API';
import AdminReports from '../../blocks/AdminReports/AdminReports';

//graphics
import cross from './icons/cross.svg';

import './FixBalance.scss';

const FixBalance = (props) => {
  let [isRequestBeingExecuted, setIsRequestBeingExecuted] = useState(false);

  let [lastDateSaveHistory, setLastDateSaveHistory] = useState('');
  let [filialId, setFilialId] = useState(false);


  const getLastDateSaveHistory = async (data) => {
    let userData = await API.get('/get-last-date-save-history', {params: data});
    return await userData.data;
  };
  let getLastDateSaveHistoryLoal = () => {
    getLastDateSaveHistory({timeZone: DateTime.local().zoneName}).then(
      (result) => { 
        if(result.success) {
          setLastDateSaveHistory(result.date);
          setFilialId(result.filialId);
        }
      }
    )
  }
  
  useEffect(() => {
    getLastDateSaveHistoryLoal();
  }, [])


  // Modal Fix Balance Confirm
  const [modalFixBalanceConfirmIsOpen, setModalFixBalanceConfirmIsOpen] = useState(false);
  let openModalFixBalanceConfirm = () => {
    setModalFixBalanceConfirmIsOpen(true);
  }
  let closeModalFixBalanceConfirm = () => setModalFixBalanceConfirmIsOpen(false);


  const saveHistoryRequest = async (data) => {
    let userData = await API.get('/save-history');
    return await userData.data;
  };
  let saveHistory = () => {
    setIsRequestBeingExecuted(true);
    saveHistoryRequest().then(
      (result) => {
        if (result.success) {
          closeModalFixBalanceConfirm();
          setIsRequestBeingExecuted(false);
          getLastDateSaveHistoryLoal();
        } else alert('Что-то пошло не так. Обновите страницу');
      },
      (error) => {
        alert(error);
      }
    )
  }

  // Modal Show History
  const [modalShowHistoryIsOpen, setModalShowHistoryIsOpen] = useState(false);
  let openModalShowHistory = () => {
    setModalShowHistoryIsOpen(true);
  }
  let closeModalShowHistory = () => setModalShowHistoryIsOpen(false);
	
	return(
    <>
  		<div className="FixBalance justify-content-between">
        <span className="name">Оператор, {props.name}</span>
        <div className="d-flex align-items-center">
    			<button className="m-btn btn_white" onClick={() => openModalFixBalanceConfirm()}>ФИКСИРОВАНИЕ БАЛАНСА</button>
    			<span className={lastDateSaveHistory ? '' : 'display-none'}>Последний раз {lastDateSaveHistory}</span>
        </div>
  		</div>

      <Modal
        isOpen={modalFixBalanceConfirmIsOpen}
        onRequestClose={closeModalFixBalanceConfirm}
        className="Modal"
        overlayClassName="OverlayModal"
      >
        <div className="modal_inner">
          <button className="crossBtn" onClick={()=> closeModalFixBalanceConfirm()}> <img src={cross} /> </button>
          <h2>Фиксирование баланса</h2>
          <p>Все финансовые действия всех операторов этого филиала будут зафикисированы и отображены у управляющего</p>
          <button className="m-btn btn_red" onClick={() => saveHistory()} disabled={isRequestBeingExecuted}>Зафиксировать</button>
          { filialId ? <button className="m-btn btn_white" onClick={() => openModalShowHistory()}>Посмотреть историю</button> : "" }
        </div>
      </Modal>

      <Modal
        isOpen={modalShowHistoryIsOpen}
        onRequestClose={closeModalShowHistory}
        className="Modal Modal-full-width"
        overlayClassName="OverlayModal"
      >
        <div className="modal_inner">
          <button className="crossBtn" onClick={()=> closeModalShowHistory()}> <img src={cross} /> </button>
          { filialId ? <AdminReports filialId={filialId} /> : "" }
        </div>
      </Modal>
    </>
	)
}
export default FixBalance;