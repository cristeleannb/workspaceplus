fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
### bump
```
fastlane bump
```
Bump build numbers, and set the version to match the pacakage.json version.
### bump_update
```
fastlane bump_update
```
Align the version to match the package.json version.
### send_notification
```
fastlane send_notification
```
Send notification

----

## Android
### android deploy_firebase
```
fastlane android deploy_firebase
```
Build and deploy Android.

----

## iOS
### ios deploy_firebase
```
fastlane ios deploy_firebase
```
Sign and build adhoc staging iOS.
### ios deploy_testflight
```
fastlane ios deploy_testflight
```
Sign and build appstore staging iOS.
### ios create_temp_keychain
```
fastlane ios create_temp_keychain
```
Create temp keychain
### ios prepare_ios_notification
```
fastlane ios prepare_ios_notification
```
Prepare the iOS Push Notification

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
