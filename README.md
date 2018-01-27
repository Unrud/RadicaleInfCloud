# InfCloud for Radicale

Integrate [InfCloud](https://www.inf-it.com/open-source/clients/infcloud/) into [Radicale](http://radicale.org/)'s web interface.

InfCloud allows you to to manage appointments, tasks and contacts in the browser.

## Installation

```shell
$ python3 -m pip install --upgrade git+https://github.com/Unrud/RadicaleInfCloud
```

## Configuration

Set the configuration option `type` in the `web` section to ``radicale_infcloud``.

```ini
[web]
type = radicale_infcloud
```

## Usage

1. Restart Radicale
1. Login to the web interface as usual
1. Click `InfCloud` on the upper-left corner

You can also directly access InfCloud by adding `/.web/infcloud/` to the end of Radicale's base URL. 

## License

[AGPL-3.0](https://github.com/Unrud/RadicaleWeb/blob/master/COPYING) because [InfCloud](https://github.com/Unrud/RadicaleInfCloud/blob/master/radicale_infcloud/web/) is included.

[GPL-3.0](https://github.com/Unrud/RadicaleWeb/blob/master/COPYING_GPL) for `radicale_infcloud/__init__.py`
