# Inset repro for @capgo/capacitor-inappbrowser

Repro for [Cap-go/capacitor-inappbrowser#770](https://github.com/Cap-go/capacitor-inappbrowser/issues/770): on Android, `--safe-area-inset-*` holds physical pixels.

Needs Node 22+, the Android SDK and `adb`, and a device or emulator with 3-button navigation.

```sh
npm install
npm run setup
npm run android
```

With more than one device connected, set `ANDROID_SERIAL` for `npm run probe`.

Tap **Open: margin off** and run `npm run probe`. Restart the app, tap **Open: margin on** and run it again.

## Result on 8.27.2

| Device | `devicePixelRatio` | `innerHeight`, margin off | `innerHeight`, margin on | `--safe-area-inset-bottom` |
|---|---|---|---|---|
| Pixel 9 Pro XL emulator, Android 16 | 3 | 897 | 849 | `144px` |
| Xiaomi M2012K11AG, Android 13 | 2.75 | 748 | 701 | `130px` |

The page loses 48 and 47 CSS px, but the variable reports 144 and 130.

**Open: blank toolbar, margins on** also shows `--safe-area-inset-top`. Rotate to landscape on the emulator to see `--safe-area-inset-right`.
