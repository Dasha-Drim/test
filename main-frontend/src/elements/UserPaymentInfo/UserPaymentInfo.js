import './UserPaymentInfo.scss';



function UserPaymentInfo(props){
  return(
    <div className="UserPaymentInfo">
      <span className="sp_info mobile-display">{props.number}</span>
      <span className="sp_info summ">{props.sum}</span>
      <span className="sp_info date">{props.date}</span>
      <span className="sp_info method">{props.method}</span>
    </div>
  )
}

export default UserPaymentInfo;
