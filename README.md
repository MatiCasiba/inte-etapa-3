Nombre: Matias Casiba
Link Repo Github: https://github.com/MatiCasiba/inte-etapa-3
Link Netlify:
Link Mongo Atlas:
Link Render:

# Base de datos de Drumstore

Ahora voy a crear la parte Back para luego conectar mi Front con este, osea la página de Drumstoer. Haré uso de controladores, modelos, middlewares, ruteo, utiles (coneccion, un handle para mongo y un storage)

## Controllers
Dentro de esta carpeta estarán los controladores de carrito, productos, uploads y usuarios:

### carrito.controller.js
```js
import model from '../models/carrito.model.js'

const guardarCarrito = async (req, res) => {
    const carrito = req.body // recibo el carrito que me envien

    try {
        const carritoGuardado = await model.crearCarrito(carrito)
        res.status(201).json(carritoGuardado)


    } catch (error) {
        console.log('[guardarCarrito]', error) // loggers
        let mensaje = 'No sae pudo guardar el carrito'
        res.status(500).json(mensaje)
    }
}

export default {
    guardarCarrito
}
```
#### guardarCarrito
Este código va a recibir un carrito desde el body del rquest, llama al modelo crearCarrito() para guardarlo en MongoDB. Si esto sale bien, responde con el carrito creado, si llega a fallar, devuelve un 500 con un mensaje de error

### productos.controller.js
```js
import models from '../models/productos.model.js'
import handleMongoId from '../utils/handle-mongo-id.js'

const getAll = async (req, res) => {

    try {
        const productos = await models.obtenerTodosLosProductos()
        res.json(handleMongoId(productos))
    } catch (error) {
        console.error(error)
        res.status(500).json({ mensaje: 'No se pudop obtener el producto solicitado' })
    }
}

const getOne = async (req, res) => {
    const id = req.params.id // puede estar fuera o dentro del try
    try {
        const producto = await models.obtenerUnProducto(id)
        res.json(handleMongoId(producto))
    } catch (error) {
        console.log(error)
    }

}

const create = async (req, res) => {
    const productoACrear = req.body

    try {
        const productoGuardado = await models.crearUnProducto(productoACrear)
        res.json(handleMongoId(productoGuardado))
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensaje: 'Algo falló, no se guardó el producto' })
    }

}

const update = async (req, res) => {
    const id = req.params.id
    const productoAEditar = req.body
    productoAEditar.id = id

    try {
        const productoEditado = await models.editarProducto(productoAEditar)
        res.status(201).json(handleMongoId(productoEditado))
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: 'No se pudo editar el producto solicitado'})
    }

}

const remove = async (req, res) => {
    const id = req.params.id

    try {
        const productoEliminado = await models.eliminarProducto(id)
        res.json(handleMongoId(productoEliminado))
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: 'No se pudo borrar el producto' })
    }

    res.send('DELETED Producto')
}


export default {
    getAll,
    getOne,
    create,
    update,
    remove
}
```
Este archivo tiene 5 métodos que manejan operaciones CRUD
* getAll: va a traer todos los productos desde la DB y lo formatea con handleMongoId para reemplazar _id por id
* getOne: trae un producto por su ID (req.params.id) y lo devuelve formateado con handleMongoId
* create: recibe un producto desde req.body, lo guarda en la base de datos y devuelve el resultado formateado
* update: va a recibir el ID del producto por params y los nuevos datos por body, los actualiza y devuelve el resultado
* remove: va a eliminar un producto por ID y devuelve el producto eliminado formateado

### uploads.controller.js
```js

const uploadImagen =  (req, res) => {
    const imagen = req.file
    console.log(imagen);

    if(!imagen){
        return res.status(400).json({
            mensaje: 'No se cargó la imagen necesaria'
        })
    }

    res.json({
        foto: imagen.filename
    })
}

export default {
    uploadImagen
}
```
#### uploadImagen
Esta función recibe una imagen subida por multer, contruye la URL completa del archivo subido y la devuleve. Si no hay imagen, va a devolver error 400 

