import { common, ConfigurationConstant } from '@kit.AbilityKit';
import { router } from '@kit.ArkUI';
import { preferences } from '@kit.ArkData';
import { ThemeHelper } from '../common/ThemeHelper';

interface ThemeOption {
  value: string;
  label: string;
}

interface ColorThemeOption {
  value: string;
  label: string;
}

@Component
struct SettingsPage {
  @State currentTheme: string = 'system';
  @State currentColorTheme: string = 'blue';

  private themeOptions: ThemeOption[] = [
    { value: 'system', label: '跟随系统' },
    { value: 'light', label: '浅色模式' },
    { value: 'dark', label: '深色模式' }
  ];

  private colorThemeOptions: ColorThemeOption[] = [
    { value: 'blue', label: '蓝青' },
    { value: 'green', label: '翠绿' },
    { value: 'orange', label: '暖橙' },
    { value: 'purple', label: '典雅紫' },
    { value: 'cyan', label: '湖水青' },
    { value: 'rose', label: '玫瑰红' }
  ];

  private updateLogs: string[] = [
    '架构重写：完全重写了应用架构，采用多页面多组件模块化构建',
    '沉浸光感：集成沉浸式视觉效果',
    '全新升级：AI工具集升级为应用集样式，新增编辑、排序等功能',
    '体验升级：深色模式下界面更通透；新增至八个默认模型',
    '跳转支持：新增拉起浏览器实现应用跳转'
  ];

  private featureList: string[] = [
    '鸿蒙版官方没有适配或功能残缺？我们通过 ArkWeb 把官方平台搬上鸿蒙版',
    'AI 文本杂乱不好处理？轻量化 Markdown 转纯文本工具，高效便捷',
    '担心第三方工具安全性不佳？我们全部集成官方网站，只做前端不做服务器'
  ];

  aboutToAppear(): void {
    let savedTheme: string = AppStorage.get<string>('appTheme') as string;
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    let savedColor: string = AppStorage.get<string>('appColorTheme') as string;
    if (savedColor) {
      this.currentColorTheme = savedColor;
    }
    this.updateStatusBarColor();
  }

