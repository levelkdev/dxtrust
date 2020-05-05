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
        const files = [
          'DecentralizedAutonomousTrust.json',
          'Multicall.json',
          'ERC20.json'
        ];
        if (files.indexOf(file) >= 0)
          fs.writeFileSync('src/contracts/'+file, JSON.stringify(contractABI), null, 2);
    });
});
