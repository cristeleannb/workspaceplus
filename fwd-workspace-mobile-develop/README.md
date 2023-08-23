## Getting Started

### Project Structure

See `documents/structure.drawio`

####

---

### Running the Application

#### Install dependencies

`yarn install`

#### Serve the application

`yarn start —reset-cache`

#### Android

##### View list

`emulator -list-avds`

##### Open specific device

`emulator -avd <emulator_name> -netdelay none -netspeed full`

##### Run android application on Emulator or Device

`yarn android`

##### Uninstall via command

`adb uninstall <package_name>`

#### iOS

#### Install Pods

`npx pod-install` or `cd ios && pod install`

##### Run ios on Simulator

`yarn ios`

####

---

### Build the Application

##### Update version

```
npx react-native-versioning --target=MAJOR.MINOR.BUILD_NUMBER --build=BUILD_NUMBER
```

Example
`npx react-native-versioning --target=1.1.12 --build=12`

---

### Major Library Dependencies

- React Navigation
- Material UI
- Axios
- React Query
- Date FNS
- React Hook Forms
- Yup
- Mobx & SQLite

---

####

#### Git Strategy

##### Pull Request Flow Summary

```
Feature -> Develop
Bugfix -> Release
Hotfix -> Master
```

##### Environment Flow Summary

```
Develop -> Release
Develop <- Release -> Master
Master -> Develop
```

### For future update

(13DEC2021) - We are currently using https://github.com/react-native-camera/react-native-camera package but this will soon be deprecated, however this is a dependency of the https://github.com/moaazsidat/react-native-qrcode-scanner.
Check if this can be paired with https://github.com/mrousavy/react-native-vision-camera .