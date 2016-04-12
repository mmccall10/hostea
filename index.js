#!/usr/local/bin/node
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var exec = require('child_process').exec;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//TODO - gather user input and add config option
var sitesAvailableDir = '/etc/apache2/sites-available/';
var sitesEnabledDir = '/etc/apache2/sites-enabled/';
var documentRoot = 'var/www/';

//TODO - ask if no url provided
if (process.argv.length <= 2) {

    console.log("Usage: node scotch-host.js site-url");
    process.exit(-1);

} else {

    var siteConfName = process.argv[2];

    fs.exists(sitesAvailableDir + siteConfName + '.conf', function (exists) {
        if (exists) {
            console.log('Apache configuration ' + sitesAvailableDir.siteConfName + ' already exists');
            process.exit(-1);
        }
        makeApacheConfigFile();
    });

}

var makeApacheConfigFile = function(){

    var vHostFile = ''+
        '<VirtualHost *:80>'+
        '\n   ServerAdmin webmaster@localhost'+
        '\n   ServerName '+siteConfName+
        '\n   ServerAlias '+siteConfName+
        '\n   DocumentRoot /'+documentRoot+siteConfName+
        '\n   ErrorLog ${APACHE_LOG_DIR}/error.log'+
        '\n   CustomLog ${APACHE_LOG_DIR}/access.log combined'+
        '\n</VirtualHost>';


    fs.writeFileSync(sitesAvailableDir+siteConfName+'.conf', vHostFile);

    fs.symlink(sitesAvailableDir+siteConfName+'.conf', sitesEnabledDir+siteConfName+'.conf', function() {

        //TODO - provide host file config
        console.log('Site configuration has been created! ');

        rl.question('Do you want to restart apache now (service apache2 restart)? [y,n] ', function (answer) {

            if(answer =='y' || answer == 'Y' || answer == 'Yes' || answer == 'yes'){

                exec('service apache2 restart', function(err, stdout, stderr){
                    if (err) {

                        console.error(err);

                        return;

                    }

                    console.log(stdout);

                });

            }else{

                console.log('Ok, Happy Coding!');

            }

            rl.close();
        });

    });




}




