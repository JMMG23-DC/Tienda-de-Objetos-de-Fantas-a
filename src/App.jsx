
import NewProduct from './NewProduct.jsx';
import AddCategory from './AddCategory.jsx';
import ProductList from './ProductList.jsx';

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
import AdminDashboard from './AdminDashboard.jsx';
import UserList from './UserList.jsx';

import UserDetail from './UserDetail.jsx';
import OrderList from './OrderList.jsx';
import { useCart } from './CartContext.jsx';


function App() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const [showAccount, setShowAccount] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const [showOrderList, setShowOrderList] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userData, setUserData] = useState({ nombre: "", apellido: "", correo: "" });
  const [isAdmin, setIsAdmin] = useState(false); // Simulación de usuario admin
  const [showAdmin, setShowAdmin] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  // Estados para la página de administrador
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showProductList, setShowProductList] = useState(false);

  // Function to reset to main menu
  const goToMainMenu = () => {
    setShowAccount(false);
    setShowAdmin(false);
    setShowLogin(false);
    setShowForgot(false);
    setShowRegister(false);
    setShowOrderList(false);
    setOrderDetail(null);
    setSelectedProduct(null);
    setShowDetail(false);
    setSearch("");
    setShowEditUser(false);
    setShowChangePassword(false);
    setShowUserList(false);
    setUserDetail(null);
    setShowNewProduct(false);
    setShowAddCategory(false);
    setShowProductList(false);
  };

  return (
    <div className="landing-page">
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Back to Main Menu button */}
          {loggedIn && (showAccount || showAdmin || showOrderList || selectedProduct || search) && (
            <button 
              onClick={goToMainMenu}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem",
                background: "#f0f0f0",
                border: "1px solid #ddd"
              }}
            >
              ← Menú Principal
            </button>
          )}
          <div style={{ flex: 1 }}>
            <SearchBar onSearch={setSearch} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {loggedIn ? (
            <span>
              Bienvenido, {userName}! 
              <button onClick={() => { setLoggedIn(false); setUserName(""); setIsAdmin(false); goToMainMenu(); }}>Cerrar sesión</button>
              <button onClick={() => { setShowAccount(true); setOrderDetail(null); setShowAdmin(false); }}>Comprador</button>
              <button style={{ marginLeft: "1rem" }} onClick={() => { setShowAdmin(true); setShowAccount(false); setIsAdmin(true); }}>Administrador</button>
            </span>
          ) : (
            <button onClick={() => { setShowLogin(true); setShowForgot(false); setShowRegister(false); }}>Mi cuenta</button>
          )}
        </div>
      </header>
      {/* Página de usuario comprador */}
      {showAccount && !showAdmin ? (
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
  ) : null}
      {/* Página de administrador */}
      {showAdmin && isAdmin ? (
        showNewProduct ? (
          <NewProduct onSave={() => { setShowNewProduct(false); }} onCancel={() => setShowNewProduct(false)} />
        ) : showAddCategory ? (
          <AddCategory 
            onSave={(categoryData) => { 
              console.log('Categoría guardada:', categoryData);
              alert('Categoría guardada exitosamente!');
              setShowAddCategory(false); 
            }} 
            onCancel={() => setShowAddCategory(false)} 
          />
        ) : showProductList ? (
          <ProductList
            onProductDetail={p => {}}
            onRegisterProduct={() => setShowNewProduct(true)}
          />
        ) : showUserList ? (
          userDetail ? (
            <UserDetail user={userDetail} onBack={() => setUserDetail(null)} />
          ) : (
            <UserList onUserDetail={u => setUserDetail(u)} />
          )
        ) : (
          <AdminDashboard
            onShowUserList={() => setShowUserList(true)}
            onShowProductList={() => setShowProductList(true)}
            onShowAddCategory={() => setShowAddCategory(true)}
          />
        )
  ) : null}
      {/* Página de login y registro */}
      {!loggedIn && (showLogin || showForgot || showRegister) ? (
        showLogin ? (
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
        ) : (
          <Register
            onBack={() => { setShowRegister(false); setShowLogin(true); }}
            onRegister={(name) => {
              setLoggedIn(true);
              setUserName(name);
              setShowRegister(false);
            }}
          />
        )
  ) : null}
      {/* Página principal y navegación general */}
      {!showAccount && !showAdmin && loggedIn && !showLogin && !showForgot && !showRegister && (
        showOrderList ? (
          orderDetail ? (
            <OrderDetail order={orderDetail} onBack={() => setOrderDetail(null)} />
          ) : (
            <OrderList onOrderDetail={order => setOrderDetail(order)} />
          )
        ) : selectedProduct ? (
          <ProductDetail 
            product={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
            onAddToCart={addToCart}
          />
        ) : search ? (
          <SearchResults search={search} onSelect={(p) => { setSelectedProduct(p); setShowDetail(true); }} />
        ) : (
          <>
            <Banner />
            <div id="categorias">
              <FeaturedCategories />
            </div>
            <div id="mas-vendidos">
              <BestSellers onProductClick={(product) => setSelectedProduct(product)} />
            </div>
            <section className="bottom-section" id="nuevos">
              <NewCategories />
              <NewProducts onProductClick={(product) => setSelectedProduct(product)} />
            </section>
            <button style={{ margin: "2rem auto", display: "block" }} onClick={() => setShowOrderList(true)}>
              Ver listado de órdenes
            </button>
          </>
        )
      )}
      <div id="carrito">
        <Cart loggedIn={loggedIn} />
      </div>
      <Footer />
    </div>
  );
}

export default App
