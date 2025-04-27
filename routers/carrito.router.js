import express from 'express'
const routerCarrito = express.Router()
import controller from '../controllers/carrito.controller.js'

//* Agregar GetALL

//! Hacer un post (Create) para que se efectue la compra
routerCarrito.post('/', controller.guardarCarrito)

export default routerCarrito