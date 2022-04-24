# InfCloud for Radicale

Integrate [InfCloud](https://www.inf-it.com/open-source/clients/infcloud/) into
[Radicale](http://radicale.org/)'s web interface.

InfCloud allows you to to manage appointments, tasks and contacts in the browser.

**Bug:** At least one calendar (appointments + tasks) and one addressbook must exist
for InfCloud to work properly. Otherwise the "Refresh" button is broken.

## Installation

```shell
python3 -m pip install --upgrade RadicaleInfCloud
```

## Configuration

Set the configuration option `type` in the `web` section to `radicale_infcloud`.

The value of  `infcloud_config` is appended to InfCloud's `config.js`.

```ini
[web]
type = radicale_infcloud
# Optional InfCloud configuration
infcloud_config = globalInterfaceLanguage='de_DE';
                  globalTimeZone='Europe/Berlin';
```

## License

[AGPL-3.0](https://github.com/Unrud/RadicaleWeb/blob/master/COPYING) because
[InfCloud](https://github.com/Unrud/RadicaleInfCloud/blob/master/radicale_infcloud/web/)
is included.

[GPL-3.0](https://github.com/Unrud/RadicaleWeb/blob/master/COPYING_GPL)
for `radicale_infcloud/__init__.py`
