export interface ToolItem {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
  isCustom: boolean;
}

export interface CustomToolData {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: string;
}

export const DEFAULT_AI_TOOLS: ToolItem[] = [
  { id: 'qwen', name: 'Qwen Studio', url: 'https://chat.qwen.ai', icon: 'qwen3', category: 'ai', isCustom: false },
  { id: 'zai', name: 'Z.ai', url: 'https://chat.z.ai', icon: 'zai2', category: 'ai', isCustom: false },
  { id: 'deepseek', name: 'Deepseek', url: 'https://chat.deepseek.com', icon: 'deepseek', category: 'ai', isCustom: false },
  { id: 'doubao', name: '豆包', url: 'https://www.doubao.com/chat', icon: 'doubao', category: 'ai', isCustom: false },
  { id: 'kimi', name: 'Kimi', url: 'https://www.kimi.com', icon: 'kimi', category: 'ai', isCustom: false },
  { id: 'minimax', name: 'MiniMax', url: 'https://agent.minimaxi.com', icon: 'minimax', category: 'ai', isCustom: false },
  { id: 'yiyan', name: '文心一言', url: 'https://yiyan.baidu.com/', icon: 'yiyan', category: 'ai', isCustom: false },
  { id: 'yuanbao', name: '元宝', url: 'https://yuanbao.tencent.com/chat/naQivTmsDa', icon: 'yuanbao', category: 'ai', isCustom: false }
];

export const DEFAULT_SEARCH_TOOLS: ToolItem[] = [
  { id: 'baidu', name: '百度', url: 'https://m.baidu.com/', icon: '', category: 'search', isCustom: false },
  { id: 'sogou', name: '搜狗', url: 'https://m.sogou.com/', icon: '', category: 'search', isCustom: false },
  { id: 'bing', name: '必应', url: 'https://www.bing.com', icon: '', category: 'search', isCustom: false }
];
