package com.neubank;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;

import org.devio.rn.splashscreen.SplashScreen;
import android.content.res.Configuration;

import android.content.res.Resources;
import android.util.Log;

import androidx.appcompat.app.AlertDialog;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Neubank";
    }

    @Override

    public Resources getResources() {

        Resources res = super.getResources();

        Configuration config=new Configuration();

        config.setToDefaults();

        res.updateConfiguration(config,res.getDisplayMetrics() );

        return res;

    }

    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);

        //证书校验
        SignCheck signCheck = new SignCheck(this,"5A:FB:A6:CF:9D:6B:1F:BD:C4:3D:EC:E3:09:2F:41:A6:75:EF:3B:E6");
        if(!signCheck.check()) {
            AlertDialog alertDialog1 = new AlertDialog.Builder(this)
                    .setTitle("警告")//标题
                    .setMessage("请前往紫微宝官方下载正版 app， https://www.zvchain.io")//内容
                    .setIcon(R.mipmap.ic_launcher)//图标
                    .setCancelable(false)
                    .create();
            alertDialog1.show();
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }
    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }


}
