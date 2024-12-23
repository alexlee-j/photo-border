// 品牌图标映射
const defaultIconMap: { [key: string]: string[] } = {
  oppo: ["icon-oppo", "icon-OPPO1"],
  apple: ["icon-apple-fill"],
  meizu: ["icon-meizu"],
  fujifilm: ["icon-fushi"],
  panasonic: ["icon-panasonic"],
  canon: ["icon-canon", "icon-jianeng"],
  oneplus: ["icon-oneplus"],
  vivo: ["icon-vivo", "icon-vivo1"],
  dji: ["icon-DJI"],
  samsung: ["icon-samsung"],
  huawei: ["icon-huawei", "icon-huawei1"],
  xiaomi: ["icon-icon-xiaomiguishu"],
  sony: ["icon-sony"],
  leica: ["icon-leica"],
  pentax: ["icon-pentax"],
  ricoh: ["icon-ricoh"],
  sigma: ["icon-sigma"],
  nikon: ["icon-nikon"],
  olympus: ["icon-olympus"],
  nikons: ["icon-nikons"],
  OnePlus: ["icon-OnePlus"],
  Hasselblad: ["icon-Hasselblad"],
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
