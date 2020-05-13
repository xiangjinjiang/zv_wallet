//
//  Wallet.m
//  Neubank
//
//  Created by mac on 2019/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "Wallet.h"
#import "Account/Account.h"

@implementation Wallet

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getMnemonic:(RCTResponseSenderBlock)callback) {
  NSString * mnemonic = AccountGenMnemonic();
  callback(@[[NSNull null],mnemonic]);
}

RCT_EXPORT_METHOD(getChild:(NSString *)mnemonic index:(int)index callback:(RCTResponseSenderBlock)callback) {
  NSString *child = AccountGetChild(mnemonic, index);
  callback(@[[NSNull null],child]);
}

RCT_EXPORT_METHOD(sk2Addr:(NSString *)child callback:(RCTResponseSenderBlock)callback) {
  NSString *address = AccountSk2Addr(child);
  callback(@[[NSNull null],address]);
}
RCT_EXPORT_METHOD(sk2Pk:(NSString *)child callback:(RCTResponseSenderBlock)callback) {
  NSString *pk = AccountSk2Pk(child);
  callback(@[[NSNull null],pk]);
}

RCT_EXPORT_METHOD(signTx:(NSString *)sk
                  dataHex:(NSString *)dataHex
                  value:(NSString *)value
                  nonce:(NSInteger)nonce
                  targetAddr:(NSString *)targetAddr
                  txType:(NSInteger) txType
                  gasLimit:(NSInteger) gasLimit
                  gasPrice:(NSInteger) gasPrice
                  extraDataHex:(NSString *) extraDataHex
                  callback:(RCTResponseSenderBlock)callback) {
  
  long long longValue = [value longLongValue];
  
  NSString *sign = AccountSignTx(sk, dataHex, longValue, nonce, targetAddr, txType, gasLimit, gasPrice, extraDataHex);
  
  callback(@[[NSNull null],sign]);
}

/*
 
 sk： 账号私钥的16进制字符串
 dataHex：transaction的data字段的16进制字符串
 value： transaction的value字段，表示转账金融
 nonce： transaction的nonce字段，从链上获取当前账户最新值
 targetAddr： transaction的target字段，表示转账的接收地址，16进制字符串。
 txType: transaction的type字段,表示转账类型。
 gasLimit： transaction的gasLimit字段，表示交易所能消耗的最大gas
 gasPrice： transaction的gasPrice字段，交易的gas价格
 extraDataHex： transaction的extraData字段，额外信息的16进制字符串
 */


@end
