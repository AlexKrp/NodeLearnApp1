if(process.env.NODE === 'production'){
    module.exports = {mongoURI: 'mongodb://gin:a123456@ds111012.mlab.com:11012/vidjot-prod'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot-dev'}
}