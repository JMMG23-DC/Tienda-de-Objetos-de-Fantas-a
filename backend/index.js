import express from "express";
import { sequelize } from "./database/database.js";
import cors from "cors";
import { Op } from "sequelize";
// Importación de modelos
import { User } from "./modelos/User.js";
import { Producto } from "./modelos/Producto.js";
import { Pago } from "./modelos/Pago.js";
import { Envio } from "./modelos/Envio.js";
import { Orden } from "./modelos/Orden.js";
import { OrdenProducto } from "./modelos/OrdenProducto.js";



const app = express();
const PORT = 3000; // Puerto del Servidor (API)

app.use(express.json());
app.use(cors());

// HOME ==========================================================================


// 1. DATOS PARA EL HOME (DASHBOARD) - Lógica de Negocio
app.get("/home-data", async (req, res) => {
  try {
    // Fechas para filtrar el "Mes Actual"
    const fechaHoy = new Date();
    const primerDiaMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);
    const ultimoDiaMes = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 0);

    const productos = await Producto.findAll();
    const ventas = await OrdenProducto.findAll({
      include: [{ model: Orden }]
    });

    // --- A. Top 3 Categorías Más Populares (Histórico) ---
    const ventasPorCategoria = {}; 

    ventas.forEach(venta => {
        if (venta.orden && venta.orden.estado !== "Cancelado") {
            const prod = productos.find(p => p.id_producto === venta.producto_id);
            if (prod) {
                const cat = prod.categoria;
                if (!ventasPorCategoria[cat]) {
                    ventasPorCategoria[cat] = { 
                        categoria: cat, 
                        ventas: 0, 
                        imagen: prod.imagen_url 
                    };
                }
                ventasPorCategoria[cat].ventas += venta.cantidad;
            }
        }
    });

    const topCategorias = Object.values(ventasPorCategoria)
        .sort((a, b) => b.ventas - a.ventas)
        .slice(0, 3);


    // --- B. Top 12 Productos Más Vendidos (Este Mes) ---
    const ventasDelMes = ventas.filter(venta => {
        if (!venta.orden) return false;
        const fechaOrden = new Date(venta.orden.fecha_orden);
        return (
            venta.orden.estado !== "Cancelado" &&
            fechaOrden >= primerDiaMes &&
            fechaOrden <= ultimoDiaMes
        );
    });

    const conteoProductosMes = {};
    ventasDelMes.forEach(venta => {
        const id = venta.producto_id;
        conteoProductosMes[id] = (conteoProductosMes[id] || 0) + venta.cantidad;
    });

    let topProductosMes = productos.map(p => ({
        ...p.dataValues,
        ventasMes: conteoProductosMes[p.id_producto] || 0
    }));

    topProductosMes = topProductosMes
        .sort((a, b) => b.ventasMes - a.ventasMes)
        .slice(0, 12);

    // Si no hay ventas este mes, rellenamos con un fallback (los 12 primeros generales)
    if (ventasDelMes.length === 0) {
       topProductosMes = productos.slice(0, 12); 
    }

    // --- C. Productos Recientes (MODIFICADO: Usa 'nuevo_producto') ---
    // Filtramos los que tienen nuevo_producto en true
    let nuevosProductos = productos.filter(p => p.nuevo_producto === true).slice(0, 6);
    
    // Si no hay ninguno marcado, usamos los últimos por ID como respaldo
    if (nuevosProductos.length === 0) {
        nuevosProductos = [...productos]
            .sort((a, b) => b.id_producto - a.id_producto)
            .slice(0, 6);
    }

    // --- D. Categorías Nuevas (MODIFICADO: Usa 'nueva_categoria') ---
    // Filtramos los productos que tienen nueva_categoria en true y extraemos el nombre
    const categoriasNuevasSet = new Set(
        productos.filter(p => p.nueva_categoria === true).map(p => p.categoria)
    );
    const categoriasNuevas = [...categoriasNuevasSet];

    // Fallback si no hay categorías marcadas
    if (categoriasNuevas.length === 0) {
        categoriasNuevas.push("Cristales Elementales", "Reliquias y Artefactos Legendarios", "Grimorios Antiguos");
    }

    res.json({
      topCategorias,
      topProductos: topProductosMes, 
      nuevosProductos,
      categoriasNuevas
    });

  } catch (error) {
    console.error("Error al obtener datos del home:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});













































// USAURIOS==============================================================================================================================

// LOGIN USUARIO
app.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // 1. Buscar al usuario por email
    const usuario = await User.findOne({ where: { email } });

    // 2. Validar existencia
    if (!usuario) {
      return res.status(400).json({ error: "Correo no registrado." });
    }

    // 3. Validar contraseña
    if (usuario.contrasena !== contrasena) {
      return res.status(400).json({ error: "Contraseña incorrecta." });
    }

    // 4. VALIDACIÓN DE ESTADO (Nueva lógica solicitada)
    if (!usuario.activo) {
        return res.status(403).json({ error: "Tu cuenta está desactivada. Contacta al soporte." });
    }

    // 5. Login exitoso
    res.json({
      id_usuario: usuario.user_id,
      nombre: usuario.nombre,
      email: usuario.email,
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

//REGISTRAR USUARIO
app.post("/registrar_usuario", async (req, res) => {
  try {
    const { nombre, email, contrasena } = req.body;
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // --- ¡NUEVA VALIDACIÓN! ---
    // 1. Buscar si el email ya existe
    const usuarioExistente = await User.findOne({
      where: { email: email },
    });

    // 2. Si existe, enviar un error 400 (Bad Request)
    if (usuarioExistente) {
      return res.status(400).json({ error: "Este correo electrónico ya está registrado." });
    }
    // -------------------------

    // 3. Si no existe, crear el nuevo usuario
    const nuevoUsuario = await User.create({ nombre, email, contrasena });
    res.status(201).json(nuevoUsuario); // 201 = Creado

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send("Error en el servidor");
  }
});



// Obtener todos los usuarios
app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await User.findAll();
    console.log("Usuarios:", usuarios);
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).send("Error en el servidor");
  }
});


