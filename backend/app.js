const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs')
const multer = require('multer');
const path = require('path');

const app = express()

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'DELETE']
    })
)

app.use(morgan('dev'))

app.use(express.json())

// routes
// 設定圖片儲存的位置和檔名
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

// 設定multer的upload中介軟體
const upload = multer({ storage: storage });

// 新增圖片
app.post('/images', upload.single('image'), (req, res, next) => {
    try {
        res.sendStatus(201)
    } catch (e) {
        next(e)
    }
})

// 取得相片
app.get('/images/:fileName', (req, res, next) => {
    try {
        const fileName = req.params.fileName
        fs.readFile(__dirname + `/images/${fileName}`, (err, data) => {
            if (err) next(err)
            res.writeHead(200, { 'Content-Type': 'image/jpeg' })
            res.end(data)
        })
    } catch (e) {
        next(e)
    }
})

// 取得所有相片名稱
app.get('/images', (req, res, next) => {
    const directoryPath = __dirname + '/images'; // 指定要查詢的資料夾路徑
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            res.status(500).send('Error getting directory information')
        } else {
            const imageNames = files.filter(file => {
                const fileExtension = file.split('.').pop() // 取得檔案副檔名
                return ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension.toLowerCase()) // 只回傳符合副檔名的檔案名稱
            })
            res.send(imageNames)
        }
    })
})

// 移除相片
app.delete('/images/:imageName', (req, res, next) => {
    const imageName = req.params.imageName 
    fs.unlink(__dirname + `/images/${imageName}`, (err) => {
        if (err) next(err)
        res.sendStatus(204)
    })
})

// error handle
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app