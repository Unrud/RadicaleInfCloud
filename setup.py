#!/usr/bin/env python3

import os

from setuptools import setup

VERSION = "3.1.6"

package_path = os.path.join(os.path.dirname(__file__), "radicale_infcloud")
web_data = sum((
    [os.path.relpath(os.path.join(root, f), package_path)
     for f in files if not f.startswith(".") and not f.endswith("~")]
    for root, _, files in os.walk(os.path.join(package_path, "web"))), [])

setup(
    name="Radicale_InfCloud",
    version=VERSION,
    description="InfCloud for Radicale",
    author="Unrud",
    author_email="unrud@outlook.com",
    url="http://github.com/Unrud/RadicaleWeb",
    license="GNU AGPL v3",
    platforms="Any",
    packages=["radicale_infcloud"],
    package_data={"radicale_infcloud": web_data},
    install_requires=["radicale>=3.1.6"])
