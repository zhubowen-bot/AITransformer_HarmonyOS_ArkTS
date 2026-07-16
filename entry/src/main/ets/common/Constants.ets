export class Constants {
  static readonly THEME_KEY: string = 'app_theme';
  static readonly COLOR_THEME_KEY: string = 'app_color_theme';
  static readonly CUSTOM_TOOLS_KEY: string = 'custom_tools';
  static readonly HIDDEN_TOOLS_KEY: string = 'hidden_tools';
  static readonly TOOLS_ORDER_KEY: string = 'tools_order';
  static readonly CURRENT_CATEGORY_KEY: string = 'current_category';

  static readonly COLOR_THEMES: string[] = ['blue', 'green', 'orange', 'purple', 'cyan', 'rose'];

  static readonly COLOR_THEME_NAMES: Record<string, string> = {
    'blue': '蓝青色（默认）',
    'green': '翠绿色',
    'orange': '暖橙色',
    'purple': '典雅紫',
    'cyan': '湖水青',
    'rose': '玫瑰红'
  };

  static readonly THEME_OPTIONS: string[] = ['system', 'light', 'dark'];

  static readonly THEME_OPTION_NAMES: Record<string, string> = {
    'system': '跟随系统',
    'light': '浅色模式',
    'dark': '深色模式'
  };
}

export function getDefaultIconName(name: string): string {
  if (name.length <= 2) {
    return name;
  }
  return name.substring(0, 2);
}
