import mongoose from "mongoose";

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
            unique: true // no se puede repetir el correo
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

const UsuarioModelo = mongoose.model('usuarios', UsuarioEsquema)

// ! Métodos para interactuar con la DB

const obtenerTodosLosUsuarios = () => {

}
const obtenerUnUsuario = () => {

}
const crearUnUsuario = async (nuevoUsuario) => {
    try {
        const usuarioACrear = new UsuarioModelo(nuevoUsuario)
        const usuarioGuardado = await usuarioACrear.save()
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
    crearUnUsuario,
    editarUnUsuario,
    eliminarUsuario
}