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