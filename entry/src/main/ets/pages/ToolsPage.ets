import { router } from '@kit.ArkUI';
import { common, ConfigurationConstant } from '@kit.AbilityKit';
import { preferences } from '@kit.ArkData';
import { ToolItem, DEFAULT_AI_TOOLS, DEFAULT_SEARCH_TOOLS, CustomToolData } from '../model/ToolData';
import { ThemeHelper } from '../common/ThemeHelper';
import { photoAccessHelper } from '@kit.MediaLibraryKit';

interface CategoryInfo {
  key: string;
  name: string;
}

@Component
struct ToolsPage {
  @State currentCategory: string = 'ai';
  @State urlInput: string = '';
  @State isEditMode: boolean = false;
  @State showAddModal: boolean = false;
  @State showFavoriteModal: boolean = false;
  @State customTools: ToolItem[] = [];
  @State hiddenTools: string[] = [];
  @State isCardFocused: boolean = false;
  @State scrollOffset: number = 0;
  @State toolsOrder: Record<string, string[]> = {};
  @State dragPreviewToolName: string = '';
  @StorageLink('appTheme') appTheme: string = 'system';
  @StorageLink('currentColorMode') currentColorMode: ConfigurationConstant.ColorMode = ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;

  private categories: CategoryInfo[] = [
    { key: 'ai', name: 'AI网址导航' },
    { key: 'search', name: '搜索引擎' },
    { key: 'saved', name: '我的保存' }
  ];

  private addToolName: string = '';
  private addToolUrl: string = '';
  @State selectedIconUri: string = '';
  @State favCategory: string = 'saved';
  private scroller: Scroller = new Scroller();
  private draggedItemId: string = '';

  aboutToAppear(): void {
    this.loadCustomTools();
    this.loadHiddenTools();
    this.loadToolsOrder();
    this.updateStatusBarColor();
  }

  private updateStatusBarColor(): void {
    let appTheme: string = AppStorage.get<string>('appTheme') || 'system';
    let currentMode: ConfigurationConstant.ColorMode = ThemeHelper.getEffectiveColorMode();
    let isDark: boolean = ThemeHelper.isEffectiveDarkMode(appTheme, currentMode);
    let ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
    ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF1E293B' : '#FFFFFFFF');
  }

  loadCustomTools(): void {
    let stored: string = AppStorage.get<string>('customTools') as string;
    if (stored && stored !== '[]') {
      try {
        let data: CustomToolData[] = JSON.parse(stored);
        let tools: ToolItem[] = [];
        for (let item of data) {
          tools.push({
            id: item.id,
            name: item.name,
            url: item.url,
            icon: item.icon,
            category: item.category,
            isCustom: true
          });
        }
        this.customTools = tools;
      } catch (e) {
        this.customTools = [];
      }
    } else {
      this.customTools = [];
    }
  }

  loadHiddenTools(): void {
    let stored: string = AppStorage.get<string>('hiddenTools') as string;
    if (stored && stored !== '[]') {
      try {
        this.hiddenTools = JSON.parse(stored);
      } catch (e) {
        this.hiddenTools = [];
      }
    } else {
      this.hiddenTools = [];
    }
  }

