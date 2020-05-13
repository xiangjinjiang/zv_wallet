//
//  Wallet.h
//  Neubank
//
//  Created by mac on 2019/7/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#if __has_include(<React/RCTAssert.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif


NS_ASSUME_NONNULL_BEGIN

@interface Wallet : NSObject  <RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
