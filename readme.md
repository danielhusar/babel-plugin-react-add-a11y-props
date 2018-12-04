# babel-plugin-react-add-a11y-props ![https://travis-ci.org/danielhusar/babel-plugin-react-add-a11y-props](https://img.shields.io/travis/danielhusar/babel-plugin-react-add-a11y-props.svg) ![NpmLicense](https://img.shields.io/npm/l/@daniel.husar/babel-plugin-react-add-a11y-props.svg) ![npm](https://img.shields.io/npm/v/@daniel.husar/babel-plugin-react-add-a11y-props.svg)

> Add accessibility attributes to react dom elements

This plugin will add `onKeyUp={}`, `role="button"` and `tabIndex="0"` to all html react elements that have onClick handler.
It will not override those props if they are already defined, and `onKeyUp` will not be added to anchors with href, inputs, buttons and selects.
`onKeyUp` will fire `onClick` event when pressed enter or space.

## Install

```sh
npm install --save-dev @daniel.husar/babel-plugin-react-add-a11y-props
yarn add @daniel.husar/babel-plugin-react-add-a11y-props --dev
```

## Usage

Add `@daniel.husar/babel-plugin-react-add-a11y-props` to your plugins array in `.babelrc`


## See the examples for what cames in and out:

### In:

```jsx
<span onClick={cb} />
<div onClick={cb} />
<article onClick={cb} />
<a onClick={() => foo()} />
```

### Out:

```jsx
<span onClick={cb} onKeyUp={e => (e.keyCode === 13 || e.keyCode === 32) && cb(e)} tabIndex="0" role="button" />
<div onClick={cb} onKeyUp={e => (e.keyCode === 13 || e.keyCode === 32) && cb(e)} tabIndex="0" role="button" />
<article onClick={cb} onKeyUp={e => (e.keyCode === 13 || e.keyCode === 32) && cb(e)} tabIndex="0" role="button" />
<a onClick={() => foo()} onKeyUp={e => (e.keyCode === 13 || e.keyCode === 32) && (() => foo())(e)} tabIndex="0" role="button" />
```

<hr>

### In:

```jsx
<input type="submit" onClick={cb} />
<button onClick={cb} />
<select onClick={() => foo()} />
```

### Out:

```jsx
<input type="submit" onClick={cb} tabIndex="0" />
<button onClick={cb} tabIndex="0" />
<select onClick={() => foo()} tabIndex="0" />
```

<hr>

### In:

```jsx
<div tabIndex="-1" onClick={cb} />
<div tabIndex="1" onClick={cb} />
<div role="foo" onClick={cb} />
```

### Out:

```jsx
<div tabIndex="-1" onClick={cb} />
<div tabIndex="1" onClick={cb} onKeyUp={e => (e.keyCode === 13 || e.keyCode === 32) && cb(e)} role="button" />
<div role="foo" onClick={cb} onKeyUp={e => (e.keyCode === 13 || e.keyCode === 32) && cb(e)} tabIndex="0" />
```

## Disclaimer
The event passed into the onClick callback from keyUp event is not click but keyboard event which is sligtly different so you should account for both.

Right now this plugin will not take into account `onClick` added via spread objects.

## License

MIT © [Daniel Husar](https://github.com/danielhusar)
