import Home from "./pages/Home/Home.jsx";
import Producto from "./pages/List_Prod/Producto.jsx"
import Login from "./pages/Login/Login.jsx"; 
import Password_email from "./pages/Login/Password_email.jsx"
import Register from "./pages/Login/Register.jsx"
import Sesion from "./pages/Mi_Cuenta/Sesion.jsx"
import Edit from "./pages/Mi_Cuenta/Edit.jsx"
import ChangePassword from "./pages/Mi_Cuenta/ChangePassword.jsx"
import OrderDetail from "./pages/Mi_Cuenta/OrderDetail.jsx"


import { Routes, Route } from "react-router-dom";


import Car from "./pages/Car/Car.jsx"

const App = () => {
  return (
      <Routes>
       <Route>
         <Route path="/" element={<Home />}/>
         <Route path="Producto" element={<Producto />}/>
         <Route path="Login" element={<Login />}/>
         <Route path="Password_email" element={<Password_email />}/>
         <Route path="Register" element={<Register />}/>
         <Route path="Sesion" element={<Sesion />}/>
         <Route path="Edit" element={<Edit />}/>
         <Route path="Car" element={<Car />}/>
         <Route path="ChangePassword" element={<ChangePassword />}/>
         <Route path="OrderDetail" element={<OrderDetail />}/>
 
         <Route path="/Home/:nombre" element={<Home />}/>
         <Route path="/Producto/:nombre" element={<Home />}/>
         <Route path="Login/:nombre" element={<Login />}/>
         <Route path="Password_email/:nombre" element={<Password_email />}/>
         <Route path="Sesion/:nombre" element={<Sesion />}/>
         <Route path="ChangePassword/:nombre" element={<ChangePassword />}/>
         <Route path="OrderDetail/:id" element={<OrderDetail />}/>
        </Route>
     </Routes>
  );
};

export default App;
