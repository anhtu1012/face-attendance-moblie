#!/bin/sh
echo "Writing google-services.json from EAS env var..."
echo "$GOOGLE_SERVICES_JSON" > android/app/google-services.json

