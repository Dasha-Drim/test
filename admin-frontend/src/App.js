import { useState, useEffect, createContext, useContext } from 'react';
import {Navigate, useRoutes, useLocation} from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

// bootstrap
import './utils/bootstrap/bootstrap.scss';

import api from './packages/api';
import { tokenAdapter } from './packages/storage';

import Loader from './components/Loader';

import players from './pages/Players';
import home from './pages/Home';
import promo from './pages/Promo';
import payments from './pages/Payments';
import balance from './pages/Balance';
import franchise from './pages/Franchise';
import monitoring from './pages/Monitoring';
import auth from './pages/Auth';

import Layout from './pages/Layout';


// context
let AuthContext = createContext(null);
let useAuth = () => {
  return useContext(AuthContext);
}

// provider
const AuthProvider = ({children}) => {
  let [isLoaded, setIsLoaded] = useState(false);
  let [user, setUser] = useState(null);

  useEffect(() => {
    // if token is ok, do api request (then setUser and setIsLoaded true)
    // if token is empty, setIsLoaded true
    tokenAdapter.getToken().then(result => {
      if(result) {
        setUser("John");
        setIsLoaded(true);
      } else {
        setIsLoaded(true);
      }
    })
  }, [])
  
  let signin = (newUser, callback) => {
    // api
    setUser("John");
    tokenAdapter.setToken("dssdds");
    callback();
  };

  let signout = (callback) => {
    // api
    setUser(null);
    callback();
    tokenAdapter.setToken("");
  };

  let value = { user, signin, signout };
  if(isLoaded) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  return <div className="d-flex my-4 justify-content-center"><Loader /></div>
}


const RequireAuth = ({children}) => {
  let auth = useAuth();
  let location = useLocation();
  if(!auth.user) {
    return <Navigate to="/login" state={{from: location}} replace />
  }
  return children;
}


const Page404 = (props, context) => {
  return (
    <span>404. Page does not exist</span>
  );
}

let statesArr = [];

const App = () => {
  let location = useLocation();

  const isState = (count) => {
    console.log("count", count)
     if (location.state) {

      console.log("statesArr", statesArr)

      

      for (let i = 0; i <= count; i++) {
        let index = statesArr.findIndex(item => item.breadcrump === location.state.breadcrump);
        
        //if ((index === -1) && (i === count) && !statesArr[i]) statesArr.push(location.state);
        //if ((index === -1) && (i === count) && statesArr[i]) statesArr[i] = location.state;
        if ((index === -1) && (i === count)) statesArr[i] = location.state;
      
        /*if ((index === -1) && (i === 1) && statesArr[1]) statesArr[1] = location.state;
        if ((index === -1) && (i === 1) && !statesArr[1]) statesArr.push(location.state);*/
      }
      
     
      


      if ((count === 0) && statesArr[0]) return statesArr[0];
      else if ((count === 1) && statesArr[1]) return statesArr[1];
      else return null;
     } else return null
  }

  const isStateStrong = () => {
     if (location.state) {
      return location.state;
     } else return null
  }

  const CustomPropsBreadcrumb = ({ someProp }) => (
    someProp && someProp.breadcrump ? someProp.breadcrump : "111"
  );
  
  const loginRoutes = {
    path: 'login',
    children: [
      {path: '', element: <auth.Main useAuth={useAuth} />},
    ]
  }

  const mainRoutes = {
    path: '/',
    children: [
      {path: '*', element: <Navigate to='/404' />},
      {path: '/', element: <home.Main />, breadcrumb: "Главная"},
      {path: '404', element: <Page404 />},
      {path: 'account', element: <Navigate to='/account/list' />},
    ],
  };

  const playersRoutes = {
    path: 'players',
    children: [
      {path: '', element: <players.Main />, breadcrumb: "Игроки"},
      {path: '*', element: <players.Edit />, breadcrumb: CustomPropsBreadcrumb, props: {someProp: isStateStrong()}},
    ],
  };

  const promoRoutes = {
    path: 'promo',
    children: [
      {path: '', element: <promo.Main />, breadcrumb: "Промокоды"},
      {path: '*', element: <promo.Add />, breadcrumb: "Создание нового"},
    ]
  };

  const paymentsRoutes = {
    path: 'payments',
    children: [
      {path: '', element: <payments.Main />, breadcrumb: "Платежи"},
    ],
  };

  const balanceRoutes = {
    path: 'balance',
    children: [
      {path: '', element: <balance.Main />, breadcrumb: "Балансы"},
    ],
  };

  const franchiseeRoutes = {
    path: 'franchisee',
    children: [
      {path: '', element: <franchise.Main />, breadcrumb: "Франчайзи"},
      {path: '/franchisee/add', element: <franchise.Add />, breadcrumb: "Создание франчайзи"},
      {path: '/franchisee/details', element: <franchise.Details />, breadcrumb: CustomPropsBreadcrumb, props: {someProp: isState(0)}}, //"Франчайзи XXX"
      {path: '/franchisee/details/add-filial', element: <franchise.AddFilial />, breadcrumb: "Создание подразделения"},
      {path: '/franchisee/details/add-manager', element: <franchise.AddManager />, breadcrumb: "Создание управляющего"},
      {path: '/franchisee/details/filial', element: <franchise.Filial />, breadcrumb: CustomPropsBreadcrumb, props: {someProp: isState(1)}},  //"Филиал XXX"
      {path: '/franchisee/details/filial/add-operator', element: <franchise.AddOperatorInFilial />, breadcrumb: "Создание оператора"},
      {path: '/franchisee/details/filial/attach-manager', element: <franchise.AttachManagerInFilial />, breadcrumb: "Прикрепление управляющего"},
    ]
  };

  const monitoringRoutes = {
    path: 'monitoring',
    children: [
      {path: '', element: <monitoring.Main />, breadcrumb: "Мониторинг"},
    ],
  };


  let routes = [mainRoutes, playersRoutes, promoRoutes, paymentsRoutes, balanceRoutes, franchiseeRoutes, monitoringRoutes];

  // generate breadcrumbs
  let breadcrumbs = useBreadcrumbs(routes);

  // add breadcrumbs to Layout components
  routes.forEach((item, key) => {
    item.element = <RequireAuth><Layout useAuth={useAuth} breadcrumbs={breadcrumbs} /></RequireAuth>;
  })

  // push public route
  routes.push(loginRoutes);

  const routing = useRoutes(routes);

  return <AuthProvider>{routing}</AuthProvider>;
}

export default App;
