const assert = require('assert')
const zip = require('../zip')
const fs = require('fs')

describe('Zip', function() {
    it('should return not authorized when key is not valid', function(done) {
        zip.zip('test', {files: [{filename: 'test.txt', content: 'test'}]}, (err, data)=> {
            assert.equal(err.message, 'Not Authorized')
            done();
        })
    });

    it('should return bad request when files are empty', function(done) {
        zip.zip('f84e2396-9c14-11e8-98d0-529269fb1459', {files: []}, (err, data)=> {
            assert.equal(err.message, 'Bad Request')
            done();
        })
    });

    it('should return archived content', function(done) {
        const files = [{path: 'test.txt', content: 'test'}]
        zip.zip('f84e2396-9c14-11e8-98d0-529269fb1459', {files: files}, (err, data)=> {
            assert.notEqual(data.archiveContent, null)
            zip.remove_dir(data.folder_name)
            done();
        })
    });

    it('should create folder with files', function(done) {
        const files = [{path: 'test.txt', content: 'test'}]
        zip.zip('f84e2396-9c14-11e8-98d0-529269fb1459', {files: files}, (err, data)=> {
            assert.equal(fs.existsSync(data.folder_name), true)
            for(let i =0; i < files.length; i++) {
                console.log(data.folder_name + 'src/' + files[i].path)
                assert.equal(fs.existsSync(data.folder_name  + 'src/' +  files[i].path), true)
            }
            zip.remove_dir(data.folder_name)
            done();
        })
    });

    it('should create target exe file', function(done) {
        const files = [{path: 'test.txt', content: 'test'}]
        zip.zip('f84e2396-9c14-11e8-98d0-529269fb1459', {files: files}, (err, data)=> {
            assert.equal(fs.existsSync(data.folder_name + 'target/sfx.zip'), true)
            zip.remove_dir(data.folder_name)
            done();
        })
    });

    it('should create delete folder after zipping', function(done) {
        const files = [{path: 'test.txt', content: 'test'}]
        zip.zip('f84e2396-9c14-11e8-98d0-529269fb1459', {files: files}, (err, data)=> {
            assert.equal(fs.existsSync(data.folder_name), true)
            for(let i =0; i < files.length; i++) {
                console.log(data.folder_name + 'src/' + files[i].path)
                assert.equal(fs.existsSync(data.folder_name  + 'src/' +  files[i].path), true)
            }
            zip.remove_dir(data.folder_name)
            setTimeout(function () {
                assert.equal(fs.existsSync(data.folder_name), false)
                done();
            }, 1000)


        })
    });
});