Emmersive App
-----------------

#### Dependencies
* Node.js 4.x
* Android
  * Oracle jdk 7 (Android)
    * JAVA_HOME=/path/to/java
    * PATH=$JAVA_HOME/bin:$PATH
  * Android stand-alone sdk tools r24.x (Android)
    * ANDROID_HOME=/path/to/android-sdk
    * ANDROID_SDK_ROOT=/path/to/android-sdk
    * PATH=$ANDROID_HOME/platform-tools:$PATH
    * PATH=$ANDROID_HOME/tools:$PATH
    * PATH=$ANDROID_HOME/build-tools/23.0.2:$PATH
    * `android list targets | grep 22` -> get ID for next line
    * `android create avd -n cordova -t 22 -b google_apis/x86_64`
* `npm install -g cordova ionic gulp`
* `npm update`
* `ionic state restore`

See Also: http://ionicframework.com/

In XCODE Add this line to your Build Settings -> Header Search Paths:
"$(OBJROOT)/UninstalledProducts/$(PLATFORM_NAME)/include"

#### Run web interface
`ionic serve`

#### Build for IOS
`ionic build ios`

#### Emulate IOS
`ionic emulate ios`

#### Build for Android
`ionic build android`

#### Emulate Android
`ionic emulate android`

#### Run on Android device over USB Debug
`ionic run android`

#### Android debug from chrome!
In chrome, you can load the dev tools and point it at the app just like you
would normally debug a web page. This will give you access to the javascript
console, network, dom inspector, etc.

* Become a developer
  * Go to settings
  * About phone
  * Tab the "Build number" about 7 times
* Enable debug
  * Go to settings
  * Developer Options
  * Enable "USB debugging"
* Trust your machine
  * Plug in phone
  * Accept prompt on phone
* Point the debugger at your phone
  * Bring up dev tools as usual (CTRL+SHIFT+I except on mac)
  * Click the "..." next the the close(x) button on the top right.
  * Click "Inspect Devices"
  * Launch app on phone
  * Click the app on the device list in chrome