### usuarios.controller.js
```js
import models from '../models/usuarios.model.js'

const getAll = (req, res) => {

    res.send('getAll')
}

const getOne = (req, res) => {

    res.send('getOne')
}

const create = async (req, res) => {
    const nuevoUsuario = req.body

    const {nombre, correo, password, confirmpassword } = nuevoUsuario

    if(password !== confirmpassword){
        console.log('La contraseña no coincide');
        return res.status(500).json({
            mensaje: 'la contraseña no coincide'
        })
    }
    
    // TODO: controlar si el usuario con el correo enviado ya existe.

    try {
        const usuarioCreado = await models.crearUnUsuario(nuevoUsuario)
        res.json(usuarioCreado)
    } catch (error) {
        console.log(error);
        res.status(500).json({mensaje: 'No se ´pudo crear el usuario'})
    }

}

const update = (req, res) => {
    res.send('update')
}

const remove = (req, res) => {
    res.send('remove')
}

export default {
    getAll,
    getOne,
    create,
    update,
    remove
}
```
* getAll: va a traer todos los usuarios de la base de datos y los formatea ocn handleMongoID
* getOne: trea un usuario por ID
* create: Valida que las contraaseñas coincidan y tengan un mínimo 5 caracteres. Luego crea el usuario, encripta la contraseña y devuelve el nuevo usuario sin el campo password


## Middlewares
Los middlewares van a permitir a loss usuarios hacer solicitudes (cómo el envio de un formulario en un explorador web o permitir que un servidor web devuelva páginas web dinámicas en función del perfil de un usuario). Dentro de la carpeta middlewaress se va a encontra el archivo uploads.middleware.js:

### uploads.middleware.js
```js
import multer from 'multer'
import storage from '../utils/handle-storage.js'

const uploadsMiddleware = multer( { storage })

export default uploadsMiddleware
```

Este configura multer con el almacenamiento que se define en utils/handle-storage.js para manejar uploads de imágenes

## Models
Dentro de esta carpeta se encontrará los modelos y funciones para interacutar con MongoDB

### carrito.model.js
```js
import mongoose from "mongoose"

// ! CREAMOS EL ESQUEMA

const carritoSchema = mongoose.Schema(
    {
        carrito: Array
    },
    {
        timestamps: true, // createAt | updatedAt
        versionKey: false
    }
)

// ! A partir del Schema creo el Modelo
const CarritoModel = mongoose.model('carritos', carritoSchema)

// --------------------------------------------------------------------
/* Métodos que nos va servir de interfaz para interacturar con la DB */ 
// --------------------------------------------------------------------

const crearCarrito = async (carrito) => {

    try {
        const carritoCreado = new CarritoModel( carrito  ) // tiene que recibir un obj
        const carritoGuardado = await carritoCreado.save()

        return carritoGuardado
        
    } catch (error) {
        // console.log('No se pudo crear el carrito', error)
        throw error
    }

}

export default {
    crearCarrito
}

```
#### Función crearCarrito
Esta función lo que va a hacer es recibir un objeto de carrito y lo guarda como un documenteo en la colección carritos.

### productos.model.js
```js
import mongoose from "mongoose";

// ! Creamos esquema (la descripcion de como va a ser el documento mongo)

// https://mongoosejs.com/docs/guide.html
const ProductoEsquema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        precio: Number,
        stock: Number,
        marca: String,
        categoria: String,
        detalle: String,
        foto: String,
        envio: Boolean
    },
    {
        timestamps: true, // createAt | updatedAt
        versionKey: false
    }
)


// ! Creamos el modelo a partir del esquema. Definir la colección donde se van a guardar los documentos

// ProductoModelo -> es el que me va a permitir interactuar con la base de datos.
const ProductoModelo = mongoose.model('productos', ProductoEsquema)

// ! Metodos para interactuar con la DB

const obtenerTodosLosProductos = async () => {

    try {
        const productos = await ProductoModelo.find()
        return productos
    } catch (error) {
        throw error
    }

    console.log('obteniendo todos los productos');
}

const obtenerUnProducto = async (id) => {

    try {
        const producto = await ProductoModelo.findById(id)
        return producto

    } catch (error) {
        throw error
    }
    
}

const crearUnProducto = async (productoNuevo) => {

    try {
        const productoAGuardar = new ProductoModelo(productoNuevo)
        const productoGuardado = await productoAGuardar.save()
        return productoGuardado

    } catch (error) {
        throw error
    }
}

const editarProducto = async (productoAEditar) => {
    try {
        const options = {new: true}
        const productoEditado = await ProductoModelo.findByIdAndUpdate(productoAEditar.id, productoAEditar, options)
        return productoEditado
    } catch (error) {
        throw error
    }
}

const eliminarProducto = async (id) => {

    try {
        const productoEliminado = await ProductoModelo.findByIdAndDelete(id)
        return productoEliminado
    } catch (error) {
        throw error
    }

}

export default {
    obtenerTodosLosProductos,
    obtenerUnProducto,
    crearUnProducto,
    editarProducto,
    eliminarProducto

}
```
#### Sus funciones
* obtenerTodosLosProductos: devuelve todos los productos de la colección
* obtenerUnProducto: devuelve un solo porducto por ID
* crearUnProducto: guarda un nuevo producto
* editarProducto: actualiza un producto existente por ID y devuelve el actualizado
* eliminarProducto: elimina un producto por ID

