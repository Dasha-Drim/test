import React, { useState, useEffect, useContext, createContext } from 'react';
import { BrowserRouter as Router,
  Switch,
  Route,
  Redirect } from 'react-router-dom';

import { useLocation } from 'react-router-dom'

import API from "./utils/API";
import ScrollToTop from "./utils/ScrollToTop";

import './App.scss';

// components
import Header from "./blocks/Header/Header";
import Footer from "./blocks/Footer/Footer";
import Home from "./pages/Home";
import BingoPage from "./pages/games/BingoPage";
import RoulettePage from "./pages/games/RoulettePage";
import Lk from "./pages/Lk";
import Payment from "./pages/Payment";
import Games from "./pages/Games";
import AboutBingo from "./pages/AboutBingo";
import AboutRoulette from "./pages/AboutRoulette";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import RestorePassword from "./pages/RestorePassword";
import Privacy from "./pages/Privacy";
import Contacts from "./pages/Contacts";
import FAQ from "./pages/FAQ";
import Principles from "./pages/Principles";
import License from "./pages/License";
import Success from "./pages/Success";
import Error from "./pages/Error";



const authContext = createContext();

// GET USERS
let getRole = async () => {
    let userData = await API.get('/users');
    return await userData.data;
}
// END OF GET USERS


const getBalanceRequest = async (data) => {
  let userData = await API.get('/players/balance');
  return await userData.data;
};


function ProvideAuth({ children }) {
    let [userData, setUserData] = useState({userType: null, userInfo: null, balance: null});
    let [userBalance, setUserBalance] = useState(null);

    /*
    GET USER INFO FROM SERVER AND SET NEW USER DATA OBJECT
    */
    let getDataFromServer = (cb) => {
      getRole().then(res => {
          if(res.role !== "user") {
            // it's visitor/admin/manager/operator
            document.cookie = "token=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            setUserData({userType: res.role, userInfo: res.info || null, balance: null});
            setUserBalance(null)
            if(cb) cb();
          } else {
            // it's user, we need to get hist balance
            if (res.offline) localStorage.setItem("offline", "true")
            getBalanceRequest().then(balanceRes => {
                if(!balanceRes.success) return false;
                setUserData({userType: res.role, userInfo: res.info, balance: balanceRes.balance});
                setUserBalance(balanceRes.balance)
                if(cb) cb();
            }, (error) => {
              // balance request failed
            });
          }
        }, (error) => {
          // getRole request failed
      })
    }

    useEffect(() => {
        getDataFromServer();
    }, [])


    let auth = {
        userType: userData.userType,
        userId: userData.userId,
        userInfo: userData.userInfo,
        balance: userBalance,
        realBalance: userData.balance,
        signin: (cb) => {
          console.log("dsds");
          getDataFromServer(cb);
        },
        signout: (cb) => {
            let cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                let eqPos = cookie.indexOf("=");
                let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
            setUserData({userType: "vizitor", userId: null, userInfo: null, balance: null});
        },
        reconfirm: (cb) => {
          getDataFromServer(cb);
        },
        updateBalance: (value) => {
          setUserBalance(value);
        }
    }

    console.log("userData", userData)
    if(userData.userType && (userData.userId !== null || userData.userType === "vizitor" || userData.userType === "admin" || userData.userType === "operator" || userData.userType === "manager" || userData.userType === "franchisee")) return (
        <authContext.Provider value={auth}>
            {children}
        </authContext.Provider>
    );
    else {
      console.log("fffrrrtt")
      return (
       <div className="container-loader">
        <div className="item-1"><div></div></div>
        <div className="item-2"><div></div></div>
        <div className="item-3"><div></div></div>
        <div className="item-4"><div></div></div>
        <div className="item-5"><div></div></div>
        <div className="item-6"><div></div></div>
        <div className="item-7"><div></div></div>
        <div className="item-8"><div></div></div>
        <div className="item-9"><div></div></div>
      </div>
    );

    }}

function useAuth() {
  return useContext(authContext);
}




function PrivateRoute({ children, ...rest }) {
  let auth = useAuth();
  console.log("auth.userId", rest.computedMatch);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (auth.userType && auth.userType !== "vizitor") ? (
        ([children].flat().findIndex(item => item.props.userType === auth.userType) !== -1) ? (
        React.cloneElement([children].flat().find(item => item.props.userType === auth.userType), { userId: auth.userId, userInfo: auth.userInfo, match: rest.computedMatch })
          ) : (  
          <Redirect
              to={{
                pathname: "/lk",
                state: { from: location }
              }}
            />
        )) : (
          <Redirect
            to={{
              pathname: "/auth",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

let App = () => {                                                                                                                                                                                                                                                                                            
	function AuthHeader() {
    let routerLocation = useLocation();

		let auth = useAuth();
    console.log("routerLocation.pathname", routerLocation.pathname)
		return (auth.userType && auth.userType === "user" && routerLocation.pathname !== "/payment") ? (
		  <Header userIsLoggedIn={true} userRole={auth.userType} balance={auth.balance} />
		) : routerLocation.pathname === "/payment" ? <></> : (
		  <Header userIsLoggedIn={false} userRole="vizitor" />
		);
	}

  function AuthFooter() {
    let routerLocation = useLocation();
    let auth = useAuth();
    return routerLocation.pathname !== "/payment" ? (
      <Footer />
    ) : (
      <></>
    );
  }


  	return (
    <Router>
    	<div className="App">
      		<ProvideAuth>
      		  <AuthHeader />
          		<Switch>

	        		  <Route exact path="/games/bingo37">
	        			  <BingoPage useAuth={useAuth}/>
	        		  </Route>
		            <Route exact path="/games/bingoX">
		              <RoulettePage useAuth={useAuth} />
		            </Route>


                <Route exact path="/">
                    <Home useAuth={useAuth} />
                </Route>
                <Route exact path="/games">
                    <Games useAuth={useAuth} />
                </Route>
		            <Route exact path="/games/about/bingoX">
		              	<AboutRoulette useAuth={useAuth} />
		            </Route>
		            <Route exact path="/games/about/bingo37">
		              	<AboutBingo useAuth={useAuth} />
		            </Route>
		            <Route exact path="/login">
		              	<Login useAuth={useAuth} />
		            </Route>
		            <Route exact path="/registation">
		              	<Registration useAuth={useAuth} />
		            </Route>
		            <Route exact path="/restorepassword">
		              	<RestorePassword useAuth={useAuth} />
		            </Route>
		            <Route exact path="/auth">
		              	<Auth useAuth={useAuth} />
		            </Route>

		            <PrivateRoute path="/lk">
		              	<Lk userType="user" useAuth={useAuth} getBalance={() => {}} />
		            </PrivateRoute>
                <PrivateRoute path="/success">
                    <Success userType="user" useAuth={useAuth} />
                </PrivateRoute>
                <PrivateRoute path="/error">
                    <Error userType="user" useAuth={useAuth} />
                </PrivateRoute>

                <Route exact path="/license" component={License} />
		            <Route exact path="/privacy" component={Privacy} />
		            <Route exact path="/principles" component={Principles} />
		            <Route exact path="/contacts" component={Contacts} />
		            <Route exact path="/FAQ" component={FAQ} />

                <Route exact path="/payment" component={Payment} />

            	</Switch>
          	<AuthFooter />
        	</ProvideAuth>
   		</div> 
        <ScrollToTop />
    </Router>
  	);
}

export default App;


