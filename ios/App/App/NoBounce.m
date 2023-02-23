//
//  NoBounce.m
//  App
//
//  Created by Marvin Koch on 23.02.23.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@implementation UIScrollView (NoBounce)
-(void) didMoveToWindow {
    [super didMoveToWindow];
    self.bounces = NO;
}
@end
