# Acht
Welcome to the inner workings of my blog.

Here's a brief summary of the tech stack and what I've learnt from building the blog so far:
### Backend: Linode, Alpine Linux and nginx
First off, I wanted to make the underlying infrastructure of the website as simple as possible. If I'm going to start building websites, then I want to do so with full control while still keeping costs down and complexity low. I also wanted to avoid using AWS, GCP or MS Azure for a host of idealogical reasons. I then discovered the [Alternative Cloud](https://www.linode.com/category/alternative-cloud/) and Linode, which at least for now satisfied all my criteria. 

I then chose to use Alpine Linux as its motto is "Small. Simple. Secure." Can't get any better than that. I took my time to understand how it's package manager works, it's choice of musl standard library over glibc (as well as the tradeoffs one must accept there) and also how to properly secure a Linux node in the cloud. 

Finally, I'd never setup an nginx server before, so I dove into the docs, philosophy and [architecture](http://aosabook.org/en/nginx.html) of arguably the best tool out there for serving static content. 


### Build setup: Pug, webpack and tailwindcss
I've used static site generators like Jekyll and Hugo before, but something about them bothered me for this blog. There's a fair bit to (re)learn to get them working properly and really I just wanted to run a few markdown files through an HTML template. 

I then came across Pug and in just less than 50 lines (see [here](https://github.com/deanrobertcook/acht/blob/main/src/index.pug) and [here](https://github.com/deanrobertcook/acht/blob/main/src/post.pug)), I was done. Originally, I had my own simple compilation script that read in the markdown files, but soon I decided it was time to relearn React. Now I had to introduce webpack to bundle the js files and their dependencies, and then manually link them to the HTML output from my Pug templates. Still, only two manual build steps was manageable. 

As I started tweaking my CSS every 10 minutes, however, things got harder to keep track of and small tweaks would break different parts of the design. I then started reading around and came across [this article](https://adamwathan.me/css-utility-classes-and-separation-of-concerns/) from Adam Wathan, which catapulted my CSS knowledge several years into the future. With that, I started writing my own "utility classes".

Having a small collection of my own utility classes and understanding their power, I decided to give [tailwindcss](https://tailwindcss.com/) a try, as managing utility classes and deciding what to call them is still a pain. For that though, I'd need a third compilation step: bundle the React, build the Pug templates (and include the js), and now run tailwindcss' build process. It was time to really dive into webpack and understand its internal workings to combine all the build steps into one. Given that webpack can handle pretty much anything (minification, transpilation, postcss, watching for file changes in development, etc.) with its loader and plugin ecosystem, it was well worth the effort to write my own [simple loaders](https://github.com/deanrobertcook/acht/tree/main/build) to combine them into one command.

This whole process was a ton of fun, and helped refresh my Node.js knowledge too!

### Frontend: HTML, CSS, React and UI design
Perhaps the most interesting part of this journey was diving more into the principles of good web design. It's hard to list out exactly what I've learnt here, since it's much more of an art than a science, but you can see that the website behaves responsively on mobile and hopefully I've struck a good balance between topography, colour and layout. I still have a long way to go on this journey, but I now feel confident finding inspiration from Codepen, Free Frontend and Dribbble, and coding things up in HTML and CSS.

Also, I've used React before, but here I wanted to really combine my custom component with CSS and animations to give it a little extra pop! It's also good just to refresh my knowledge in JavaScript and working with the browser!

I'm still learning a great deal, especially when it comes to accessability and design, but so far it's a been a fun start 😊

---
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