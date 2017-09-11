import {template as html} from './template.js'

class TestFailed extends Error {}

// THE test framework
const assert = (cond, msg = cond ? 'Ok' : 'Assertion failed') => {
  if (!cond) throw new TestFailed(`\u274C ${msg}`)
  else console.log(`\u2714 ${msg}`)
}
const expectError = (fn, err) => {
  try {
    fn()
    assert(false, `Expected function to throw ${err.name}`)
  } catch(e) {
    assert(e instanceof err, `Expected ${err.name}, got ${e}`)
  }
}
const test = msg => console.log('[test]:', msg)

// THE tests
test('should fail if string is not a <template>')
expectError(() => html`foo`, TypeError)

test('should return a template element')
assert(html`<template>` instanceof HTMLTemplateElement)

test('should add the parsed template to the head of the document')
const hasChild = (ele, child) => child.parentNode === ele
assert(hasChild(document.head, html`<template>`))

test('converting some strings')
for (let tplString of [
  '<template>foo</template>',
  '<template><div>foo</div></template>',
  '<template><span title="foo"></span><div><i>bar</i></div></template>',
]) {
  const tpl = html`${tplString}`
  assert(tpl.outerHTML === tplString)
}
