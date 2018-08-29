# RadicaleWeb web interface for Radicale.
# Copyright (C) 2017 Unrud <unrud@openaliasbox.org>
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

import os
import pkg_resources
import posixpath
import time

from http import client
from radicale import storage, web
from radicale.web import NOT_FOUND, MIMETYPES, FALLBACK_MIMETYPE


class Web(web.Web):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.infcloud_folder = pkg_resources.resource_filename(__name__, "web")

    def get(self, environ, base_prefix, path, user):
        if not path.startswith("/.web/infcloud/") and path != "/.web/infcloud":
            status, headers, answer = super().get(environ, base_prefix, path,
                                                  user)
            if status == client.OK and path in ("/.web/", "/.web/index.html"):
                answer = answer.replace(b"""\
        <nav>
            <ul>""", b"""\
        <nav>
            <ul>
                <li><a href="infcloud">InfCloud</a></li>""")
            return status, headers, answer
        try:
            filesystem_path = storage.path_to_filesystem(
                self.infcloud_folder, path[len("/.web/infcloud"):])
        except ValueError as e:
            self.logger.debug("Web content with unsafe path %r requested: %s",
                              path, e, exc_info=True)
            return NOT_FOUND
        if os.path.isdir(filesystem_path) and not path.endswith("/"):
            location = posixpath.basename(path) + "/"
            return (client.SEE_OTHER,
                    {"Location": location, "Content-Type": "text/plain"},
                    "Redirected to %s" % location)
        if os.path.isdir(filesystem_path):
            filesystem_path = os.path.join(filesystem_path, "index.html")
        if not os.path.isfile(filesystem_path):
            return NOT_FOUND
        content_type = MIMETYPES.get(
            os.path.splitext(filesystem_path)[1].lower(), FALLBACK_MIMETYPE)
        with open(filesystem_path, "rb") as f:
            answer = f.read()
            last_modified = time.strftime(
                "%a, %d %b %Y %H:%M:%S GMT",
                time.gmtime(os.fstat(f.fileno()).st_mtime))
        headers = {
            "Content-Type": content_type,
            "Last-Modified": last_modified}
        return client.OK, headers, answer
