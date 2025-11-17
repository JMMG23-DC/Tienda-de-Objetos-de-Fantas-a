import express from "express";
import { sequelize } from "./database/database.js";
import cors from "cors";

// Importación de modelos
import { User } from "./modelos/User.js";
import { Producto } from "./modelos/Producto.js";
import { Pago } from "./modelos/Pago.js";
import { Envio } from "./modelos/Envio.js";
import { Orden } from "./modelos/Orden.js";
import { OrdenProducto } from "./modelos/OrdenProducto.js";

const app = express();
const PORT = 4000; // Puerto del Servidor (API)

app.use(express.json());
app.use(cors());

// USAURIOS==============================================================================================================================

// LOGIN USUARIO
app.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // 1. Buscar al usuario por email
    const usuarioExistente = await User.findOne({
      where: { email: email },
    });

    // 2. Si el email no se encuentra
    if (!usuarioExistente) {
      return res.status(400).json({ error: "Correo no registrado." });
    }

    // 3. Comparar la contraseña (en texto plano, como lo estás haciendo)
    if (usuarioExistente.contrasena !== contrasena) {
      return res.status(400).json({ error: "Contraseña incorrecta." });
    }

    // 4. Si todo está OK, enviamos los datos del usuario (sin la contraseña)
    res.status(200).json({
      id_usuario: usuarioExistente.id_usuario,
      nombre: usuarioExistente.nombre,
      email: usuarioExistente.email,
    });

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).send("Error en el servidor");
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
    const { nombre } = req.params; // <-- CAMBIADO

    // 1. Buscar todas las órdenes que coincidan con el NOMBRE de usuario
    const ordenes = await Orden.findAll({
      // 2. Incluir el modelo User para filtrar por nombre
      include: [
        {
          model: User,
          where: { nombre: nombre }, // <-- CAMBIADO (filtro por nombre)
          attributes: [] // No necesitamos los datos del usuario, solo el filtro
        },
        {
          model: Producto,
          attributes: ['nombre', 'imagen_url'], // Solo traer nombre e imagen
          through: {
            // Traer 'cantidad' y 'subtotal' de la tabla intermedia
            model: OrdenProducto, 
            attributes: ['cantidad', 'subtotal']
          }
        }
      ],
      
      // 3. Ordenar por fecha (más nuevas primero)
      order: [['fecha_orden', 'DESC']]
    });

    if (!ordenes) {
      return res.status(200).json([]); // Devolver array vacío si no hay
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

    // 1. Buscar al usuario por su ID
    const usuario = await User.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // 2. Verificar que la contraseña actual sea correcta
    // (Como no estás hasheando, es una simple comparación)
    if (usuario.contrasena !== currentPassword) {
      return res.status(400).json({ error: "La contraseña actual es incorrecta." });
    }

    // 3. Si es correcta, actualizar a la nueva contraseña
    usuario.contrasena = newPassword;
    await usuario.save();

    res.status(200).json({ message: "¡Contraseña actualizada con éxito!" });

  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
});


// ============================================================================================================






































// ================================================================================




// CREACIÓN DE TABLAS Y ENTRADA DE DATOS

// rutas admin
app.get("/admin/dashboard-resumen", async (req, res) => {
  try {
    const totalUsuarios = await User.count();
    const totalProductos = await Producto.count();
    const totalOrdenes = await Orden.count();
    const ventas = await OrdenProducto.findAll({ attributes: ["subtotal"] });
    const totalVentas = ventas.reduce((a, b) => a + (b.subtotal || 0), 0);
    res.json({ totalUsuarios, totalProductos, totalOrdenes, totalVentas });
  } catch (e) {
    res.status(500).json({ error: "Error" });
  }
});

app.get("/admin/productos", async (req, res) => {
  try { res.json(await Producto.findAll()); }
  catch (e) { res.status(500).json({ error: "Error" }); }
});

app.post("/admin/productos", async (req, res) => {
  try { res.json(await Producto.create(req.body)); }
  catch (e) { res.status(500).json({ error: "Error" }); }
});

