#!/usr/bin/env python3

import glob
import os
import re

from setuptools import setup

init_path = os.path.join(os.path.dirname(__file__),
                         "radicale_web", "__init__.py")
with open(init_path) as f:
    version = re.search(r'VERSION = "([^"]+)"', f.read()).group(1)
os.chdir("radicale_web")
web_data = list(filter(os.path.isfile, glob.glob("web/**/*[!~]", recursive=True)))
os.chdir(os.pardir)

setup(
    name="Radicale_Web",
    version=version,
    description="Web interface for Radicale",
    author="Unrud",
    author_email="unrud@openaliasbox.org",
    url="http://github.com/Unrud/RadicaleWeb",
    license="GNU AGPL v3",
    platforms="Any",
    packages=["radicale_web"],
    package_data={"radicale_web": web_data})
