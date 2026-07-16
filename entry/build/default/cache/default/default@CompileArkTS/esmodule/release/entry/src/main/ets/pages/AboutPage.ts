if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface AboutPage_Params {
    appTheme?: string;
    currentColorMode?: ConfigurationConstant.ColorMode;
    updateLogs?: string[];
    featureList?: string[];
}
import router from "@ohos:router";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
interface ThemeOption {
    value: string;
    label: string;
}
class AboutPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__appTheme = this.createStorageLink('appTheme', 'system', "appTheme");
        this.__currentColorMode = this.createStorageProp('currentColorMode', ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT, "currentColorMode");
        this.updateLogs = [
            '完全重构：采用ArkTS和C++重写整个应用，代替原有的ArkWeb混合架构方案',
            '原生组件：导航栏、标签栏、图标等全部换用鸿蒙原生组件和设计风格，适配最新沉浸光感效果，我们对美的追求永无止境',
            '性能暴增：相比原有ArkWeb，原生ArkTS与C++的方案节省30%内存占用，性能提升50%',
            '智能感知：智能感知你的下一步动向，采用预连接、预加载方案优化网页启动速度',
            '快速切换：新增网页标题栏功能，无需退出即可快速切换页面',
            '丝滑流畅：弹簧动画丝滑细腻，ArkTS原生开发彻底解决了原有混合架构的若干卡顿问题和页面切换Bug',
            '权限新增：新增摄像头权限授予，优化权限的授权流程使之丝滑简单，您可以自由使用AI的语音输入和视频通话功能了'
        ];
        this.featureList = [
            '各大软件鸿蒙版官方没有适配或功能残缺？我们通过嵌入式Web把官方平台搬上鸿蒙版',
            'AI 文本杂乱不好处理？轻量化 Markdown 转纯文本工具，高效便捷',
            '担心第三方工具安全性不佳？我们全部集成官方网站，只做前端不做服务器'
        ];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: AboutPage_Params) {
        if (params.updateLogs !== undefined) {
            this.updateLogs = params.updateLogs;
        }
        if (params.featureList !== undefined) {
            this.featureList = params.featureList;
        }
    }
    updateStateVars(params: AboutPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__appTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__currentColorMode.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__appTheme.aboutToBeDeleted();
        this.__currentColorMode.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
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
    private updateLogs: string[];
    private featureList: string[];
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
        }
        catch (e) {
            console.error('openPrivacyUrl error', JSON.stringify(e));
        }
    }
    closePage(): void {
        router.back();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(48);
            Row.padding({ left: 12, right: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(36);
            Button.height(36);
            Button.backgroundColor(Color.Transparent);
            Button.borderRadius(18);
            Button.onClick(() => {
                this.closePage();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832679, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([{ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关于应用');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: -36 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.width('100%');
            Scroll.clip(false);
            Scroll.edgeEffect(EdgeEffect.Spring);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ left: 16, right: 16, top: 20 });
            Column.expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.BOTTOM]);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Privacy
            Column.create();
            // Privacy
            Column.width('100%');
            // Privacy
            Column.padding(16);
            // Privacy
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Privacy
            Column.borderRadius(16);
            // Privacy
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('隐私协议');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('关于AI一站清与隐私的声明');
            Text.fontSize(14);
            Text.fontColor(this.getAccentColor());
            Text.onClick(() => {
                this.openPrivacyUrl();
            });
        }, Text);
        Text.pop();
        // Privacy
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Updates
            Column.create();
            // Updates
            Column.width('100%');
            // Updates
            Column.padding(16);
            // Updates
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Updates
            Column.borderRadius(16);
            // Updates
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('更新动态');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Version 11');
            Text.fontSize(13);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.getAccentColor());
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const log = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.alignItems(VerticalAlign.Top);
                    Row.margin({ bottom: 4 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('·');
                    Text.fontSize(14);
                    Text.fontColor(this.getAccentColor());
                    Text.margin({ right: 6 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(log);
                    Text.fontSize(13);
                    Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    Text.lineHeight(20);
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.updateLogs, forEachItemGenFunction, (log: string) => log, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        // Updates
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Features
            Column.create();
            // Features
            Column.width('100%');
            // Features
            Column.padding(16);
            // Features
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Features
            Column.borderRadius(16);
            // Features
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('功能介绍');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 一站清 是一款鸿蒙版一站式 AI 解决平台');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 12 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const feature = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                    Row.alignItems(VerticalAlign.Top);
                    Row.margin({ bottom: 4 });
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create('·');
                    Text.fontSize(14);
                    Text.fontColor(this.getAccentColor());
                    Text.margin({ right: 6 });
                }, Text);
                Text.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(feature);
                    Text.fontSize(13);
                    Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    Text.lineHeight(20);
                }, Text);
                Text.pop();
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, this.featureList, forEachItemGenFunction, (feature: string) => feature, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
        // Features
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Open Source
            Column.create();
            // Open Source
            Column.width('100%');
            // Open Source
            Column.padding(16);
            // Open Source
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Open Source
            Column.borderRadius(16);
            // Open Source
            Column.margin({ bottom: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('技术开源');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('本应用经过架构重写，采用ArkTS和C++原生开发，带来极致的原生流畅体验');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(20);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('秉持开源开放、共建共享的精神，此应用将开源在github平台，你可以审计每一行代码，欢迎学习、交流');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(20);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我的 GitHub 主页：');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 4 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('https://github.com/zhubowen-bot');
            Text.fontSize(13);
            Text.fontColor(this.getAccentColor());
            Text.lineHeight(20);
        }, Text);
        Text.pop();
        // Open Source
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "AboutPage";
    }
}
export default AboutPage;
registerNamedRoute(() => new AboutPage(undefined, {}), "", { bundleName: "com.aitransformer.bowenapp", moduleName: "entry", pagePath: "pages/AboutPage", pageFullPath: "entry/src/main/ets/pages/AboutPage", integratedHsp: "false", moduleType: "followWithHap" });
