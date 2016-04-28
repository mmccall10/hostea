#!/usr/local/bin/node
var fs = require('fs'),
    path = require('path'),
    readline = require('readline'),
    exec = require('child_process').exec,
    chalk = require('chalk'),
    ip = require('ip'),
    os = require('os'),
    nconf = require('nconf'),
    config = require('./setup.js'),
    terminal = false,
    siteUrl = '';

if(!process.stdout.isTTY){
    terminal = true
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: terminal
});

const confFile = path.resolve(__dirname,'config.json');
nconf.file({file: confFile});
var start = function(){
    fs.stat(confFile, function(err, stat) {
        if (err) {
            config.startConfig();
        } else {
            if (process.argv[2] == "config" && process.argv[3] == '-reset') {
                config.reset();
            } else if (process.argv[2] == 'remove') {
                removeHostFiles();
            } else if (nconf.get("isSetup") == false || process.argv[2] == "config") {
                config.startConfig();
            } else {
                askForUrl();
            }
        }
    });
}


var removeHostFiles = function(){
    //TODO save created host files in a host.json config file for printable locations

    if(typeof process.argv[3] !== 'undefined'){
        fs.unlink(nconf.get('sitesAvailableDir')+process.argv[3]+'.conf', function(err){
            if(err){
                console.log(chalk.red(err));
            }else{
                console.log(chalk.yellow('Removed: '+nconf.get('sitesAvailableDir')+process.argv[3]+'.conf'));
            }

        });

        fs.unlink(nconf.get('sitesEnabledDir')+process.argv[3]+'.conf', function(err){
            if(err){
                console.log(chalk.red(err));
            }else{
                console.log(chalk.yellow('Removed: '+nconf.get('sitesEnabledDir')+process.argv[3]+'.conf'));
            }
        });
        if(nconf.get('autoRestart') == "yes"){

            exec(nconf.get('restartCmd'), function(err, stdout, stderr){
                if (err) {

                    console.error(chalk.red(err));
                    return;

                }

                if(stderr){
                    console.log(chalk.yellow(stderr));
                }

                console.log(chalk.green(stdout));

                rl.close();

            });
        }else{
            rl.close();
        }

    }else{
        rl.question(chalk.blue('Site URL to Delete: '), function (answer) {

            if(answer.length > 0) {
                fs.unlink(nconf.get('sitesAvailableDir')+answer+'.conf', function(err){
                    if(err){
                        console.log(chalk.red(err));
                    }else{
                        console.log(chalk.yellow('Removed: '+nconf.get('sitesAvailableDir')+answer+'.conf'));
                    }

                });

                fs.unlink(nconf.get('sitesEnabledDir')+answer+'.conf', function(err){
                    if(err){
                        console.log(chalk.red(err));
                    }else{
                        console.log(chalk.yellow('Removed: '+nconf.get('sitesEnabledDir')+answer+'.conf'));
                    }

                });

            }else{
                console.log(chalk.red('Provide a url to remove: '));
                removeHostFiles();
            }

            if(nconf.get('autoRestart') == "yes"){
                exec(nconf.get('restartCmd'), function(err, stdout, stderr){
                    if (err) {

                        console.error(chalk.red(err));
                        return;

                    }

                    if(stderr){
                        console.log(chalk.yellow(stderr));
                    }

                    console.log(chalk.green(stdout));

                    rl.close();

                });
            }else{
                rl.close();
            }


        });
    }

}

var askForUrl = function(){

    if(typeof process.argv[2] !== 'undefined') {
        siteUrl = process.argv[2];
        makeHostFile();
    }else{
        rl.question(chalk.blue('Site URL: '), function (answer) {

            if(answer.length > 0) {

                siteUrl = answer;

            }else if(answer.length == 0){

                console.log(chalk.red("Must enter a site url."));
                askForUrl();
                return;

            }
            makeHostFile();

        });
    }
}


var finish = function(){
    console.log(chalk.bgGreen('Don\'t forget to set up your local host file!'));

    if(nconf.get('hostIp').length > 0){
        console.log(chalk.bgWhite('sudo echo "'+nconf.get('hostIp')+' '+siteUrl+'" >> /etc/hosts'));

    }

    console.log(chalk.green('Happy Coding'));

    process.exit(-1);
}


var makeHostFile = function(){
    //TODO create dynamic vhost templates for nginx and apache (:443, :80)

    var vHostFile = ''+
        '<VirtualHost *:80>'+
        '\n   ServerAdmin webmaster@localhost'+
        '\n   ServerName '+siteUrl+
        '\n   ServerAlias '+siteUrl+
        '\n   DocumentRoot /'+nconf.get('documentRoot')+siteUrl+
        '\n   ErrorLog ${APACHE_LOG_DIR}/error.log'+
        '\n   CustomLog ${APACHE_LOG_DIR}/'+siteUrl+'.access.log combined'+
        '\n</VirtualHost>';


    fs.writeFileSync(nconf.get('sitesAvailableDir')+siteUrl+'.conf', vHostFile);

    fs.symlink(nconf.get('sitesAvailableDir')+siteUrl+'.conf', nconf.get('sitesEnabledDir')+siteUrl+'.conf', function() {

        console.log(chalk.green('Site configuration has been created! '));

        if(nconf.get('autoRestart') == 'no'){

            rl.question(chalk.blue('Do you want to restart apache now (service apache2 restart)? [y,N] '), function (answer) {

                if(answer != 'y' || answer == 'Y' || answer == 'Yes' || answer == 'yes'){

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
        }else{
            exec(nconf.get('restartCmd'), function(err, stdout, stderr){
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
        }


    });

}

start();



