import { Routes, Route } from "react-router-dom";

// Alumno 1 & Alumno 2
import Home from "./pages/Home/Home.jsx";
import Producto from "./pages/List_Prod/Producto.jsx"

import Car from "./pages/List_Prod/Car.jsx"
import Checkout from "./pages/List_Prod/Checkout.jsx"


// Alumno 3
import Login from "./pages/Login/Login.jsx"; 
import Password_email from "./pages/Login/Password_email.jsx"
import Register from "./pages/Login/Register.jsx"
import Sesion from "./pages/Mi_Cuenta/Sesion.jsx"
import Edit from "./pages/Mi_Cuenta/Edit.jsx"
import ChangePassword from "./pages/Mi_Cuenta/ChangePassword.jsx"
import OrderDetail from "./pages/Mi_Cuenta/OrderDetail.jsx"


// Alumno 4
import AdminDashboard from "./pages/Admin/AdminDashBoard.jsx";
import ProductList from "./pages/Admin/Product/PrductList"
import NewProduct from "./pages/Admin/Product/NewProduct"
import ProductDetail from "./pages/Admin/Product/ProductDetail"


import CategoryList from "./pages/Admin/Category/CategoryList.jsx"
import NewCategory from "./pages/Admin/Category/NewCategory.jsx"
import CategoryDetail from "./pages/Admin/Category/CategoryDetail.jsx"


// Alumno 5
import UserList from "./pages/Admin/User&Order/UserList"
import UserDetail from "./pages/Admin/User&Order/UserDetail"
import OrderList from "./pages/Admin/User&Order/OrderList"
import OrderDetailUser from "./pages/Admin/User&Order/OrderDetailUser"







const App = () => {
  return (
      <Routes>
       <Route>
         {/*Faltan Cositas*/}
         {/*LanPage*/}
         <Route path="/" element={<Home />}/>

         {/*Product List in Sale*/}
         <Route path="Producto" element={<Producto />}/>

         {/*Lista de Compras & Carrito*/}
         <Route path="/Car" element={<Car />}/>
         <Route path="/Checkout" element={<Checkout />}/>         


         {/*Login and Register User - Mi Cuenta*/}
         <Route path="Login" element={<Login />}/>
         <Route path="Password_email" element={<Password_email />}/>
         <Route path="Register" element={<Register />}/>
         <Route path="Sesion" element={<Sesion />}/>
         <Route path="Edit" element={<Edit />}/>
         <Route path="ChangePassword" element={<ChangePassword />}/>
         <Route path="OrderDetail/:id" element={<OrderDetail />}/>

         {/*Admin*/}
         {/*ProductList*/}
         <Route path="AdminDashboard" element={<AdminDashboard />}/>
         <Route path="ProductList" element={<ProductList />}/>
         <Route path="NewProduct" element={<NewProduct />}/>
         <Route path="ProductDetail" element={<ProductDetail />}/>
         <Route path="/ProductDetail/:id" element={<ProductDetail />}/>

         {/*CategoryList*/}
         <Route path="CategoryList" element={<CategoryList />}/>
         <Route path="NewCategory" element={<NewCategory />}/>
         <Route path="CategoryDetail" element={<CategoryDetail />}/>
         <Route path="/CategoryDetail/:categoria" element={<CategoryDetail />}/>


         {/*User->Order List*/}
         <Route path="UserList" element={<UserList />}/>
         <Route path="UserDetail" element={<UserDetail />}/>
         <Route path="/OrderList" element={<OrderList />}/>
         <Route path="/UserDetail/:id" element={<UserDetail />}/>
         <Route path="/OrderDetailUser/:id" element={<OrderDetailUser />}/>




         
        </Route>
     </Routes>
  );
};

export default App;
