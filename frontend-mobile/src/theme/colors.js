export const light = {
  bg:          '#f1f5f9',
  card:        '#ffffff',
  header:      '#1565C0',
  text:        '#1e293b',
  subText:     '#64748b',
  border:      '#e2e8f0',
  input:       '#f8fafc',
  tabBar:      '#ffffff',
  accent:      '#1565C0',
  statusBar:   'light-content',
};

export const dark = {
  bg:          '#070d1a',
  card:        '#0f1f45',
  header:      '#0d1b3e',
  text:        '#e2e8f0',
  subText:     '#94a3b8',
  border:      '#1e3a6e',
  input:       '#0d1b3e',
  tabBar:      '#0d1b3e',
  accent:      '#3b82f6',
  statusBar:   'light-content',
};

export const useColors = (isDark) => isDark ? dark : light;