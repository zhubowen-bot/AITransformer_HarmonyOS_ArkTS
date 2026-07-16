import { webview } from '@kit.ArkWeb';
import { router, window } from '@kit.ArkUI';
import { deviceInfo } from '@kit.BasicServicesKit';
import { abilityAccessCtrl, common, ConfigurationConstant } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { DEFAULT_AI_TOOLS, DEFAULT_SEARCH_TOOLS, CustomToolData } from '../model/ToolData';
import { ThemeHelper } from '../common/ThemeHelper';

interface DropdownTool {
  id: string;
  name: string;
  url: string;
}

interface DropdownCategory {
  name: string;
  tools: DropdownTool[];
}

@Entry
@Component
struct WebPage {
  @State currentUrl: string = '';
  @State pageTitle: string = '';
  @State isLoading: boolean = true;
  @State canGoBack: boolean = false;
  @State canGoForward: boolean = false;
  @State showDropdown: boolean = false;
  @State bottomSafeArea: number = 0;
  @StorageLink('appTheme') @Watch('onThemeChanged') appTheme: string = 'system';
  @StorageProp('currentColorMode') @Watch('onThemeChanged') currentColorMode: ConfigurationConstant.ColorMode =
    ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
  @State webDarkMode: WebDarkMode = WebDarkMode.Off;
  @State webBgColor: ResourceColor = Color.White;
  @State navBarColor: ResourceColor = $r('app.color.bg_primary');

  private controller: webview.WebviewController = new webview.WebviewController();
  private isMobileDevice: boolean = false;
  private dropdownCategories: DropdownCategory[] = [];

  async aboutToAppear(): Promise<void> {
    this.isMobileDevice = this.checkIsMobileDevice();
    this.loadDropdownTools();

    let params: Record<string, string> = router.getParams() as Record<string, string>;
    if (params) {
      let urlValue: string = params['url'];
      let titleValue: string = params['title'];
      if (urlValue) {
        this.currentUrl = urlValue;
      }
      if (titleValue) {
        this.pageTitle = titleValue;
      }
    }
    this.onThemeChanged();
    this.requestMediaPermissions();

    // Preconnect current URL domain to speed up initial page load
    if (this.currentUrl) {
      try {
        webview.WebviewController.prepareForPageLoad(this.currentUrl, true, 2);
      } catch (e) {
        console.error('prepareForPageLoad error', this.currentUrl, JSON.stringify(e));
      }
    }

    // 获取底部导航条高度，让 Web 页面延伸到底部安全区
    try {
      let mainWindow: window.Window = await window.getLastWindow(getContext(this) as common.UIAbilityContext);
      let avoidArea: window.AvoidArea = mainWindow.getWindowAvoidArea(window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR);
      this.bottomSafeArea = px2vp(avoidArea.bottomRect.height);
    } catch (e) {
      console.error('getWindowAvoidArea error', JSON.stringify(e));
    }

    // 设置状态栏背景色与页面顶部颜色一致
    let effectiveMode: ConfigurationConstant.ColorMode = this.currentColorMode;
    if (effectiveMode === ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
      effectiveMode = ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
    }
    let isDark: boolean = ThemeHelper.isEffectiveDarkMode(this.appTheme, effectiveMode);
    ThemeHelper.setStatusBarColor(getContext(this) as common.UIAbilityContext, isDark ? '#FF000000' : '#FFF8FAFC');
  }

  requestMediaPermissions(): void {
    try {
      let atManager: abilityAccessCtrl.AtManager = abilityAccessCtrl.createAtManager();
      let context: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
      atManager.requestPermissionsFromUser(context, ['ohos.permission.MICROPHONE', 'ohos.permission.CAMERA'])
        .then((data) => {
          console.info('Permission request result:' + JSON.stringify(data));
        })
        .catch((error: BusinessError) => {
          console.error('Permission request failed, code:' + error.code + ', message:' + error.message);
        });
    } catch (e) {
      console.error('requestMediaPermissions error', JSON.stringify(e));
    }
  }

  checkIsMobileDevice(): boolean {
    let deviceType: string = deviceInfo.deviceType;
    return deviceType === 'phone' || deviceType === 'tablet';
  }

