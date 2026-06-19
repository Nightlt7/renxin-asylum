/**
 * 根据 Vite 的 base 配置生成图片资源路径。
 * 在 GitHub Pages 等子路径部署下会自动加上前缀。
 */
export const imagePath = (path: string): string => `${import.meta.env.BASE_URL}assets/images/${path}`;
