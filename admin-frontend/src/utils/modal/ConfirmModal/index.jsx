import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import CrossIcon from './CrossIcon';

import './index.scss';

Modal.setAppElement('#root');

let ConfirmModal = (props) => {
  /* PROPS:
  {
    props.heading (string)
    props.text (string)
    props.buttonTextTrue (string)
    props.onAgree (function)
    props.onCancel (function)
    props.isOpen (true | false)
  }
  */

  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen])

  let closeModal = () => {
    props.onCancel();
    setIsOpen(false);
  }

  return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Confirm modal"
        overlayClassName="ConfirmModal__Overlay"
        className="ConfirmModal__Content p-4"
      >
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <h2 className="mb-0 pe-4">{props.heading}</h2>
          <button onClick={closeModal}><CrossIcon /></button>
        </div>
        <p>{props.text}</p>
        <div className="mt-3 d-flex justify-content-end">
          <button className="btn btn-primary" onClick={() => props.onAgree(props.data)}>{props.buttonTextAgree}</button>
          <button className="ms-3" onClick={closeModal}>Закрыть</button>
        </div>
      </Modal>
  );
}

export default ConfirmModal;