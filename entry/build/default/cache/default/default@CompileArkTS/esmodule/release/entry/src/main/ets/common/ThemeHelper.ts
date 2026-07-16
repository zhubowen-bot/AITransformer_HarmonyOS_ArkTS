import type common from "@ohos:app.ability.common";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import window from "@ohos:window";
export class ThemeHelper {
    static readonly THEME_SYSTEM: string = 'system';
    static readonly THEME_DARK: string = 'dark';
    static readonly THEME_LIGHT: string = 'light';
    private static readonly COLOR_MAP: Record<string, string> = {
        'blue': '#3B82F6',
        'green': '#059669',
        'orange': '#EA580C',
        'purple': '#7C3AED',
        'cyan': '#0891B2',
        'rose': '#E11D48'
    };
    static applyTheme(theme: string, context: common.UIAbilityContext): void {
        let appContext = context.getApplicationContext();
        let mode: ConfigurationConstant.ColorMode = ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET;
        if (theme === ThemeHelper.THEME_DARK) {
            mode = ConfigurationConstant.ColorMode.COLOR_MODE_DARK;
        }
        else if (theme === ThemeHelper.THEME_LIGHT) {
            mode = ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
        }
        try {
            appContext.setColorMode(mode);
        }
        catch (e) {
            console.error('applyTheme setColorMode error', JSON.stringify(e));
        }
        let currentMode: ConfigurationConstant.ColorMode = ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
        if (theme === ThemeHelper.THEME_DARK) {
            currentMode = ConfigurationConstant.ColorMode.COLOR_MODE_DARK;
        }
        else if (theme === ThemeHelper.THEME_LIGHT) {
            currentMode = ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
        }
        else {
            let configMode: ConfigurationConstant.ColorMode | undefined = context.config.colorMode;
            // 排除 COLOR_MODE_NOT_SET，该值表示配置尚未传播到位，此时保留 AppStorage 中的已有值或默认值
            if (configMode !== undefined && configMode !== ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
                currentMode = configMode;
            }
            else {
                // 如果 AppStorage 中已有有效的 currentColorMode，保留它
                let storedMode = AppStorage.get<ConfigurationConstant.ColorMode>('currentColorMode');
                if (storedMode !== undefined && storedMode !== ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
                    currentMode = storedMode;
                }
            }
        }
        AppStorage.setOrCreate<ConfigurationConstant.ColorMode>('currentColorMode', currentMode);
    }
    static getColorTheme(): string {
        return AppStorage.get<string>('appColorTheme') || 'blue';
    }
    static getAccentColor(): string {
        return ThemeHelper.COLOR_MAP[ThemeHelper.getColorTheme()] || '#3B82F6';
    }
    static getAccentLightColor(): string {
        let hex: string = ThemeHelper.getAccentColor();
        let r: number = parseInt(hex.substring(1, 3), 16);
        let g: number = parseInt(hex.substring(3, 5), 16);
        let b: number = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.12)`;
    }
    static getAccentShadow(): string {
        let hex: string = ThemeHelper.getAccentColor();
        let r: number = parseInt(hex.substring(1, 3), 16);
        let g: number = parseInt(hex.substring(3, 5), 16);
        let b: number = parseInt(hex.substring(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, 0.3)`;
    }
    static isEffectiveDarkMode(theme: string, systemColorMode: ConfigurationConstant.ColorMode): boolean {
        if (theme === ThemeHelper.THEME_DARK) {
            return true;
        }
        if (theme === ThemeHelper.THEME_LIGHT) {
            return false;
        }
        return systemColorMode === ConfigurationConstant.ColorMode.COLOR_MODE_DARK;
    }
    static getEffectiveColorMode(): ConfigurationConstant.ColorMode {
        let mode: ConfigurationConstant.ColorMode | undefined = AppStorage.get<ConfigurationConstant.ColorMode>('currentColorMode');
        if (mode === undefined || mode === ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET) {
            return ConfigurationConstant.ColorMode.COLOR_MODE_LIGHT;
        }
        return mode;
    }
    static setStatusBarColor(context: common.UIAbilityContext, bgColor: string): void {
        let appTheme: string = AppStorage.get<string>('appTheme') || 'system';
        let currentMode: ConfigurationConstant.ColorMode = ThemeHelper.getEffectiveColorMode();
        let isDark: boolean = ThemeHelper.isEffectiveDarkMode(appTheme, currentMode);
        let contentColor: string = isDark ? '#FFFFFFFF' : '#FF000000';
        window.getLastWindow(context).then((mainWindow: window.Window) => {
            mainWindow.setWindowSystemBarProperties({
                statusBarColor: bgColor,
                statusBarContentColor: contentColor
            });
        }).catch((e: Error) => {
            console.error('setStatusBarColor error', JSON.stringify(e));
        });
    }
    static updateStatusBarColor(context: common.UIAbilityContext): void {
        let currentMode: ConfigurationConstant.ColorMode = ThemeHelper.getEffectiveColorMode();
        let isDark: boolean = ThemeHelper.isEffectiveDarkMode(AppStorage.get<string>('appTheme') || 'system', currentMode);
        ThemeHelper.setStatusBarColor(context, isDark ? '#FF0F172A' : '#FFF8FAFC');
    }
}
