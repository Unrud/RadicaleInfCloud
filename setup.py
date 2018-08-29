#!/usr/bin/env python3

import os

from setuptools import setup

VERSION = "2.0.0"

os.chdir("radicale_infcloud")
web_data = sum(([os.path.join(root, f) for f in files
                 if not f.startswith(".") and not f.endswith("~")]
                for root, _, files in os.walk("web")), [])
os.chdir(os.pardir)

setup(
    name="Radicale_InfCloud",
    version=VERSION,
    description="InfCloud for Radicale",
    author="Unrud",
    author_email="unrud@openaliasbox.org",
    url="http://github.com/Unrud/RadicaleWeb",
    license="GNU AGPL v3",
    platforms="Any",
    packages=["radicale_infcloud"],
    package_data={"radicale_infcloud": web_data},
    install_requires=["radicale>=2.1.0"])
