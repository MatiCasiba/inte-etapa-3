
const uploadImagen =  (req, res) => {
    const imagen = req.file
    console.log(imagen);

    if(!imagen){
        return res.status(400).json({
            mensaje: 'No se cargó la imagen necesaria'
        })
    }

    //console.log(req.protocol) // http o https
    //console.log(req.get('host')); //localhost: ...
    //console.log(imagen.filename) // nombre del archivo

    const urlCompletaBack = `${req.protocol}://${req.get('host')}/uploads/${imagen.filename}`
    res.status(201).json({
        foto: urlCompletaBack
    })
}

export default {
    uploadImagen
}