
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