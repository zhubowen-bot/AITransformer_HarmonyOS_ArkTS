if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SettingsPage_Params {
    currentTheme?: string;
    currentColorTheme?: string;
    themeOptions?: ThemeOption[];
    colorThemeOptions?: ColorThemeOption[];
    updateLogs?: string[];
    featureList?: string[];
}
import type common from "@ohos:app.ability.common";
import router from "@ohos:router";
import preferences from "@ohos:data.preferences";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
interface ThemeOption {
    value: string;
    label: string;
}
interface ColorThemeOption {
    value: string;
    label: string;
}
class SettingsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentTheme = new ObservedPropertySimplePU('system', this, "currentTheme");
        this.__currentColorTheme = new ObservedPropertySimplePU('blue', this, "currentColorTheme");
        this.themeOptions = [
            { value: 'system', label: '跟随系统' },
            { value: 'light', label: '浅色模式' },
            { value: 'dark', label: '深色模式' }
        ];
        this.colorThemeOptions = [
            { value: 'blue', label: '蓝青' },
            { value: 'green', label: '翠绿' },
            { value: 'orange', label: '暖橙' },
            { value: 'purple', label: '典雅紫' },
            { value: 'cyan', label: '湖水青' },
            { value: 'rose', label: '玫瑰红' }
        ];
        this.updateLogs = [
            '架构重写：完全重写了应用架构，采用多页面多组件模块化构建',
            '沉浸光感：集成沉浸式视觉效果',
            '全新升级：AI工具集升级为应用集样式，新增编辑、排序等功能',
            '体验升级：深色模式下界面更通透；新增至八个默认模型',
            '跳转支持：新增拉起浏览器实现应用跳转'
        ];
        this.featureList = [
            '鸿蒙版官方没有适配或功能残缺？我们通过 ArkWeb 把官方平台搬上鸿蒙版',
            'AI 文本杂乱不好处理？轻量化 Markdown 转纯文本工具，高效便捷',
            '担心第三方工具安全性不佳？我们全部集成官方网站，只做前端不做服务器'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SettingsPage_Params) {
        if (params.currentTheme !== undefined) {
            this.currentTheme = params.currentTheme;
        }
        if (params.currentColorTheme !== undefined) {
            this.currentColorTheme = params.currentColorTheme;
        }
        if (params.themeOptions !== undefined) {
            this.themeOptions = params.themeOptions;
        }
        if (params.colorThemeOptions !== undefined) {
            this.colorThemeOptions = params.colorThemeOptions;
        }
        if (params.updateLogs !== undefined) {
            this.updateLogs = params.updateLogs;
        }
        if (params.featureList !== undefined) {
            this.featureList = params.featureList;
        }
    }
    updateStateVars(params: SettingsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__currentColorTheme.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentTheme.aboutToBeDeleted();
        this.__currentColorTheme.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentTheme: ObservedPropertySimplePU<string>;
    get currentTheme() {
        return this.__currentTheme.get();
    }
    set currentTheme(newValue: string) {
        this.__currentTheme.set(newValue);
    }
    private __currentColorTheme: ObservedPropertySimplePU<string>;
    get currentColorTheme() {
        return this.__currentColorTheme.get();
    }
    set currentColorTheme(newValue: string) {
        this.__currentColorTheme.set(newValue);
    }
    private themeOptions: ThemeOption[];
    private colorThemeOptions: ColorThemeOption[];
    private updateLogs: string[];
    private featureList: string[];
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.width('100%');
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== Header =====
            Column.create();
            // ===== Header =====
            Column.width('100%');
            // ===== Header =====
            Column.alignItems(HorizontalAlign.Center);
            // ===== Header =====
            Column.padding({ top: 40, bottom: 24 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Image.width(60);
            Image.height(60);
            Image.borderRadius(16);
            Image.shadow({ radius: 12, color: 'rgba(0,0,0,0.1)', offsetY: 4 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 一站清');
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Version 11.0.0');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        // ===== Header =====
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 深色模式 =====
            Column.create();
            // ===== 深色模式 =====
            Column.width('100%');
            // ===== 深色模式 =====
            Column.padding(20);
            // ===== 深色模式 =====
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== 深色模式 =====
            Column.borderRadius(16);
            // ===== 深色模式 =====
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831553, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('深色模式');
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const option = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(option.label);
                    Text.fontSize(14);
                    Text.fontWeight(this.currentTheme === option.value ? FontWeight.Medium : FontWeight.Regular);
                    Text.fontColor(this.currentTheme === option.value ?
                        this.getAccentColor() : { "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    Text.layoutWeight(1);
                    Text.height(40);
                    Text.textAlign(TextAlign.Center);
                    Text.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    Text.borderRadius(10);
                    Text.border({ width: this.currentTheme === option.value ? 1.5 : 1,
                        color: this.currentTheme === option.value ?
                            this.getAccentColor() : { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                    Text.shadow({ radius: 4, color: 'rgba(0,0,0,0.06)', offsetY: 2 });
                    Text.margin({ left: 4, right: 4 });
                    Text.onClick(() => {
                        this.setTheme(option.value);
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.themeOptions, forEachItemGenFunction, (item: ThemeOption) => item.value, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // ===== 深色模式 =====
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 主题色彩 =====
            Column.create();
            // ===== 主题色彩 =====
            Column.width('100%');
            // ===== 主题色彩 =====
            Column.padding(20);
            // ===== 主题色彩 =====
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== 主题色彩 =====
            Column.borderRadius(16);
            // ===== 主题色彩 =====
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831605, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('主题色彩');
            Text.fontSize(17);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const option = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.onClick(() => {
                        this.setColorTheme(option.value);
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create();
                    Stack.width(32);
                    Stack.height(32);
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Circle.create();
                    Circle.width(28);
                    Circle.height(28);
                    Circle.fill(this.getColorValue(option.value));
                }, Circle);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.currentColorTheme === option.value) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Circle.create();
                                Circle.width(10);
                                Circle.height(10);
                                Circle.fill(Color.White);
                            }, Circle);
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                        });
                    }
                }, If);
                If.pop();
                Stack.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(option.label);
                    Text.fontSize(11);
                    Text.fontColor(this.currentColorTheme === option.value ?
                        this.getColorValue(option.value) : { "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    Text.margin({ top: 6 });
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.colorThemeOptions, forEachItemGenFunction, (item: ColorThemeOption) => item.value, false, false);
        }, ForEach);
        ForEach.pop();
        Row.pop();
        // ===== 主题色彩 =====
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 关于应用 =====
            Row.create();
            // ===== 关于应用 =====
            Row.width('100%');
            // ===== 关于应用 =====
            Row.padding(20);
            // ===== 关于应用 =====
            Row.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== 关于应用 =====
            Row.borderRadius(16);
            // ===== 关于应用 =====
            Row.margin({ bottom: 12 });
            // ===== 关于应用 =====
            Row.onClick(() => {
                router.pushUrl({ url: 'pages/AboutPage' });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831493, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关于应用');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832680, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([{ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // ===== 关于应用 =====
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 支持作者 =====
            Row.create();
            // ===== 支持作者 =====
            Row.width('100%');
            // ===== 支持作者 =====
            Row.padding(20);
            // ===== 支持作者 =====
            Row.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== 支持作者 =====
            Row.borderRadius(16);
            // ===== 支持作者 =====
            Row.margin({ bottom: 12 });
            // ===== 支持作者 =====
            Row.onClick(() => {
                router.pushUrl({ url: 'pages/SupportPage' });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831544, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([Color.Red]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支持作者');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832680, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([{ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        // ===== 支持作者 =====
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== 联系方式 =====
            Column.create();
            // ===== 联系方式 =====
            Column.width('100%');
            // ===== 联系方式 =====
            Column.padding(20);
            // ===== 联系方式 =====
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== 联系方式 =====
            Column.borderRadius(16);
            // ===== 联系方式 =====
            Column.margin({ bottom: 160 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831925, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ left: 12 });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('邮箱');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('15196443523@139.com');
            Text.fontSize(15);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831925, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ left: 12 });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('邮箱');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('bowen_zbw@sjtu.edu.cn');
            Text.fontSize(15);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.height(1);
            Divider.color({ "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Divider.margin({ top: 16 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831925, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ left: 12 });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('电话');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('15196443523');
            Text.fontSize(15);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ top: 16 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831925, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.margin({ left: 12 });
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('QQ反馈群');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('1067833232');
            Text.fontSize(15);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Column.pop();
        Row.pop();
        // ===== 联系方式 =====
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export default SettingsPage;
