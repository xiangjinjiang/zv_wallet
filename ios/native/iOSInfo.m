//
//  iOSInfo.m
//  reactApp
//
//  Created by 闫通亮 on 2017/12/4.
//  Copyright
//

#import "iOSInfo.h"
#import <UIKit/UIKit.h>
#import <ifaddrs.h>
#import <arpa/inet.h>
#import <net/if.h>


@implementation iOSInfo

RCT_EXPORT_MODULE();

- (NSDictionary *)constantsToExport
{
  CGRect rectOfStatusbar = [[UIApplication sharedApplication] statusBarFrame];
  NSString *height = [NSString stringWithFormat:@"%f",rectOfStatusbar.size.height];
  NSLog(@"height ==== %@",height);
  return @{ @"statusbarHeight":  height};
}

+ (BOOL)requiresMainQueueSetup{
  return YES;
}


@end
