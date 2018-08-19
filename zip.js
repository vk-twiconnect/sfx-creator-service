const uuidv4 = require('uuid/v4')
const config = require('./config')()
const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)
const lstat = util.promisify(fs.lstat)
const unlink = util.promisify(fs.unlink)
const rmdir = util.promisify(fs.rmdir)
const { execFile } = require('child_process')

exports.zip = (key, data, callbackfn) => {

    if (!config.keys || !config.keys.length || !config.keys.includes(key)) {

        return callbackfn({code: '401', message: 'Not Authorized'})
    }

    const uq = uuidv4()
    const folder_name = __dirname + '/zip_' + uq + '/'
    const target = folder_name + 'target/'
    const src = folder_name + 'src/'

    if (!data.files || data.files.length == 0) {

        return callbackfn({code: '400', message: 'Bad Request'})
    }

    try {
        !fs.existsSync(folder_name) && fs.mkdirSync(folder_name)
        !fs.existsSync(target) && fs.mkdirSync(target)
        !fs.existsSync(src) && fs.mkdirSync(src)

        for(let i=0; i< data.files.length; i++) {

            const file = data.files[i]
            let li = file.path.lastIndexOf('/')
            if (li > -1) {
                const sf = file.path.substr(0, li + 1)
                const fn = file.path.substr(li + 1)
                !fs.existsSync(src + sf) && fs.mkdirSync(src + sf)
            }
            fs.writeFileSync(src+file.path, file.content, 'base64')
        }

        execFile('./create-zip.sh', [folder_name], (error, stdout, stderr) => {
            if (error) {

                return callbackfn({code: '500', message: error})
            }
            fs.readFile(target + 'sfx.exe', 'base64', (err, data) => {

                callbackfn(null, {archiveContent : data, folder_name: folder_name})
            })
        })
    } catch(e) {
        return callbackfn({code: '500', message: e.message ? e.message : e});
    }

}

exports.remove_dir = remove_dir = async (dir) => {
    try {
        const files = await readdir(dir)
        await Promise.all(files.map(async (file) => {
            try {
                const p = path.join(dir, file)
                const stat = await lstat(p)
                if (stat.isDirectory()) {
                    await remove_dir(p)
                } else {
                    await unlink(p)
                }
            } catch (err) {
                console.error(err)
            }
        }))
        await rmdir(dir)
    } catch (err) {
        console.error(err)
    }
}