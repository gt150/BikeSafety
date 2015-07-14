Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network :forwarded_port, guest: 80, host: 3000

  config.vm.provision :shell do |s|
    s.inline = <<SCRIPT
    sudo apt-get update
    sudo apt-get -y install nodejs npm git
    sudo ln -s `which nodejs` /usr/bin/node

    cd /vagrant
    npm install
    npm start
SCRIPT
  end
end
