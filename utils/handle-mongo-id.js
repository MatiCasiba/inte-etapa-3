

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