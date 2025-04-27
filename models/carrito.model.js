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
