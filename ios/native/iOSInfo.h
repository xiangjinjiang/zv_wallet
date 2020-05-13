//
//  iOSInfo.h
//  reactApp
//
//  Created by 闫通亮 on 2017/12/4.
//  Copyright
//

#import <Foundation/Foundation.h>

#if __has_include(<React/RCTAssert.h>)
#import <React/RCTBridgeModule.h>
#else
#import "RCTBridgeModule.h"
#endif


@interface iOSInfo : NSObject <RCTBridgeModule>


@end
