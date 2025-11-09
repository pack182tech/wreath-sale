import defaultConfig from '../config/content.json'

export const getConfig = () => {
  const savedConfig = localStorage.getItem('siteConfig')
  if (savedConfig) {
    try {
      const parsed = JSON.parse(savedConfig)
      // Merge saved config with default config
      // For email templates, always use default config (they're managed in content.json)
      return {
        ...defaultConfig,
        ...parsed,
        // Always use default email templates from content.json
        emailTemplates: defaultConfig.emailTemplates,
        // Deep merge for other nested objects
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
