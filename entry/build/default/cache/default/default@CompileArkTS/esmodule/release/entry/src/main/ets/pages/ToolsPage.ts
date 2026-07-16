if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ToolsPage_Params {
    currentCategory?: string;
    urlInput?: string;
    isEditMode?: boolean;
    showAddModal?: boolean;
    showFavoriteModal?: boolean;
    customTools?: ToolItem[];
    hiddenTools?: string[];
    isCardFocused?: boolean;
    scrollOffset?: number;
    toolsOrder?: Record<string, string[]>;
    dragPreviewToolName?: string;
    appTheme?: string;
    currentColorMode?: ConfigurationConstant.ColorMode;
    categories?: CategoryInfo[];
    addToolName?: string;
    addToolUrl?: string;
    selectedIconUri?: string;
    favCategory?: string;
    scroller?: Scroller;
    draggedItemId?: string;
}
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import preferences from "@ohos:data.preferences";
import { DEFAULT_AI_TOOLS, DEFAULT_SEARCH_TOOLS } from "@bundle:com.aitransformer.bowenapp/entry/ets/model/ToolData";
import type { ToolItem, CustomToolData } from "@bundle:com.aitransformer.bowenapp/entry/ets/model/ToolData";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
interface CategoryInfo {
    key: string;
    name: string;
}
class ToolsPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentCategory = new ObservedPropertySimplePU('ai', this, "currentCategory");
        this.__urlInput = new ObservedPropertySimplePU('', this, "urlInput");
        this.__isEditMode = new ObservedPropertySimplePU(false, this, "isEditMode");
        this.__showAddModal = new ObservedPropertySimplePU(false, this, "showAddModal");
        this.__showFavoriteModal = new ObservedPropertySimplePU(false, this, "showFavoriteModal");
        this.__customTools = new ObservedPropertyObjectPU([], this, "customTools");
        this.__hiddenTools = new ObservedPropertyObjectPU([], this, "hiddenTools");
        this.__isCardFocused = new ObservedPropertySimplePU(false, this, "isCardFocused");
        this.__scrollOffset = new ObservedPropertySimplePU(0, this, "scrollOffset");
        this.__toolsOrder = new ObservedPropertyObjectPU({}, this, "toolsOrder");
        this.__dragPreviewToolName = new ObservedPropertySimplePU('', this, "dragPreviewToolName");
        this.__appTheme = this.createStorageLink('appTheme', 'system', "appTheme");
        this.__currentColorMode = this.createStorageLink('currentColorMode', ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT, "currentColorMode");
        this.categories = [
            { key: 'ai', name: 'AI网址导航' },
            { key: 'search', name: '搜索引擎' },
            { key: 'saved', name: '我的保存' }
        ];
        this.addToolName = '';
        this.addToolUrl = '';
        this.__selectedIconUri = new ObservedPropertySimplePU('', this, "selectedIconUri");
        this.__favCategory = new ObservedPropertySimplePU('saved', this, "favCategory");
        this.scroller = new Scroller();
        this.draggedItemId = '';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ToolsPage_Params) {
        if (params.currentCategory !== undefined) {
            this.currentCategory = params.currentCategory;
        }
        if (params.urlInput !== undefined) {
            this.urlInput = params.urlInput;
        }
        if (params.isEditMode !== undefined) {
            this.isEditMode = params.isEditMode;
        }
        if (params.showAddModal !== undefined) {
            this.showAddModal = params.showAddModal;
        }
        if (params.showFavoriteModal !== undefined) {
            this.showFavoriteModal = params.showFavoriteModal;
        }
        if (params.customTools !== undefined) {
            this.customTools = params.customTools;
        }
        if (params.hiddenTools !== undefined) {
            this.hiddenTools = params.hiddenTools;
        }
        if (params.isCardFocused !== undefined) {
            this.isCardFocused = params.isCardFocused;
        }
        if (params.scrollOffset !== undefined) {
            this.scrollOffset = params.scrollOffset;
        }
        if (params.toolsOrder !== undefined) {
            this.toolsOrder = params.toolsOrder;
        }
        if (params.dragPreviewToolName !== undefined) {
            this.dragPreviewToolName = params.dragPreviewToolName;
        }
        if (params.categories !== undefined) {
            this.categories = params.categories;
        }
        if (params.addToolName !== undefined) {
            this.addToolName = params.addToolName;
        }
        if (params.addToolUrl !== undefined) {
            this.addToolUrl = params.addToolUrl;
        }
        if (params.selectedIconUri !== undefined) {
            this.selectedIconUri = params.selectedIconUri;
        }
        if (params.favCategory !== undefined) {
            this.favCategory = params.favCategory;
        }
        if (params.scroller !== undefined) {
            this.scroller = params.scroller;
        }
        if (params.draggedItemId !== undefined) {
            this.draggedItemId = params.draggedItemId;
        }
    }
    updateStateVars(params: ToolsPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentCategory.purgeDependencyOnElmtId(rmElmtId);
        this.__urlInput.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditMode.purgeDependencyOnElmtId(rmElmtId);
        this.__showAddModal.purgeDependencyOnElmtId(rmElmtId);
        this.__showFavoriteModal.purgeDependencyOnElmtId(rmElmtId);
        this.__customTools.purgeDependencyOnElmtId(rmElmtId);
        this.__hiddenTools.purgeDependencyOnElmtId(rmElmtId);
        this.__isCardFocused.purgeDependencyOnElmtId(rmElmtId);
        this.__scrollOffset.purgeDependencyOnElmtId(rmElmtId);
        this.__toolsOrder.purgeDependencyOnElmtId(rmElmtId);
        this.__dragPreviewToolName.purgeDependencyOnElmtId(rmElmtId);
        this.__appTheme.purgeDependencyOnElmtId(rmElmtId);
        this.__currentColorMode.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedIconUri.purgeDependencyOnElmtId(rmElmtId);
        this.__favCategory.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentCategory.aboutToBeDeleted();
        this.__urlInput.aboutToBeDeleted();
        this.__isEditMode.aboutToBeDeleted();
        this.__showAddModal.aboutToBeDeleted();
        this.__showFavoriteModal.aboutToBeDeleted();
        this.__customTools.aboutToBeDeleted();
        this.__hiddenTools.aboutToBeDeleted();
        this.__isCardFocused.aboutToBeDeleted();
        this.__scrollOffset.aboutToBeDeleted();
        this.__toolsOrder.aboutToBeDeleted();
        this.__dragPreviewToolName.aboutToBeDeleted();
        this.__appTheme.aboutToBeDeleted();
        this.__currentColorMode.aboutToBeDeleted();
        this.__selectedIconUri.aboutToBeDeleted();
        this.__favCategory.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentCategory: ObservedPropertySimplePU<string>;
    get currentCategory() {
        return this.__currentCategory.get();
    }
    set currentCategory(newValue: string) {
        this.__currentCategory.set(newValue);
    }
    private __urlInput: ObservedPropertySimplePU<string>;
    get urlInput() {
        return this.__urlInput.get();
    }
    set urlInput(newValue: string) {
        this.__urlInput.set(newValue);
    }
    private __isEditMode: ObservedPropertySimplePU<boolean>;
    get isEditMode() {
        return this.__isEditMode.get();
    }
    set isEditMode(newValue: boolean) {
        this.__isEditMode.set(newValue);
    }
    private __showAddModal: ObservedPropertySimplePU<boolean>;
    get showAddModal() {
        return this.__showAddModal.get();
    }
    set showAddModal(newValue: boolean) {
        this.__showAddModal.set(newValue);
    }
    private __showFavoriteModal: ObservedPropertySimplePU<boolean>;
    get showFavoriteModal() {
        return this.__showFavoriteModal.get();
    }
    set showFavoriteModal(newValue: boolean) {
        this.__showFavoriteModal.set(newValue);
    }
    private __customTools: ObservedPropertyObjectPU<ToolItem[]>;
    get customTools() {
        return this.__customTools.get();
    }
    set customTools(newValue: ToolItem[]) {
        this.__customTools.set(newValue);
    }
    private __hiddenTools: ObservedPropertyObjectPU<string[]>;
    get hiddenTools() {
        return this.__hiddenTools.get();
    }
    set hiddenTools(newValue: string[]) {
        this.__hiddenTools.set(newValue);
    }
    private __isCardFocused: ObservedPropertySimplePU<boolean>;
    get isCardFocused() {
        return this.__isCardFocused.get();
    }
    set isCardFocused(newValue: boolean) {
        this.__isCardFocused.set(newValue);
    }
    private __scrollOffset: ObservedPropertySimplePU<number>;
    get scrollOffset() {
        return this.__scrollOffset.get();
    }
    set scrollOffset(newValue: number) {
        this.__scrollOffset.set(newValue);
    }
    private __toolsOrder: ObservedPropertyObjectPU<Record<string, string[]>>;
    get toolsOrder() {
        return this.__toolsOrder.get();
    }
    set toolsOrder(newValue: Record<string, string[]>) {
        this.__toolsOrder.set(newValue);
    }
    private __dragPreviewToolName: ObservedPropertySimplePU<string>;
    get dragPreviewToolName() {
        return this.__dragPreviewToolName.get();
    }
    set dragPreviewToolName(newValue: string) {
        this.__dragPreviewToolName.set(newValue);
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
    private categories: CategoryInfo[];
    private addToolName: string;
    private addToolUrl: string;
    private __selectedIconUri: ObservedPropertySimplePU<string>;
    get selectedIconUri() {
        return this.__selectedIconUri.get();
    }
    set selectedIconUri(newValue: string) {
        this.__selectedIconUri.set(newValue);
    }
    private __favCategory: ObservedPropertySimplePU<string>;
    get favCategory() {
        return this.__favCategory.get();
    }
    set favCategory(newValue: string) {
        this.__favCategory.set(newValue);
    }
    private scroller: Scroller;
    private draggedItemId: string;
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
            }
            catch (e) {
                this.customTools = [];
            }
        }
        else {
            this.customTools = [];
        }
    }
    loadHiddenTools(): void {
        let stored: string = AppStorage.get<string>('hiddenTools') as string;
        if (stored && stored !== '[]') {
            try {
                this.hiddenTools = JSON.parse(stored);
            }
            catch (e) {
                this.hiddenTools = [];
            }
        }
        else {
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
            }
            catch (e) {
                this.toolsOrder = {};
            }
        }
        else {
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
        }
        else {
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
        }
        else {
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
        }
        else if (category === 'search') {
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
            }
            catch (e) {
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
        }
        catch (e) {
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
        return isSelected ? ThemeHelper.getAccentColor() : { "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" };
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
    dragPreviewContent(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding(12);
            Column.borderRadius(12);
            Column.backgroundColor(ThemeHelper.getAccentColor());
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.dragPreviewToolName);
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(Color.White);
            Text.maxLines(1);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        Column.pop();
    }
    buildToolGrid(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Category Tabs - inside scroll
            Row.create();
            // Category Tabs - inside scroll
            Row.width('100%');
            // Category Tabs - inside scroll
            Row.justifyContent(FlexAlign.Center);
            // Category Tabs - inside scroll
            Row.padding({ top: 28, bottom: 28 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const category = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(category.name);
                    Text.fontSize(14);
                    Text.fontWeight(this.currentCategory === category.key ? FontWeight.Medium : FontWeight.Regular);
                    Text.fontColor(this.getCategoryFontColor(this.currentCategory === category.key));
                    Text.padding({ left: 18, right: 18, top: 8, bottom: 8 });
                    Text.margin({ left: 4, right: 4 });
                    Text.borderRadius(22);
                    Text.backgroundColor(this.currentCategory === category.key ?
                        ThemeHelper.getAccentLightColor() : 'rgba(255, 255, 255, 0.15)');
                    Text.onClick(() => {
                        this.switchCategory(category.key);
                    });
                }, Text);
                Text.pop();
            };
            this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction, (item: CategoryInfo) => item.key, false, false);
        }, ForEach);
        ForEach.pop();
        // Category Tabs - inside scroll
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({
                direction: FlexDirection.Row,
                wrap: FlexWrap.Wrap,
                justifyContent: FlexAlign.Start
            });
            Flex.width('100%');
            Flex.padding({ left: 12, right: 12 });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Render tools inline
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const tool = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('25%');
                    Column.alignItems(HorizontalAlign.Center);
                    Column.padding({ top: 12, bottom: 12 });
                    Column.draggable(this.isEditMode);
                    Column.onDragStart(() => {
                        this.draggedItemId = tool.id;
                        this.dragPreviewToolName = tool.name;
                        return { builder: (): void => this.dragPreviewContent() };
                    });
                    Column.onDrop(() => {
                        if (this.draggedItemId) {
                            this.reorderSwap(this.draggedItemId, tool.id);
                            this.draggedItemId = '';
                        }
                    });
                    Column.onDragEnd(() => {
                        this.draggedItemId = '';
                    });
                    Column.onClick(() => {
                        if (!this.isEditMode) {
                            this.openUrl(tool.url, tool.name);
                        }
                    });
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Stack.create({ alignContent: Alignment.TopEnd });
                    Stack.width(56);
                    Stack.height(56);
                }, Stack);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (tool.icon && tool.icon !== '') {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (tool.icon.startsWith('file://') || tool.icon.startsWith('content://') || tool.icon.startsWith('/')) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Image.create(tool.icon);
                                            Image.width(56);
                                            Image.height(56);
                                            Image.borderRadius(12);
                                            Image.objectFit(ImageFit.Cover);
                                            Image.hitTestBehavior(HitTestMode.None);
                                        }, Image);
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Image.create({ get id() {
                                                    return typeof __getResourceId__ === "function" ? __getResourceId__(this) : -1;
                                                }, "type": -1, params: ['app.media.' + tool.icon], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                            Image.width(56);
                                            Image.height(56);
                                            Image.borderRadius(12);
                                            Image.objectFit(ImageFit.Contain);
                                            Image.hitTestBehavior(HitTestMode.None);
                                        }, Image);
                                    });
                                }
                            }, If);
                            If.pop();
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(this.getIconName(tool.name));
                                Text.fontSize(20);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor(Color.White);
                                Text.width(56);
                                Text.height(56);
                                Text.borderRadius(12);
                                Text.backgroundColor(this.getIconBackgroundColor(tool.name));
                                Text.textAlign(TextAlign.Center);
                            }, Text);
                            Text.pop();
                        });
                    }
                }, If);
                If.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.isEditMode) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create('×');
                                Text.fontSize(10);
                                Text.fontWeight(FontWeight.Bold);
                                Text.fontColor(Color.White);
                                Text.width(18);
                                Text.height(18);
                                Text.backgroundColor('#DC2626');
                                Text.borderRadius(9);
                                Text.textAlign(TextAlign.Center);
                                Text.offset({ x: 6, y: -6 });
                                Text.zIndex(1);
                                Text.onClick(() => {
                                    if (tool.isCustom) {
                                        this.deleteCustomTool(tool.id);
                                    }
                                    else {
                                        this.deleteTool(tool.id);
                                    }
                                });
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
                Stack.pop();
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Text.create(tool.name);
                    Text.fontSize(12);
                    Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    Text.textAlign(TextAlign.Center);
                    Text.maxLines(1);
                    Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                    Text.margin({ top: 4 });
                }, Text);
                Text.pop();
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.getToolsForCategory(this.currentCategory), forEachItemGenFunction, (tool: ToolItem) => tool.id, false, false);
        }, ForEach);
        // Render tools inline
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Add card inline
            Column.create();
            // Add card inline
            Column.width('25%');
            // Add card inline
            Column.alignItems(HorizontalAlign.Center);
            // Add card inline
            Column.padding({ top: 12, bottom: 12 });
            // Add card inline
            Column.onClick(() => {
                this.openAddModal();
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+');
            Text.fontSize(28);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.width(56);
            Text.height(56);
            Text.borderRadius(12);
            Text.border({ width: 2, style: BorderStyle.Dashed, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('添加');
            Text.fontSize(12);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        // Add card inline
        Column.pop();
        Flex.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Edit Button
            Button.createWithLabel(this.isEditMode ? '完成' : '编辑');
            // Edit Button
            Button.fontSize(14);
            // Edit Button
            Button.fontWeight(FontWeight.Bold);
            // Edit Button
            Button.fontColor(this.isEditMode ? Color.White : { "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Edit Button
            Button.backgroundColor(this.isEditMode ? ThemeHelper.getAccentColor() : 'rgba(255, 255, 255, 0.15)');
            // Edit Button
            Button.borderRadius(24);
            // Edit Button
            Button.padding({ left: 32, right: 32, top: 12, bottom: 12 });
            // Edit Button
            Button.margin({ top: 4, bottom: 28 });
            // Edit Button
            Button.shadow({ radius: 6, color: 'rgba(0, 0, 0, 0.1)', offsetY: 2 });
            // Edit Button
            Button.onClick(() => {
                this.toggleEditMode();
            });
        }, Button);
        // Edit Button
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Info Section
            Row.create();
            globalThis.Context.animation({ duration: 350, curve: Curve.EaseInOut, delay: 80 });
            // Info Section
            Row.width('100%');
            // Info Section
            Row.padding({ left: 48, right: 48 });
            // Info Section
            Row.margin({ top: 20, bottom: 16 });
            // Info Section
            Row.opacity(this.isCardFocused ? 1 : 0.45);
            globalThis.Context.animation(null);
            // Info Section
            Row.onClick(() => {
                this.isCardFocused = true;
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.padding(12);
            Column.borderRadius(12);
            Column.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('使用须知');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('本应用仅提供第三方 AI 平台的官方链接导航，不隶属于、不代表、不授权于任何第三方平台，也不对第三方网站的内容负责。所有 AI 服务均由原平台提供，本应用为纯前端应用，无服务器，不采集、不存储、不中转用户对话内容。');
            Text.fontSize(11);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(22);
            Text.margin({ bottom: 8 });
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('功能特性');
            Text.fontSize(12);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('· 多平台 AI 导航，一键访问主流 AI 服务\n· 支持自定义工具与收藏管理\n· 主题随心切换\n· 纯前端运行，无服务器、不中转数据\n· 鸿蒙ArkTS原生开发，沉浸式深度适配');
            Text.fontSize(11);
            Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.lineHeight(22);
            Text.width('100%');
        }, Text);
        Text.pop();
        Column.pop();
        // Info Section
        Row.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Full-height background
            Column.create();
            // Full-height background
            Column.width('100%');
            // Full-height background
            Column.height('100%');
            // Full-height background
            Column.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            // Full-height background
            Column.onClick(() => {
                this.isCardFocused = false;
            });
        }, Column);
        // Full-height background
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.create(this.scroller);
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.width('100%');
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.height('100%');
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.edgeEffect(EdgeEffect.Spring);
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.scrollBar(BarState.Off);
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.padding({ bottom: 80 });
            // Scrollable content (fills full area, padding at top for title bar)
            Scroll.onScroll(() => {
                this.scrollOffset = Math.max(this.scroller.currentOffset().yOffset, 0);
            });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.constraintSize({ minHeight: '100%' });
            Column.padding({ top: 64 });
            Column.onClick(() => {
                this.isCardFocused = false;
            });
        }, Column);
        this.buildToolGrid.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        Column.pop();
        // Scrollable content (fills full area, padding at top for title bar)
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
            Row.create();
            // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
            Row.width('100%');
            // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
            Row.padding({ left: 14, right: 14, top: 8, bottom: 12 });
            // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
            Row.backgroundColor(this.getInputBarBackground());
            // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
            Row.backdropBlur(this.getBlurRadius());
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('AI');
            Text.fontSize(14);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(ThemeHelper.getAccentColor());
            Text.width(36);
            Text.height(36);
            Text.borderRadius(18);
            Text.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '访问网页或保存为应用' });
            TextInput.layoutWeight(1);
            TextInput.height(36);
            TextInput.fontSize(14);
            TextInput.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            TextInput.placeholderColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            TextInput.placeholderFont({ size: 14 });
            TextInput.padding({ left: 10, right: 10 });
            TextInput.margin({ left: 8 });
            TextInput.onChange((value: string) => {
                this.urlInput = value;
            });
            TextInput.onSubmit(() => {
                this.navigateToInputUrl();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(36);
            Button.height(36);
            Button.borderRadius(18);
            Button.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Button.onClick(() => {
                this.navigateToInputUrl();
            });
            Button.margin({ left: 4 });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125832680, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([ThemeHelper.getAccentColor()]);
        }, SymbolGlyph);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.width(36);
            Button.height(36);
            Button.borderRadius(18);
            Button.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            Button.margin({ left: 8 });
            Button.onClick(() => {
                this.openFavoriteModal();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            SymbolGlyph.create({ "id": 125831605, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
            SymbolGlyph.fontSize(20);
            SymbolGlyph.fontColor([ThemeHelper.getAccentColor()]);
        }, SymbolGlyph);
        Button.pop();
        // Title Bar (HDS style: full-width, opaque at top, dynamic blur on scroll)
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Add Modal - conditional, not overlay
            if (this.showAddModal) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
                        Column.backgroundColor('rgba(0, 0, 0, 0.4)');
                        Column.position({ x: 0, y: 0 });
                        Column.zIndex(100);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('85%');
                        Column.padding(16);
                        Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Column.borderRadius(16);
                        Column.shadow({ radius: 16, color: 'rgba(0, 0, 0, 0.15)', offsetY: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('添加网站为应用');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(28);
                        Button.height(28);
                        Button.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.borderRadius(14);
                        Button.onClick(() => {
                            this.closeAddModal();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('x');
                        Text.fontSize(16);
                        Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('名称');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '例如：APPname' });
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.borderRadius(10);
                        TextInput.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                        TextInput.padding({ left: 12 });
                        TextInput.onChange((value: string) => {
                            this.addToolName = value;
                        });
                    }, TextInput);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('网址（请以https://格式开头）');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '例如：https://example.com' });
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.borderRadius(10);
                        TextInput.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                        TextInput.padding({ left: 12 });
                        TextInput.onChange((value: string) => {
                            this.addToolUrl = value;
                        });
                    }, TextInput);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('图标(可选)');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedIconUri) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Stack.create();
                                    Stack.width(64);
                                    Stack.height(64);
                                }, Stack);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.selectedIconUri);
                                    Image.width(64);
                                    Image.height(64);
                                    Image.borderRadius(12);
                                    Image.objectFit(ImageFit.Cover);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild();
                                    Button.width(20);
                                    Button.height(20);
                                    Button.borderRadius(10);
                                    Button.backgroundColor('rgba(0,0,0,0.5)');
                                    Button.position({ x: '100%', y: 0 });
                                    Button.offset({ x: -6, y: -6 });
                                    Button.onClick(() => {
                                        this.selectedIconUri = '';
                                    });
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                    SymbolGlyph.fontSize(12);
                                    SymbolGlyph.fontColor([Color.White]);
                                }, SymbolGlyph);
                                Button.pop();
                                Stack.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('已选择');
                                    Text.fontSize(11);
                                    Text.fontColor(ThemeHelper.getAccentColor());
                                    Text.margin({ top: 4 });
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.height(72);
                                    Column.justifyContent(FlexAlign.Center);
                                    Column.alignItems(HorizontalAlign.Center);
                                    Column.border({ width: 2, style: BorderStyle.Dashed, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                                    Column.borderRadius(12);
                                    Column.onClick(() => {
                                        this.pickImage();
                                    });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('+');
                                    Text.fontSize(24);
                                    Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('点击上传图片');
                                    Text.fontSize(11);
                                    Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                    Text.margin({ top: 2 });
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.flexGrow(1);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.borderRadius(10);
                        Button.onClick(() => {
                            this.closeAddModal();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('添加');
                        Button.flexGrow(1);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor(ThemeHelper.getAccentColor());
                        Button.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.borderRadius(10);
                        Button.border({ width: 1, color: ThemeHelper.getAccentColor() });
                        Button.shadow({ radius: 4, color: ThemeHelper.getAccentShadow(), offsetY: 2 });
                        Button.onClick(() => {
                            this.confirmAddTool();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            // Favorite Modal - conditional, not overlay
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // Favorite Modal - conditional, not overlay
            if (this.showFavoriteModal) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
                        Column.backgroundColor('rgba(0, 0, 0, 0.4)');
                        Column.position({ x: 0, y: 0 });
                        Column.zIndex(100);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('85%');
                        Column.padding(16);
                        Column.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Column.borderRadius(16);
                        Column.shadow({ radius: 16, color: 'rgba(0, 0, 0, 0.15)', offsetY: 8 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.margin({ bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('保存网站为应用');
                        Text.fontSize(16);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(36);
                        Button.height(36);
                        Button.backgroundColor(Color.Transparent);
                        Button.borderRadius(18);
                        Button.onClick(() => {
                            this.closeFavoriteModal();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        SymbolGlyph.fontSize(20);
                        SymbolGlyph.fontColor([{ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" }]);
                    }, SymbolGlyph);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('网站名称');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '输入网站名称' });
                        TextInput.height(40);
                        TextInput.fontSize(14);
                        TextInput.borderRadius(10);
                        TextInput.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                        TextInput.padding({ left: 12 });
                        TextInput.onChange((value: string) => {
                            this.addToolName = value;
                        });
                    }, TextInput);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('网址');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.addToolUrl);
                        Text.width('100%');
                        Text.height(40);
                        Text.fontSize(14);
                        Text.borderRadius(10);
                        Text.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                        Text.padding({ left: 12 });
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                    }, Text);
                    Text.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('分类');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 6 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding(8);
                        Column.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Column.borderRadius(10);
                        Column.border({ width: 1, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const cat = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.height(40);
                                Row.padding({ left: 4 });
                                Row.onClick(() => {
                                    this.favCategory = cat.key;
                                });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Radio.create({ value: cat.key, group: 'favCatGroup' });
                                Radio.checked(this.favCategory === cat.key);
                                Radio.width(20);
                                Radio.height(20);
                            }, Radio);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(cat.name);
                                Text.fontSize(14);
                                Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                Text.margin({ left: 8 });
                            }, Text);
                            Text.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.categories, forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.margin({ bottom: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('图标(可选)');
                        Text.fontSize(13);
                        Text.fontWeight(FontWeight.Medium);
                        Text.fontColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Text.margin({ bottom: 4 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.selectedIconUri) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Stack.create();
                                    Stack.width(64);
                                    Stack.height(64);
                                }, Stack);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.selectedIconUri);
                                    Image.width(64);
                                    Image.height(64);
                                    Image.borderRadius(12);
                                    Image.objectFit(ImageFit.Cover);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithChild();
                                    Button.width(20);
                                    Button.height(20);
                                    Button.borderRadius(10);
                                    Button.backgroundColor('rgba(0,0,0,0.5)');
                                    Button.position({ x: '100%', y: 0 });
                                    Button.offset({ x: -6, y: -6 });
                                    Button.onClick(() => {
                                        this.selectedIconUri = '';
                                    });
                                }, Button);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    SymbolGlyph.create({ "id": 125831487, "type": 40000, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                    SymbolGlyph.fontSize(12);
                                    SymbolGlyph.fontColor([Color.White]);
                                }, SymbolGlyph);
                                Button.pop();
                                Stack.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('已选择');
                                    Text.fontSize(11);
                                    Text.fontColor(ThemeHelper.getAccentColor());
                                    Text.margin({ top: 4 });
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.height(72);
                                    Column.justifyContent(FlexAlign.Center);
                                    Column.alignItems(HorizontalAlign.Center);
                                    Column.border({ width: 2, style: BorderStyle.Dashed, color: { "id": 16777247, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" } });
                                    Column.borderRadius(12);
                                    Column.onClick(() => {
                                        this.pickImage();
                                    });
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('+');
                                    Text.fontSize(24);
                                    Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('点击上传图片');
                                    Text.fontSize(11);
                                    Text.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                                    Text.margin({ top: 2 });
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.flexGrow(1);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor({ "id": 16777256, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.backgroundColor({ "id": 16777246, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.borderRadius(10);
                        Button.onClick(() => {
                            this.closeFavoriteModal();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('收藏');
                        Button.flexGrow(1);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.fontColor(ThemeHelper.getAccentColor());
                        Button.backgroundColor({ "id": 16777245, "type": 10001, params: [], "bundleName": "com.aitransformer.bowenapp", "moduleName": "entry" });
                        Button.borderRadius(10);
                        Button.border({ width: 1, color: ThemeHelper.getAccentColor() });
                        Button.shadow({ radius: 4, color: ThemeHelper.getAccentShadow(), offsetY: 2 });
                        Button.onClick(() => {
                            this.confirmFavorite();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
export default ToolsPage;
