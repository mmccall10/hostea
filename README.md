# hostea

Command line tool to quickly configure new apache vhost.

Currently intended for local development.

<code>[sudo] npm install -g hostea</code>

Dealing with apache configuration, it likely you need to run it as sudo.

Usage:<br>
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

TODO
<br>
- Add nginx conf
- vhost templates
- SSL option