### usuarioss.model.js
```js
import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const UsuarioEsquema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        apellido: String,
        correo: {
            type: String,
            required: true,
            unique: true
        },
        dni: String,
        nacionalidad: String,
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// Métodos de los esquemas ( Métodos de Mongoose)

UsuarioEsquema.methods.escriptarPassword = async (password) => { // arrow function
    // Indentificador único que se generar para complicar la descriptación por fuerza bruta.
    const salt = await bcrypt.genSalt(10) // la semilla -> Un identificador al azar para hacer más robusta la password
    // password ---> sin escriptar ---> 123456
    return await bcrypt.hash(password, salt)
}

// una función -> 21301328dsfafasdf341321 <--- funcHash('123456', 'fecha-de-hoy', 'dfsadsf341231234dsfadfa')

UsuarioEsquema.methods.comprobarPassword = async function() { // traditional

}

const UsuarioModelo = mongoose.model('usuarios', UsuarioEsquema)

// ! Métodos para interactuar con la DB

const obtenerTodosLosUsuarios = async () => {
    try {
        const usuarios = await UsuarioModelo.find()
        return usuarios
    } catch (error) {
        throw error
    }
}
const obtenerUnUsuario = async () => {
    try {
        const usuario = await UsuarioModelo.findById(id)
        return usuario
    } catch (error) {
        throw error
    }
}

const obtenerUsuarioPorEmail = async (email) => {
    
    try {

        const usuarioEncontrado = await UsuarioModelo.findOne( { email } )
        return usuarioEncontrado

    } catch (error) {
        throw error
    }

}

const crearUnUsuario = async (nuevoUsuario) => {
    console.log(nuevoUsuario) 
    try {
        const usuarioACreado = new UsuarioModelo(nuevoUsuario)
        //      encriptado = encriptarPassword('123456')
        usuarioACreado.password = await usuarioACreado.escriptarPassword(nuevoUsuario.password)

        const usuarioGuardado = await usuarioACreado.save() // Guardo en Mongo
        return usuarioGuardado
    } catch (error) {
        throw error
    }
}
const editarUnUsuario = () => {

}
const eliminarUsuario = () => {

}

export default {
    obtenerTodosLosUsuarios,
    obtenerUnUsuario,
    obtenerUsuarioPorEmail,
    crearUnUsuario,
    editarUnUsuario,
    eliminarUsuario
}
```
#### Sus funcones
* escriptarPassword: es un método del esquema quye encripta la contraseña usando bcrypt
* obtenerTodosLosUsuarios: deuvleve un usuario por ID
* obteneUsuarioPorEmail: busca un usuario por su email
* crearUnUsuario: recibe un objeto usuario, encripta su contraseña y lo guarda en la DB

## Routers
Dentro de la carpeta routers se encuentran las direcciones de carrito, productos, uploads y usuarios:

### carrito.router.js
```js
import express from 'express'
const routerCarrito = express.Router()
import controller from '../controllers/carrito.controller.js'

//* Agregar GetALL

//! Hacer un post (Create) para que se efectue la compra
routerCarrito.post('/', controller.guardarCarrito)

export default routerCarrito
```

