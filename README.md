# hostea

Command line tool to quickly configure new apache vhost

The current build is intended to quickly configure apache vhost using scotch-box and vagrant for local development. Yet to be tested elsewhere.


<code>[sudo] npm install -g hostea</code>

Dealing with apache configuration it's likely need to run it as sudo.

Usage:

<code>
hostea config
</code>
<br><br>
<code>
sudo hostea siteurl
</code>
<br><br>
<code>
sudo hostea remove siteurl
</code>
<br>
<br>
Reset config<br>
<code>
hostea config -reset
</code>

<br><br>
TODO
<br>
- Add nginx
- Separate vhost templates
- SSL option

