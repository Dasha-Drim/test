import { useState, useEffect, createContext, useContext } from 'react';
import {Navigate, useRoutes, useLocation} from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

// bootstrap
import './utils/bootstrap/bootstrap.scss';

import api from './packages/api';
import { tokenAdapter, roleAdapter } from './packages/storage';

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
        setUser("123");
        setIsLoaded(true);
      } else {
        setIsLoaded(true);
      }
    })
  }, [])
  
  let signin = (newUser, callback) => {
    // api
    roleAdapter.setRole(newUser.role);
    setUser(newUser.role);
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
  console.log("auth.user", auth.user)
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

const App = () => {
  let role = localStorage.getItem("role");

  const EditorBreadcrumb = ({ location: { state: { breadcrump } } }) => (
    <span>{breadcrump ? breadcrump : '2222'}</span>
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
      {path: '404', element: <Page404 />},
      {path: 'account', element: <Navigate to='/account/list' />},
    ],
  };

  if (role === "franchisee") mainRoutes.children.push({path: '/', element: <franchise.Details />, breadcrumb: "Главная"});
  else if (role === "manager") mainRoutes.children.push({path: '/', element: <franchise.Details />, breadcrumb: "Главная"});
  else if (role === "operator") mainRoutes.children.push({path: '/', element: <franchise.Filial />, breadcrumb: "Главная"});

  const franchiseeRoutes = {
    path: '/',
    children: []
  };

  if (role === "franchisee") {
    franchiseeRoutes.children.push({path: '/add-filial', element: <franchise.AddFilial />, breadcrumb: "Создание подразделения"});
    franchiseeRoutes.children.push({path: '/add-manager', element: <franchise.AddManager />, breadcrumb: "Создание управляющего"});
    franchiseeRoutes.children.push({path: '/filial', element: <franchise.Filial />, breadcrumb: EditorBreadcrumb});
    franchiseeRoutes.children.push({path: '/filial/add-operator', element: <franchise.AddOperatorInFilial />, breadcrumb: "Создание оператора"});
    franchiseeRoutes.children.push({path: '/filial/attach-manager', element: <franchise.AttachManagerInFilial />, breadcrumb: "Прикрепление управляющего"});
  } else if (role === "manager") {
    franchiseeRoutes.children.push({path: '/filial', element: <franchise.Filial />, breadcrumb: EditorBreadcrumb});
    franchiseeRoutes.children.push({path: '/filial/add-operator', element: <franchise.AddOperatorInFilial />, breadcrumb: "Создание оператора"});
    franchiseeRoutes.children.push({path: '/filial/register-player', element: <franchise.RegisterPlayerInFilial />, breadcrumb: "Регистрация гостя"});
  }
  else if (role === "operator") {
    franchiseeRoutes.children.push({path: '/register-player', element: <franchise.RegisterPlayerInFilial />, breadcrumb: "Регистрация гостя"});
    franchiseeRoutes.children.push({path: '/player', element: <franchise.PlayerDetails />, breadcrumb: EditorBreadcrumb});
  }

  let routes = [mainRoutes, franchiseeRoutes];

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