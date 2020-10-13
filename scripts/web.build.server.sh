#!/bin/bash

#
# Script to build and local server
# 
# ..:: https://docs.expo.io/distribution/publishing-websites/
#

expo build:web
 
npx serve web-build