  onThemeChanged(): void {
    let effectiveMode: ConfigurationConstant.ColorMode = this.currentColorMode;
    if (effectiveMode === ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
      effectiveMode = ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
    }
    let isDark: boolean = ThemeHelper.isEffectiveDarkMode(this.appTheme, effectiveMode);
    this.webDarkMode = isDark ? WebDarkMode.On : WebDarkMode.Off;
    this.webBgColor = isDark ? Color.Black : Color.White;
    this.navBarColor = isDark ? Color.Black : $r('app.color.bg_primary');
    ThemeHelper.setStatusBarColor(getContext(this) as common.UIAbilityContext, isDark ? '#FF000000' : '#FFF8FAFC');
  }

  loadDropdownTools(): void {
    // Read current state from AppStorage
    let hiddenStr: string = AppStorage.get<string>('hiddenTools') as string;
    let hiddenTools: string[] = [];
    if (hiddenStr && hiddenStr !== '[]') {
      try {
        hiddenTools = JSON.parse(hiddenStr);
      } catch (e) {
        hiddenTools = [];
      }
    }

    let toolsOrderStr: string = AppStorage.get<string>('toolsOrder') as string;
    let toolsOrder: Record<string, string[]> = {};
    if (toolsOrderStr && toolsOrderStr !== '{}') {
      try {
        toolsOrder = JSON.parse(toolsOrderStr);
      } catch (e) {
        toolsOrder = {};
      }
    }

    let customStr: string = AppStorage.get<string>('customTools') as string;
    let customTools: CustomToolData[] = [];
    if (customStr && customStr !== '[]') {
      try {
        customTools = JSON.parse(customStr);
      } catch (e) {
        customTools = [];
      }
    }

    let applyOrder = (tools: DropdownTool[], order: string[]): DropdownTool[] => {
      if (!order || order.length === 0) {
        return tools;
      }
      let sorted: DropdownTool[] = [];
      for (let id of order) {
        for (let tool of tools) {
          if (tool.id === id) {
            sorted.push(tool);
            break;
          }
        }
      }
      for (let tool of tools) {
        let found: boolean = false;
        for (let s of sorted) {
          if (s.id === tool.id) {
            found = true;
            break;
          }
        }
        if (!found) {
          sorted.push(tool);
        }
      }
      return sorted;
    };

    let categories: DropdownCategory[] = [];

    // AI tools
    let aiTools: DropdownTool[] = [];
    for (let tool of DEFAULT_AI_TOOLS) {
      if (hiddenTools.indexOf(tool.id) === -1) {
        aiTools.push({ id: tool.id, name: tool.name, url: tool.url });
      }
    }
    for (let item of customTools) {
      if (item.category === 'ai') {
        aiTools.push({ id: item.id, name: item.name, url: item.url });
      }
    }
    aiTools = applyOrder(aiTools, toolsOrder['ai']);
    if (aiTools.length > 0) {
      categories.push({ name: 'AI网址导航', tools: aiTools });
    }

    // Search tools
    let searchTools: DropdownTool[] = [];
    for (let tool of DEFAULT_SEARCH_TOOLS) {
      if (hiddenTools.indexOf(tool.id) === -1) {
        searchTools.push({ id: tool.id, name: tool.name, url: tool.url });
      }
    }
    for (let item of customTools) {
      if (item.category === 'search') {
        searchTools.push({ id: item.id, name: item.name, url: item.url });
      }
    }
    searchTools = applyOrder(searchTools, toolsOrder['search']);
    if (searchTools.length > 0) {
      categories.push({ name: '搜索引擎', tools: searchTools });
    }

    // Saved tools
    let savedTools: DropdownTool[] = [];
    for (let item of customTools) {
      if (item.category === 'saved') {
        savedTools.push({ id: item.id, name: item.name, url: item.url });
      }
    }
    savedTools = applyOrder(savedTools, toolsOrder['saved']);
    if (savedTools.length > 0) {
      categories.push({ name: '我的保存', tools: savedTools });
    }

    this.dropdownCategories = categories;
  }

  setMobileUserAgent(): void {
    if (this.isMobileDevice) {
      try {
        let mobileUA: string = 'Mozilla/5.0 (Linux; Android 12; HarmonyOS) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';
        this.controller.setCustomUserAgent(mobileUA);
      } catch (e) {
        console.error('setCustomUserAgent error', JSON.stringify(e));
      }
    }
  }

  closeWebPage(): void {
    router.back();
  }

  goBack(): void {
    if (this.controller.accessStep(-1)) {
      this.controller.backward();
      this.canGoBack = this.controller.accessStep(-1);
      this.canGoForward = this.controller.accessStep(1);
    }
  }

