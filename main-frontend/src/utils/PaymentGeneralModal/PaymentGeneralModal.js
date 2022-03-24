import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import Modal from 'react-modal';

import cross from './cross.svg';
import './PaymentGeneralModal.scss';

let PaymentGeneralModal = (props) => {
  /*
  props.modalIsOpen
  props.modalIsOpenCallback
  props.modalHeader
  props.modalText
  */

  const [modalIsOpen, setModalIsOpen] = useState(false);

  // CLOSE MODAL
  let closeModal = () => {
    setModalIsOpen(false);
    props.modalIsOpenCallback(false);
  }
  // END OF CLOSE MODAL


  // SYNC MODAL_IS_OPEN STATE
  useEffect(() => {
    setModalIsOpen(props.modalIsOpen);
  }, [props.modalIsOpen])
  // END OF SYNC MODAL_IS_OPEN STATE


  // HANDLE CLICK OUTSIDE
  const wrapperRef = useRef(null);
  useEffect(() => {
    let handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) closeModal();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // END OF HANDLE CLICK OUTSIDE

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      overlayClassName="PaymentGeneralModal__Overlay"
      className="GeneralModal__Content container h-100"
    >
      <div className="row mx-0 justify-content-center h-100 align-content-sm-center align-items-sm-center align-content-end align-items-end">
        <div ref={wrapperRef} className="GeneralModal col-12 col-md-6 p-4 p-md-5">
          <button onClick={closeModal} className="close-modal-button mr-2 mt-2"><img src={cross} alt="" /></button>
          <div className="GeneralModal__Header d-flex mb-2 justify-content-center align-items-center text-center">
            <h2>{props.modalHeader}</h2>
          </div>
          <div className="GeneralModal__Body text-center">
            <p className="mb-4">{props.modalText}</p>
            <Link to="/lk" className="white-md-btn d-inline-block" onClick={closeModal}>Хорошо</Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PaymentGeneralModal;
