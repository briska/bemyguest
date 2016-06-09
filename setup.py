#!/usr/bin/env python

from setuptools import setup

setup(
    name='beMyGuest',
    version='1.0',
    description='A lightweight hotel room booking system.',
    author='briska',
    author_email='brisova.majka@gmail.com',
    url='https://github.com/briska/',
    install_requires=[
        'Django==1.8.4'
    ],
    dependency_links=[
        'https://pypi.python.org/simple/django/'
    ],
)