  goForward(): void {
    if (this.controller.accessStep(1)) {
      this.controller.forward();
      this.canGoBack = this.controller.accessStep(-1);
      this.canGoForward = this.controller.accessStep(1);
    }
  }

  refreshPage(): void {
    this.controller.refresh();
  }

  switchToTool(url: string, name: string): void {
    this.showDropdown = false;
    if (url === this.currentUrl) {
      return;
    }
    this.pageTitle = name;
    this.currentUrl = url;
    this.isLoading = true;
    this.controller.loadUrl(url);
  }

  getAllDropdownTools(): DropdownTool[] {
    let allTools: DropdownTool[] = [];
    for (let category of this.dropdownCategories) {
      for (let tool of category.tools) {
        allTools.push(tool);
      }
    }
    return allTools;
  }

  prefetchTools(urls: string[]): void {
    for (let url of urls) {
      try {
        this.controller.prefetchPage(url);
      } catch (e) {
        console.error('prefetchPage error', url, JSON.stringify(e));
      }
    }
  }

  prefetchNextTools(count: number): void {
    let allTools: DropdownTool[] = this.getAllDropdownTools();
    if (allTools.length === 0) {
      return;
    }

    let currentIndex: number = -1;
    for (let i = 0; i < allTools.length; i++) {
      if (allTools[i].url === this.currentUrl) {
        currentIndex = i;
        break;
      }
    }

    let urls: string[] = [];
    for (let i = 1; i <= count; i++) {
      let idx: number = currentIndex >= 0 ? (currentIndex + i) % allTools.length : i - 1;
      let tool: DropdownTool = allTools[idx];
      if (tool && tool.url !== this.currentUrl) {
        let exists: boolean = false;
        for (let u of urls) {
          if (u === tool.url) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          urls.push(tool.url);
        }
      }
    }
    this.prefetchTools(urls);
  }

  prefetchDropdownTools(): void {
    let allTools: DropdownTool[] = this.getAllDropdownTools();
    let urls: string[] = [];
    let limit: number = 5;
    let added: number = 0;
    for (let tool of allTools) {
      if (tool.url !== this.currentUrl) {
        urls.push(tool.url);
        added++;
        if (added >= limit) {
          break;
        }
      }
    }
    this.prefetchTools(urls);
  }

  aboutToDisappear(): void {
    try {
      webview.WebCookieManager.saveCookieAsync();
    } catch (e) {
      console.error('saveCookieAsync error', JSON.stringify(e));
    }
  }

  build() {
    Column() {
      // Top Navigation Bar
      Row() {
        // Back button
        Button() {
          SymbolGlyph($r('sys.symbol.arrow_left'))
            .fontSize(17)
            .fontColor([this.canGoBack ? $r('app.color.text_primary') : $r('app.color.disabled_color')])
        }
        .width(28)
        .height(28)
        .backgroundColor(Color.Transparent)
        .borderRadius(14)
        .enabled(this.canGoBack)
        .onClick(() => {
          this.goBack();
        })
        .margin({ left: 4 })

        // Forward button
        Button() {
          SymbolGlyph($r('sys.symbol.arrow_right'))
            .fontSize(17)
            .fontColor([this.canGoForward ? $r('app.color.text_primary') : $r('app.color.disabled_color')])
        }
        .width(28)
        .height(28)
        .backgroundColor(Color.Transparent)
        .borderRadius(14)
        .enabled(this.canGoForward)
        .onClick(() => {
          this.goForward();
        })
        .margin({ left: 4 })

        // Title + Dropdown button
        Column() {
          Text(this.pageTitle)
            .fontSize(14)
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))
            .maxLines(1)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
        }
        .layoutWeight(1)
        .alignItems(HorizontalAlign.Center)
        .margin({ left: 8, right: 8 })

        // Quick switch button
        Button() {
          SymbolGlyph(this.showDropdown ? $r('sys.symbol.chevron_up') : $r('sys.symbol.chevron_down'))
            .fontSize(17)
            .fontColor([$r('app.color.text_secondary')])
        }
        .width(28)
        .height(28)
        .backgroundColor(Color.Transparent)
        .borderRadius(14)
        .onClick(() => {
          this.showDropdown = !this.showDropdown;
          if (this.showDropdown) {
            this.loadDropdownTools();
            this.prefetchDropdownTools();
          }
        })

        // Refresh button
        Button() {
          SymbolGlyph($r('sys.symbol.arrow_clockwise'))
            .fontSize(17)
            .fontColor([$r('app.color.text_primary')])
        }
        .width(28)
        .height(28)
        .backgroundColor(Color.Transparent)
        .borderRadius(14)
        .onClick(() => {
          this.refreshPage();
        })
        .margin({ left: 4 })
      }
      .width('100%')
      .padding({ left: 8, right: 8, top: 4, bottom: 4 })
      .backgroundColor(this.navBarColor)
      .border({ width: { bottom: 1 }, color: $r('app.color.border_color') })

