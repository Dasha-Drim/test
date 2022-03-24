import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next'

// components
import UserPassport from "../blocks/UserPassport/UserPassport";
import UpdateBalance from "../blocks/UpdateBalance/UpdateBalance";
import UserHistory from "../blocks/UserHistory/UserHistory";
import UserBalance from "../blocks/UserBalance/UserBalance";
import UserPromocode from "../blocks/UserPromocode/UserPromocode";

import './Lk.scss';

const Lk = (props) => {
  let [offline] = useState(localStorage.getItem("offline"))
  let auth = props.useAuth();

  const { t } = useTranslation();

  let [triggerToHistoryUpdate, setTriggerToHistoryUpdate] = useState(false);
  return (
    <div className="Lk">
      <div className="container-fluid px-1">
        <div className="row m-0 py-4 px-1 px-md-4">
          
            <div className="col-12 col-lg-6">
              <div className="row">
              {!offline && 
                <div className="col-12 mb-3">
                  <UpdateBalance getBalance={props.getBalance} />
                </div>
                 }
                <div className="col-12 mb-3 mb-lg-0">
                  <UserHistory triggerToUpdate={triggerToHistoryUpdate} />
                </div>
              </div>
            </div>
         
          <div className="col-12 col-lg-6">
            <div className="row">
              <div className="col-12 mb-3">
                <UserBalance />
              </div>
              {!offline && <>
                <div className="col-12 mb-3">
                  <UserPromocode updatePaymentsHistory={() => {setTriggerToHistoryUpdate((actual) => !actual); auth.reconfirm(() => {})}} />
                </div>
                <div className="col-12">
                  <UserPassport/>
                </div> </>
              }
            </div>
          </div>
          <div className="col-12 mt-3">
            <button className="logout-btn p-2" onClick={() => auth.signout(() => {console.log(44)})}>{t('log_out')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lk;
