export const template = (strings, ...parts) => {
  let template = parts
      .reduce((tpl, value, i) => `${tpl}${strings[i]}${value}`, '')
      .concat(strings[parts.length])
  template = new DOMParser()
    .parseFromString(template, 'text/html')
    .querySelector('template')
  if (!template) throw new TypeError('No template element found')
  document.head.append(template)
  return template
}
