# Playliter native application

The native version of [Playliter](https://playliter.com.br) includes all the resources available in the web version, along with an exclusive EVA-based design.

## Libraries and Structure

This app was developed using

* **[Expo](https://expo.dev/)** - React Native development Framework
* **[UI Kitten](https://akveo.github.io/react-native-ui-kitten/)** - EVA Based Visual Framework
* **[Tanstack Query](https://tanstack.com/query/latest)** - Http requests handler
* **[Axios](https://axios-http.com/ptbr/docs/intro)** - Http client for REST APIs

The folders included in ```src``` follows the clean architecture.

## Development setup

```sh
# Install node dependencies
$ npm i 

# Run app on your android or ios system
$ npm run android
$ npm run ios
```

## Deployment setup

```sh
# First install the build tools
npm install --global eas-cli && npx create-expo-app

# To build a preview verion to android (APK) just run
eas build --platform android --profile preview

# To build a production version run
eas build --platform android --profile production
```

## Credits

* [Gabriel Mazurco](https://github.com/Mazurco066) Mobile and web applications developer.

### License

This project is licensed under the MIT License. Check the [LICENSE](LICENSE) file for further details.