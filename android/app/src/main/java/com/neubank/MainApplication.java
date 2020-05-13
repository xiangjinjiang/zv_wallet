package com.neubank;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.pilloxa.backgroundjob.BackgroundJobPackage;
import com.airbnb.android.react.lottie.LottiePackage;

import androidx.appcompat.app.AlertDialog;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.neubank.um.DplusReactPackage;
import com.neubank.um.RNUMConfigure;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.microsoft.codepush.react.CodePush;
import com.rnfingerprint.FingerprintAuthPackage;
import dk.madslee.imageCapInsets.RCTImageCapInsetPackage;
import com.horcrux.svg.SvgPackage;
import com.imagepicker.ImagePickerPackage;
import com.beefe.picker.PickerViewPackage;
import com.neubank.appUpdate.DownloadApkPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.umeng.commonsdk.UMConfigure;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new BackgroundJobPackage(),
            new LottiePackage(),
            new RNViewShotPackage(),
            new RNCWebViewPackage(),
            new FingerprintAuthPackage(),
            new RCTImageCapInsetPackage(),
            new SvgPackage(),
            new ImagePickerPackage(),
            new PickerViewPackage(),
            new RNGestureHandlerPackage(),
            new RNDeviceInfo(),
              new SplashScreenReactPackage(),
              new DownloadApkPackage(),
              new RCTCapturePackage(),
              new AppPackage(),
              new DplusReactPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
