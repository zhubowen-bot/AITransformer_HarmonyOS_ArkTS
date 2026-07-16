import { common, ConfigurationConstant } from '@kit.AbilityKit';
import { pasteboard } from '@kit.BasicServicesKit';
import { ThemeHelper } from '../common/ThemeHelper';

@Component
struct ConvertPage {
  @State inputText: string = '';
  @State outputText: string = '';
  @State copyBtnText: string = '复制';
  @State currentDate: string = '';
  @State currentTime: string = '';

  aboutToAppear(): void {
    this.updateDateTime();
    this.updateStatusBarColor();
  }

  private updateStatusBarColor(): void {
    let appTheme: string = AppStorage.get<string>('appTheme') || 'system';
    let currentMode: ConfigurationConstant.ColorMode = ThemeHelper.getEffectiveColorMode();
    let isDark: boolean = ThemeHelper.isEffectiveDarkMode(appTheme, currentMode);
    let ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
    ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF1E293B' : '#FFFFFFFF');
  }

  updateDateTime(): void {
    let now: Date = new Date();
    let year: number = now.getFullYear();
    let month: string = ('0' + (now.getMonth() + 1)).slice(-2);
    let day: string = ('0' + now.getDate()).slice(-2);
    let hours: string = ('0' + now.getHours()).slice(-2);
    let minutes: string = ('0' + now.getMinutes()).slice(-2);
    this.currentDate = year + '-' + month + '-' + day;
    this.currentTime = hours + ':' + minutes;
  }

  convertText(): void {
    if (!this.inputText.trim()) {
      return;
    }
    let result: string = '';
    for (let i = 0; i < this.inputText.length; i++) {
      let ch: string = this.inputText[i];
      if (ch !== '*' && ch !== '#') {
        result += ch;
      }
    }
    this.outputText = result;
  }

  clearInput(): void {
    this.inputText = '';
    this.outputText = '';
  }

  copyOutput(): void {
    if (!this.outputText.trim()) {
      return;
    }
    try {
      let data: pasteboard.PasteData = pasteboard.createData(pasteboard.MIMETYPE_TEXT_PLAIN, this.outputText);
      pasteboard.getSystemPasteboard().setData(data);
      this.copyBtnText = '已复制';
      setTimeout(() => {
        this.copyBtnText = '复制';
      }, 2000);
    } catch (e) {
      console.error('copy error', JSON.stringify(e));
    }
  }

  build() {
    Column() {
      // Header
      Row() {
        Text('AI 一站清')
          .fontSize(16)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))

        Column()
          .width(1)
          .height(16)
          .backgroundColor($r('app.color.border_color'))
          .margin({ left: 10, right: 10 })

        Text('文本转换')
          .fontSize(14)
          .fontWeight(FontWeight.Regular)
          .fontColor(ThemeHelper.getAccentColor())

        Blank()

        Column() {
          Text(this.currentDate)
            .fontSize(10)
            .fontColor($r('app.color.text_secondary'))
          Text(this.currentTime)
            .fontSize(10)
            .fontWeight(FontWeight.Bold)
            .fontColor(ThemeHelper.getAccentColor())
        }
        .alignItems(HorizontalAlign.End)
      }
      .width('100%')
      .padding({ left: 16, right: 16, top: 12, bottom: 12 })
      .backgroundColor($r('app.color.bg_card'))

      // Content
      Column() {
        Text('Markdown转纯文本')
          .fontSize(19)
          .fontWeight(FontWeight.Bold)
          .fontColor($r('app.color.text_primary'))
          .textAlign(TextAlign.Center)
          .width('100%')
          .margin({ top: 35, bottom: 32 })

        // Input Area
        Column() {
          Row() {
            Text('输入框')
              .fontSize(13)
              .fontColor($r('app.color.text_secondary'))
            Blank()
            Button() {
              Row() {
                SymbolGlyph($r('sys.symbol.trash'))
                  .fontSize(16)
                  .fontColor([ThemeHelper.getAccentColor()])
                Text('清空')
                  .fontSize(13)
                  .fontColor(ThemeHelper.getAccentColor())
                  .margin({ left: 4 })
              }
            }
            .height(32)
            .backgroundColor(ThemeHelper.getAccentLightColor())
            .borderRadius(16)
            .padding({ left: 12, right: 12 })
            .onClick(() => {
              this.clearInput();
            })
          }
          .width('100%')
          .margin({ bottom: 8 })

          TextArea({ placeholder: '示例：# 这是一个**标题**', text: this.inputText })
            .height(170)
            .width('100%')
            .fontSize(14)
            .borderRadius(12)
            .border({ width: 1, color: $r('app.color.border_color') })
            .padding(12)
            .backgroundColor($r('app.color.bg_card'))
            .onChange((value: string) => {
              this.inputText = value;
            })
        }
        .width('100%')
        .padding({ left: 16, right: 16 })
        .margin({ bottom: 14 })

        // Convert Button
        Button() {
          Row() {
            SymbolGlyph($r('sys.symbol.arrow_2_circlepath'))
              .fontSize(18)
              .fontColor([ThemeHelper.getAccentColor()])
            Text('转换')
              .fontSize(15)
              .fontWeight(FontWeight.Bold)
              .fontColor(ThemeHelper.getAccentColor())
              .margin({ left: 6 })
          }
        }
        .width('80%')
        .height(48)
        .backgroundColor($r('app.color.bg_card'))
        .borderRadius(14)
        .shadow({ radius: 6, color: 'rgba(0, 0, 0, 0.08)', offsetY: 2 })
        .border({ width: 1, color: $r('app.color.border_color') })
        .margin({ bottom: 14 })
        .alignSelf(ItemAlign.Center)
        .onClick(() => {
          this.convertText();
        })

        // Output Area
        Column() {
          Row() {
            Text('输出框')
              .fontSize(13)
              .fontColor($r('app.color.text_secondary'))
            Blank()
            Button() {
              Row() {
                SymbolGlyph($r('sys.symbol.text_clipboard'))
                  .fontSize(16)
                  .fontColor([ThemeHelper.getAccentColor()])
                Text(this.copyBtnText)
                  .fontSize(13)
                  .fontColor(ThemeHelper.getAccentColor())
                  .margin({ left: 4 })
              }
            }
            .height(32)
            .backgroundColor(ThemeHelper.getAccentLightColor())
            .borderRadius(16)
            .padding({ left: 12, right: 12 })
            .onClick(() => {
              this.copyOutput();
            })
          }
          .width('100%')
          .margin({ bottom: 8 })

          TextArea({ placeholder: '转换后的纯文本', text: this.outputText })
            .height(170)
            .width('100%')
            .fontSize(14)
            .borderRadius(12)
            .border({ width: 1, color: $r('app.color.border_color') })
            .padding(12)
            .backgroundColor($r('app.color.bg_card'))
            .enabled(false)
        }
        .width('100%')
        .padding({ left: 16, right: 16 })

        Blank()
          .layoutWeight(1)
      }
      .layoutWeight(1)
      .width('100%')
      .backgroundColor($r('app.color.bg_primary'))
    }
    .width('100%')
    .height('100%')
  }
}

export default ConvertPage;
