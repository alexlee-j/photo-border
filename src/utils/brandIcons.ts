// 品牌图标映射
const defaultIconMap: { [key: string]: string[] } = {
  oppo: ["oppo", "OPPO1"],
  apple: ["apple-fill"],
  meizu: ["meizu"],
  fujifilm: ["fushi"],
  panasonic: ["panasonic"],
  canon: ["canon", "jianeng"],
  oneplus: ["oneplus"],
  vivo: ["vivo", "vivo1"],
  dji: ["DJI"],
  samsung: ["samsung"],
  huawei: ["huawei", "huawei1"],
  xiaomi: ["xiaomiguishu"],
  sony: ["sony"],
  leica: ["leica"],
  pentax: ["pentax"],
  ricoh: ["ricoh"],
  sigma: ["sigma"],
  nikon: ["nikons"],
  olympus: ["olympus"],
  nikons: ["nikons"],
  OnePlus: ["OnePlus"],
  Hasselblad: ["Hasselblad"],
};

export const getBrandIconClass = (brand: string): string => {
  const normalizedBrand = brand.toLowerCase().trim();

  // 精确匹配
  if (defaultIconMap[normalizedBrand]) {
    return defaultIconMap[normalizedBrand][0];
  }

  // 模糊匹配
  for (const [key, value] of Object.entries(defaultIconMap)) {
    if (normalizedBrand.includes(key)) {
      return value[0];
    }
  }

  return "";
};
