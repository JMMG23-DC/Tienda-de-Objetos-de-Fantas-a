

import { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar.jsx';
import FeaturedCategories from './FeaturedCategories.jsx';
import BestSellers from './BestSellers.jsx';
import NewCategories from './NewCategories.jsx';
import NewProducts from './NewProducts.jsx';
import Banner from './Banner.jsx';

import Cart from './Cart.jsx';
import Footer from './Footer.jsx';
import SearchResults from './SearchResults.jsx';
import ProductDetail from './ProductDetail.jsx';
import LoginForm from './LoginForm.jsx';
import ForgotPassword from './ForgotPassword.jsx';
import Register from './Register.jsx';
import UserAccount from './UserAccount.jsx';
import OrderDetail from './OrderDetail.jsx';
import EditUserData from './EditUserData.jsx';
import ChangePassword from './ChangePassword.jsx';


function App() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [showAccount, setShowAccount] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userData, setUserData] = useState({ nombre: "", apellido: "", correo: "" });

  return (
    <div className="landing-page">
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "#fff" }}>
        <div style={{ flex: 1 }}>
          <SearchBar onSearch={setSearch} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {loggedIn ? (
            <span>Bienvenido, {userName}! <button onClick={() => { setLoggedIn(false); setUserName(""); }}>Cerrar sesión</button> <button onClick={() => { setShowAccount(true); setOrderDetail(null); }}>Mi cuenta</button></span>
          ) : (
            <button onClick={() => { setShowLogin(true); setShowForgot(false); setShowRegister(false); }}>Mi cuenta</button>
          )}
        </div>
      </header>
      {showAccount ? (
        showEditUser ? (
          <EditUserData
            user={userData}
            onSave={data => {
              setUserData(data);
              setShowEditUser(false);
            }}
            onCancel={() => setShowEditUser(false)}
          />
        ) : showChangePassword ? (
          <ChangePassword
            onSave={() => { setShowChangePassword(false); }}
            onCancel={() => setShowChangePassword(false)}
          />
        ) : orderDetail ? (
          <OrderDetail order={orderDetail} onBack={() => setOrderDetail(null)} />
        ) : (
          <UserAccount
            onOrderDetail={order => setOrderDetail(order)}
            onEditUser={() => setShowEditUser(true)}
            onChangePassword={() => setShowChangePassword(true)}
          />
        )
      ) : showLogin && !loggedIn ? (
        <LoginForm
          onLogin={(name) => {
            setLoggedIn(true);
            setUserName(name);
            setShowLogin(false);
          }}
          forgotPassword={() => { setShowForgot(true); setShowLogin(false); }}
          register={() => { setShowRegister(true); setShowLogin(false); }}
        />
      ) : showForgot ? (
        <ForgotPassword onBack={() => { setShowForgot(false); setShowLogin(true); }} />
      ) : showRegister ? (
        <Register
          onBack={() => { setShowRegister(false); setShowLogin(true); }}
          onRegister={(name) => {
            setLoggedIn(true);
            setUserName(name);
            setShowRegister(false);
          }}
        />
      ) : !loggedIn ? (
        <LoginForm
          onLogin={(name) => {
            setLoggedIn(true);
            setUserName(name);
            setShowLogin(false);
          }}
          forgotPassword={() => { setShowForgot(true); setShowLogin(false); }}
          register={() => { setShowRegister(true); setShowLogin(false); }}
        />
      ) : selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      ) : search ? (
        <SearchResults search={search} onSelect={setSelectedProduct} />
      ) : (
        <>
          <Banner />
          <div id="categorias">
            <FeaturedCategories />
          </div>
          <div id="mas-vendidos">
            <BestSellers />
          </div>
          <section className="bottom-section" id="nuevos">
            <NewCategories />
            <NewProducts />
          </section>
        </>
      )}
      <div id="carrito">
        <Cart loggedIn={loggedIn} />
      </div>
      <Footer />
    </div>
  );
}

export default App
