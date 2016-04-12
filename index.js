#!/usr/local/bin/node
var fs = require('fs');
var path = require('path');
var readline = require('readline');
var exec = require('child_process').exec;
var chalk = require('chalk');
var ip = require('ip');

var os = require('os');



const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

//TODO - save config

var config = {
    sitesAvailableDir: '/etc/apache2/sites-available/',
    sitesEnabledDir: '/etc/apache2/sites-enabled/',
    documentRoot: '/var/www/',
    siteUrl: '',
    ip: ''
}


var askForUrl = function(){

    rl.question(chalk.blue('Site URL: '), function (answer) {

        if(answer.length > 0) {

            config.siteUrl = answer;

        }else if(answer.length == 0){

            console.log(chalk.red("Must enter a site url."));
            askForUrl();
            return;

        }
        askForWebRoot();

    });
}

var askForWebRoot = function(){

    rl.question(chalk.blue('Web Root (/var/www/): '), function (answer) {

        if(answer.length > 0) {
            config.documentRoot = answer;
        }

        makeApacheConfigFile();

    });
}



var getIpForHostFile = function(){
    var ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }
            if(ifname == 'eth1'){
                config.ip = iface.address;
            }

            ++alias;
        });


    });
}

var finish = function(){
    console.log(chalk.bgGreen('Don\'t forget to set up your local host file!'));

    if(config.ip.length > 0){
        console.log(chalk.bgWhite('sudo echo "'+config.ip+' '+config.siteUrl+'" >> /etc/hosts'));

    }

    console.log(chalk.green('Happy Coding'));


    process.exit(-1);
}

//setup config

var makeApacheConfigFile = function(){


    var vHostFile = ''+
        '<VirtualHost *:80>'+
        '\n   ServerAdmin webmaster@localhost'+
        '\n   ServerName '+config.siteUrl+
        '\n   ServerAlias '+config.siteUrl+
        '\n   DocumentRoot /'+config.documentRoot+config.siteUrl+
        '\n   ErrorLog ${APACHE_LOG_DIR}/error.log'+
        '\n   CustomLog ${APACHE_LOG_DIR}/access.log combined'+
        '\n</VirtualHost>';


    fs.writeFileSync(config.sitesAvailableDir+config.siteUrl+'.conf', vHostFile);

    fs.symlink(config.sitesAvailableDir+config.siteUrl+'.conf', config.sitesEnabledDir+config.siteUrl+'.conf', function() {

        //TODO - provide host file config
        console.log(chalk.green('Site configuration has been created! '));

        rl.question(chalk.blue('Do you want to restart apache now (service apache2 restart)? [y,n] '), function (answer) {

            if(answer =='y' || answer == 'Y' || answer == 'Yes' || answer == 'yes'){

                exec('service apache2 restart', function(err, stdout, stderr){
                    if (err) {

                        console.error(chalk.red(err));
                        return;

                    }

                    if(stderr){
                        console.log(chalk.yellow(stderr));
                    }

                    console.log(chalk.green(stdout));

                    rl.close();
                    finish();

                });

            }else{
                rl.close();
                finish();

            }


        });

    });


}

askForUrl();
getIpForHostFile();



