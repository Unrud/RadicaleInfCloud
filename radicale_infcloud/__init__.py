# RadicaleWeb web interface for Radicale.
# Copyright © 2017-2018, 2020, 2022 Unrud <unrud@outlook.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from http import client
from radicale import httputils
from radicale.web import internal

import pkg_resources

PLUGIN_CONFIG_SCHEMA = {"web": {}}


class Web(internal.Web):
    def __init__(self, configuration):
        super().__init__(configuration.copy(PLUGIN_CONFIG_SCHEMA))
        self.infcloud_folder = pkg_resources.resource_filename(__name__, "web")

    def get(self, environ, base_prefix, path, user):
        if path == "/.web/infcloud/" or path.startswith("/.web/infcloud"):
            status, headers, answer = httputils.serve_folder(
                self.infcloud_folder, base_prefix, path, "/.web/infcloud")
        else:
            status, headers, answer = super().get(
                environ, base_prefix, path, user)
        if status == client.OK and path in ("/.web/", "/.web/index.html"):
            answer = answer.replace(b"""\
<nav>
    <ul>""", b"""\
<nav>
    <ul>
        <li><a href="infcloud">InfCloud</a></li>""")
        return status, headers, answer
