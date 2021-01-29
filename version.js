var fs = require('fs');
var cp = require('child_process');

var tourPath = './src/js/Tour.js';

var package = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
var tour = fs.readFileSync(tourPath, 'utf8');

fs.writeFile(tourPath, tour.replace(
  /\[(.*)\]/g,
  '[' + package.version.split('.').join(', ') + ']'
), function(err) {
  if (err) {
    console.log('Ошибка обновления версии в ' + tourPath);
    process.exit(1);
  } else {
    console.log('Версия в файле ' + tourPath + ' обновленна');

    cp.execSync('git add ' + tourPath).toString();
    cp.execSync('git commit -m "Update v' + package.version+'"').toString();

    process.exit(0);
  }
})
