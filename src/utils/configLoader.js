import defaultConfig from '../config/content.json'

export const getConfig = () => {
  const savedConfig = localStorage.getItem('siteConfig')
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig)
      // Merge saved config with default config to ensure new fields are included
      return {
        ...defaultConfig,
        ...parsed,
        // Deep merge for nested objects
        emailTemplates: {
          ...defaultConfig.emailTemplates,
          ...(parsed.emailTemplates || {})
        },
        zelle: {
          ...defaultConfig.zelle,
          ...(parsed.zelle || {})
        },
        donation: {
          ...defaultConfig.donation,
          ...(parsed.donation || {})
        },
        cart: {
          ...defaultConfig.cart,
          ...(parsed.cart || {})
        }
      }
    } catch (e) {
      console.error('Error parsing saved config:', e)
      return defaultConfig
    }
  }
  return defaultConfig
}

export const saveConfig = (config) => {
  localStorage.setItem('siteConfig', JSON.stringify(config))
}

export const resetConfig = () => {
  localStorage.removeItem('siteConfig')
  return defaultConfig
}
