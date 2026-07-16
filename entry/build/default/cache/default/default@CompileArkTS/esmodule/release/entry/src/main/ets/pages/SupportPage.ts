if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SupportPage_Params {
    appTheme?: string;
    currentColorMode?: ConfigurationConstant.ColorMode;
}
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import type Want from "@ohos:app.ability.Want";
import type { BusinessError } from "@ohos:base";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
class SupportPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__appTheme = this.createStorageLink('appTheme', 'system', "appTheme");
        this.__currentColorMode = this.createStorageProp('currentColorMode', ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT, "currentColorMode");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SupportPage_Params) {
    }
    updateStateVars(params: SupportPage_Params) {
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
    closePage(): void {
        router.back();
    }
    openAppGalleryReview(): void {
        let context: common.UIAbilityContext = this.getUIContext().getHostContext() as common.UIAbilityContext;
        let bundleName: string = 'com.aitransformer.bowenapp';
        let want: Want = {
            action: 'ohos.want.action.appdetail',
            uri: 'store://appgallery.huawei.com/app/detail?id=' + bundleName + '&action=write-review'
        };
        context.startAbility(want).then(() => {
            console.info('SupportPage', 'openAppGalleryReview success');
        }).catch((error: BusinessError) => {
            console.error('SupportPage', 'openAppGalleryReview failed, Code: ' + error.code + ', message: ' + error.message);
        });
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
            // ===== Header =====
            Row.create();
            // ===== Header =====
            Row.width('100%');
            // ===== Header =====
            Row.height(48);
            // ===== Header =====
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
            Text.create('支持作者');
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
        // ===== Header =====
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
            // ===== Card 1: 赞助作者 =====
            Column.create();
            // ===== Card 1: 赞助作者 =====
            Column.width('100%');
            // ===== Card 1: 赞助作者 =====
            Column.padding(20);
            // ===== Card 1: 赞助作者 =====
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== Card 1: 赞助作者 =====
            Column.borderRadius(16);
            // ===== Card 1: 赞助作者 =====
            Column.margin({ bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title
            Row.create();
            // Title
            Row.width('100%');
            // Title
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831544, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(22);
            SymbolGlyph.fontColor([Color.Red]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('赞助作者');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        // Title
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Message
            Text.create('应用全量功能永久免费。如果这个应用对你有所帮助，欢迎赞助作者一些开发消耗的 tokens ！(*^▽^*)');
            // Message
            Text.fontSize(14);
            // Message
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Message
            Text.lineHeight(22);
            // Message
            Text.width('100%');
            // Message
            Text.margin({ bottom: 4 });
        }, Text);
        // Message
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('你的每一份支持，都是作者持续前进的动力！');
            Text.fontSize(14);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // QR Codes
            Row.create();
            // QR Codes
            Row.width('100%');
            // QR Codes
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // WeChat
            Column.create();
            // WeChat
            Column.layoutWeight(1);
            // WeChat
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777268, "type": 20000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Image.width(140);
            Image.height(140);
            Image.borderRadius(12);
            Image.objectFit(ImageFit.Contain);
            Image.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('微信');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        // WeChat
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Alipay
            Column.create();
            // Alipay
            Column.layoutWeight(1);
            // Alipay
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777260, "type": 20000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Image.width(140);
            Image.height(140);
            Image.borderRadius(12);
            Image.objectFit(ImageFit.Contain);
            Image.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支付宝');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        // Alipay
        Column.pop();
        // QR Codes
        Row.pop();
        // ===== Card 1: 赞助作者 =====
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // ===== Card 2: 给个好评 =====
            Column.create();
            // ===== Card 2: 给个好评 =====
            Column.width('100%');
            // ===== Card 2: 给个好评 =====
            Column.padding(20);
            // ===== Card 2: 给个好评 =====
            Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // ===== Card 2: 给个好评 =====
            Column.borderRadius(16);
            // ===== Card 2: 给个好评 =====
            Column.margin({ bottom: 32 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title
            Row.create();
            // Title
            Row.width('100%');
            // Title
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831520, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(22);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('给个好评');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        // Title
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('如果你喜欢这个应用，欢迎在应用市场给个五星好评！');
            Text.fontSize(14);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('你的好评是对我最大的鼓励，也是我持续优化的动力源泉。');
            Text.fontSize(14);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(48);
            Row.justifyContent(FlexAlign.Center);
            Row.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Row.borderRadius(12);
            Row.border({ width: 1, color: this.getAccentColor() });
            Row.shadow({ radius: 8, color: this.getAccentColor() + '33', offsetY: 3 });
            Row.onClick(() => {
                this.openAppGalleryReview();
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.alignItems(VerticalAlign.Center);
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831520, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([this.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('去应用市场好评');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.getAccentColor());
            Text.margin({ left: 6 });
        }, Text);
        Text.pop();
        Row.pop();
        Row.pop();
        // ===== Card 2: 给个好评 =====
        Column.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SupportPage";
    }
}
export default SupportPage;
registerNamedRoute(() => new SupportPage(undefined, {}), "", { bundleName: "com.aitransformer.bowenapp", moduleName: "entry", pagePath: "pages/SupportPage", pageFullPath: "entry/src/main/ets/pages/SupportPage", integratedHsp: "false", moduleType: "followWithHap" });
