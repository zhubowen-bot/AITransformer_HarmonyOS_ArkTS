import { router } from '@kit.ArkUI';
import { common, ConfigurationConstant } from '@kit.AbilityKit';
import { ThemeHelper } from '../common/ThemeHelper';

interface ThemeOption {
  value: string;
  label: string;
}

@Entry
@Component
struct AboutPage {
  @StorageLink('appTheme') appTheme: string = 'system';
  @StorageProp('currentColorMode') currentColorMode: ConfigurationConstant.ColorMode =
    ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
  private updateLogs: string[] = [
    '完全重构：采用ArkTS和C++重写整个应用，代替原有的ArkWeb混合架构方案',
    '原生组件：导航栏、标签栏、图标等全部换用鸿蒙原生组件和设计风格，适配最新沉浸光感效果，我们对美的追求永无止境',
    '性能暴增：相比原有ArkWeb，原生ArkTS与C++的方案节省30%内存占用，性能提升50%',
    '智能感知：智能感知你的下一步动向，采用预连接、预加载方案优化网页启动速度',
    '快速切换：新增网页标题栏功能，无需退出即可快速切换页面',
    '丝滑流畅：弹簧动画丝滑细腻，ArkTS原生开发彻底解决了原有混合架构的若干卡顿问题和页面切换Bug',
    '权限新增：新增摄像头权限授予，优化权限的授权流程使之丝滑简单，您可以自由使用AI的语音输入和视频通话功能了'
  ];

  private featureList: string[] = [
    '各大软件鸿蒙版官方没有适配或功能残缺？我们通过嵌入式Web把官方平台搬上鸿蒙版',
    'AI 文本杂乱不好处理？轻量化 Markdown 转纯文本工具，高效便捷',
    '担心第三方工具安全性不佳？我们全部集成官方网站，只做前端不做服务器'
  ];

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

  openPrivacyUrl(): void {
    let url: string = 'https://agreement-drcn.hispace.dbankcloud.cn/index.html?lang=zh&agreementId=1931500322883123520';
    try {
      router.pushUrl({
        url: 'pages/WebPage',
        params: {
          url: url,
          title: '隐私协议'
        }
      });
    } catch (e) {
      console.error('openPrivacyUrl error', JSON.stringify(e));
    }
  }

  closePage(): void {
    router.back();
  }

  build() {
    Column() {
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

        Text('关于应用')
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
          // Privacy
          Column() {
            Text('隐私协议')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 8 })

            Text('关于AI一站清与隐私的声明')
              .fontSize(14)
              .fontColor(this.getAccentColor())
              .onClick(() => {
                this.openPrivacyUrl();
              })
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('app.color.bg_card'))
          .borderRadius(16)
          .margin({ bottom: 12 })

          // Updates
          Column() {
            Text('更新动态')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 8 })

            Text('Version 11')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor(this.getAccentColor())
              .margin({ bottom: 12 })

            Column() {
              ForEach(this.updateLogs, (log: string) => {
                Row() {
                  Text('·')
                    .fontSize(14)
                    .fontColor(this.getAccentColor())
                    .margin({ right: 6 })
                  Text(log)
                    .fontSize(13)
                    .fontColor($r('app.color.text_secondary'))
                    .lineHeight(20)
                }
                .width('100%')
                .alignItems(VerticalAlign.Top)
                .margin({ bottom: 4 })
              }, (log: string) => log)
            }
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('app.color.bg_card'))
          .borderRadius(16)
          .margin({ bottom: 12 })

          // Features
          Column() {
            Text('功能介绍')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 8 })

            Text('AI 一站清 是一款鸿蒙版一站式 AI 解决平台')
              .fontSize(13)
              .fontColor($r('app.color.text_secondary'))
              .margin({ bottom: 12 })

            Column() {
              ForEach(this.featureList, (feature: string) => {
                Row() {
                  Text('·')
                    .fontSize(14)
                    .fontColor(this.getAccentColor())
                    .margin({ right: 6 })
                  Text(feature)
                    .fontSize(13)
                    .fontColor($r('app.color.text_secondary'))
                    .lineHeight(20)
                }
                .width('100%')
                .alignItems(VerticalAlign.Top)
                .margin({ bottom: 4 })
              }, (feature: string) => feature)
            }
          }
          .width('100%')
          .padding(16)
          .backgroundColor($r('app.color.bg_card'))
          .borderRadius(16)
          .margin({ bottom: 12 })

          // Open Source
          Column() {
            Text('技术开源')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 8 })

            Text('本应用经过架构重写，采用ArkTS和C++原生开发，带来极致的原生流畅体验')
              .fontSize(13)
              .fontColor($r('app.color.text_secondary'))
              .lineHeight(20)
              .margin({ bottom: 8 })

            Text('秉持开源开放、共建共享的精神，此应用将开源在github平台，你可以审计每一行代码，欢迎学习、交流')
              .fontSize(13)
              .fontColor($r('app.color.text_secondary'))
              .lineHeight(20)
              .margin({ bottom: 8 })

            Text('我的 GitHub 主页：')
              .fontSize(13)
              .fontColor($r('app.color.text_secondary'))
              .margin({ bottom: 4 })

            Text('https://github.com/zhubowen-bot')
              .fontSize(13)
              .fontColor(this.getAccentColor())
              .lineHeight(20)
          }
          .width('100%')
          .padding(16)
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

export default AboutPage;
