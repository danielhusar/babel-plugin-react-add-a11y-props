const babel = require('@babel/core');
const reactPreset = require('@babel/preset-react');
const prettier = require('prettier');
const convertReactCreateElementToJSX = require('babel-plugin-transform-react-createelement-to-jsx');
const plugin = require('../');

const format = jsx => {
  const { code: reactElements } = babel.transform(jsx, { plugins: [plugin], presets: [reactPreset] });
  const { code } = babel.transform(reactElements, { plugins: [convertReactCreateElementToJSX] });
  return prettier.format(code, { printWidth: 300, parser: 'babylon' });
};

// babel-plugin-transform-react-createelement-to-jsx have some deprecated calls, so silent them until it upgrades
console.error = jest.fn();

describe('react-add-a11y-props', () => {
  it('add onKeyDown, tabindex and role to all elements with onClick', () => {
    const jsx = `
      <span>
        <span onClick={cb} />
        <div onClick={cb} />
        <article onClick={cb} />
        <a onClick={() => foo()} />
      </span>
    `;
    expect(format(jsx)).toMatchSnapshot();
  });

  it('it will only add tabindex to inputs and will not add keyDown and role', () => {
    const jsx = `
      <span>
        <input type="submit" onClick={cb} />
        <button onClick={cb} />
        <select onClick={() => foo()} />
      </span>
    `;
    expect(format(jsx)).toMatchSnapshot();
  });

  it('it will not add tabIndex and keyDown for negative tabIndex', () => {
    const jsx = `<div tabIndex="-1" onClick={cb} />`;
    expect(format(jsx)).toMatchSnapshot();
  });

  it('it will not add tabIndex if its already present', () => {
    const jsx = `<div tabIndex="1" onClick={cb} />`;
    expect(format(jsx)).toMatchSnapshot();
  });

  it('it will not add role if its already present', () => {
    const jsx = `<div role="foo" onClick={cb} />`;
    expect(format(jsx)).toMatchSnapshot();
  });

  it('it will not add keyDown if its already present', () => {
    const jsx = `<div onKeyDown={cb} onClick={cb} />`;
    expect(format(jsx)).toMatchSnapshot();
  });

  it('it will not add keyDown and role to anchor with href', () => {
    const jsx = `<a href="https://www.google.com" onClick={cb} />`;
    expect(format(jsx)).toMatchSnapshot();
  });
});