app.put("/admin/productos/:id", async (req, res) => {
  try {
    const pr = await Producto.findByPk(req.params.id);
    if (!pr) return res.status(404).json({ error: "No existe" });
    await pr.update(req.body);
    res.json(pr);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

app.patch("/admin/productos/:id/activar", async (req, res) => {
  try {
    const pr = await Producto.findByPk(req.params.id);
    if (!pr) return res.status(404).json({ error: "No existe" });
    pr.activo = true; await pr.save();
    res.json({ mensaje: "activado" });
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

app.patch("/admin/productos/:id/inactivar", async (req, res) => {
  try {
    const pr = await Producto.findByPk(req.params.id);
    if (!pr) return res.status(404).json({ error: "No existe" });
    pr.activo = false; await pr.save();
    res.json({ mensaje: "inactivado" });
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

app.get("/admin/categorias", async (req, res) => {
  try {
    const productos = await Producto.findAll({ attributes: ["categoria"] });
    const categorias = [...new Set(productos.map(x => x.categoria))];
    res.json(categorias);
  } catch (e) { res.status(500).json({ error: "Error" }); }
});

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
      // Pociones y Elixires Místicos
      {"nombre":"Poción de Curación","descripcion":"Restaura 50 puntos de salud al instante.","precio":25,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/pocion_curacion.png","rareza":"Común"},
      {"nombre":"Elixir de Maná","descripcion":"Recupera 40 puntos de maná.","precio":30,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/elixir_mana.png","rareza":"Común"},
      {"nombre":"Poción de Fuerza","descripcion":"Aumenta el ataque físico por 5 minutos.","precio":40,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/pocion_fuerza.png","rareza":"Raro"},
      {"nombre":"Poción de Invisibilidad","descripcion":"Vuelve invisible durante 60 segundos.","precio":120,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/pocion_invisibilidad.png","rareza":"Épico"},
      {"nombre":"Elixir de Resistencia","descripcion":"Reduce el daño recibido en 20% por 3 minutos.","precio":55,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/elixir_resistencia.png","rareza":"Raro"},
      {"nombre":"Poción de Velocidad","descripcion":"Duplica la velocidad por 30 segundos.","precio":70,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/pocion_velocidad.png","rareza":"Raro"},
      {"nombre":"Poción Antídoto","descripcion":"Cura envenenamiento y toxinas.","precio":45,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/pocion_antidoto.png","rareza":"Raro"},
      {"nombre":"Elixir de Vitalidad","descripcion":"Aumenta la salud máxima temporalmente.","precio":80,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/elixir_vitalidad.png","rareza":"Épico"},
      {"nombre":"Poción de Sueño","descripcion":"Adormece al objetivo durante 10 segundos.","precio":90,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/pocion_sueno.png","rareza":"Épico"},
      {"nombre":"Elixir del Sabio","descripcion":"Incrementa poder mágico en +15.","precio":100,"categoria":"Pociones y Elixires Místicos","imagen_url":"/images/elixir_sabio.png","rareza":"Épico"},

      // Armas Encantadas
      {"nombre":"Espada del Dragón","descripcion":"Espada forjada con fuego de dragón. Gran poder de ataque.","precio":500,"categoria":"Armas Encantadas","imagen_url":"/images/espada_dragon.png","rareza":"Legendario"},
      {"nombre":"Arco Elfico","descripcion":"Arco mágico de gran precisión y alcance.","precio":450,"categoria":"Armas Encantadas","imagen_url":"/images/arco_elfico.png","rareza":"Épico"},
      {"nombre":"Daga de Sombras","descripcion":"Ataca rápido y en silencio, daño crítico aumentado.","precio":300,"categoria":"Armas Encantadas","imagen_url":"/images/daga_sombras.png","rareza":"Raro"},
      {"nombre":"Martillo del Trueno","descripcion":"Invoca rayos al golpear.","precio":600,"categoria":"Armas Encantadas","imagen_url":"/images/martillo_trueno.png","rareza":"Legendario"},
      {"nombre":"Lanza de Hielo","descripcion":"Congela enemigos al contacto.","precio":350,"categoria":"Armas Encantadas","imagen_url":"/images/lanza_hielo.png","rareza":"Épico"},
      {"nombre":"Espada Rúnica","descripcion":"Luz mágica que corta defensas oscuras.","precio":550,"categoria":"Armas Encantadas","imagen_url":"/images/espada_runica.png","rareza":"Legendario"},
      {"nombre":"Hacha del Coloso","descripcion":"Hacha pesada que causa gran devastación.","precio":650,"categoria":"Armas Encantadas","imagen_url":"/images/hacha_coloso.png","rareza":"Legendario"},
      {"nombre":"Ballesta Mágica","descripcion":"Dispara proyectiles encantados.","precio":480,"categoria":"Armas Encantadas","imagen_url":"/images/ballesta_magica.png","rareza":"Épico"},
      {"nombre":"Katana Espiritual","descripcion":"Espada ligera con filo espiritual.","precio":520,"categoria":"Armas Encantadas","imagen_url":"/images/katana_espiritual.png","rareza":"Épico"},
      {"nombre":"Maza de Obsidiana","descripcion":"Rompe armaduras con facilidad.","precio":600,"categoria":"Armas Encantadas","imagen_url":"/images/maza_obsidiana.png","rareza":"Legendario"},

      // Grimorios Antiguos
      {"nombre":"Grimorio de Fuego","descripcion":"Hechizos de fuego más potentes.","precio":200,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_fuego.png","rareza":"Raro"},
      {"nombre":"Grimorio de Hielo","descripcion":"Acceso a magia de hielo avanzada.","precio":200,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_hielo.png","rareza":"Raro"},
      {"nombre":"Grimorio de Oscuridad","descripcion":"Permite invocar criaturas sombrías.","precio":300,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_oscuridad.png","rareza":"Épico"},
      {"nombre":"Grimorio de Luz","descripcion":"Magias de curación más efectivas.","precio":250,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_luz.png","rareza":"Épico"},
      {"nombre":"Grimorio del Tiempo","descripcion":"Permite ralentizar enemigos.","precio":400,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_tiempo.png","rareza":"Legendario"},
      {"nombre":"Grimorio de Invocación","descripcion":"Permite invocar criaturas menores.","precio":350,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_invocacion.png","rareza":"Épico"},
      {"nombre":"Grimorio de Sangre","descripcion":"Hechizos de sacrificio y vitalidad.","precio":500,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_sangre.png","rareza":"Legendario"},
      {"nombre":"Grimorio Arcano","descripcion":"Contiene secretos mágicos prohibidos.","precio":600,"categoria":"Grimorios Antiguos","imagen_url":"/images/grimorio_arcano.png","rareza":"Legendario"},

      // Cristales Elementales
      {"nombre":"Cristal de Vida","descripcion":"Aumenta la salud máxima en +20.","precio":150,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_vida.png","rareza":"Raro"},
      {"nombre":"Cristal de Energía","descripcion":"Regenera maná más rápido.","precio":180,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_energia.png","rareza":"Raro"},
      {"nombre":"Cristal de Fuego","descripcion":"Mejora los ataques de fuego.","precio":160,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_fuego.png","rareza":"Raro"},
      {"nombre":"Cristal de Hielo","descripcion":"Refuerza defensas contra ataques de fuego.","precio":160,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_hielo.png","rareza":"Raro"},
      {"nombre":"Cristal de Rayo","descripcion":"Aumenta la velocidad de ataque.","precio":200,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_rayo.png","rareza":"Épico"},
      {"nombre":"Cristal de Tierra","descripcion":"Otorga resistencia física adicional.","precio":170,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_tierra.png","rareza":"Raro"},
      {"nombre":"Cristal de Oscuridad","descripcion":"Refuerza ataques sombríos.","precio":210,"categoria":"Cristales Elementales","imagen_url":"/images/cristal_oscuridad.png","rareza":"Épico"},

      // Reliquias y Artefactos Legendarios
      {"nombre":"Amuleto del Guardián","descripcion":"Protección contra maldiciones.","precio":250,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/amuleto_guardian.png","rareza":"Épico"},
      {"nombre":"Anillo de la Fortuna","descripcion":"Aumenta la probabilidad de encontrar tesoros.","precio":350,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/anillo_fortuna.png","rareza":"Épico"},
      {"nombre":"Medallón de Sabiduría","descripcion":"Incrementa experiencia ganada en 20%.","precio":400,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/medallon_sabiduria.png","rareza":"Legendario"},
      {"nombre":"Báculo del Alma","descripcion":"Aumenta poder mágico en +30.","precio":500,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/baculo_alma.png","rareza":"Legendario"},
      {"nombre":"Corona del Rey Antiguo","descripcion":"Otorga liderazgo y carisma.","precio":600,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/corona_rey.png","rareza":"Legendario"},
      {"nombre":"Amuleto del Fénix","descripcion":"Resucita una vez al morir.","precio":800,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/amuleto_fenix.png","rareza":"Legendario"},
      {"nombre":"Cáliz de la Eternidad","descripcion":"Regenera salud lentamente.","precio":900,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/calis_eternidad.png","rareza":"Legendario"},
      {"nombre":"Capa de las Sombras","descripcion":"Permite camuflarse en la oscuridad.","precio":700,"categoria":"Reliquias y Artefactos Legendarios","imagen_url":"/images/capa_sombras.png","rareza":"Épico"},

      // Armaduras y Escudos
      {"nombre":"Armadura de Dragón","descripcion":"Defensa suprema contra fuego.","precio":1000,"categoria":"Armaduras y Escudos","imagen_url":"/images/armadura_dragon.png","rareza":"Legendario"},
      {"nombre":"Escudo de Cristal","descripcion":"Absorbe 30% del daño recibido.","precio":700,"categoria":"Armaduras y Escudos","imagen_url":"/images/escudo_cristal.png","rareza":"Épico"},
      {"nombre":"Casco de Guerra","descripcion":"Aumenta defensa física en +15.","precio":400,"categoria":"Armaduras y Escudos","imagen_url":"/images/casco_guerra.png","rareza":"Raro"},
      {"nombre":"Botas del Viento","descripcion":"Velocidad de movimiento aumentada.","precio":450,"categoria":"Armaduras y Escudos","imagen_url":"/images/botas_viento.png","rareza":"Raro"},
      {"nombre":"Guantes del Guerrero","descripcion":"Incrementa fuerza física en +10.","precio":300,"categoria":"Armaduras y Escudos","imagen_url":"/images/guantes_guerrero.png","rareza":"Raro"},
      {"nombre":"Armadura Sagrada","descripcion":"Protección contra ataques oscuros.","precio":1200,"categoria":"Armaduras y Escudos","imagen_url":"/images/armadura_sagrada.png","rareza":"Legendario"},
      {"nombre":"Escudo Solar","descripcion":"Brilla y repele ataques mágicos.","precio":950,"categoria":"Armaduras y Escudos","imagen_url":"/images/escudo_solar.png","rareza":"Legendario"}
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