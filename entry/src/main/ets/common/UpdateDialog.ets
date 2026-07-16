import { common } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';

const VERSION_NAME: string = '11.0.0';
const PREF_KEY_PREFIX: string = 'update_dialog_dismissed_';

@CustomDialog
export struct UpdateDialog {
  controller?: CustomDialogController;

  @State isChecked: boolean = false;

  build() {
    Column() {
      // Header
      Column() {
        Text('v' + VERSION_NAME + ' 版本更新日志')
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FF1E293B')
          .textAlign(TextAlign.Center)

        Text('全新原生鸿蒙体验')
          .fontSize(14)
          .fontColor('#FF64748B')
          .margin({ top: 6 })
      }
      .width('100%')
      .padding({ top: 8, bottom: 12 })

      // Divider
      Divider()
        .width('100%')
        .color('#FFF1F5F9')

      // Scrollable content
      Scroll() {
        Column() {
          // Apology / Data loss notice
          Column() {
            Row() {
              Text('!')
                .fontSize(16)
                .fontWeight(FontWeight.Bold)
                .fontColor('#FFFFFF')
                .width(28)
                .height(28)
                .textAlign(TextAlign.Center)
                .borderRadius(14)
                .backgroundColor('#FFEF4444')

              Text('数据迁移说明')
                .fontSize(16)
                .fontWeight(FontWeight.Bold)
                .fontColor('#FF991F1F')
                .margin({ left: 8 })
            }

            Text('因底层架构全面重构，本次更新会抹除所有用户数据，感谢您的理解与支持！')
              .fontSize(14)
              .fontColor('#FFB91C1C')
              .lineHeight(22)
              .margin({ top: 10 })
          }
          .width('100%')
          .padding(14)
          .backgroundColor('#FFFEF2F2')
          .borderRadius(12)
          .border({ width: 1, color: '#FFFECACA' })

          // Core changes
          Text('核心变革：完全重写，原生蜕变')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF1E293B')
            .width('100%')
            .margin({ top: 16, bottom: 8 })

          Text('新版本采用 ArkTS + C++ 原生技术栈彻底重写了整个应用，取代原有的 ArkWeb 混合架构。内存管理、性能调度、资源分配、页面加载全面优化。所有页面、导航栏、标签栏、图标均换用鸿蒙原生组件与设计风格，同时保留了备受好评的沉浸光感效果。在保证功能上完全对齐老版本，并带来以下重大升级：')
            .fontSize(14)
            .fontColor('#FF475569')
            .lineHeight(22)
            .width('100%')

          // Highlights
          Text('亮点一览')
            .fontSize(16)
            .fontWeight(FontWeight.Bold)
            .fontColor('#FF1E293B')
            .width('100%')
            .margin({ top: 16, bottom: 10 })

          // Item 1
          Column() {
            Row() {
              Text('')
                .width(8)
                .height(8)
                .borderRadius(4)
                .backgroundColor('#FF3B82F6')
                .margin({ top: 6 })

              Text('性能暴增，流畅如飞')
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF1E293B')
                .margin({ left: 8 })
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)

            Text('内存占用降低 30%，性能提升 50% — 原生方案彻底告别混合架构的臃肿。\n智能预判行动：预连接 + 预加载技术，网页启动速度大幅优化。\n动画丝滑细腻：弹簧动画配合触顶/触底反弹效果，彻底解决原有卡顿、掉帧及页面切换 Bug。')
              .fontSize(14)
              .fontColor('#FF475569')
              .lineHeight(22)
              .width('100%')
              .margin({ top: 6, left: 16 })
          }
          .width('100%')
          .margin({ bottom: 14 })

          // Item 2
          Column() {
            Row() {
              Text('')
                .width(8)
                .height(8)
                .borderRadius(4)
                .backgroundColor('#FF3B82F6')
                .margin({ top: 6 })

              Text('交互升级，切换自如')
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF1E293B')
                .margin({ left: 8 })
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)

            Text('新增网页标题栏，无需退出当前页面即可快速切换，操作效率倍增。')
              .fontSize(14)
              .fontColor('#FF475569')
              .lineHeight(22)
              .width('100%')
              .margin({ top: 6, left: 16 })
          }
          .width('100%')
          .margin({ bottom: 14 })

          // Item 3
          Column() {
            Row() {
              Text('')
                .width(8)
                .height(8)
                .borderRadius(4)
                .backgroundColor('#FF3B82F6')
                .margin({ top: 6 })

              Text('数据更安全，告别误删')
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF1E293B')
                .margin({ left: 8 })
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)

            Text('原生开发将用户数据从缓存中"解救"出来，避免清理缓存时意外丢失重要信息。')
              .fontSize(14)
              .fontColor('#FF475569')
              .lineHeight(22)
              .width('100%')
              .margin({ top: 6, left: 16 })
          }
          .width('100%')
          .margin({ bottom: 14 })

          // Item 4
          Column() {
            Row() {
              Text('')
                .width(8)
                .height(8)
                .borderRadius(4)
                .backgroundColor('#FF3B82F6')
                .margin({ top: 6 })

              Text('视觉焕新，美不胜收')
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF1E293B')
                .margin({ left: 8 })
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)

            Text('全新应用图标：简洁耐看，告别"丑"标签。\n全组件统一：全部采用鸿蒙原生组件，视觉高度协调。\n主题色彩同步至沉浸光感悬浮导航栏，色彩观感统一和谐。\n重写所有 UI，界面更精致、更美观。')
              .fontSize(14)
              .fontColor('#FF475569')
              .lineHeight(22)
              .width('100%')
              .margin({ top: 6, left: 16 })
          }
          .width('100%')
          .margin({ bottom: 14 })

          // Item 5
          Column() {
            Row() {
              Text('')
                .width(8)
                .height(8)
                .borderRadius(4)
                .backgroundColor('#FF3B82F6')
                .margin({ top: 6 })

              Text('支持作者，共创美好')
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF1E293B')
                .margin({ left: 8 })
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)

            Text('新增赞助入口，欢迎您用好评或打赏支持我们持续创作！')
              .fontSize(14)
              .fontColor('#FF475569')
              .lineHeight(22)
              .width('100%')
              .margin({ top: 6, left: 16 })
          }
          .width('100%')
          .margin({ bottom: 14 })

          // Item 6
          Column() {
            Row() {
              Text('')
                .width(8)
                .height(8)
                .borderRadius(4)
                .backgroundColor('#FF3B82F6')
                .margin({ top: 6 })

              Text('权限管理问题修复')
                .fontSize(15)
                .fontWeight(FontWeight.Medium)
                .fontColor('#FF1E293B')
                .margin({ left: 8 })
            }
            .width('100%')
            .alignItems(VerticalAlign.Top)

            Text('新增摄像头权限授予，优化权限的授权流程，权限管理更加丝滑简单，您可以自由使用 AI 的语音输入和视频通话功能了！')
              .fontSize(14)
              .fontColor('#FF475569')
              .lineHeight(22)
              .width('100%')
              .margin({ top: 6, left: 16 })
          }
          .width('100%')
          .margin({ bottom: 14 })

          // Closing
          Text('我们对美的追求永无止境，感谢您一路相伴。新版 ' + VERSION_NAME + ' 已就绪，迎接全新体验！')
            .fontSize(14)
            .fontColor('#FF64748B')
            .lineHeight(22)
            .width('100%')
            .margin({ top: 12 })
        }
        .width('100%')
        .padding({ right: 4 })
      }
      .width('100%')
      .height(360)
      .scrollBar(BarState.Auto)

      // Divider
      Divider()
        .width('100%')
        .color('#FFF1F5F9')
        .margin({ top: 8 })

      // Checkbox
      Row() {
        Checkbox({ name: 'dontShowAgain', group: 'updateGroup' })
          .width(20)
          .height(20)
          .select(false)
          .selectedColor('#FF3B82F6')
          .onChange((value: boolean) => {
            this.isChecked = value;
          })

        Text('当前版本不再弹出')
          .fontSize(14)
          .fontColor('#FF475569')
          .margin({ left: 8 })
      }
      .width('100%')
      .padding({ top: 12, bottom: 8 })
      .onClick(() => {
        this.isChecked = !this.isChecked;
      })

      // Confirm button
      Button() {
        Text('我知道了')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor('#FFFFFF')
      }
      .width('100%')
      .height(44)
      .backgroundColor('#FF3B82F6')
      .borderRadius(22)
      .type(ButtonType.Capsule)
      .margin({ top: 4, bottom: 8 })
      .onClick(() => {
        if (this.isChecked) {
          this.saveDismissPreference();
        }
        this.controller?.close();
      })
    }
    .width('100%')
    .padding(24)
    .backgroundColor('#FFFFFF')
    .borderRadius(20)
  }

  saveDismissPreference(): void {
    try {
      let ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
      let prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'updateDialogPrefs' });
      prefs.putSync(PREF_KEY_PREFIX + VERSION_NAME, true);
      prefs.flushSync();
    } catch (e) {
      console.error('saveDismissPreference error', JSON.stringify(e));
    }
  }
}