  saveCustomTools(): void {
    let data: CustomToolData[] = [];
    for (let item of this.customTools) {
      data.push({
        id: item.id,
        name: item.name,
        url: item.url,
        icon: item.icon,
        category: item.category
      });
    }
    const json: string = JSON.stringify(data);
    AppStorage.set<string>('customTools', json);
    const ctx: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    const prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'toolData' });
    prefs.putSync('customTools', json);
    prefs.flushSync();
  }

  saveHiddenTools(): void {
    const json: string = JSON.stringify(this.hiddenTools);
    AppStorage.set<string>('hiddenTools', json);
    const ctx: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    const prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'toolData' });
    prefs.putSync('hiddenTools', json);
    prefs.flushSync();
  }

  loadToolsOrder(): void {
    let stored: string = AppStorage.get<string>('toolsOrder') as string;
    if (stored && stored !== '{}') {
      try {
        this.toolsOrder = JSON.parse(stored);
      } catch (e) {
        this.toolsOrder = {};
      }
    } else {
      this.toolsOrder = {};
    }
  }

  saveToolsOrder(): void {
    const json: string = JSON.stringify(this.toolsOrder);
    AppStorage.set<string>('toolsOrder', json);
    const ctx: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
    const prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'toolData' });
    prefs.putSync('toolsOrder', json);
    prefs.flushSync();
  }

  copyOrderRecord(source: Record<string, string[]>): Record<string, string[]> {
    let result: Record<string, string[]> = {};
    let keys: string[] = Object.keys(source);
    for (let i = 0; i < keys.length; i++) {
      let key: string = keys[i];
      let arr: string[] = [];
      for (let j = 0; j < source[key].length; j++) {
        arr.push(source[key][j]);
      }
      result[key] = arr;
    }
    return result;
  }

  reorderSwap(fromId: string, toId: string): void {
    if (fromId === toId) {
      return;
    }
    let category: string = this.currentCategory;
    let order: string[] = [];
    if (this.toolsOrder[category] && this.toolsOrder[category].length > 0) {
      for (let i = 0; i < this.toolsOrder[category].length; i++) {
        order.push(this.toolsOrder[category][i]);
      }
    } else {
      let tools: ToolItem[] = this.getToolsForCategory(category);
      for (let i = 0; i < tools.length; i++) {
        order.push(tools[i].id);
      }
    }
    let fromIdx: number = order.indexOf(fromId);
    let toIdx: number = order.indexOf(toId);
    if (fromIdx === -1 || toIdx === -1) {
      return;
    }
    let temp: string = order[fromIdx];
    order[fromIdx] = order[toIdx];
    order[toIdx] = temp;
    let newOrder: Record<string, string[]> = this.copyOrderRecord(this.toolsOrder);
    newOrder[category] = order;
    this.toolsOrder = newOrder;
    this.saveToolsOrder();
  }

  addToOrder(toolId: string): void {
    let category: string = this.currentCategory;
    let order: string[] = [];
    if (this.toolsOrder[category]) {
      for (let i = 0; i < this.toolsOrder[category].length; i++) {
        order.push(this.toolsOrder[category][i]);
      }
      if (order.indexOf(toolId) === -1) {
        order.push(toolId);
      }
    } else {
      let tools: ToolItem[] = this.getToolsForCategory(category);
      for (let i = 0; i < tools.length; i++) {
        order.push(tools[i].id);
      }
    }
    let newOrder: Record<string, string[]> = this.copyOrderRecord(this.toolsOrder);
    newOrder[category] = order;
    this.toolsOrder = newOrder;
    this.saveToolsOrder();
  }

  removeFromOrder(toolId: string): void {
    let category: string = this.currentCategory;
    if (!this.toolsOrder[category]) {
      return;
    }
    let idx: number = this.toolsOrder[category].indexOf(toolId);
    if (idx === -1) {
      return;
    }
    let newOrder: string[] = [];
    for (let i = 0; i < this.toolsOrder[category].length; i++) {
      if (i !== idx) {
        newOrder.push(this.toolsOrder[category][i]);
      }
    }
    let result: Record<string, string[]> = this.copyOrderRecord(this.toolsOrder);
    result[category] = newOrder;
    this.toolsOrder = result;
    this.saveToolsOrder();
  }

  getToolsForCategory(category: string): ToolItem[] {
    let result: ToolItem[] = [];

    if (category === 'ai') {
      for (let tool of DEFAULT_AI_TOOLS) {
        if (this.hiddenTools.indexOf(tool.id) === -1) {
          result.push(tool);
        }
      }
    } else if (category === 'search') {
      for (let tool of DEFAULT_SEARCH_TOOLS) {
        if (this.hiddenTools.indexOf(tool.id) === -1) {
          result.push(tool);
        }
      }
    }

    for (let tool of this.customTools) {
      if (tool.category === category) {
        result.push(tool);
      }
    }

    let order: string[] = this.toolsOrder[category];
    if (order && order.length > 0) {
      let sorted: ToolItem[] = [];
      for (let id of order) {
        for (let tool of result) {
          if (tool.id === id) {
            sorted.push(tool);
            break;
          }
        }
      }
      for (let tool of result) {
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
    }

    return result;
  }

  switchCategory(category: string): void {
    this.currentCategory = category;
    this.isEditMode = false;
    this.scrollOffset = 0;
    this.scroller.scrollTo({ xOffset: 0, yOffset: 0, animation: { duration: 0 } });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  openUrl(url: string, name?: string): void {
    if (this.isEditMode) {
      return;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        router.pushUrl({
          url: 'pages/WebPage',
          params: {
            url: url,
            title: name ? name : ''
          }
        });
      } catch (e) {
        console.error('openUrl error', JSON.stringify(e));
      }
    }
  }

  navigateToInputUrl(): void {
    let url: string = this.urlInput.trim();
    if (!url) {
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    this.openUrl(url);
  }

  deleteTool(toolId: string): void {
    let idx: number = this.hiddenTools.indexOf(toolId);
    if (idx === -1) {
      let newHidden: string[] = [];
      for (let h of this.hiddenTools) {
        newHidden.push(h);
      }
      newHidden.push(toolId);
      this.hiddenTools = newHidden;
      this.saveHiddenTools();
    }
    this.removeFromOrder(toolId);
  }

  deleteCustomTool(toolId: string): void {
    let newTools: ToolItem[] = [];
    for (let item of this.customTools) {
      if (item.id !== toolId) {
        newTools.push(item);
      }
    }
    this.customTools = newTools;
    this.saveCustomTools();
    this.removeFromOrder(toolId);
  }

  private async pickImage(): Promise<void> {
    try {
      let photoPicker = new photoAccessHelper.PhotoViewPicker();
      let photoSelectOptions = new photoAccessHelper.PhotoSelectOptions();
      photoSelectOptions.maxSelectNumber = 1;
      let result = await photoPicker.select(photoSelectOptions);
      if (result.photoUris && result.photoUris.length > 0) {
        this.selectedIconUri = result.photoUris[0];
      }
    } catch (e) {
      console.error('pickImage error', JSON.stringify(e));
    }
  }

  openAddModal(): void {
    this.addToolName = '';
    this.addToolUrl = '';
    this.selectedIconUri = '';
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  confirmAddTool(): void {
    let name: string = this.addToolName.trim();
    let url: string = this.addToolUrl.trim();
    if (!name || !url) {
      return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    let newTool: ToolItem = {
      id: 'custom_' + Date.now().toString(),
      name: name,
      url: url,
      icon: this.selectedIconUri,
      category: this.currentCategory,
      isCustom: true
    };
    let newTools: ToolItem[] = [];
    for (let t of this.customTools) {
      newTools.push(t);
    }
    newTools.push(newTool);
    this.customTools = newTools;
    this.saveCustomTools();
    this.addToOrder(newTool.id);
    this.showAddModal = false;
  }

  openFavoriteModal(): void {
    if (!this.urlInput.trim()) {
      return;
    }
    let url: string = this.urlInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    this.addToolUrl = url;
    this.addToolName = '';
    this.selectedIconUri = '';
    this.favCategory = 'saved';
    this.showFavoriteModal = true;
  }

  closeFavoriteModal(): void {
    this.showFavoriteModal = false;
  }

  confirmFavorite(): void {
    let name: string = this.addToolName.trim();
    let url: string = this.addToolUrl.trim();
    if (!name || !url) {
      return;
    }
    let newTool: ToolItem = {
      id: 'fav_' + Date.now().toString(),
      name: name,
      url: url,
      icon: this.selectedIconUri,
      category: this.favCategory,
      isCustom: true
    };
    let newTools: ToolItem[] = [];
    for (let t of this.customTools) {
      newTools.push(t);
    }
    newTools.push(newTool);
    this.customTools = newTools;
    this.saveCustomTools();
    this.addToOrder(newTool.id);
    this.showFavoriteModal = false;
    this.urlInput = '';
    this.currentCategory = 'saved';
  }

  getIconName(name: string): string {
    if (name.length <= 2) {
      return name;
    }
    return name.substring(0, 2);
  }

  getIconBackgroundColor(name: string): string {
    let colors: string[] = ['#3B82F6', '#059669', '#EA580C', '#7C3AED', '#0891B2', '#E11D48', '#6366F1', '#EC4899'];
    let hash: number = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  getCategoryFontColor(isSelected: boolean): ResourceColor {
    return isSelected ? ThemeHelper.getAccentColor() : $r('app.color.text_secondary');
  }

  isDarkMode(): boolean {
    return ThemeHelper.isEffectiveDarkMode(this.appTheme, this.currentColorMode);
  }

  getBlurRadius(): number {
    return Math.min(this.scrollOffset / 30, 1) * 20;
  }

  getInputBarBackground(): string {
    let alpha = 1.0 - Math.min(this.scrollOffset / 30, 1) * 0.2;
    if (this.isDarkMode()) {
      return 'rgba(30, 41, 59, ' + alpha + ')';
    }
    return 'rgba(255, 255, 255, ' + alpha + ')';
  }

  @Builder
  dragPreviewContent() {
    Column() {
      Text(this.dragPreviewToolName)
        .fontSize(14)
        .fontWeight(FontWeight.Medium)
        .fontColor(Color.White)
        .maxLines(1)
        .textOverflow({ overflow: TextOverflow.Ellipsis })
    }
    .padding(12)
    .borderRadius(12)
    .backgroundColor(ThemeHelper.getAccentColor())
  }

  @Builder
  buildToolGrid() {
    Column() {
      // Category Tabs - inside scroll
      Row() {
        ForEach(this.categories, (category: CategoryInfo) => {
          Text(category.name)
            .fontSize(14)
            .fontWeight(this.currentCategory === category.key ? FontWeight.Medium : FontWeight.Regular)
            .fontColor(this.getCategoryFontColor(this.currentCategory === category.key))
            .padding({ left: 18, right: 18, top: 8, bottom: 8 })
            .margin({ left: 4, right: 4 })
            .borderRadius(22)
            .backgroundColor(this.currentCategory === category.key ?
              ThemeHelper.getAccentLightColor() : 'rgba(255, 255, 255, 0.15)')
            .onClick(() => {
              this.switchCategory(category.key);
            })
        }, (item: CategoryInfo) => item.key)
      }
      .width('100%')
      .justifyContent(FlexAlign.Center)
      .padding({ top: 28, bottom: 28 })

      Flex({
        direction: FlexDirection.Row,
        wrap: FlexWrap.Wrap,
        justifyContent: FlexAlign.Start
      }) {
        // Render tools inline
        ForEach(this.getToolsForCategory(this.currentCategory), (tool: ToolItem) => {
          Column() {
            Stack({ alignContent: Alignment.TopEnd }) {
              if (tool.icon && tool.icon !== '') {
                if (tool.icon.startsWith('file://') || tool.icon.startsWith('content://') || tool.icon.startsWith('/')) {
                  Image(tool.icon)
                    .width(56)
                    .height(56)
                    .borderRadius(12)
                    .objectFit(ImageFit.Cover)
                    .hitTestBehavior(HitTestMode.None)
                } else {
                  Image($r('app.media.' + tool.icon))
                    .width(56)
                    .height(56)
                    .borderRadius(12)
                    .objectFit(ImageFit.Contain)
                    .hitTestBehavior(HitTestMode.None)
                }
              } else {
                Text(this.getIconName(tool.name))
                  .fontSize(20)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Color.White)
                  .width(56)
                  .height(56)
                  .borderRadius(12)
                  .backgroundColor(this.getIconBackgroundColor(tool.name))
                  .textAlign(TextAlign.Center)
              }

              if (this.isEditMode) {
                Text('×')
                  .fontSize(10)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(Color.White)
                  .width(18)
                  .height(18)
                  .backgroundColor('#DC2626')
                  .borderRadius(9)
                  .textAlign(TextAlign.Center)
                  .offset({ x: 6, y: -6 })
                  .zIndex(1)
                  .onClick(() => {
                    if (tool.isCustom) {
                      this.deleteCustomTool(tool.id);
                    } else {
                      this.deleteTool(tool.id);
                    }
                  })
              }
            }
            .width(56)
            .height(56)

            Text(tool.name)
              .fontSize(12)
              .fontColor($r('app.color.text_primary'))
              .textAlign(TextAlign.Center)
              .maxLines(1)
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .margin({ top: 4 })
          }
          .width('25%')
          .alignItems(HorizontalAlign.Center)
          .padding({ top: 12, bottom: 12 })
          .draggable(this.isEditMode)
          .onDragStart(() => {
            this.draggedItemId = tool.id;
            this.dragPreviewToolName = tool.name;
            return { builder: (): void => this.dragPreviewContent() };
          })
          .onDrop(() => {
            if (this.draggedItemId) {
              this.reorderSwap(this.draggedItemId, tool.id);
              this.draggedItemId = '';
            }
          })
          .onDragEnd(() => {
            this.draggedItemId = '';
          })
          .onClick(() => {
            if (!this.isEditMode) {
              this.openUrl(tool.url, tool.name);
            }
          })
        }, (tool: ToolItem) => tool.id)

        // Add card inline
        Column() {
          Text('+')
            .fontSize(28)
            .fontColor($r('app.color.text_secondary'))
            .width(56)
            .height(56)
            .borderRadius(12)
            .border({ width: 2, style: BorderStyle.Dashed, color: $r('app.color.border_color') })
            .textAlign(TextAlign.Center)

          Text('添加')
            .fontSize(12)
            .fontColor($r('app.color.text_primary'))
            .textAlign(TextAlign.Center)
            .margin({ top: 4 })
        }
        .width('25%')
        .alignItems(HorizontalAlign.Center)
        .padding({ top: 12, bottom: 12 })
        .onClick(() => {
          this.openAddModal();
        })
      }
      .width('100%')
      .padding({ left: 12, right: 12 })

      // Edit Button
      Button(this.isEditMode ? '完成' : '编辑')
        .fontSize(14)
        .fontWeight(FontWeight.Bold)
        .fontColor(this.isEditMode ? Color.White : $r('app.color.text_primary'))
        .backgroundColor(this.isEditMode ? ThemeHelper.getAccentColor() : 'rgba(255, 255, 255, 0.15)')
        .borderRadius(24)
        .padding({ left: 32, right: 32, top: 12, bottom: 12 })
        .margin({ top: 4, bottom: 28 })
        .shadow({ radius: 6, color: 'rgba(0, 0, 0, 0.1)', offsetY: 2 })
        .onClick(() => {
          this.toggleEditMode();
        })

      // Info Section
      Row() {
        Column() {
          Text('使用须知')
            .fontSize(12)
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 8 })

          Text('本应用仅提供第三方 AI 平台的官方链接导航，不隶属于、不代表、不授权于任何第三方平台，也不对第三方网站的内容负责。所有 AI 服务均由原平台提供，本应用为纯前端应用，无服务器，不采集、不存储、不中转用户对话内容。')
            .fontSize(11)
            .fontColor($r('app.color.text_secondary'))
            .lineHeight(22)
            .margin({ bottom: 8 })
            .width('100%')

          Text('功能特性')
            .fontSize(12)
            .fontWeight(FontWeight.Medium)
            .fontColor($r('app.color.text_primary'))
            .margin({ bottom: 8 })

          Text('· 多平台 AI 导航，一键访问主流 AI 服务\n· 支持自定义工具与收藏管理\n· 主题随心切换\n· 纯前端运行，无服务器、不中转数据\n· 鸿蒙ArkTS原生开发，沉浸式深度适配')
            .fontSize(11)
            .fontColor($r('app.color.text_secondary'))
            .lineHeight(22)
            .width('100%')
        }
        .width('100%')
        .padding(12)
        .borderRadius(12)
        .border({ width: 1, color: $r('app.color.border_color') })
      }
      .width('100%')
      .padding({ left: 48, right: 48 })
      .margin({ top: 20, bottom: 16 })
      .opacity(this.isCardFocused ? 1 : 0.45)
      .animation({ duration: 350, curve: Curve.EaseInOut, delay: 80 })
      .onClick(() => {
        this.isCardFocused = true;
      })
    }
    .width('100%')
  }

  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      // Full-height background
      Column()
        .width('100%')
        .height('100%')
        .backgroundColor($r('app.color.bg_primary'))
        .onClick(() => {
          this.isCardFocused = false;
        })

      // Scrollable content (fills full area, padding at top for title bar)
      Scroll(this.scroller) {
        Column() {
          this.buildToolGrid();
          Blank()
        }
        .width('100%')
        .constraintSize({ minHeight: '100%' })
        .padding({ top: 64 })
        .onClick(() => {
          this.isCardFocused = false;
        })
      }
      .width('100%')
      .height('100%')
      .edgeEffect(EdgeEffect.Spring)
      .scrollBar(BarState.Off)
      .padding({ bottom: 80 })
      .onScroll(() => {
        this.scrollOffset = Math.max(this.scroller.currentOffset().yOffset, 0);
      })

      // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
      Row() {
        Text('AI')
          .fontSize(14)
          .fontWeight(FontWeight.Bold)
          .fontColor(ThemeHelper.getAccentColor())
          .width(36)
          .height(36)
          .borderRadius(18)
          .backgroundColor($r('app.color.bg_card'))
          .textAlign(TextAlign.Center)

        TextInput({ placeholder: '访问网页或保存为应用' })
          .layoutWeight(1)
          .height(36)
          .fontSize(14)
          .fontColor($r('app.color.text_primary'))
          .placeholderColor($r('app.color.text_secondary'))
          .placeholderFont({ size: 14 })
          .padding({ left: 10, right: 10 })
          .margin({ left: 8 })
          .onChange((value: string) => {
            this.urlInput = value;
          })
          .onSubmit(() => {
            this.navigateToInputUrl();
          })

        Button() {
          SymbolGlyph($r('sys.symbol.arrow_right'))
            .fontSize(20)
            .fontColor([ThemeHelper.getAccentColor()])
        }
        .width(36)
        .height(36)
        .borderRadius(18)
        .backgroundColor($r('app.color.bg_card'))
        .onClick(() => {
          this.navigateToInputUrl();
        })
        .margin({ left: 4 })

        Button() {
          SymbolGlyph($r('sys.symbol.bookmark'))
            .fontSize(20)
            .fontColor([ThemeHelper.getAccentColor()])
        }
        .width(36)
        .height(36)
        .borderRadius(18)
        .backgroundColor($r('app.color.bg_card'))
        .margin({ left: 8 })
        .onClick(() => {
          this.openFavoriteModal();
        })
      }
      .width('100%')
      .padding({ left: 14, right: 14, top: 8, bottom: 12 })
      .backgroundColor(this.getInputBarBackground())
      .backdropBlur(this.getBlurRadius())

    // Add Modal - conditional, not overlay
    if (this.showAddModal) {
      Column() {
        Column() {
          Row() {
            Text('添加网站为应用')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor($r('app.color.text_primary'))

            Blank()

            Button() {
              Text('x')
                .fontSize(16)
                .fontColor($r('app.color.text_secondary'))
            }
            .width(28)
            .height(28)
            .backgroundColor($r('app.color.bg_primary'))
            .borderRadius(14)
            .onClick(() => {
              this.closeAddModal();
            })
          }
          .width('100%')
          .margin({ bottom: 12 })

          Column() {
            Text('名称')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 4 })

            TextInput({ placeholder: '例如：APPname' })
              .height(40)
              .fontSize(14)
              .borderRadius(10)
              .border({ width: 1, color: $r('app.color.border_color') })
              .padding({ left: 12 })
              .onChange((value: string) => {
                this.addToolName = value;
              })
          }
          .width('100%')
          .margin({ bottom: 10 })

          Column() {
            Text('网址（请以https://格式开头）')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 4 })

            TextInput({ placeholder: '例如：https://example.com' })
              .height(40)
              .fontSize(14)
              .borderRadius(10)
              .border({ width: 1, color: $r('app.color.border_color') })
              .padding({ left: 12 })
              .onChange((value: string) => {
                this.addToolUrl = value;
              })
          }
          .width('100%')
          .margin({ bottom: 10 })

          Column() {
            Text('图标(可选)')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 4 })

            Column() {
                if (this.selectedIconUri) {
                  Column() {
                    Stack() {
                      Image(this.selectedIconUri)
                        .width(64)
                        .height(64)
                        .borderRadius(12)
                        .objectFit(ImageFit.Cover)

                      Button() {
                        SymbolGlyph($r('sys.symbol.xmark'))
                          .fontSize(12)
                          .fontColor([Color.White])
                      }
                      .width(20)
                      .height(20)
                      .borderRadius(10)
                      .backgroundColor('rgba(0,0,0,0.5)')
                      .position({ x: '100%', y: 0 })
                      .offset({ x: -6, y: -6 })
                      .onClick(() => {
                        this.selectedIconUri = '';
                      })
                    }
                    .width(64)
                    .height(64)

                    Text('已选择')
                      .fontSize(11)
                      .fontColor(ThemeHelper.getAccentColor())
                      .margin({ top: 4 })
                  }
                } else {
                Column() {
                  Text('+')
                    .fontSize(24)
                    .fontColor($r('app.color.text_secondary'))
                  Text('点击上传图片')
                    .fontSize(11)
                    .fontColor($r('app.color.text_secondary'))
                    .margin({ top: 2 })
                }
                .width('100%')
                .height(72)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .border({ width: 2, style: BorderStyle.Dashed, color: $r('app.color.border_color') })
                .borderRadius(12)
                .onClick(() => {
                  this.pickImage();
                })
              }
            }
            .width('100%')
            .alignItems(HorizontalAlign.Center)
          }
          .width('100%')
          .margin({ bottom: 16 })

          Row() {
            Button('取消')
              .flexGrow(1)
              .height(40)
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .backgroundColor($r('app.color.bg_primary'))
              .borderRadius(10)
              .onClick(() => {
                this.closeAddModal();
              })

            Button('添加')
              .flexGrow(1)
              .height(40)
              .fontSize(14)
              .fontColor(ThemeHelper.getAccentColor())
              .backgroundColor($r('app.color.bg_card'))
              .borderRadius(10)
              .border({ width: 1, color: ThemeHelper.getAccentColor() })
              .shadow({ radius: 4, color: ThemeHelper.getAccentShadow(), offsetY: 2 })
              .onClick(() => {
                this.confirmAddTool();
              })
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)
        }
        .width('85%')
        .padding(16)
        .backgroundColor($r('app.color.bg_card'))
        .borderRadius(16)
        .shadow({ radius: 16, color: 'rgba(0, 0, 0, 0.15)', offsetY: 8 })
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor('rgba(0, 0, 0, 0.4)')
      .position({ x: 0, y: 0 })
      .zIndex(100)
    }

    // Favorite Modal - conditional, not overlay
    if (this.showFavoriteModal) {
      Column() {
        Column() {
          Row() {
            Text('保存网站为应用')
              .fontSize(16)
              .fontWeight(FontWeight.Bold)
              .fontColor($r('app.color.text_primary'))

            Blank()

            Button() {
              SymbolGlyph($r('sys.symbol.xmark'))
                .fontSize(20)
                .fontColor([$r('app.color.text_secondary')])
            }
            .width(36)
            .height(36)
            .backgroundColor(Color.Transparent)
            .borderRadius(18)
            .onClick(() => {
              this.closeFavoriteModal();
            })
          }
          .width('100%')
          .margin({ bottom: 12 })

          Column() {
            Text('网站名称')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 4 })

            TextInput({ placeholder: '输入网站名称' })
              .height(40)
              .fontSize(14)
              .borderRadius(10)
              .border({ width: 1, color: $r('app.color.border_color') })
              .padding({ left: 12 })
              .onChange((value: string) => {
                this.addToolName = value;
              })
          }
          .width('100%')
          .margin({ bottom: 10 })

          Column() {
            Text('网址')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 4 })

            Text(this.addToolUrl)
              .width('100%')
              .height(40)
              .fontSize(14)
              .borderRadius(10)
              .border({ width: 1, color: $r('app.color.border_color') })
              .padding({ left: 12 })
              .fontColor($r('app.color.text_primary'))
          }
          .width('100%')
          .margin({ bottom: 10 })

          Column() {
            Text('分类')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 6 })

            Column() {
              ForEach(this.categories, (cat: CategoryInfo) => {
                Row() {
                  Radio({ value: cat.key, group: 'favCatGroup' })
                    .checked(this.favCategory === cat.key)
                    .width(20)
                    .height(20)
                  Text(cat.name)
                    .fontSize(14)
                    .fontColor($r('app.color.text_primary'))
                    .margin({ left: 8 })
                }
                .width('100%')
                .height(40)
                .padding({ left: 4 })
                .onClick(() => {
                  this.favCategory = cat.key;
                })
              })
            }
            .width('100%')
            .padding(8)
            .backgroundColor($r('app.color.bg_primary'))
            .borderRadius(10)
            .border({ width: 1, color: $r('app.color.border_color') })
          }
          .width('100%')
          .margin({ bottom: 10 })

          Column() {
            Text('图标(可选)')
              .fontSize(13)
              .fontWeight(FontWeight.Medium)
              .fontColor($r('app.color.text_primary'))
              .margin({ bottom: 4 })

            Column() {
                if (this.selectedIconUri) {
                  Column() {
                    Stack() {
                      Image(this.selectedIconUri)
                        .width(64)
                        .height(64)
                        .borderRadius(12)
                        .objectFit(ImageFit.Cover)

                      Button() {
                        SymbolGlyph($r('sys.symbol.xmark'))
                          .fontSize(12)
                          .fontColor([Color.White])
                      }
                      .width(20)
                      .height(20)
                      .borderRadius(10)
                      .backgroundColor('rgba(0,0,0,0.5)')
                      .position({ x: '100%', y: 0 })
                      .offset({ x: -6, y: -6 })
                      .onClick(() => {
                        this.selectedIconUri = '';
                      })
                    }
                    .width(64)
                    .height(64)

                    Text('已选择')
                      .fontSize(11)
                      .fontColor(ThemeHelper.getAccentColor())
                      .margin({ top: 4 })
                  }
                } else {
                Column() {
                  Text('+')
                    .fontSize(24)
                    .fontColor($r('app.color.text_secondary'))
                  Text('点击上传图片')
                    .fontSize(11)
                    .fontColor($r('app.color.text_secondary'))
                    .margin({ top: 2 })
                }
                .width('100%')
                .height(72)
                .justifyContent(FlexAlign.Center)
                .alignItems(HorizontalAlign.Center)
                .border({ width: 2, style: BorderStyle.Dashed, color: $r('app.color.border_color') })
                .borderRadius(12)
                .onClick(() => {
                  this.pickImage();
                })
              }
            }
            .width('100%')
            .alignItems(HorizontalAlign.Center)
          }
          .width('100%')
          .margin({ bottom: 16 })

          Row() {
            Button('取消')
              .flexGrow(1)
              .height(40)
              .fontSize(14)
              .fontColor($r('app.color.text_secondary'))
              .backgroundColor($r('app.color.bg_primary'))
              .borderRadius(10)
              .onClick(() => {
                this.closeFavoriteModal();
              })

            Button('收藏')
              .flexGrow(1)
              .height(40)
              .fontSize(14)
              .fontColor(ThemeHelper.getAccentColor())
              .backgroundColor($r('app.color.bg_card'))
              .borderRadius(10)
              .border({ width: 1, color: ThemeHelper.getAccentColor() })
              .shadow({ radius: 4, color: ThemeHelper.getAccentShadow(), offsetY: 2 })
              .onClick(() => {
                this.confirmFavorite();
              })
          }
          .width('100%')
          .alignItems(VerticalAlign.Center)
        }
        .width('85%')
        .padding(16)
        .backgroundColor($r('app.color.bg_card'))
        .borderRadius(16)
        .shadow({ radius: 16, color: 'rgba(0, 0, 0, 0.15)', offsetY: 8 })
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor('rgba(0, 0, 0, 0.4)')
      .position({ x: 0, y: 0 })
      .zIndex(100)
    }
    }
    .width('100%')
    .height('100%')
  }
}

export default ToolsPage;
