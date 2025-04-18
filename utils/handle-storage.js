import path from 'node:path'
import multer from 'multer'
import { v4 as uuidv4 } from 'uuid'; // * importo el uuid

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const rutaDeAlmacenamiento = path.join('public', 'uploads') // creo el directorio donde se están guardando las imagenes -> /public/uploads
        cb(null, rutaDeAlmacenamiento) // le paso la ruta ya construida
    },
    filename: function(req, file, cb){
        const extension = file.originalname.split('.').pop() // saca el ultimo elemento el pop -> foto.jpg -> ['foto', 'jpg']
        const nombreArchivo = `${uuidv4()}.${extension}`
        cb(null, nombreArchivo)
    }
})

export default storage