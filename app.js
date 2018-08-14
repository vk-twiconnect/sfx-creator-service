const express = require('express')
const app = express()
const fs = require('fs')
const { execFile } = require('child_process')
const path = require('path')
const util = require('util')

const readdir = util.promisify(fs.readdir)
const lstat = util.promisify(fs.lstat)
const unlink = util.promisify(fs.unlink)
const rmdir = util.promisify(fs.rmdir)

const removeDir = async (dir) => {
    try {
        const files = await readdir(dir)
        await Promise.all(files.map(async (file) => {
            try {
                const p = path.join(dir, file)
        const stat = await lstat(p)
        if (stat.isDirectory()) {
            await removeDir(p)
        } else {
            await unlink(p)
            console.log(`Removed file ${p}`)
        }
    } catch (err) {
            console.error(err)
        }
    }))
        await rmdir(dir)
        console.log(`Removed dir ${dir}`)
    } catch (err) {
        console.error(err)
    }
}

app.use(express.json())

app.get('/', (req, res) => res.send('Service running!'))

app.post('/zip', (req, res) => {

    if (req.get('x-api-key') != 'f84e2396-9c14-11e8-98d0-529269fb1459') {

        return res.send('401', 'Not Authorized')
    }
    const folder_name = __dirname + '/zip_' + Date.now() + '/'
    const target = __dirname + '/zip_' + Date.now() + '/target/'
    const src = __dirname + '/zip_' + Date.now() + '/src/'
    !fs.existsSync(folder_name) && fs.mkdirSync(folder_name)
    !fs.existsSync(target) && fs.mkdirSync(target)
    !fs.existsSync(src) && fs.mkdirSync(src)
    if (req.body.files && req.body.files.length > 0) {

        for(let i=0; i< req.body.files.length; i++) {

            const file = req.body.files[i]
            let li = file.path.lastIndexOf('/')
            if (li > -1) {
                const sf = file.path.substr(0, li + 1)
                const fn = file.path.substr(li + 1)
                !fs.existsSync(src + sf) && fs.mkdirSync(src + sf)
            }
            fs.writeFileSync(src+file.path, file.content, 'base64')

        }
        const child = execFile('./create-zip.sh', [folder_name], (error, stdout, stderr) => {
            if (error) {
                throw error
            }
            console.log(stdout)
            fs.readFile(target + 'sfx.exe', 'base64', (err, data) => {
                res.send({archiveContent : data})
            })
            removeDir(folder_name)
    })

    }
})

app.listen(3000, () => console.log('Service listening on port 3000!'))