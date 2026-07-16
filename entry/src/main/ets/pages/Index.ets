import ToolsPage from './ToolsPage';
import ConvertPage from './ConvertPage';
import SettingsPage from './SettingsPage';
import {
  HdsNavigation,
  HdsTabs,
  HdsTabsController,
  hdsMaterial
} from '@kit.UIDesignKit';
import { common, ConfigurationConstant } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';
import { SymbolGlyphModifier, curves } from '@kit.ArkUI';
import { ThemeHelper } from '../common/ThemeHelper';
import { UpdateDialog } from '../common/UpdateDialog';

@Entry
@Component
struct Index {
  @State currentTabIndex: number = 0;
  @State showTabBar: boolean = true;
  @StorageLink('appColorTheme') appColorTheme: string = 'blue';
  private tabsController: HdsTabsController = new HdsTabsController();
  private updateDialogController: CustomDialogController | null = null;

  aboutToAppear(): void {
    this.checkUpdateDialog();
  }

  private checkUpdateDialog(): void {
    let ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
    try {
      let prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'updateDialogPrefs' });
      let dismissed: boolean = prefs.getSync('update_dialog_dismissed_11.0.0', false) as boolean;
      if (!dismissed) {
        this.updateDialogController = new CustomDialogController({
          builder: UpdateDialog(),
          autoCancel: false
        });
        this.updateDialogController.open();
      }
    } catch (e) {
      console.error('checkUpdateDialog error', JSON.stringify(e));
    }
  }

  private getAccentColor(): string {
    const colorMap: Record<string, string> = {
      'blue': '#3B82F6',
      'green': '#059669',
      'orange': '#EA580C',
      'purple': '#7C3AED',
      'cyan': '#0891B2',
      'rose': '#E11D48'
    };
    return colorMap[this.appColorTheme] || '#3B82F6';
  }

  onPageShow(): void {
    this.updateStatusBarForCurrentTab();
  }

  private updateStatusBarForCurrentTab(): void {
    let appTheme: string = AppStorage.get<string>('appTheme') || 'system';
    let currentMode: ConfigurationConstant.ColorMode = ThemeHelper.getEffectiveColorMode();
    let isDark: boolean = ThemeHelper.isEffectiveDarkMode(appTheme, currentMode);
    let ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;

    if (this.currentTabIndex === 0) {
      ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF1E293B' : '#FFFFFFFF');
    } else if (this.currentTabIndex === 1) {
      ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF1E293B' : '#FFFFFFFF');
    } else {
      ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF0F172A' : '#FFF8FAFC');
    }
  }

  private getPageTransition(): TransitionEffect {
    return TransitionEffect.asymmetric(
      TransitionEffect.translate({ x: 0, y: -30 })
        .combine(TransitionEffect.OPACITY)
        .animation({ curve: curves.springMotion(0.65, 1.0) }),
      TransitionEffect.OPACITY
    );
  }

  build() {
    HdsNavigation() {
      HdsTabs({ controller: this.tabsController }) {
        TabContent() {
          Stack() {
            if (this.currentTabIndex === 0) {
              ToolsPage()
                .transition(this.getPageTransition())
            }
          }
          .width('100%')
          .height('100%')
        }
        .tabBar(new BottomTabBarStyle({
          normal: new SymbolGlyphModifier($r('sys.symbol.application_develop_fill'))
            .fontColor([$r('sys.color.ohos_id_color_bottom_tab_icon_off')]),
          selected: new SymbolGlyphModifier($r('sys.symbol.application_develop_fill'))
            .fontColor([this.getAccentColor()])
        }, '工具集')
          .labelStyle({ selectedColor: this.getAccentColor() }))

        TabContent() {
          Stack() {
            if (this.currentTabIndex === 1) {
              ConvertPage()
                .transition(this.getPageTransition())
            }
          }
          .width('100%')
          .height('100%')
        }
        .tabBar(new BottomTabBarStyle({
          normal: new SymbolGlyphModifier($r('sys.symbol.doc_text'))
            .fontColor([$r('sys.color.ohos_id_color_bottom_tab_icon_off')]),
          selected: new SymbolGlyphModifier($r('sys.symbol.doc_text'))
            .fontColor([this.getAccentColor()])
        }, '文本转换')
          .labelStyle({ selectedColor: this.getAccentColor() }))

        TabContent() {
          Stack() {
            if (this.currentTabIndex === 2) {
              SettingsPage()
                .transition(this.getPageTransition())
            }
          }
          .width('100%')
          .height('100%')
        }
        .tabBar(new BottomTabBarStyle({
          normal: new SymbolGlyphModifier($r('sys.symbol.gearshape'))
            .fontColor([$r('sys.color.ohos_id_color_bottom_tab_icon_off')]),
          selected: new SymbolGlyphModifier($r('sys.symbol.gearshape'))
            .fontColor([this.getAccentColor()])
        }, '设置')
          .labelStyle({ selectedColor: this.getAccentColor() }))
      }
      .barOverlap(true)
      .vertical(false)
      .barPosition(BarPosition.End)
      .scrollable(false)
      .animationDuration(0)
      .onChange((index: number) => {
        this.currentTabIndex = index;
        this.updateStatusBarForCurrentTab();
      })
      .barHeight(this.showTabBar ? 56 : 0)
      .barFloatingStyle(this.showTabBar ? {
        barBottomMargin: 28,
        systemMaterialEffect: {
          materialType: hdsMaterial.MaterialType.IMMERSIVE,
          materialLevel: hdsMaterial.MaterialLevel.EXQUISITE
        }
      } : undefined)
    }
    .mode(NavigationMode.Stack)
    .hideBackButton(true)
    .hideTitleBar(true)
    .ignoreLayoutSafeArea([LayoutSafeAreaType.SYSTEM], [LayoutSafeAreaEdge.BOTTOM])
  }
}