  private updateStatusBarColor(): void {
    let ctx: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    ThemeHelper.updateStatusBarColor(ctx);
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    AppStorage.set<string>('appTheme', theme);
    const ctx: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    ThemeHelper.applyTheme(theme, ctx);
    ThemeHelper.updateStatusBarColor(ctx);
    const prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'toolData' });
    prefs.putSync('appTheme', theme);
    prefs.flushSync();
  }

  setColorTheme(colorTheme: string): void {
    this.currentColorTheme = colorTheme;
    AppStorage.set<string>('appColorTheme', colorTheme);
    const ctx: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    const prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'toolData' });
    prefs.putSync('appColorTheme', colorTheme);
    prefs.flushSync();
  }

  getAccentColor(): string {
    let colorMap: Record<string, string> = {
      'blue': '#3B82F6',
      'green': '#059669',
      'orange': '#EA580C',
      'purple': '#7C3AED',
      'cyan': '#0891B2',
      'rose': '#E11D48'
    };
    return colorMap[this.currentColorTheme] || '#3B82F6';
  }

  getColorValue(colorTheme: string): string {
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

  build() {
    Stack() {
      Column() {
        Scroll() {
          Column() {
            // ===== Header =====
            Column() {
              Image($r('app.media.aitransformer2'))
                .width(60)
                .height(60)
                .borderRadius(16)
                .shadow({ radius: 12, color: 'rgba(0,0,0,0.1)', offsetY: 4 })

              Text('AI 一站清')
                .fontSize(22)
                .fontWeight(FontWeight.Bold)
                .fontColor($r('app.color.text_primary'))
                .margin({ top: 12 })

              Text('Version 11.0.0')
                .fontSize(13)
                .fontColor($r('app.color.text_secondary'))
                .margin({ top: 2 })
            }
            .width('100%')
            .alignItems(HorizontalAlign.Center)
            .padding({ top: 40, bottom: 24 })

            // ===== 深色模式 =====
            Column() {
              Row() {
                SymbolGlyph($r('sys.symbol.arrow_2_circlepath'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Text('深色模式')
                  .fontSize(17)
                  .fontWeight(FontWeight.Medium)
                  .fontColor($r('app.color.text_primary'))
                  .margin({ left: 10 })
              }
              .width('100%')
              .margin({ bottom: 16 })

              Row() {
                ForEach(this.themeOptions, (option: ThemeOption) => {
                  Text(option.label)
                    .fontSize(14)
                    .fontWeight(this.currentTheme === option.value ? FontWeight.Medium : FontWeight.Regular)
                    .fontColor(this.currentTheme === option.value ?
                      this.getAccentColor() : $r('app.color.text_secondary'))
                    .layoutWeight(1)
                    .height(40)
                    .textAlign(TextAlign.Center)
                    .backgroundColor($r('app.color.bg_primary'))
                    .borderRadius(10)
                    .border({ width: this.currentTheme === option.value ? 1.5 : 1,
                      color: this.currentTheme === option.value ?
                        this.getAccentColor() : $r('app.color.border_color') })
                    .shadow({ radius: 4, color: 'rgba(0,0,0,0.06)', offsetY: 2 })
                    .margin({ left: 4, right: 4 })
                    .onClick(() => {
                      this.setTheme(option.value);
                    })
                }, (item: ThemeOption) => item.value)
              }
              .width('100%')
            }
            .width('100%')
            .padding(20)
            .backgroundColor($r('app.color.bg_card'))
            .borderRadius(16)
            .margin({ bottom: 12 })

            // ===== 主题色彩 =====
            Column() {
              Row() {
                SymbolGlyph($r('sys.symbol.bookmark'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Text('主题色彩')
                  .fontSize(17)
                  .fontWeight(FontWeight.Medium)
                  .fontColor($r('app.color.text_primary'))
                  .margin({ left: 10 })
              }
              .width('100%')
              .margin({ bottom: 16 })

              Row() {
                ForEach(this.colorThemeOptions, (option: ColorThemeOption) => {
                  Column() {
                    Stack() {
                      Circle()
                        .width(28)
                        .height(28)
                        .fill(this.getColorValue(option.value))
                      if (this.currentColorTheme === option.value) {
                        Circle()
                          .width(10)
                          .height(10)
                          .fill(Color.White)
                      }
                    }
                    .width(32)
                    .height(32)

                    Text(option.label)
                      .fontSize(11)
                      .fontColor(this.currentColorTheme === option.value ?
                        this.getColorValue(option.value) : $r('app.color.text_secondary'))
                      .margin({ top: 6 })
                  }
                  .onClick(() => {
                    this.setColorTheme(option.value);
                  })
                }, (item: ColorThemeOption) => item.value)
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceAround)
            }
            .width('100%')
            .padding(20)
            .backgroundColor($r('app.color.bg_card'))
            .borderRadius(16)
            .margin({ bottom: 12 })

            // ===== 关于应用 =====
            Row() {
              SymbolGlyph($r('sys.symbol.gearshape'))
                .fontSize(20)
                .fontColor([this.getAccentColor()])

              Text('关于应用')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor($r('app.color.text_primary'))
                .margin({ left: 12 })

              Blank()

              SymbolGlyph($r('sys.symbol.arrow_right'))
                .fontSize(16)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width('100%')
            .padding(20)
            .backgroundColor($r('app.color.bg_card'))
            .borderRadius(16)
            .margin({ bottom: 12 })
            .onClick(() => {
              router.pushUrl({ url: 'pages/AboutPage' });
            })

            // ===== 支持作者 =====
            Row() {
              SymbolGlyph($r('sys.symbol.heart'))
                .fontSize(20)
                .fontColor([Color.Red])

              Text('支持作者')
                .fontSize(16)
                .fontWeight(FontWeight.Medium)
                .fontColor($r('app.color.text_primary'))
                .margin({ left: 12 })

              Blank()

              SymbolGlyph($r('sys.symbol.arrow_right'))
                .fontSize(16)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width('100%')
            .padding(20)
            .backgroundColor($r('app.color.bg_card'))
            .borderRadius(16)
            .margin({ bottom: 12 })
            .onClick(() => {
              router.pushUrl({ url: 'pages/SupportPage' });
            })

            // ===== 联系方式 =====
            Column() {
              Row() {
                SymbolGlyph($r('sys.symbol.text_clipboard'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Column() {
                  Text('邮箱')
                    .fontSize(12)
                    .fontColor($r('app.color.text_secondary'))

                  Text('15196443523@139.com')
                    .fontSize(15)
                    .fontColor($r('app.color.text_primary'))
                    .margin({ top: 2 })
                }
                .margin({ left: 12 })
                .alignItems(HorizontalAlign.Start)
              }
              .width('100%')

              Row() {
                SymbolGlyph($r('sys.symbol.text_clipboard'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Column() {
                  Text('邮箱')
                    .fontSize(12)
                    .fontColor($r('app.color.text_secondary'))

                  Text('bowen_zbw@sjtu.edu.cn')
                    .fontSize(15)
                    .fontColor($r('app.color.text_primary'))
                    .margin({ top: 2 })
                }
                .margin({ left: 12 })
                .alignItems(HorizontalAlign.Start)
              }
              .width('100%')
              .margin({ top: 16 })

              Divider()
                .height(1)
                .color($r('app.color.border_color'))
                .margin({ top: 16 })

              Row() {
                SymbolGlyph($r('sys.symbol.text_clipboard'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Column() {
                  Text('电话')
                    .fontSize(12)
                    .fontColor($r('app.color.text_secondary'))

                  Text('15196443523')
                    .fontSize(15)
                    .fontColor($r('app.color.text_primary'))
                    .margin({ top: 2 })
                }
                .margin({ left: 12 })
                .alignItems(HorizontalAlign.Start)
              }
              .width('100%')
              .margin({ top: 16 })

              Row() {
                SymbolGlyph($r('sys.symbol.text_clipboard'))
                  .fontSize(18)
                  .fontColor([this.getAccentColor()])

                Column() {
                  Text('QQ反馈群')
                    .fontSize(12)
                    .fontColor($r('app.color.text_secondary'))

                  Text('1067833232')
                    .fontSize(15)
                    .fontColor($r('app.color.text_primary'))
                    .margin({ top: 2 })
                }
                .margin({ left: 12 })
                .alignItems(HorizontalAlign.Start)
              }
              .width('100%')
              .margin({ top: 16 })
            }
            .width('100%')
            .padding(20)
            .backgroundColor($r('app.color.bg_card'))
            .borderRadius(16)
            .margin({ bottom: 160 })
          }
          .width('100%')
          .padding({ left: 16, right: 16 })
        }
        .layoutWeight(1)
        .width('100%')
        .edgeEffect(EdgeEffect.Spring)
        .scrollBar(BarState.Off)
      }
      .width('100%')
      .height('100%')
      .backgroundColor($r('app.color.bg_primary'))


    }
    .width('100%')
    .height('100%')
  }
}

export default SettingsPage;
