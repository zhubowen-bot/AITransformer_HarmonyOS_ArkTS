import { router } from '@kit.ArkUI';
import { common, ConfigurationConstant, Want } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { ThemeHelper } from '../common/ThemeHelper';

@Entry
@Component
struct SupportPage {
  @StorageLink('appTheme') appTheme: string = 'system';
  @StorageProp('currentColorMode') currentColorMode: ConfigurationConstant.ColorMode =
    ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;

  getAccentColor(): string {
    let colorTheme: string = AppStorage.get<string>('appColorTheme') as string || 'blue';
    let colorMap: Record<string, string> = {
      'blue': '#3B82F6',
      'green': '#059669',
      'orange': '#EA580C',
      'purple': '#7C3AED',
      'cyan': '#0891B2',
      'rose': '#E11D48'
    };
    return colorMap[colorTheme] || '#3B82F6';
  }

  isDarkMode(): boolean {
    return ThemeHelper.isEffectiveDarkMode(this.appTheme, this.currentColorMode);
  }

  closePage(): void {
    router.back();
  }

  openAppGalleryReview(): void {
    let context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    let bundleName: string = 'com.aitransformer.bowenapp';
    let want: Want = {
      action: 'ohos.want.action.appdetail',
      uri: 'store://appgallery.huawei.com/app/detail?id=' + bundleName + '&action=write-review'
    };
    context.startAbility(want).then(() => {
      console.info('SupportPage', 'openAppGalleryReview success');
    }).catch((error: BusinessError) => {
      console.error('SupportPage', 'openAppGalleryReview failed, Code: ' + error.code + ', message: ' + error.message);
    });
  }

  build() {
    Column() {
      // ===== Header =====
      Row() {
        Button() {
          SymbolGlyph($r('sys.symbol.arrow_left'))
            .fontSize(20)
            .fontColor([$r('app.color.text_primary')])
        }
        .width(36)
        .height(36)
        .backgroundColor(Color.Transparent)
        .borderRadius(18)
        .onClick(() => {
          this.closePage();
        })

        Blank()

        Text('支持作者')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .margin({ left: -36 })

        Blank()
      }
      .width('100%')
      .height(48)
      .padding({ left: 12, right: 12 })

      Scroll() {
        Column() {
          // ===== Card 1: 赞助作者 =====
          Column() {
            // Title
            Row() {
              SymbolGlyph($r('sys.symbol.heart'))
                .fontSize(22)
                .fontColor([Color.Red])

              Text('赞助作者')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor($r('app.color.text_primary'))
                .margin({ left: 8 })
            }
            .width('100%')
            .margin({ bottom: 12 })

            // Message
            Text('应用全量功能永久免费。如果这个应用对你有所帮助，欢迎赞助作者一些开发消耗的 tokens ！(*^▽^*)')
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .lineHeight(22)
              .width('100%')
              .margin({ bottom: 4 })

            Text('你的每一份支持，都是作者持续前进的动力！')
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .lineHeight(22)
              .width('100%')
              .margin({ bottom: 20 })

            // QR Codes
            Row() {
              // WeChat
              Column() {
                Image($r('app.media.wechat'))
                  .width(140)
                  .height(140)
                  .borderRadius(12)
                  .objectFit(ImageFit.Contain)
                  .border({ width: 1, color: $r('app.color.border_color') })

                Text('微信')
                  .fontSize(14)
                  .fontWeight(FontWeight.Medium)
                  .fontColor($r('app.color.text_primary'))
                  .margin({ top: 8 })
              }
              .layoutWeight(1)
              .alignItems(HorizontalAlign.Center)

              // Alipay
              Column() {
                Image($r('app.media.alipay'))
                  .width(140)
                  .height(140)
                  .borderRadius(12)
                  .objectFit(ImageFit.Contain)
                  .border({ width: 1, color: $r('app.color.border_color') })

                Text('支付宝')
                  .fontSize(14)
                  .fontWeight(FontWeight.Medium)
                  .fontColor($r('app.color.text_primary'))
                  .margin({ top: 8 })
              }
              .layoutWeight(1)
              .alignItems(HorizontalAlign.Center)
            }
            .width('100%')
            .justifyContent(FlexAlign.SpaceAround)
          }
          .width('100%')
          .padding(20)
          .backgroundColor($r('app.color.bg_card'))
          .borderRadius(16)
          .margin({ bottom: 12 })

          // ===== Card 2: 给个好评 =====
          Column() {
            // Title
            Row() {
              SymbolGlyph($r('sys.symbol.star'))
                .fontSize(22)
                .fontColor([this.getAccentColor()])

              Text('给个好评')
                .fontSize(18)
                .fontWeight(FontWeight.Bold)
                .fontColor($r('app.color.text_primary'))
                .margin({ left: 8 })
            }
            .width('100%')
            .margin({ bottom: 12 })

            Text('如果你喜欢这个应用，欢迎在应用市场给个五星好评！')
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .lineHeight(22)
              .width('100%')
              .margin({ bottom: 8 })

            Text('你的好评是对我最大的鼓励，也是我持续优化的动力源泉。')
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .lineHeight(22)
              .width('100%')
              .margin({ bottom: 20 })

            Row() {
              Row() {
                SymbolGlyph($r('sys.symbol.star'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Text('去应用市场好评')
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor(this.getAccentColor())
                  .margin({ left: 6 })
              }
              .alignItems(VerticalAlign.Center)
              .justifyContent(FlexAlign.Center)
            }
            .width('100%')
            .height(48)
            .justifyContent(FlexAlign.Center)
            .backgroundColor($r('app.color.bg_card'))
            .borderRadius(12)
            .border({ width: 1, color: this.getAccentColor() })
            .shadow({ radius: 8, color: this.getAccentColor() + '33', offsetY: 3 })
            .onClick(() => {
              this.openAppGalleryReview();
            })
          }
          .width('100%')
          .padding(20)
          .backgroundColor($r('app.color.bg_card'))
          .borderRadius(16)
          .margin({ bottom: 32 })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 20 })
        .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM])
      }
      .layoutWeight(1)
      .width('100%')
      .clip(false)
      .edgeEffect(EdgeEffect.Spring)
      .scrollBar(BarState.Off)
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.bg_primary'))
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM])
  }
}

export default SupportPage;
