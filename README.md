# hostea

Command line tool to quickly configure new apache vhost

The current build is intended to be used to quickly configure apache vhost using scotch-box and vagrant for local development. Yet to be tested elsewhere.


<code>[sudo] npm install -g hostea</code>

Dealing with apache conf it's likely need to run it as sudo.

Usage:



<code>
sudo hostea<br>
Site URL: example.dev<br>
Web Root (/var/www/):<br>
Site configuration has been created!<br>
Do you want to restart apache now (service apache2 restart)? [y,n] y<br>
 * Restarting web server apache2
   ...done.
Don't forget to set up your local host file!<br>
sudo echo "192.168.33.10    example.dev" >> /etc/hosts<br>
Happy Coding

