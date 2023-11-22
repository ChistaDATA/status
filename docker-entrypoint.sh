#!/bin/sh

set -e

mkdir /tmp/portal-ui/
echo "window.api_host = '${API_HOST}'" > /tmp/portal-ui/env.js

cat /tmp/portal-ui/env.js
