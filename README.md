Welcome to the inner workings of my blog.

Here's a brief summary of the tech stack:

### Hosting:
Runs on a tiny node on [Linode](https://www.linode.com/) (a pretty cool Alternative cloud provider). 

### Backend: 
Nginx on an Alpine Linux container. I can definitely get behind the philosophy of both technologies, particularly that they are small and focus on doing one thing well. 
### Frontend:
Self-rolled SSG, super minimal. About [100 lines of Node.js code](https://github.com/deanrobertcook/acht/blob/main/compile.js) putting together a few pug templates injected with my essays.

### Design:
I've focused on keeping things as simple as possible, and have done my best to keep things responsive as I update the design. 

The CSS code also follows the [utility-first](https://tailwindcss.com/docs/utility-first) approach to styling markup. Even for a small project like this, it has a lot of benefits, particularly in its potential as a way of making learning CSS easier.

---

I'm still learning a great deal, especially when it comes to accessability and design, but so far it's a been a fun start 😊


## Deployment Checklist
Just a little note to self for whenever I have to redeploy an nginx server

### Secure server
1. update and upgrade packages:
```bash
apk update
apk upgrade
```

2. Create an admin user with sudo privileges
```bash
useradd -m admin # -m to create home dir
passwd admin
usermod -aG wheel admin #wheel for alpine
```
Also ensure that the wheel group has sudo access in `/etc/sudoers`
```
## Uncomment to allow members of group wheel to execute any command
%wheel ALL=(ALL) ALL
```

3. Add local ssh key to `/home/admin/.ssh/authorized_keys`:
```
ssh-copy-id admin@<node-ip>
```

4. Sign in as admin and remove pw and root login in `/etc/ssh/sshd_config`:
```
PermitRootLogin no
PasswordAuthentication no
```

and then run `sudo /etc/init.d/sshd restart` for the changes to take effect.

### Set up nginx
1. Install with `sudo apk add nginx`
2. Copy `/etc/nginx/http.d/default.conf` to create a new config for the site, and a minimal server directive:
```
server {
        server_name achtfast.me www.achtfast.me;
        listen <node-ip>:80;
        listen [::]:80;

        root /home/www/achtfast;
}
```
3. Make sure nginx is running with `sudo nginx` or reload the nginx config with `sudo nginx -s reload`

### Setup DNS
1. Point your registrar to the Linode name servers.
2. Add an A record pointing from the root to the node ip, and a CNAME pointing from the www host to the root.
3. Modify the local `/etc/hosts` file to test the IP address before the DNS config changes propagate!