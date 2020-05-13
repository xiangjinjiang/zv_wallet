package com.neubank.wallet;


import android.content.Context;

import android.app.Activity;

import android.content.SharedPreferences;

import android.net.Uri;

import android.os.Environment;

import com.facebook.react.bridge.Callback;
import	com.facebook.react.bridge.ReactApplicationContext;

import	com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.ReactMethod;
import account.Account;

public	class	Wallet	extends ReactContextBaseJavaModule {


    public Wallet(ReactApplicationContext reactContext) {

        super(reactContext);

    }

    @Override
    public String getName() {
        return "Wallet";

    }

    @ReactMethod
    public void getMnemonic(Callback callback) {
        String mnemonic = Account.genMnemonic();
        callback.invoke("", mnemonic);
    }

    @ReactMethod
    public void getChild(String mnemonic,Integer index, Callback callback) {
        String child = Account.getChild(mnemonic,index);
        callback.invoke("", child);
    }

    @ReactMethod
    public void sk2Addr(String child, Callback callback) {
        String addr = Account.sk2Addr(child);
        callback.invoke("", addr);
    }

    @ReactMethod
    public void sk2Pk(String child, Callback callback) {
        String pk = Account.sk2Pk(child);
        callback.invoke("", pk);
    }

    @ReactMethod
    public void signTx(String sk, String dataHex, String value, Integer nonce, String targetAddr, Integer txType, Integer gasLimit, Integer gasPrice, String extraDataHex, Callback callback) {
        long longValue = Long.parseLong(value, 10);
        String sign = Account.signTx(sk,dataHex,longValue,nonce,targetAddr,txType, gasLimit, gasPrice,extraDataHex);
        callback.invoke("", sign);
    }

}
