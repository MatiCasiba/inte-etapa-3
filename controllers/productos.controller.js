import models from '../models/productos.model.js'
import handleMongoId from '../utils/handle-mongo-id.js'
// ../ para salir de la carpeta donde estamos y ecceder a otra

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