import express from 'express'
const routerUsuarios = express.Router()
import usuariosController from '../controllers/usuarios.controller.js'


// ! CRUD Usuarios
// CRUD -> R:READ ALL -> GET ALL -> http://localhost:8080/api/v1/usuarios
routerUsuarios.get('/', usuariosController.getAll)
// CRUD -> R:READ ONE -> GET ONE -> http://localhost:8080/api/v1/usuarios/id
routerUsuarios.get('/:id', usuariosController.getOne)
  
// CRUD -> C:CREATE -> POST -> http://localhost:8080/api/v1/usuarios + usuarioACrear
routerUsuarios.post('/', usuariosController.create)
  
// CRUD -> U:UPDATE -> PUT -> http://localhost:8080/api/v1/usuarios/id + usuarioAEditar
routerUsuarios.put('/:id', usuariosController.update)
  
// CRUD -> D:DELETE -> DELETE -> http://localhost:8080/api/v1/usuarios/id
routerUsuarios.delete('/:id', usuariosController.remove)

export default routerUsuarios