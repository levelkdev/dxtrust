const path = require('path');
const fs = require('fs');

fs.readdir('contracts/build', function (err, files) {
    if (err)
      throw('No contracts compiled in build')
    
    if (!fs.existsSync('src/contracts/'))
        fs.mkdirSync('src/contracts/');

    files.forEach(function (file) {
        const contractABI = {
          abi: JSON.parse(fs.readFileSync('contracts/build/'+file)).abi
        };
        fs.writeFileSync('src/contracts/'+file, JSON.stringify(contractABI), null, 2);
    });
});