// OBTENER ÓRDENES DE UN USUARIO (CON PRODUCTOS)
app.get("/mis-ordenes/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params; 

    const ordenes = await Orden.findAll({

      include: [
        {
          model: User,
          where: { nombre: nombre }, 
          attributes: [] 
        },
        {
          model: Producto,
          attributes: ['nombre', 'imagen_url'], 
          through: {

            model: OrdenProducto, 
            attributes: ['cantidad', 'subtotal']
          }
        }
      ],
      

      order: [['fecha_orden', 'DESC']]
    });

    if (!ordenes) {
      return res.status(200).json([]); 
    }

    res.status(200).json(ordenes);

  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).send("Error en el servidor");
  }
});



// CAMBIAR CONTRASEÑA
app.put("/change-password", async (req, res) => {
  try {

    const { id_usuario, currentPassword, newPassword } = req.body;

    if (!id_usuario || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Faltan datos obligatorios." });
    }

    const usuario = await User.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    if (usuario.contrasena !== currentPassword) {
      return res.status(400).json({ error: "La contraseña actual es incorrecta." });
    }


    usuario.contrasena = newPassword;
    await usuario.save();

    res.status(200).json({ message: "¡Contraseña actualizada con éxito!" });

  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

// ACTUALIZAR PERFIL (Nombre y Correo)
app.put("/update-profile", async (req, res) => {
  try {
    const { id_usuario, nuevoNombre, nuevoEmail } = req.body;

    // 1. Validaciones básicas
    if (!id_usuario || !nuevoNombre || !nuevoEmail) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // 2. Buscar al usuario que quiere editarse
    const usuario = await User.findByPk(id_usuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const emailExistente = await User.findOne({
      where: {
        email: nuevoEmail 
      }
    });


    if (emailExistente) {
      const idExistente = emailExistente.user_id || emailExistente.id || emailExistente.id_usuario;
      const idActual = usuario.user_id || usuario.id || usuario.id_usuario;

      if (idExistente !== idActual) {
         return res.status(400).json({ error: "Este correo electrónico ya está en uso por otro usuario." });
      }
    }

    
    usuario.nombre = nuevoNombre;
    usuario.email = nuevoEmail;
    
    await usuario.save();

    res.status(200).json({ 
      message: "Datos actualizados correctamente.",
      usuario: { nombre: usuario.nombre, email: usuario.email }
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

// DETALLES DE LA ORDEN DEL USUARIO
app.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await Orden.findByPk(id, {
      include: [
        { model: User, attributes: ['nombre', 'email'] },
        { model: Envio },
        { model: Pago },
        { 
          model: Producto, 
          through: { attributes: ['cantidad', 'subtotal'] } 
        }
      ]
    });

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada." });
    }

    res.json(orden);
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

// CANCELAR ORDEN
app.put("/orders/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;

    const orden = await Orden.findByPk(id);

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada." });
    }

    if (["Entregado", "Enviado", "Completado"].includes(orden.estado)) {
      return res.status(400).json({ error: "No se puede cancelar una orden que ya fue enviada o entregada." });
    }

    orden.estado = "Cancelado";
    await orden.save();

    res.json({ message: "Orden cancelada exitosamente.", estado: orden.estado });

  } catch (error) {
    console.error("Error al cancelar orden:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});

// ============================================================================================================

// ADMIN =======================================================================================================
app.get("/admin/summary", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Si no hay fechas, usamos hoy por defecto
    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    
    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    // A. Conteo de Órdenes (Filtrado por fecha)
    const ordersCount = await Orden.count({
      where: {
        fecha_orden: { [Op.between]: [start, end] }
      }
    });

    // B. Usuarios Nuevos (Filtrado por fecha de creación)
    const newUsersCount = await User.count({
      where: {
        createdAt: { [Op.between]: [start, end] }
      }
    });

    // C. Ingresos Totales (Suma de subtotales de órdenes NO canceladas en ese rango)
    const totalIncome = await OrdenProducto.sum('subtotal', {
      include: [{
        model: Orden,
        attributes: [], // <--- ¡ESTA ES LA CLAVE! No seleccionar columnas de Orden
        where: {
          fecha_orden: { [Op.between]: [start, end] },
          estado: { [Op.ne]: 'Cancelado' }
        },
        required: true // Inner Join
      }]
    });

    res.json({ 
        orders: ordersCount, 
        newUsers: newUsersCount, 
        totalIncome: totalIncome || 0 
    });

  } catch (error) {
    console.error("Error admin summary:", error);
    res.status(500).json({ error: "Error servidor" });
  }
});




// LISTA PRODUCTOS ======================================================================================================

// PRODUCTOS: OBTENER TODOS
app.get("/products", async (req, res) => {
  try {
    const prods = await Producto.findAll({ order: [['id_producto', 'ASC']] });
    res.json(prods);
  } catch (error) { res.status(500).json({ error: "Error servidor" }); }
});

// PRODUCTOS: CAMBIAR ESTADO (TOGGLE)
app.put("/products/:id/toggle", async (req, res) => {
  try {
    const prod = await Producto.findByPk(req.params.id);
    if (!prod) return res.status(404).json({ error: "No encontrado" });
    prod.activo = !prod.activo;
    await prod.save();
    res.json({ message: "Estado actualizado", activo: prod.activo });
  } catch (error) { res.status(500).json({ error: "Error servidor" }); }
});

// Detalle Producto
app.get("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await Producto.findOne({
      where: { id_producto: id }
    });

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto); // devuelve solo el objeto, NO array
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error del servidor" });
  }
});



// AGREGAR PRODUCTO
import multer from "multer";
import path from "path";

// Ruta dinámica hacia /tienda_de_objetos/public/images
const imagePath = path.join(process.cwd(), "../tienda_de_objetos/public/images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagePath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Ruta para crear producto
app.post("/productos", upload.single("imagen"), async (req, res) => {
  try {
    const { nombre, categoria, precio } = req.body;
    const imagen = req.file ? `/images/${req.file.filename}` : null;

    const nuevo = await Producto.create({
      nombre,
      categoria,
      precio,
      imagen_url: imagen   
    });

    res.status(200).json(nuevo);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});







// LISTA ORDENES ======================================================================================================
// LISTAR TODAS LAS ÓRDENES
app.get("/ordenes", async (req, res) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "nombre", "email"]   // ← corregido
        },
        {
          model: Pago,
          attributes: ["pago_id", "fecha_pago", "estado_pago", "metodo_pago"]
        },
        {
          model: Envio,
          attributes: ["entrega_id", "metodo_envio", "ciudad", "direccion"]
        },
        {
          model: OrdenProducto,
          include: [
            {
              model: Producto,
              attributes: ["id_producto", "nombre", "precio", "imagen_url"]
            }
          ]
        }
      ]
    });

    res.status(200).json(ordenes);

  } catch (error) {
    console.error("ERROR LISTAR ÓRDENES:", error);
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
});


