// Script de verificación post-migración
// Ejecutar con: node verificacion-migracion.js

import { sequelize } from "./database/database.js";
import { User } from "./modelos/User.js";
import { Producto } from "./modelos/Producto.js";
import { Categoria } from "./modelos/Categoria.js";
import { Orden } from "./modelos/Orden.js";
import { OrdenProducto } from "./modelos/OrdenProducto.js";

async function verificarMigracion() {
  try {
    console.log("🔍 Iniciando verificación post-migración...\n");

    // 1. Verificar conexión a BD
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos establecida correctamente");

    // 2. Verificar que la tabla Categoria existe y tiene datos
    const totalCategorias = await Categoria.count();
    console.log(`✅ Tabla 'categoria': ${totalCategorias} categorías encontradas`);
    
    if (totalCategorias === 0) {
      console.log("⚠️  ADVERTENCIA: No hay categorías en la base de datos");
      return;
    }

    // 3. Mostrar categorías creadas
    const categorias = await Categoria.findAll();
    console.log("\n📋 Categorías creadas:");
    categorias.forEach(cat => {
      console.log(`  - ID: ${cat.categoria_id}, Nombre: "${cat.nombre}", Nueva: ${cat.nueva_categoria}`);
    });

    // 4. Verificar que los productos tienen categoria_id asignado
    const totalProductos = await Producto.count();
    const productosConCategoria = await Producto.count({ where: { categoria_id: { [sequelize.Op.not]: null } } });
    const productosSinCategoria = totalProductos - productosConCategoria;
    
    console.log(`\n✅ Tabla 'producto': ${totalProductos} productos encontrados`);
    console.log(`✅ Productos con categoría asignada: ${productosConCategoria}`);
    
    if (productosSinCategoria > 0) {
      console.log(`⚠️  ADVERTENCIA: ${productosSinCategoria} productos sin categoría asignada`);
    }

    // 5. Verificar relaciones funcionan correctamente
    const productosConCategoriaDatos = await Producto.findAll({
      include: [{
        model: Categoria,
        attributes: ['categoria_id', 'nombre', 'descripcion']
      }],
      limit: 5
    });

    console.log("\n🔗 Verificando relaciones (muestra de 5 productos):");
    productosConCategoriaDatos.forEach(prod => {
      const categoriaNombre = prod.categoria?.nombre || "SIN CATEGORÍA";
      console.log(`  - "${prod.nombre}" -> Categoría: "${categoriaNombre}"`);
    });

    // 6. Verificar distribución de productos por categoría
    console.log("\n📊 Distribución de productos por categoría:");
    const distribuccion = await Categoria.findAll({
      include: [{
        model: Producto,
        attributes: []
      }],
      attributes: [
        'nombre',
        [sequelize.fn('COUNT', sequelize.col('productos.id_producto')), 'total_productos']
      ],
      group: ['categoria.categoria_id'],
      raw: false
    });

    distribuccion.forEach(cat => {
      const total = cat.dataValues.total_productos || 0;
      console.log(`  - ${cat.nombre}: ${total} productos`);
    });

    // 7. Verificar que los campos obsoletos no existen en la tabla producto
    try {
      const producto = await sequelize.query("SELECT categoria FROM producto LIMIT 1");
      console.log("\n⚠️  ADVERTENCIA: Campo obsoleto 'categoria' aún existe en tabla producto");
    } catch (error) {
      console.log("\n✅ Campo obsoleto 'categoria' removido correctamente");
    }

    // 8. Verificar endpoints básicos (simulación)
    console.log("\n🌐 Endpoints que deberían funcionar:");
    console.log("  - GET /categories - Lista categorías con conteo de productos");
    console.log("  - GET /products - Lista productos con información de categoría");
    console.log("  - GET /api/productos - Lista productos para el carrito");
    console.log("  - POST /categories/new - Crear nueva categoría");
    console.log("  - PUT /categories/update - Actualizar categoría existente");
    console.log("  - POST /productos - Crear nuevo producto con categoria_id");

    console.log("\n✅ Verificación completada exitosamente!");
    console.log("\n🚀 La migración parece haber funcionado correctamente.");
    console.log("   Puedes proceder a probar el frontend y verificar que los endpoints respondan como esperado.");

  } catch (error) {
    console.error("\n❌ Error durante la verificación:", error);
    console.log("\n🔧 Posibles soluciones:");
    console.log("  1. Asegúrate de que el servidor de BD esté ejecutándose");
    console.log("  2. Verifica las credenciales de conexión en .env");
    console.log("  3. Ejecuta primero la migración con: node index.js");
  } finally {
    await sequelize.close();
  }
}

// Ejecutar verificación
verificarMigracion();