import models from '../models/usuarios.model.js'
import handleMongoId from '../utils/handle-mongo-id.js'

const getAll = async (req, res) => {
    //res.send('getAll')
    try {
        const usuarios = await models.obtenerTodosLosUsuarios()
        res.json(handleMongoId(usuarios))
    } catch (error) {
        console.error(error)
        res.status(500).json({mensaje: 'No se pudo obtener el usuario solicitado'})
    }
}

const getOne = async (req, res) => {
    //res.send('getOne')
    const id = req.params.id
    try {
        const usuario = await models.obtenerUnUsuario(id)
        res.json(handleMongoId(usuario))
    } catch (error) {
        console.error(error)
    }
}

const create = async (req, res) => {
    const nuevoUsuario = req.body

    const { nombre, correo, password, confirm_password } = nuevoUsuario

    if ( password !== confirm_password ) {
        console.log('La contraseñas no coinciden')
        return res.status(500).json({
            mensaje: 'La contraseñas no coinciden'
        })
    }

    if ( password.length < 5 ) {
        return res.status(500).json({
            mensaje: 'La contraseña debe tener al menos 5 caracteres'
        })
    }

    // obtenerUsuarioPorEmail -> Si lo encuentra, devuelve el usuario y sino devuelve null
    /* const usuarioEncontrado = await models.obtenerUsuarioPorEmail( correo ) 

    if ( !usuarioEncontrado ) {
        return res.status(500).json({
            mensaje: 'No se puede crear un usuario con ese correo'
        })
    } */

    try {
        let usuarioCreado = await models.crearUnUsuario(nuevoUsuario)
        usuarioCreado = JSON.parse(JSON.stringify(usuarioCreado))
        delete usuarioCreado.password
        res.json(usuarioCreado)
    } catch (error) {
        console.log(error)
        res.status(500).json({
            mensaje: 'No se pudo crear el usuario'
        })
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