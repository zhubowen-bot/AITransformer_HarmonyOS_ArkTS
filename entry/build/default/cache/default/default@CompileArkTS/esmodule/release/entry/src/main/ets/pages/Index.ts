if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentTabIndex?: number;
    showTabBar?: boolean;
    appColorTheme?: string;
    tabsController?: HdsTabsController;
    updateDialogController?: CustomDialogController | null;
}
import ToolsPage from "@bundle:com.aitransformer.bowenapp/entry/ets/pages/ToolsPage";
import ConvertPage from "@bundle:com.aitransformer.bowenapp/entry/ets/pages/ConvertPage";
import SettingsPage from "@bundle:com.aitransformer.bowenapp/entry/ets/pages/SettingsPage";
import { HdsNavigation } from "@hms:hds.hdsBaseComponent";
import { HdsTabs } from "@hms:hds.hdsBaseComponent";
import { HdsTabsController } from "@hms:hds.hdsBaseComponent";
import { hdsMaterial } from "@hms:hds.hdsMaterial";
import type { HdsNavigationAttribute } from "@hms:hds.hdsBaseComponent";
import type { HdsTabsAttribute } from "@hms:hds.hdsBaseComponent";
import type common from "@ohos:app.ability.common";
import type ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import preferences from "@ohos:data.preferences";
import { SymbolGlyphModifier } from "@ohos:arkui.modifier";
import curves from "@native:ohos.curves";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
import { UpdateDialog } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/UpdateDialog";
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTabIndex = new ObservedPropertySimplePU(0, this, "currentTabIndex");
        this.__showTabBar = new ObservedPropertySimplePU(true, this, "showTabBar");
        this.__appColorTheme = this.createStorageLink('appColorTheme', 'blue', "appColorTheme");
        this.tabsController = new HdsTabsController();
        this.updateDialogController = null;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentTabIndex !== undefined) {
            this.currentTabIndex = params.currentTabIndex;
        }
        if (params.showTabBar !== undefined) {
            this.showTabBar = params.showTabBar;
        }
        if (params.tabsController !== undefined) {
            this.tabsController = params.tabsController;
        }
        if (params.updateDialogController !== undefined) {
            this.updateDialogController = params.updateDialogController;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__showTabBar.purgeDependencyOnElmtId(rmElmtId);
        this.__appColorTheme.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTabIndex.aboutToBeDeleted();
        this.__showTabBar.aboutToBeDeleted();
        this.__appColorTheme.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTabIndex: ObservedPropertySimplePU<number>;
    get currentTabIndex() {
        return this.__currentTabIndex.get();
    }
    set currentTabIndex(newValue: number) {
        this.__currentTabIndex.set(newValue);
    }
    private __showTabBar: ObservedPropertySimplePU<boolean>;
    get showTabBar() {
        return this.__showTabBar.get();
    }
    set showTabBar(newValue: boolean) {
        this.__showTabBar.set(newValue);
    }
    private __appColorTheme: ObservedPropertyAbstractPU<string>;
    get appColorTheme() {
        return this.__appColorTheme.get();
    }
    set appColorTheme(newValue: string) {
        this.__appColorTheme.set(newValue);
    }
    private tabsController: HdsTabsController;
    private updateDialogController: CustomDialogController | null;
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
                    builder: () => {
                        let jsDialog = new UpdateDialog(this, {}, undefined, -1, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 36, col: 20 });
                        jsDialog.setController(this.updateDialogController);
                        ViewPU.create(jsDialog);
                        let paramsLambda = () => {
                            return {};
                        };
                        jsDialog.paramsGenerator_ = paramsLambda;
                    },
                    autoCancel: false
                }, this);
                this.updateDialogController.open();
            }
        }
        catch (e) {
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
        }
        else if (this.currentTabIndex === 1) {
            ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF1E293B' : '#FFFFFFFF');
        }
        else {
            ThemeHelper.setStatusBarColor(ctx, isDark ? '#FF0F172A' : '#FFF8FAFC');
        }
    }
    private getPageTransition(): TransitionEffect {
        return TransitionEffect.asymmetric(TransitionEffect.translate({ x: 0, y: -30 })
            .combine(TransitionEffect.OPACITY)
            .animation({ curve: curves.springMotion(0.65, 1.0) }), TransitionEffect.OPACITY);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            HdsNavigation.create(new NavPathStack(), { moduleName: "entry", pagePath: "entry/src/main/ets/pages/Index", isUserCreateStack: false });
            HdsNavigation.mode(NavigationMode.Stack);
            HdsNavigation.hideBackButton(true);
            HdsNavigation.hideTitleBar(true);
            HdsNavigation.ignoreLayoutSafeArea([LayoutSafeAreaType.SYSTEM], [LayoutSafeAreaEdge.BOTTOM]);
        }, HdsNavigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            HdsTabs.create({ controller: this.tabsController });
            HdsTabs.barOverlap(true);
            HdsTabs.vertical(false);
            HdsTabs.barPosition(BarPosition.End);
            HdsTabs.scrollable(false);
            HdsTabs.animationDuration(0);
            HdsTabs.onChange((index: number) => {
                this.currentTabIndex = index;
                this.updateStatusBarForCurrentTab();
            });
            HdsTabs.barHeight(this.showTabBar ? 56 : 0);
            HdsTabs.barFloatingStyle(this.showTabBar ? {
                barBottomMargin: 28,
                systemMaterialEffect: {
                    materialType: hdsMaterial.MaterialType.IMMERSIVE,
                    materialLevel: hdsMaterial.MaterialLevel.EXQUISITE
                }
            } : undefined);
        }, HdsTabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width('100%');
                    Stack.height('100%');
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.currentTabIndex === 0) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                __Common__.create();
                                __Common__.transition(this.getPageTransition());
                            }, __Common__);
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new ToolsPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 92, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "ToolsPage" });
                            }
                            __Common__.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
            });
            TabContent.tabBar(new BottomTabBarStyle({
                normal: new SymbolGlyphModifier({ "id": 125834995, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" })
                    .fontColor([{ "id": 125829426, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]),
                selected: new SymbolGlyphModifier({ "id": 125834995, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" })
                    .fontColor([this.getAccentColor()])
            }, '工具集')
                .labelStyle({ selectedColor: this.getAccentColor() }));
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width('100%');
                    Stack.height('100%');
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.currentTabIndex === 1) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                __Common__.create();
                                __Common__.transition(this.getPageTransition());
                            }, __Common__);
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new ConvertPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 110, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "ConvertPage" });
                            }
                            __Common__.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
            });
            TabContent.tabBar(new BottomTabBarStyle({
                normal: new SymbolGlyphModifier({ "id": 125831910, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" })
                    .fontColor([{ "id": 125829426, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]),
                selected: new SymbolGlyphModifier({ "id": 125831910, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" })
                    .fontColor([this.getAccentColor()])
            }, '文本转换')
                .labelStyle({ selectedColor: this.getAccentColor() }));
        }, TabContent);
        TabContent.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TabContent.create(() => {
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width('100%');
                    Stack.height('100%');
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.currentTabIndex === 2) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                __Common__.create();
                                __Common__.transition(this.getPageTransition());
                            }, __Common__);
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new SettingsPage(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 128, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "SettingsPage" });
                            }
                            __Common__.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
            });
            TabContent.tabBar(new BottomTabBarStyle({
                normal: new SymbolGlyphModifier({ "id": 125831493, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" })
                    .fontColor([{ "id": 125829426, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]),
                selected: new SymbolGlyphModifier({ "id": 125831493, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" })
                    .fontColor([this.getAccentColor()])
            }, '设置')
                .labelStyle({ selectedColor: this.getAccentColor() }));
        }, TabContent);
        TabContent.pop();
        HdsTabs.pop();
        HdsNavigation.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.aitransformer.bowenapp", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