      // Dropdown Menu
      if (this.showDropdown) {
        Column() {
          Scroll() {
            Column() {
              ForEach(this.dropdownCategories, (category: DropdownCategory) => {
                // Category title
                Text(category.name)
                  .fontSize(12)
                  .fontWeight(FontWeight.Bold)
                  .fontColor($r('app.color.text_secondary'))
                  .width('100%')
                  .padding({ left: 16, top: 10, bottom: 4 })

                // Tools in category
                ForEach(category.tools, (tool: DropdownTool) => {
                  Row() {
                    Text(tool.name)
            .fontSize(14)
                      .fontColor(tool.url === this.currentUrl ? ThemeHelper.getAccentColor() : $r('app.color.text_primary'))
                      .fontWeight(tool.url === this.currentUrl ? FontWeight.Medium : FontWeight.Regular)

                    Blank()

                    if (tool.url === this.currentUrl) {
                      Text('当前')
                        .fontSize(11)
                        .fontColor(ThemeHelper.getAccentColor())
                        .backgroundColor(ThemeHelper.getAccentLightColor())
                        .borderRadius(8)
.padding({ left: 8, right: 8, top: 4, bottom: 4 })
                    }
                  }
                  .width('100%')
                  .padding({ left: 16, right: 16, top: 8, bottom: 8 })
                  .borderRadius(8)
                  .backgroundColor(tool.url === this.currentUrl ?
                    ThemeHelper.getAccentLightColor() : $r('app.color.bg_card'))
                  .onClick(() => {
                    this.switchToTool(tool.url, tool.name);
                  })
                }, (tool: DropdownTool) => tool.id)
              }, (category: DropdownCategory) => category.name)
            }
            .width('100%')
            .padding({ bottom: 8 })
          }
          .layoutWeight(1)
          .width('100%')
        }
        .width('100%')
        .height(300)
        .backgroundColor($r('app.color.bg_card'))
        .borderRadius({ bottomLeft: 12, bottomRight: 12 })
        .shadow({ radius: 8, color: 'rgba(0,0,0,0.1)', offsetY: 4 })
        .position({ x: 0, y: 0 })
        .zIndex(10)
      }

      // WebView Container
      Stack() {
        Web({ src: this.currentUrl, controller: this.controller })
          .layoutWeight(1)
          .width('100%')
          .domStorageAccess(true)
          .javaScriptAccess(true)
          .onlineImageAccess(true)
          .imageAccess(true)
          .fileAccess(true)
          .databaseAccess(true)
          .mixedMode(MixedMode.All)
          .horizontalScrollBarAccess(false)
          .verticalScrollBarAccess(false)
          .backgroundColor(this.webBgColor)
          .darkMode(this.webDarkMode)
          .forceDarkAccess(this.webDarkMode === WebDarkMode.On)
          .margin({ bottom: -this.bottomSafeArea })
          .onClick(() => {
            if (this.showDropdown) {
              this.showDropdown = false;
            }
          })
          .onControllerAttached(() => {
            this.setMobileUserAgent();
          })
          .onPermissionRequest((event) => {
            if (event) {
              event.request.grant(event.request.getAccessibleResource());
            }
          })
          .onPageBegin((event) => {
            if (event) {
              this.isLoading = true;
            }
          })
          .onPageEnd(() => {
            this.isLoading = false;
            this.canGoBack = this.controller.accessStep(-1);
            this.canGoForward = this.controller.accessStep(1);
            this.prefetchNextTools(3);
          })
          .onErrorReceive((event) => {
            if (event) {
              this.isLoading = false;
            }
          })
          .onRenderExited(() => {
            this.controller.loadUrl(this.currentUrl);
          })
      }
      .layoutWeight(1)
      .width('100%')
    }
    .width('100%')
    .height('100%')
    .backgroundColor($r('app.color.bg_primary'))
  }
}
