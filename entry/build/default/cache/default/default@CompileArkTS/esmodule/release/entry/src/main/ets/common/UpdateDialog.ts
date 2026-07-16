if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface UpdateDialog_Params {
    controller?: CustomDialogController;
    isChecked?: boolean;
}
import type common from "@ohos:app.ability.common";
import preferences from "@ohos:data.preferences";
const VERSION_NAME: string = '11.0.0';
const PREF_KEY_PREFIX: string = 'update_dialog_dismissed_';
export class UpdateDialog extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = undefined;
        this.__isChecked = new ObservedPropertySimplePU(false, this, "isChecked");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: UpdateDialog_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.isChecked !== undefined) {
            this.isChecked = params.isChecked;
        }
    }
    updateStateVars(params: UpdateDialog_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isChecked.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isChecked.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller?: CustomDialogController;
    setController(ctr: CustomDialogController) {
        this.controller = ctr;
    }
    private __isChecked: ObservedPropertySimplePU<boolean>;
    get isChecked() {
        return this.__isChecked.get();
    }
    set isChecked(newValue: boolean) {
        this.__isChecked.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(24);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(20);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Header
            Column.create();
            // Header
            Column.width('100%');
            // Header
            Column.padding({ top: 8, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('v' + VERSION_NAME + ' 版本更新日志');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF1E293B');
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('全新原生鸿蒙体验');
            Text.fontSize(14);
            Text.fontColor('#FF64748B');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        // Header
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Divider
            Divider.create();
            // Divider
            Divider.width('100%');
            // Divider
            Divider.color('#FFF1F5F9');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Scrollable content
            Scroll.create();
            // Scrollable content
            Scroll.width('100%');
            // Scrollable content
            Scroll.height(360);
            // Scrollable content
            Scroll.scrollBar(BarState.Auto);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding({ right: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Apology / Data loss notice
            Column.create();
            // Apology / Data loss notice
            Column.width('100%');
            // Apology / Data loss notice
            Column.padding(14);
            // Apology / Data loss notice
            Column.backgroundColor('#FFFEF2F2');
            // Apology / Data loss notice
            Column.borderRadius(12);
            // Apology / Data loss notice
            Column.border({ width: 1, color: '#FFFECACA' });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('!');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.width(28);
            Text.height(28);
            Text.textAlign(TextAlign.Center);
            Text.borderRadius(14);
            Text.backgroundColor('#FFEF4444');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('数据迁移说明');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FF991F1F');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('因底层架构全面重构，本次更新会抹除所有用户数据，感谢您的理解与支持！');
            Text.fontSize(14);
            Text.fontColor('#FFB91C1C');
            Text.lineHeight(22);
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        // Apology / Data loss notice
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Core changes
            Text.create('核心变革：完全重写，原生蜕变');
            // Core changes
            Text.fontSize(16);
            // Core changes
            Text.fontWeight(FontWeight.Bold);
            // Core changes
            Text.fontColor('#FF1E293B');
            // Core changes
            Text.width('100%');
            // Core changes
            Text.margin({ top: 16, bottom: 8 });
        }, Text);
        // Core changes
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新版本采用 ArkTS + C++ 原生技术栈彻底重写了整个应用，取代原有的 ArkWeb 混合架构。内存管理、性能调度、资源分配、页面加载全面优化。所有页面、导航栏、标签栏、图标均换用鸿蒙原生组件与设计风格，同时保留了备受好评的沉浸光感效果。在保证功能上完全对齐老版本，并带来以下重大升级：');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Highlights
            Text.create('亮点一览');
            // Highlights
            Text.fontSize(16);
            // Highlights
            Text.fontWeight(FontWeight.Bold);
            // Highlights
            Text.fontColor('#FF1E293B');
            // Highlights
            Text.width('100%');
            // Highlights
            Text.margin({ top: 16, bottom: 10 });
        }, Text);
        // Highlights
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Item 1
            Column.create();
            // Item 1
            Column.width('100%');
            // Item 1
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(8);
            Text.height(8);
            Text.borderRadius(4);
            Text.backgroundColor('#FF3B82F6');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('性能暴增，流畅如飞');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF1E293B');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('内存占用降低 30%，性能提升 50% — 原生方案彻底告别混合架构的臃肿。\n智能预判行动：预连接 + 预加载技术，网页启动速度大幅优化。\n动画丝滑细腻：弹簧动画配合触顶/触底反弹效果，彻底解决原有卡顿、掉帧及页面切换 Bug。');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ top: 6, left: 16 });
        }, Text);
        Text.pop();
        // Item 1
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Item 2
            Column.create();
            // Item 2
            Column.width('100%');
            // Item 2
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(8);
            Text.height(8);
            Text.borderRadius(4);
            Text.backgroundColor('#FF3B82F6');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('交互升级，切换自如');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF1E293B');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新增网页标题栏，无需退出当前页面即可快速切换，操作效率倍增。');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ top: 6, left: 16 });
        }, Text);
        Text.pop();
        // Item 2
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Item 3
            Column.create();
            // Item 3
            Column.width('100%');
            // Item 3
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(8);
            Text.height(8);
            Text.borderRadius(4);
            Text.backgroundColor('#FF3B82F6');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('数据更安全，告别误删');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF1E293B');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('原生开发将用户数据从缓存中"解救"出来，避免清理缓存时意外丢失重要信息。');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ top: 6, left: 16 });
        }, Text);
        Text.pop();
        // Item 3
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Item 4
            Column.create();
            // Item 4
            Column.width('100%');
            // Item 4
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(8);
            Text.height(8);
            Text.borderRadius(4);
            Text.backgroundColor('#FF3B82F6');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('视觉焕新，美不胜收');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF1E293B');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('全新应用图标：简洁耐看，告别"丑"标签。\n全组件统一：全部采用鸿蒙原生组件，视觉高度协调。\n主题色彩同步至沉浸光感悬浮导航栏，色彩观感统一和谐。\n重写所有 UI，界面更精致、更美观。');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ top: 6, left: 16 });
        }, Text);
        Text.pop();
        // Item 4
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Item 5
            Column.create();
            // Item 5
            Column.width('100%');
            // Item 5
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(8);
            Text.height(8);
            Text.borderRadius(4);
            Text.backgroundColor('#FF3B82F6');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支持作者，共创美好');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF1E293B');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新增赞助入口，欢迎您用好评或打赏支持我们持续创作！');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ top: 6, left: 16 });
        }, Text);
        Text.pop();
        // Item 5
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Item 6
            Column.create();
            // Item 6
            Column.width('100%');
            // Item 6
            Column.margin({ bottom: 14 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.alignItems(VerticalAlign.Top);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('');
            Text.width(8);
            Text.height(8);
            Text.borderRadius(4);
            Text.backgroundColor('#FF3B82F6');
            Text.margin({ top: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('权限管理问题修复');
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FF1E293B');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新增摄像头权限授予，优化权限的授权流程，权限管理更加丝滑简单，您可以自由使用 AI 的语音输入和视频通话功能了！');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.lineHeight(22);
            Text.width('100%');
            Text.margin({ top: 6, left: 16 });
        }, Text);
        Text.pop();
        // Item 6
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Closing
            Text.create('我们对美的追求永无止境，感谢您一路相伴。新版 ' + VERSION_NAME + ' 已就绪，迎接全新体验！');
            // Closing
            Text.fontSize(14);
            // Closing
            Text.fontColor('#FF64748B');
            // Closing
            Text.lineHeight(22);
            // Closing
            Text.width('100%');
            // Closing
            Text.margin({ top: 12 });
        }, Text);
        // Closing
        Text.pop();
        Column.pop();
        // Scrollable content
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Divider
            Divider.create();
            // Divider
            Divider.width('100%');
            // Divider
            Divider.color('#FFF1F5F9');
            // Divider
            Divider.margin({ top: 8 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Checkbox
            Row.create();
            // Checkbox
            Row.width('100%');
            // Checkbox
            Row.padding({ top: 12, bottom: 8 });
            // Checkbox
            Row.onClick(() => {
                this.isChecked = !this.isChecked;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Checkbox.create({ name: 'dontShowAgain', group: 'updateGroup' });
            Checkbox.width(20);
            Checkbox.height(20);
            Checkbox.select(false);
            Checkbox.selectedColor('#FF3B82F6');
            Checkbox.onChange((value: boolean) => {
                this.isChecked = value;
            });
        }, Checkbox);
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('当前版本不再弹出');
            Text.fontSize(14);
            Text.fontColor('#FF475569');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        // Checkbox
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Confirm button
            Button.createWithChild();
            // Confirm button
            Button.width('100%');
            // Confirm button
            Button.height(44);
            // Confirm button
            Button.backgroundColor('#FF3B82F6');
            // Confirm button
            Button.borderRadius(22);
            // Confirm button
            Button.type(ButtonType.Capsule);
            // Confirm button
            Button.margin({ top: 4, bottom: 8 });
            // Confirm button
            Button.onClick(() => {
                if (this.isChecked) {
                    this.saveDismissPreference();
                }
                this.controller?.close();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('我知道了');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        // Confirm button
        Button.pop();
        Column.pop();
    }
    saveDismissPreference(): void {
        try {
            let ctx: common.UIAbilityContext = getContext(this) as common.UIAbilityContext;
            let prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'updateDialogPrefs' });
            prefs.putSync(PREF_KEY_PREFIX + VERSION_NAME, true);
            prefs.flushSync();
        }
        catch (e) {
            console.error('saveDismissPreference error', JSON.stringify(e));
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
