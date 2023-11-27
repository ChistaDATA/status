#!/bin/sh

set -e

mkdir /tmp/portal-ui/
echo "window.api_host = '${API_HOST}'" > /tmp/portal-ui/env.js
echo "window.monitoring_urls = ${MONITORING_URLS}" > /tmp/portal-ui/env.js

cat /tmp/portal-ui/env.js
