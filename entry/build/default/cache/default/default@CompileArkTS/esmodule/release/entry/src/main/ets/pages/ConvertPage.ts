if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ConvertPage_Params {
    inputText?: string;
    outputText?: string;
    copyBtnText?: string;
    currentDate?: string;
    currentTime?: string;
}
import type common from "@ohos:app.ability.common";
import type ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import pasteboard from "@ohos:pasteboard";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
class ConvertPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__inputText = new ObservedPropertySimplePU('', this, "inputText");
        this.__outputText = new ObservedPropertySimplePU('', this, "outputText");
        this.__copyBtnText = new ObservedPropertySimplePU('复制', this, "copyBtnText");
        this.__currentDate = new ObservedPropertySimplePU('', this, "currentDate");
        this.__currentTime = new ObservedPropertySimplePU('', this, "currentTime");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ConvertPage_Params) {
        if (params.inputText !== undefined) {
            this.inputText = params.inputText;
        }
        if (params.outputText !== undefined) {
            this.outputText = params.outputText;
        }
        if (params.copyBtnText !== undefined) {
            this.copyBtnText = params.copyBtnText;
        }
        if (params.currentDate !== undefined) {
            this.currentDate = params.currentDate;
        }
        if (params.currentTime !== undefined) {
            this.currentTime = params.currentTime;
        }
    }
    updateStateVars(params: ConvertPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__inputText.purgeDependencyOnElmtId(rmElmtId);
        this.__outputText.purgeDependencyOnElmtId(rmElmtId);
        this.__copyBtnText.purgeDependencyOnElmtId(rmElmtId);
        this.__currentDate.purgeDependencyOnElmtId(rmElmtId);
        this.__currentTime.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__inputText.aboutToBeDeleted();
        this.__outputText.aboutToBeDeleted();
        this.__copyBtnText.aboutToBeDeleted();
        this.__currentDate.aboutToBeDeleted();
        this.__currentTime.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __inputText: ObservedPropertySimplePU<string>;
    get inputText() {
        return this.__inputText.get();
    }
    set inputText(newValue: string) {
        this.__inputText.set(newValue);
    }
    private __outputText: ObservedPropertySimplePU<string>;
    get outputText() {
        return this.__outputText.get();
    }
    set outputText(newValue: string) {
        this.__outputText.set(newValue);
    }
    private __copyBtnText: ObservedPropertySimplePU<string>;
    get copyBtnText() {
        return this.__copyBtnText.get();
    }
    set copyBtnText(newValue: string) {
        this.__copyBtnText.set(newValue);
    }
    private __currentDate: ObservedPropertySimplePU<string>;
    get currentDate() {
        return this.__currentDate.get();
    }
    set currentDate(newValue: string) {
        this.__currentDate.set(newValue);
    }
    private __currentTime: ObservedPropertySimplePU<string>;
    get currentTime() {
        return this.__currentTime.get();
    }
    set currentTime(newValue: string) {
        this.__currentTime.set(newValue);
    }
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
        }
        catch (e) {
            console.error('copy error', JSON.stringify(e));
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header
            Row.create();
            // Header
            Row.width('100%');
            // Header
            Row.padding({ left: 16, right: 16, top: 12, bottom: 12 });
            // Header
            Row.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI 一站清');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(1);
            Column.height(16);
            Column.backgroundColor({ "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Column.margin({ left: 10, right: 10 });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('文本转换');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Regular);
            Text.fontColor(ThemeHelper.getAccentColor());
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.End);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentDate);
            Text.fontSize(10);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentTime);
            Text.fontSize(10);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(ThemeHelper.getAccentColor());
        }, Text);
        Text.pop();
        Column.pop();
        // Header
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Content
            Column.create();
            // Content
            Column.layoutWeight(1);
            // Content
            Column.width('100%');
            // Content
            Column.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('Markdown转纯文本');
            Text.fontSize(19);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.width('100%');
            Text.margin({ top: 35, bottom: 32 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Input Area
            Column.create();
            // Input Area
            Column.width('100%');
            // Input Area
            Column.padding({ left: 16, right: 16 });
            // Input Area
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('输入框');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.height(32);
            Button.backgroundColor(ThemeHelper.getAccentLightColor());
            Button.borderRadius(16);
            Button.padding({ left: 12, right: 12 });
            Button.onClick(() => {
                this.clearInput();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831542, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([ThemeHelper.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('清空');
            Text.fontSize(13);
            Text.fontColor(ThemeHelper.getAccentColor());
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '示例：# 这是一个**标题**', text: this.inputText });
            TextArea.height(170);
            TextArea.width('100%');
            TextArea.fontSize(14);
            TextArea.borderRadius(12);
            TextArea.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
            TextArea.padding(12);
            TextArea.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            TextArea.onChange((value: string) => {
                this.inputText = value;
            });
        }, TextArea);
        // Input Area
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Convert Button
            Button.createWithChild();
            // Convert Button
            Button.width('80%');
            // Convert Button
            Button.height(48);
            // Convert Button
            Button.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Convert Button
            Button.borderRadius(14);
            // Convert Button
            Button.shadow({ radius: 6, color: 'rgba(0, 0, 0, 0.08)', offsetY: 2 });
            // Convert Button
            Button.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
            // Convert Button
            Button.margin({ bottom: 14 });
            // Convert Button
            Button.alignSelf(ItemAlign.Center);
            // Convert Button
            Button.onClick(() => {
                this.convertText();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831553, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(18);
            SymbolGlyph.fontColor([ThemeHelper.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('转换');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(ThemeHelper.getAccentColor());
            Text.margin({ left: 6 });
        }, Text);
        Text.pop();
        Row.pop();
        // Convert Button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Output Area
            Column.create();
            // Output Area
            Column.width('100%');
            // Output Area
            Column.padding({ left: 16, right: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('输出框');
            Text.fontSize(13);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.height(32);
            Button.backgroundColor(ThemeHelper.getAccentLightColor());
            Button.borderRadius(16);
            Button.padding({ left: 12, right: 12 });
            Button.onClick(() => {
                this.copyOutput();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831925, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(16);
            SymbolGlyph.fontColor([ThemeHelper.getAccentColor()]);
        }, SymbolGlyph);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.copyBtnText);
            Text.fontSize(13);
            Text.fontColor(ThemeHelper.getAccentColor());
            Text.margin({ left: 4 });
        }, Text);
        Text.pop();
        Row.pop();
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '转换后的纯文本', text: this.outputText });
            TextArea.height(170);
            TextArea.width('100%');
            TextArea.fontSize(14);
            TextArea.borderRadius(12);
            TextArea.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
            TextArea.padding(12);
            TextArea.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            TextArea.enabled(false);
        }, TextArea);
        // Output Area
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.layoutWeight(1);
        }, Blank);
        Blank.pop();
        // Content
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export default ConvertPage;
