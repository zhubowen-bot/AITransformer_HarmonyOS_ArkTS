if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface WebPage_Params {
    currentUrl?: string;
    pageTitle?: string;
    isLoading?: boolean;
    canGoBack?: boolean;
    canGoForward?: boolean;
    showDropdown?: boolean;
    bottomSafeArea?: number;
    appTheme?: string;
    currentColorMode?: ConfigurationConstant.ColorMode;
    webDarkMode?: WebDarkMode;
    webBgColor?: ResourceColor;
    navBarColor?: ResourceColor;
    controller?: webview.WebviewController;
    isMobileDevice?: boolean;
    dropdownCategories?: DropdownCategory[];
}
import webview from "@ohos:web.webview";
import router from "@ohos:router";
import window from "@ohos:window";
import deviceInfo from "@ohos:deviceInfo";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type common from "@ohos:app.ability.common";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import type { BusinessError } from "@ohos:base";
import { DEFAULT_AI_TOOLS, DEFAULT_SEARCH_TOOLS } from "@bundle:com.aitransformer.bowenapp/entry/ets/model/ToolData";
import type { CustomToolData } from "@bundle:com.aitransformer.bowenapp/entry/ets/model/ToolData";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
interface DropdownTool {
    id: string;
    name: string;
    url: string;
}
interface DropdownCategory {
    name: string;
    tools: DropdownTool[];
}
class WebPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUrl = new ObservedPropertySimplePU('', this, "currentUrl");
        this.__pageTitle = new ObservedPropertySimplePU('', this, "pageTitle");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__canGoBack = new ObservedPropertySimplePU(false, this, "canGoBack");
        this.__canGoForward = new ObservedPropertySimplePU(false, this, "canGoForward");
        this.__showDropdown = new ObservedPropertySimplePU(false, this, "showDropdown");
        this.__bottomSafeArea = new ObservedPropertySimplePU(0, this, "bottomSafeArea");
        this.__appTheme = this.createStorageLink('appTheme', 'system', "appTheme");
        this.__currentColorMode = this.createStorageProp('currentColorMode', ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT, "currentColorMode");
        this.__webDarkMode = new ObservedPropertySimplePU(WebDarkMode.Off, this, "webDarkMode");
        this.__webBgColor = new ObservedPropertyObjectPU(Color.White, this, "webBgColor");
        this.__navBarColor = new ObservedPropertyObjectPU({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }, this, "navBarColor");
        this.controller = new webview.WebviewController();
        this.isMobileDevice = false;
        this.dropdownCategories = [];
        this.setInitiallyProvidedValue(params);
        this.declareWatch("appTheme", this.onThemeChanged);
        this.declareWatch("currentColorMode", this.onThemeChanged);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: WebPage_Params) {
        if (params.currentUrl !== undefined) {
            this.currentUrl = params.currentUrl;
        }
        if (params.pageTitle !== undefined) {
            this.pageTitle = params.pageTitle;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.canGoBack !== undefined) {
            this.canGoBack = params.canGoBack;
        }
        if (params.canGoForward !== undefined) {
            this.canGoForward = params.canGoForward;
        }
        if (params.showDropdown !== undefined) {
            this.showDropdown = params.showDropdown;
        }
        if (params.bottomSafeArea !== undefined) {
            this.bottomSafeArea = params.bottomSafeArea;
        }
        if (params.webDarkMode !== undefined) {
            this.webDarkMode = params.webDarkMode;
        }
        if (params.webBgColor !== undefined) {
            this.webBgColor = params.webBgColor;
        }
        if (params.navBarColor !== undefined) {
            this.navBarColor = params.navBarColor;
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.isMobileDevice !== undefined) {
            this.isMobileDevice = params.isMobileDevice;
        }
        if (params.dropdownCategories !== undefined) {
            this.dropdownCategories = params.dropdownCategories;
        }
    }
    updateStateVars(params: WebPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUrl.purgeDependencyOnElmtId(rmElmtId);
        this.__pageTitle.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__canGoBack.purgeDependencyOnElmtId(rmElmtId);
        this.__canGoForward.purgeDependencyOnElmtId(rmElmtId);
        this.__showDropdown.purgeDependencyOnElmtId(rmElmtId);
        this.__bottomSafeArea.purgeDependencyOnElmtId(rmElmtId);
        this.__appTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__currentColorMode.purgeDependencyOnElmtId(rmElmtId);
        this.__webDarkMode.purgeDependencyOnElmtId(rmElmtId);
        this.__webBgColor.purgeDependencyOnElmtId(rmElmtId);
        this.__navBarColor.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUrl.aboutToBeDeleted();
        this.__pageTitle.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__canGoBack.aboutToBeDeleted();
        this.__canGoForward.aboutToBeDeleted();
        this.__showDropdown.aboutToBeDeleted();
        this.__bottomSafeArea.aboutToBeDeleted();
        this.__appTheme.aboutToBeDeleted();
        this.__currentColorMode.aboutToBeDeleted();
        this.__webDarkMode.aboutToBeDeleted();
        this.__webBgColor.aboutToBeDeleted();
        this.__navBarColor.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentUrl: ObservedPropertySimplePU<string>;
    get currentUrl() {
        return this.__currentUrl.get();
    }
    set currentUrl(newValue: string) {
        this.__currentUrl.set(newValue);
    }
    private __pageTitle: ObservedPropertySimplePU<string>;
    get pageTitle() {
        return this.__pageTitle.get();
    }
    set pageTitle(newValue: string) {
        this.__pageTitle.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __canGoBack: ObservedPropertySimplePU<boolean>;
    get canGoBack() {
        return this.__canGoBack.get();
    }
    set canGoBack(newValue: boolean) {
        this.__canGoBack.set(newValue);
    }
    private __canGoForward: ObservedPropertySimplePU<boolean>;
    get canGoForward() {
        return this.__canGoForward.get();
    }
    set canGoForward(newValue: boolean) {
        this.__canGoForward.set(newValue);
    }
    private __showDropdown: ObservedPropertySimplePU<boolean>;
    get showDropdown() {
        return this.__showDropdown.get();
    }
    set showDropdown(newValue: boolean) {
        this.__showDropdown.set(newValue);
    }
    private __bottomSafeArea: ObservedPropertySimplePU<number>;
    get bottomSafeArea() {
        return this.__bottomSafeArea.get();
    }
    set bottomSafeArea(newValue: number) {
        this.__bottomSafeArea.set(newValue);
    }
    private __appTheme: ObservedPropertyAbstractPU<string>;
    get appTheme() {
        return this.__appTheme.get();
    }
    set appTheme(newValue: string) {
        this.__appTheme.set(newValue);
    }
    private __currentColorMode: ObservedPropertyAbstractPU<ConfigurationConstant.ColorMode>;
    get currentColorMode() {
        return this.__currentColorMode.get();
    }
    set currentColorMode(newValue: ConfigurationConstant.ColorMode) {
        this.__currentColorMode.set(newValue);
    }
    private __webDarkMode: ObservedPropertySimplePU<WebDarkMode>;
    get webDarkMode() {
        return this.__webDarkMode.get();
    }
    set webDarkMode(newValue: WebDarkMode) {
        this.__webDarkMode.set(newValue);
    }
    private __webBgColor: ObservedPropertyObjectPU<ResourceColor>;
    get webBgColor() {
        return this.__webBgColor.get();
    }
    set webBgColor(newValue: ResourceColor) {
        this.__webBgColor.set(newValue);
    }
    private __navBarColor: ObservedPropertyObjectPU<ResourceColor>;
    get navBarColor() {
        return this.__navBarColor.get();
    }
    set navBarColor(newValue: ResourceColor) {
        this.__navBarColor.set(newValue);
    }
    private controller: webview.WebviewController;
    private isMobileDevice: boolean;
    private dropdownCategories: DropdownCategory[];
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
            }
            catch (e) {
                console.error('prepareForPageLoad error', this.currentUrl, JSON.stringify(e));
            }
        }
        // 获取底部导航条高度，让 Web 页面延伸到底部安全区
        try {
            let mainWindow: window.Window = await window.getLastWindow(getContext(this) as common.UIAbilityContext);
            let avoidArea: window.AvoidArea = mainWindow.getWindowAvoidArea(window.AvoidAreaType.TYPE_NAVIGATION_INDICATOR);
            this.bottomSafeArea = px2vp(avoidArea.bottomRect.height);
        }
        catch (e) {
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
        }
        catch (e) {
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
        this.navBarColor = isDark ? Color.Black : { "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" };
        ThemeHelper.setStatusBarColor(getContext(this) as common.UIAbilityContext, isDark ? '#FF000000' : '#FFF8FAFC');
    }
    loadDropdownTools(): void {
        // Read current state from AppStorage
        let hiddenStr: string = AppStorage.get<string>('hiddenTools') as string;
        let hiddenTools: string[] = [];
        if (hiddenStr && hiddenStr !== '[]') {
            try {
                hiddenTools = JSON.parse(hiddenStr);
            }
            catch (e) {
                hiddenTools = [];
            }
        }
        let toolsOrderStr: string = AppStorage.get<string>('toolsOrder') as string;
        let toolsOrder: Record<string, string[]> = {};
        if (toolsOrderStr && toolsOrderStr !== '{}') {
            try {
                toolsOrder = JSON.parse(toolsOrderStr);
            }
            catch (e) {
                toolsOrder = {};
            }
        }
        let customStr: string = AppStorage.get<string>('customTools') as string;
        let customTools: CustomToolData[] = [];
        if (customStr && customStr !== '[]') {
            try {
                customTools = JSON.parse(customStr);
            }
            catch (e) {
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
            }
            catch (e) {
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
            }
            catch (e) {
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
        }
        catch (e) {
            console.error('saveCookieAsync error', JSON.stringify(e));
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Top Navigation Bar
            Row.create();
            // Top Navigation Bar
            Row.width('100%');
            // Top Navigation Bar
            Row.padding({ left: 8, right: 8, top: 4, bottom: 4 });
            // Top Navigation Bar
            Row.backgroundColor(ObservedObject.GetRawObject(this.navBarColor));
            // Top Navigation Bar
            Row.border({ width: { bottom: 1 }, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Back button
            Button.createWithChild();
            // Back button
            Button.width(28);
            // Back button
            Button.height(28);
            // Back button
            Button.backgroundColor(Color.Transparent);
            // Back button
            Button.borderRadius(14);
            // Back button
            Button.enabled(this.canGoBack);
            // Back button
            Button.onClick(() => {
                this.goBack();
            });
            // Back button
            Button.margin({ left: 4 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832679, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(17);
            SymbolGlyph.fontColor([this.canGoBack ? { "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } : { "id": 16777248, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // Back button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Forward button
            Button.createWithChild();
            // Forward button
            Button.width(28);
            // Forward button
            Button.height(28);
            // Forward button
            Button.backgroundColor(Color.Transparent);
            // Forward button
            Button.borderRadius(14);
            // Forward button
            Button.enabled(this.canGoForward);
            // Forward button
            Button.onClick(() => {
                this.goForward();
            });
            // Forward button
            Button.margin({ left: 4 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832680, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(17);
            SymbolGlyph.fontColor([this.canGoForward ? { "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } : { "id": 16777248, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // Forward button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title + Dropdown button
            Column.create();
            // Title + Dropdown button
            Column.layoutWeight(1);
            // Title + Dropdown button
            Column.alignItems(HorizontalAlign.Center);
            // Title + Dropdown button
            Column.margin({ left: 8, right: 8 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.pageTitle);
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        // Title + Dropdown button
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Quick switch button
            Button.createWithChild();
            // Quick switch button
            Button.width(28);
            // Quick switch button
            Button.height(28);
            // Quick switch button
            Button.backgroundColor(Color.Transparent);
            // Quick switch button
            Button.borderRadius(14);
            // Quick switch button
            Button.onClick(() => {
                this.showDropdown = !this.showDropdown;
                if (this.showDropdown) {
                    this.loadDropdownTools();
                    this.prefetchDropdownTools();
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create(this.showDropdown ? { "id": 125832665, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } : { "id": 125832666, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(17);
            SymbolGlyph.fontColor([{ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // Quick switch button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Refresh button
            Button.createWithChild();
            // Refresh button
            Button.width(28);
            // Refresh button
            Button.height(28);
            // Refresh button
            Button.backgroundColor(Color.Transparent);
            // Refresh button
            Button.borderRadius(14);
            // Refresh button
            Button.onClick(() => {
                this.refreshPage();
            });
            // Refresh button
            Button.margin({ left: 4 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831551, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(17);
            SymbolGlyph.fontColor([{ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // Refresh button
        Button.pop();
        // Top Navigation Bar
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Dropdown Menu
            if (this.showDropdown) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height(300);
                        Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Column.borderRadius({ bottomLeft: 12, bottomRight: 12 });
                        Column.shadow({ radius: 8, color: 'rgba(0,0,0,0.1)', offsetY: 4 });
                        Column.position({ x: 0, y: 0 });
                        Column.zIndex(10);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Scroll.create();
                        Scroll.layoutWeight(1);
                        Scroll.width('100%');
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ bottom: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const category = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // Category title
                                Text.create(category.name);
                                // Category title
                                Text.fontSize(12);
                                // Category title
                                Text.fontWeight(FontWeight.Bold);
                                // Category title
                                Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                // Category title
                                Text.width('100%');
                                // Category title
                                Text.padding({ left: 16, top: 10, bottom: 4 });
                            }, Text);
                            // Category title
                            Text.pop();
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // Tools in category
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const tool = _item;
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width('100%');
                                        Row.padding({ left: 16, right: 16, top: 8, bottom: 8 });
                                        Row.borderRadius(8);
                                        Row.backgroundColor(tool.url === this.currentUrl ?
                                            ThemeHelper.getAccentLightColor() : { "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                        Row.onClick(() => {
                                            this.switchToTool(tool.url, tool.name);
                                        });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(tool.name);
                                        Text.fontSize(14);
                                        Text.fontColor(tool.url === this.currentUrl ? ThemeHelper.getAccentColor() : { "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                        Text.fontWeight(tool.url === this.currentUrl ? FontWeight.Medium : FontWeight.Regular);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Blank.create();
                                    }, Blank);
                                    Blank.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (tool.url === this.currentUrl) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Text.create('当前');
                                                    Text.fontSize(11);
                                                    Text.fontColor(ThemeHelper.getAccentColor());
                                                    Text.backgroundColor(ThemeHelper.getAccentLightColor());
                                                    Text.borderRadius(8);
                                                    Text.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                                }, Text);
                                                Text.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                    Row.pop();
                                };
                                this.forEachUpdateFunction(elmtId, category.tools, forEachItemGenFunction, (tool: DropdownTool) => tool.id, false, false);
                            }, ForEach);
                            // Tools in category
                            ForEach.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.dropdownCategories, forEachItemGenFunction, (category: DropdownCategory) => category.name, false, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Scroll.pop();
                    Column.pop();
                });
            }
            // WebView Container
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // WebView Container
            Stack.create();
            // WebView Container
            Stack.layoutWeight(1);
            // WebView Container
            Stack.width('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Web.create({ src: this.currentUrl, controller: this.controller });
            Web.layoutWeight(1);
            Web.width('100%');
            Web.domStorageAccess(true);
            Web.javaScriptAccess(true);
            Web.onlineImageAccess(true);
            Web.imageAccess(true);
            Web.fileAccess(true);
            Web.databaseAccess(true);
            Web.mixedMode(MixedMode.All);
            Web.horizontalScrollBarAccess(false);
            Web.verticalScrollBarAccess(false);
            Web.backgroundColor(ObservedObject.GetRawObject(this.webBgColor));
            Web.darkMode(this.webDarkMode);
            Web.forceDarkAccess(this.webDarkMode === WebDarkMode.On);
            Web.margin({ bottom: -this.bottomSafeArea });
            Web.onClick(() => {
                if (this.showDropdown) {
                    this.showDropdown = false;
                }
            });
            Web.onControllerAttached(() => {
                this.setMobileUserAgent();
            });
            Web.onPermissionRequest((event) => {
                if (event) {
                    event.request.grant(event.request.getAccessibleResource());
                }
            });
            Web.onPageBegin((event) => {
                if (event) {
                    this.isLoading = true;
                }
            });
            Web.onPageEnd(() => {
                this.isLoading = false;
                this.canGoBack = this.controller.accessStep(-1);
                this.canGoForward = this.controller.accessStep(1);
                this.prefetchNextTools(3);
            });
            Web.onErrorReceive((event) => {
                if (event) {
                    this.isLoading = false;
                }
            });
            Web.onRenderExited(() => {
                this.controller.loadUrl(this.currentUrl);
            });
        }, Web);
        // WebView Container
        Stack.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "WebPage";
    }
}
registerNamedRoute(() => new WebPage(undefined, {}), "", { bundleName: "com.aitransformer.bowenapp", moduleName: "entry", pagePath: "pages/WebPage", pageFullPath: "entry/src/main/ets/pages/WebPage", integratedHsp: "false", moduleType: "followWithHap" });
