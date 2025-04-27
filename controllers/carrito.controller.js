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