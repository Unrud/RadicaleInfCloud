# Web interface for Radicale

Create, edit and delete calendars and address books via a simple web interface.

The package also includes [InfCloud](https://www.inf-it.com/open-source/clients/infcloud/) which allows you to manage appointments, tasks and contacts in the browser.

## Installation

    pip3 install --upgrade git+https://github.com/Unrud/RadicaleWeb

The official version of [Radicale](https://github.com/Kozea/Radicale/) doesn't support this package (yet) and is missing a WebDAV features that is required by InfCloud.

I created [a fork of Radicale](https://github.com/Unrud/Radicale/) which includes all necessary pull requests:

    pip3 install --upgrade git+https://github.com/Unrud/Radicale

## Screenshots

![Login](https://github.com/Unrud/RadicaleWeb/raw/master/etc/screenshot_login.png)
![Overview](https://github.com/Unrud/RadicaleWeb/raw/master/etc/screenshot_overview.png)
![New Collection](https://github.com/Unrud/RadicaleWeb/raw/master/etc/screenshot_new_collection.png)