// Obtener detalle de una orden
app.get("/ordenes/:id", async (req, res) => {
  try {
    const orden = await Orden.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ["user_id", "nombre", "email"] },
        { model: Pago, attributes: ["pago_id", "fecha_pago", "estado_pago", "metodo_pago"] },
        { model: Envio, attributes: ["entrega_id", "metodo_envio", "ciudad", "direccion"] },
        {
          model: OrdenProducto,
          include: [
            { model: Producto, attributes: ["id_producto", "nombre", "precio", "imagen_url"] }
          ]
        }
      ]
    });

    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    res.status(200).json(orden);
  } catch (error) {
    console.error("ERROR DETALLE ÓRDEN:", error);
    res.status(500).json({ error: "Error al obtener la orden" });
  }
});

// Actualizar estado de una orden
app.put("/ordenes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) return res.status(400).json({ error: "No se envió el estado" });

    const orden = await Orden.findByPk(id);
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });

    await orden.update({ estado });
    res.json({ message: "Estado actualizado", orden });
  } catch (err) {
    console.error("ERROR ACTUALIZAR ORDEN:", err);
    res.status(500).json({ error: "No se pudo actualizar la orden" });
  }
});

// CATEGORIAS ===========================================================================================
// OBTENER LISTA DE CATEGORÍAS
app.get("/categories", async (req, res) => {
  try {
    const productos = await Producto.findAll();

    const categoryMap = {};

    productos.forEach(p => {
      if (!categoryMap[p.categoria]) {
        categoryMap[p.categoria] = {
          categoria: p.categoria,
          descripcion_categoria: p.descripcion_categoria || "",
          totalProductos: 0,
          activos: 0
        };
      }
      categoryMap[p.categoria].totalProductos += 1;
      if (p.estado) categoryMap[p.categoria].activos += 1; // asumimos que 'estado' indica activo
    });

    const categories = Object.values(categoryMap);

    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ACTUALIZAR CATEGORÍA Y DESCRIPCIÓN
app.put("/categories/update", async (req, res) => {
  try {
    const { categoria, nuevoNombre, nuevaDesc } = req.body;

    // Buscar productos con esa categoría
    const productos = await Producto.findAll({ where: { categoria } });

    if (!productos.length) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    // Actualizar cada producto
    for (let p of productos) {
      p.categoria = nuevoNombre;
      p.descripcion_categoria = nuevaDesc;
      await p.save();
    }

    res.json({ message: "Categoría actualizada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});

// Agregar Categoria

// Crear nueva categoría
app.post("/categories/new", async (req, res) => {
  try {
    const { categoria, descripcion_categoria, productos } = req.body;
    const idsProductos = JSON.parse(productos || "[]");

    // Crear productos asociados o asignar la categoría a productos existentes
    for (let id of idsProductos) {
      const p = await Producto.findByPk(id);
      if (p) {
        p.categoria = categoria;
        p.descripcion_categoria = descripcion_categoria;
        await p.save();
      }
    }

    res.json({ message: "Categoría creada correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear la categoría" });
  }
});
// Obtener todos los productos
app.get("/products", async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// actulizar categorias de los productos seleccionados
app.put("/categories/update-products", async (req, res) => {
  try {
    const { productoIds, categoria, descripcion_categoria } = req.body;

    if (!productoIds || productoIds.length === 0) {
      return res.status(400).json({ error: "No se seleccionaron productos" });
    }

    // Usa id_producto, no id
    const productos = await Producto.findAll({ where: { id_producto: productoIds } });

    for (let p of productos) {
      p.categoria = categoria;
      p.descripcion_categoria = descripcion_categoria || p.descripcion_categoria;
      await p.save();
    }

    res.json({ message: "Productos actualizados correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar productos" });
  }
});


// USER LIST ========================================================================================================
// OBTENER TODOS LOS USUARIOS
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['user_id', 'ASC']] // Ordenar por ID
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// CAMBIAR ESTADO DE USUARIO (Activar/Desactivar)
app.put("/users/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Invertir el estado actual
    user.activo = !user.activo;
    await user.save();

    res.json({ message: "Estado actualizado", activo: user.activo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar estado" });
  }
});


// USER DETAIL ORDERS
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Buscar información del usuario
    const usuario = await User.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2. Buscar las órdenes de ese usuario (con productos para calcular totales)
    const ordenes = await Orden.findAll({
      where: { usuario_id: id },
      include: [
        {
          model: Producto,
          through: { attributes: ['cantidad', 'subtotal'] } // Necesario para sumar $$
        }
      ],
      order: [['fecha_orden', 'DESC']], // Las más recientes primero
      limit: 10 // Límite opcional (ej. últimas 10 órdenes)
    });

    // 3. Formatear los datos para que el Frontend los entienda fácil
    const ordenesFormateadas = ordenes.map(orden => {
      // Calcular total de la orden sumando los subtotales de sus productos
      const totalOrden = orden.productos.reduce((acc, prod) => acc + prod.orden_producto.subtotal, 0);
      // Calcular cantidad total de ítems
      const totalItems = orden.productos.reduce((acc, prod) => acc + prod.orden_producto.cantidad, 0);

      return {
        id: orden.id_orden,
        date: orden.fecha_orden,
        total: totalOrden.toFixed(2), // Formato con 2 decimales
        items: totalItems,
        estado: orden.estado
      };
    });

    // Enviar respuesta combinada
    res.json({
      usuario: {
        id: usuario.user_id,
        nombre: usuario.nombre,
        email: usuario.email,
        activo: usuario.activo
      },
      ordenes: ordenesFormateadas
    });

  } catch (error) {
    console.error("Error al obtener detalle de usuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});






















// ================================================================================


// CREACIÓN DE TABLAS Y ENTRADA DE DATOS
async function sincronizarBD() {
  try {
    await sequelize.authenticate();
    console.log("Conexión exitosa a la base de datos");

    await sequelize.sync({ force: true });
    console.log("Tablas sincronizadas.");

    // --- Creación de Dataset (Solo si las tablas están vacías) ---

    // 1. Crear Usuarios (5)
    if ((await User.count()) === 0) {
      console.log("Creando usuarios de ejemplo...");
      await User.bulkCreate([
        { nombre: "Adrian", email: "adrian@example.com", contrasena: "12345" },
        { nombre: "Rafa", email: "maria@example.com", contrasena: "12345" },
        { nombre: "Admin", email: "carlos@example.com", contrasena: "12345" },
        { nombre: "Ana Gomez", email: "ana@example.com", contrasena: "12345" },
        { nombre: "Test User", email: "test@example.com", contrasena: "test" },
      ]);
    }


    // 2. Crear Productos (50)

    const productos = [
      // Pociones (Viejas)
      {"nombre":"Poción de Curación","descripcion":"Restaura 50 PS.","precio":25,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/pocion_curacion.png","rareza":"Común","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Elixir de Maná","descripcion":"Recupera 40 PM.","precio":30,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/elixir_mana.png","rareza":"Común","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Poción de Fuerza","descripcion":"Aumenta ataque.","precio":40,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/pocion_fuerza.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Poción de Velocidad","descripcion":"Aumenta velocidad.","precio":70,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/pocion_velocidad.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Elixir de Vitalidad","descripcion":"Salud máxima +.","precio":80,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/elixir_vitalidad.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Poción de Sueño","descripcion":"Duerme 10s.","precio":90,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/pocion_sueno.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Elixir del Sabio","descripcion":"Poder mágico +15.","precio":100,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/elixir_sabio.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Poción de Invisibilidad","descripcion":"Invisible 60s.","precio":120,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/pocion_invisibilidad.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Elixir de Resistencia","descripcion":"Reduce daño 20%.","precio":55,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/elixir_resistencia.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":false},
      {"nombre":"Poción Antídoto","descripcion":"Cura veneno.","precio":45,"categoria":"Pociones y Elixires Místicos","descripcion_categoria":"Consumibles mágicos que restauran vida, energía o potencian habilidades.","imagen_url":"/images/pocion_antidoto.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":false},

    // Armas (Viejas)
    {"nombre":"Espada del Dragón","descripcion":"Fuego de dragón.","precio":500,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/espada_dragon.png","rareza":"Legendario","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Arco Elfico","descripcion":"Gran precisión.","precio":450,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/arco_elfico.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Daga de Sombras","descripcion":"Silenciosa.","precio":300,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/daga_sombras.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Martillo del Trueno","descripcion":"Invoca rayos.","precio":600,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/martillo_trueno.png","rareza":"Legendario","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Lanza de Hielo","descripcion":"Congela.","precio":350,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/lanza_hielo.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Espada Rúnica","descripcion":"Corta defensas.","precio":550,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/espada_runica.png","rareza":"Legendario","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Hacha del Coloso","descripcion":"Gran devastación.","precio":650,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/hacha_coloso.png","rareza":"Legendario","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Ballesta Mágica","descripcion":"Proyectiles mágicos.","precio":480,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/ballesta_magica.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Katana Espiritual","descripcion":"Filo espiritual.","precio":520,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/katana_espiritual.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":false},
    {"nombre":"Maza de Obsidiana","descripcion":"Rompe armaduras.","precio":600,"categoria":"Armas Encantadas","descripcion_categoria":"Armas imbuidas con magia que otorgan poderes especiales y daño elemental.","imagen_url":"/images/maza_obsidiana.png","rareza":"Legendario","nuevo_producto":false,"nueva_categoria":false},

    // Grimorios (Nueva Categoría)
    {"nombre":"Grimorio de Fuego","descripcion":"Hechizos fuego.","precio":200,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_fuego.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":true},
    {"nombre":"Grimorio de Hielo","descripcion":"Magia hielo.","precio":200,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_hielo.png","rareza":"Raro","nuevo_producto":false,"nueva_categoria":true},
    {"nombre":"Grimorio de Oscuridad","descripcion":"Invoca sombras.","precio":300,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_oscuridad.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":true},
    {"nombre":"Grimorio de Luz","descripcion":"Curación.","precio":250,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_luz.png","rareza":"Épico","nuevo_producto":false,"nueva_categoria":true},
    {"nombre":"Grimorio del Tiempo","descripcion":"Ralentiza enemigos.","precio":400,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_tiempo.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Grimorio de Invocación","descripcion":"Invoca criaturas.","precio":350,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_invocacion.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Grimorio de Sangre","descripcion":"Sacrificio vital.","precio":500,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_sangre.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Grimorio Arcano","descripcion":"Secretos prohibidos.","precio":600,"categoria":"Grimorios Antiguos","descripcion_categoria":"Libros que contienen hechizos antiguos y secretos mágicos.","imagen_url":"/images/grimorio_arcano.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":false},

    // Cristales (Nueva Categoría)
    {"nombre":"Cristal de Vida","descripcion":"Salud +20.","precio":150,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_vida.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Cristal de Energía","descripcion":"Mana rapido.","precio":180,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_energia.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Cristal de Fuego","descripcion":"Ataque fuego.","precio":160,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_fuego.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Cristal de Hielo","descripcion":"Defensa fuego.","precio":160,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_hielo.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Cristal de Rayo","descripcion":"Velocidad ataque.","precio":200,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_rayo.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Cristal de Tierra","descripcion":"Resistencia física.","precio":170,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_tierra.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Cristal de Oscuridad","descripcion":"Ataque sombrío.","precio":210,"categoria":"Cristales Elementales","descripcion_categoria":"Cristales mágicos que potencian atributos y habilidades elementales.","imagen_url":"/images/cristal_oscuridad.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":false},

    // Reliquias (Nueva Categoría)
    {"nombre":"Amuleto del Guardián","descripcion":"Protección.","precio":250,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/amuleto_guardian.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Anillo de la Fortuna","descripcion":"Más tesoros.","precio":350,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/anillo_fortuna.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Medallón de Sabiduría","descripcion":"Exp +20%.","precio":400,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/medallon_sabiduria.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Báculo del Alma","descripcion":"Poder +30.","precio":500,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/baculo_alma.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Corona del Rey","descripcion":"Liderazgo.","precio":600,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/corona_rey.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Amuleto del Fénix","descripcion":"Resucita.","precio":800,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/amuleto_fenix.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Cáliz de la Eternidad","descripcion":"Regenera.","precio":900,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/calis_eternidad.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":true},
    {"nombre":"Capa de las Sombras","descripcion":"Camuflaje.","precio":700,"categoria":"Reliquias y Artefactos Legendarios","descripcion_categoria":"Objetos únicos con poderes extraordinarios y propiedades mágicas.","imagen_url":"/images/capa_sombras.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":true},

    // Armaduras (Nuevos Productos, Categoria Vieja/Mezclada)
    {"nombre":"Armadura de Dragón","descripcion":"Defensa fuego.","precio":1000,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/armadura_dragon.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Escudo de Cristal","descripcion":"Absorbe daño.","precio":700,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/escudo_cristal.png","rareza":"Épico","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Casco de Guerra","descripcion":"Defensa +15.","precio":400,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/casco_guerra.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Botas del Viento","descripcion":"Velocidad.","precio":450,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/botas_viento.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Guantes del Guerrero","descripcion":"Fuerza +10.","precio":300,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/guantes_guerrero.png","rareza":"Raro","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Armadura Sagrada","descripcion":"Protección luz.","precio":1200,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/armadura_sagrada.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":false},
    {"nombre":"Escudo Solar","descripcion":"Repele magia.","precio":950,"categoria":"Armaduras y Escudos","descripcion_categoria":"Equipamiento defensivo que protege y potencia al usuario en combate.","imagen_url":"/images/escudo_solar.png","rareza":"Legendario","nuevo_producto":true,"nueva_categoria":false}
  ];
    if ((await Producto.count()) === 0) {
      console.log("Creando 50 productos de ejemplo...");
      // Quitamos los campos extra para que coincida con el modelo
      const productosParaCrear = productos.map(p => ({
        nombre: p.nombre,
        descripcion: p.descripcion,
        precio: p.precio,
        categoria: p.categoria,
        imagen_url: p.imagen_url,
        rareza: p.rareza,
        nuevo_producto: p.nuevo_producto,
        nueva_categoria: p.nueva_categoria,
        descripcion_categoria: p.descripcion_categoria,
      }));
      await Producto.bulkCreate(productosParaCrear);
    }

    // 3. Crear Órdenes (20)
    // Solo creamos órdenes si la tabla está vacía
    if ((await Orden.count()) === 0) {
      console.log("Creando 20 órdenes de ejemplo...");

      const metodosPago = ["Tarjeta", "Yape", "PayPal", "Efectivo"];
      const estadosOrden = ["Pendiente", "Enviado", "Completado", "Cancelado"];
      const ciudades = ["Minas Tirith", "La Comarca", "Rivendell", "Gondor", "Rohan"];

      for (let i = 1; i <= 20; i++) {
        // Asignar orden a un usuario (IDs 1 a 5)
        const userId = (i % 5) + 1;
        const estado = estadosOrden[i % estadosOrden.length];
        
        // Crear Pago
        const pago = await Pago.create({
          fecha_pago: new Date(),
          estado_pago: (estado === "Pendiente" || estado === "Cancelado") ? "Pendiente" : "Completado",
          metodo_pago: metodosPago[i % metodosPago.length],
        });

        // Crear Envío
        const envio = await Envio.create({
          metodo_envio: (i % 2 === 0) ? "Delivery mágico" : "Recojo en tienda",
          ciudad: ciudades[i % ciudades.length],
          direccion: `Calle Falsa 123, ${ciudades[i % ciudades.length]}`,
        });

        // Crear Orden
        const orden = await Orden.create({
          usuario_id: userId,
          pago_id: pago.pago_id,
          envio_id: envio.entrega_id,
          estado: estado,
        });

        // Añadir productos a la orden
        
        // Producto 1 (ID de producto 1 a 10)
        const prod1_idx = i % productos.length;
        const prod1_cant = (i % 3) + 1; // Cantidad 1, 2 o 3
        await OrdenProducto.create({
          orden_id: orden.id_orden,
          producto_id: prod1_idx + 1, // IDs de producto empiezan en 1
          cantidad: prod1_cant,
          subtotal: productos[prod1_idx].precio * prod1_cant,
        });

        // Añadir un segundo producto a las órdenes pares
        if (i % 2 === 0) {
          const prod2_idx = (i + 3) % productos.length;
          const prod2_cant = 1;
          await OrdenProducto.create({
            orden_id: orden.id_orden,
            producto_id: prod2_idx + 1,
            cantidad: prod2_cant,
            subtotal: productos[prod2_idx].precio * prod2_cant,
          });
        }
      }
    }

    console.log("Dataset de ejemplo listo.");

  } catch (error) {
    console.error(" Error en la conexión o sincronización:", error);
  }
}

// Iniciar servidor (Esta parte ya la tienes)
app.listen(PORT, async () => {
  console.log(` Servidor funcionando en el puerto: ${PORT}`);
  // await sincronizarBD();
});