### productos.router.js
```js
import express from 'express'

import productosController from '../controllers/productos.controller.js'
// Constantes
const routerProductos = express.Router()

// ! CRUD Productos
// CRUD -> R:READ ALL -> GET ALL -> http://localhost:/api/v1/productos
routerProductos.get('/', productosController.getAll)
// CRUD -> R:READ ONE -> GET ONE -> http://localhost:/api/v1/productos/id
routerProductos.get('/:id', productosController.getOne)
  
// CRUD -> C:CREATE -> POST -> http://localhost:/api/v1/productos + productoACrear
routerProductos.post('/', productosController.create)
  
// CRUD -> U:UPDATE -> PUT -> http://localhost:/api/v1/productos/id + productoAEditar
routerProductos.put('/:id', productosController.update)
  
// CRUD -> D:DELETE -> DELETE -> http://localhost:/api/v1/productos/id
routerProductos.delete('/:id', productosController.remove)

export default routerProductos
```

### uploads.router.js
```js
import express from 'express'
const routerUpload = express.Router()
import controller from '../controllers/uploads.controller.js'
import uploadsMiddleware from '../middlewares/uploads.middleware.js' 

/* POST -> request que guartda la imagen en una carpeta.  */
routerUpload.post('/', uploadsMiddleware.single('imagen'), controller.uploadImagen)

export default routerUpload
```

### usuarios.router.js
```js
import express from 'express'
const routerUsuarios = express.Router()
import usuariosController from '../controllers/usuarios.controller.js'


// ! CRUD Usuarios
// CRUD -> R:READ ALL -> GET ALL -> http://localhost:/api/v1/usuarios
routerUsuarios.get('/', usuariosController.getAll)
// CRUD -> R:READ ONE -> GET ONE -> http://localhost:/api/v1/usuarios/id
routerUsuarios.get('/:id', usuariosController.getOne)
  
// CRUD -> C:CREATE -> POST -> http://localhost:/api/v1/usuarios + usuarioACrear
routerUsuarios.post('/', usuariosController.create)
  
// CRUD -> U:UPDATE -> PUT -> http://localhost:/api/v1/usuarios/id + usuarioAEditar
routerUsuarios.put('/:id', usuariosController.update)
  
// CRUD -> D:DELETE -> DELETE -> http://localhost:/api/v1/usuarios/id
routerUsuarios.delete('/:id', usuariosController.remove)

export default routerUsuarios
```

## Utils
Dentro de la carpeta Utils se encuentra connection.js, handle-mongo-id.js y handle-storage.js:

### connection.js
```js
import mongoose from 'mongoose'

const connection = async (uri) => {
    
    try {
        await mongoose.connect(uri)
        console.log('Conexión a MONGODB OK')    
    } catch (error) {
        console.log('Conexión Error', error)
    }
}

export default connection
```

### handle-mongo-id.js
```js
const handleMongoId = (elemento) => { // * elemento -> un documento | un array de docummentos
    // elemento -> va a ser un obj mongoose -> métodos, funciones

    const clave = '_id'

    // Convierto un obj complejo de mongoose (métodos) -> Objeto de js vanilla
    /* fromMongoToVanilla() */
    elemento = JSON.parse(JSON.stringify(elemento)) // * convierto un obj mongoose en un obj de js

    if (Array.isArray(elemento)) {
        console.log('Llegó un arrayy de productos')

        for (let i = 0; i < elemento.length; i++) {
            elemento[i].id = elemento[i][clave] //  producto[0].id = producto[0]._id | producto[1].id = producto[1]._id
            delete elemento[i][clave]
        }

    } else {
        console.log('Lleg+o un documento')
        elemento.id = elemento[clave] // guardo en id lo que tenia en _id
        delete elemento['_id'] // borro el producto._id
    }

    return elemento // obj
}

export default handleMongoId
```

### handle-storaje.js
```js
import path from 'node:path'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'; // * importo el uuid

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const rutaDeAlmacenamiento = path.join('public', 'uploads') // creo el directorio donde se están guardando las imagenes -> /public/uploads
        cb(null, rutaDeAlmacenamiento) // le paso la ruta ya construida
    },
    filename: function(req, file, cb){
        const extension = file.originalname.split('.').pop() // saca el ultimo elemento el pop -> foto.jpg -> ['foto', 'jpg']
        const nombreArchivo = `${uuidv4()}.${extension}`
        cb(null, nombreArchivo)
    }
})

export default storage
```


