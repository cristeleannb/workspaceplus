echo "$RELEASE_KEYSTORE" > release-keystore.asc
gpg -d --passphrase="$RELEASE_KEYSTORE_PASSPHRASE" --batch release-keystore.asc > android/app/release-keystore
rm release-keystore.asc
