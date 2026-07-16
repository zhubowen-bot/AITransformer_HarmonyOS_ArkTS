import UIAbility from "@ohos:app.ability.UIAbility";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import type Want from "@ohos:app.ability.Want";
import type common from "@ohos:app.ability.common";
import type { Configuration } from "@ohos:app.ability.Configuration";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import type window from "@ohos:window";
import preferences from "@ohos:data.preferences";
import type { BusinessError } from "@ohos:base";
import webview from "@ohos:web.webview";
import { ThemeHelper } from "@bundle:com.aitransformer.bowenapp/entry/ets/common/ThemeHelper";
import { DEFAULT_AI_TOOLS, DEFAULT_SEARCH_TOOLS } from "@bundle:com.aitransformer.bowenapp/entry/ets/model/ToolData";
import type { CustomToolData } from "@bundle:com.aitransformer.bowenapp/entry/ets/model/ToolData";
export default class EntryAbility extends UIAbility {
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        const ctx: common.UIAbilityContext = this.context;
        const prefs: preferences.Preferences = preferences.getPreferencesSync(ctx, { name: 'toolData' });
        const customTools: string = prefs.getSync('customTools', '[]') as string;
        const hiddenTools: string = prefs.getSync('hiddenTools', '[]') as string;
        const toolsOrder: string = prefs.getSync('toolsOrder', '{}') as string;
        const appTheme: string = prefs.getSync('appTheme', 'system') as string;
        const appColorTheme: string = prefs.getSync('appColorTheme', 'blue') as string;
        AppStorage.setOrCreate<string>('customTools', customTools);
        AppStorage.setOrCreate<string>('hiddenTools', hiddenTools);
        AppStorage.setOrCreate<string>('toolsOrder', toolsOrder);
        AppStorage.setOrCreate<string>('appTheme', appTheme);
        AppStorage.setOrCreate<string>('appColorTheme', appColorTheme);
        ThemeHelper.applyTheme(appTheme, ctx);
        // Initialize WebEngine for ArkWeb
        let features: webview.BackForwardCacheSupportedFeatures = new webview.BackForwardCacheSupportedFeatures();
        features.nativeEmbed = true;
        features.mediaTakeOver = true;
        webview.WebviewController.enableBackForwardCache(features);
        webview.WebviewController.initializeWebEngine();
        // Preconnect known tool URLs to accelerate first Web page load
        this.preconnectToolUrls();
    }
    preconnectToolUrls(): void {
        let urls: string[] = [];
        let addUrl = (url: string): void => {
            if (url.startsWith('http://') || url.startsWith('https://')) {
                for (let i = 0; i < urls.length; i++) {
                    if (urls[i] === url) {
                        return;
                    }
                }
                urls.push(url);
            }
        };
        for (let tool of DEFAULT_AI_TOOLS) {
            addUrl(tool.url);
        }
        for (let tool of DEFAULT_SEARCH_TOOLS) {
            addUrl(tool.url);
        }
        let customToolsStr: string = AppStorage.get<string>('customTools') as string;
        if (customToolsStr && customToolsStr !== '[]') {
            try {
                let data: CustomToolData[] = JSON.parse(customToolsStr);
                for (let item of data) {
                    addUrl(item.url);
                }
            }
            catch (e) {
                console.error('parse customTools error', JSON.stringify(e));
            }
        }
        for (let url of urls) {
            try {
                webview.WebviewController.prepareForPageLoad(url, true, 2);
            }
            catch (e) {
                console.error('prepareForPageLoad error', url, JSON.stringify(e));
            }
        }
    }
    onConfigurationUpdate(newConfig: Configuration): void {
        let colorMode: ConfigurationConstant.ColorMode | undefined = newConfig.colorMode;
        if (colorMode !== undefined) {
            AppStorage.setOrCreate<ConfigurationConstant.ColorMode>('currentColorMode', colorMode);
            ThemeHelper.updateStatusBarColor(this.context);
        }
    }
    onDestroy(): void {
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        windowStage.loadContent('pages/Index', (err: BusinessError) => {
            if (err.code) {
                console.error('Failed to load content', JSON.stringify(err));
                return;
            }
            // 确保 currentColorMode 从配置中正确获取（onCreate 阶段配置可能尚未传播到位）
            let appTheme: string = AppStorage.get<string>('appTheme') || 'system';
            if (appTheme === 'system') {
                let configMode: ConfigurationConstant.ColorMode | undefined = this.context.config.colorMode;
                if (configMode !== undefined && configMode !== ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
                    AppStorage.setOrCreate<ConfigurationConstant.ColorMode>('currentColorMode', configMode);
                }
            }
            ThemeHelper.updateStatusBarColor(this.context);
        });
    }
    onWindowStageDestroy(): void {
    }
    onForeground(): void {
        // 兜底：确保 currentColorMode 正确，onCreate 阶段配置可能尚未传播到位
        let appTheme: string = AppStorage.get<string>('appTheme') || 'system';
        if (appTheme === 'system') {
            let configMode: ConfigurationConstant.ColorMode | undefined = this.context.config.colorMode;
            if (configMode !== undefined && configMode !== ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
                AppStorage.setOrCreate<ConfigurationConstant.ColorMode>('currentColorMode', configMode);
                ThemeHelper.updateStatusBarColor(this.context);
            }
        }
    }
    onBackground(): void {
    }
}
