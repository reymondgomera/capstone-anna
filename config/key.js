// export specific config based on the product environment otherwise, development environment
if (process.env.NODE_ENV === 'production') {
   module.exports = require('./prod');
} else {
   module.exports = require('./dev');
}
