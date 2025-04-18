import multer from 'multer'
import storage from '../utils/handle-storage.js'

const uploadsMiddleware = multer( { storage })

export default uploadsMiddleware