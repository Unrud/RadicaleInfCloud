# InfCloud for Radicale

Integrate [InfCloud](https://www.inf-it.com/open-source/clients/infcloud/) into Radicale's web interface.

InfCloud allows you to to manage appointments, tasks and contacts in the browser.

## Installation

    pip3 install --upgrade git+https://github.com/Unrud/RadicaleInfCloud

You need the
[development version of Radicale](https://github.com/Kozea/Radicale).
Set the configuration option `type` in the `web` section to `radicale_infcloud`.

## License

[AGPL-3.0](https://github.com/Unrud/RadicaleWeb/blob/master/COPYING) because [InfCloud](https://github.com/Unrud/RadicaleInfCloud/blob/master/radicale_infcloud/web/) is included.

[GPL-3.0](https://github.com/Unrud/RadicaleWeb/blob/master/COPYING_GPL) for `radicale_infcloud/__init__.py`
