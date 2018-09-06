const ELEMENTS_WITH_NATIVE_KEY_DOWN = ['button', 'input', 'select'];

module.exports = function({ types: t, template }) {
  const jsxVisitor = {
    JSXOpeningElement(path) {
      if (!path.container || !path.container.openingElement || !path.container.openingElement.name || !path.container.openingElement.name.name) {
        return;
      }

      const elementName = path.container.openingElement.name.name;
      const attributes = path.container.openingElement.attributes;
      const newAttributes = [];

      const isHtmlElement = [...elementName][0].match(/[a-z]/);
      if (!isHtmlElement) return;
      const haveOnClick = attributes.find(attr => attr.name && attr.name.name === 'onClick');
      if (!haveOnClick) return;

      const haveTabIndex = attributes.find(attr => attr.name && attr.name.name.toLowerCase() === 'tabindex');
      const haveNegativeTabIndex = haveTabIndex && haveTabIndex.value.value == -1;
      const haveKeyUp = attributes.find(attr => attr.name && attr.name.name.toLowerCase() === 'onkeyup');
      const haveRole = attributes.find(attr => attr.name && attr.name.name.toLowerCase() === 'role');
      const isAnchorWithHref = elementName === 'a' && attributes.find(attr => attr.name && attr.name.name.toLowerCase() === 'href');
      const isElementFromNativeList = ELEMENTS_WITH_NATIVE_KEY_DOWN.includes(elementName);

      const addTabIndex = !haveTabIndex;
      const addKeyDown = !haveKeyUp && !isAnchorWithHref && !isElementFromNativeList && !haveNegativeTabIndex;
      const addRole = !haveRole && !isAnchorWithHref && !isElementFromNativeList && !haveNegativeTabIndex;

      if (addKeyDown) {
        const ast = template('(e) => (e.keyCode === 13 || e.keyCode === 32) && (CALLBACK)(e)')({
          CALLBACK: haveOnClick.value.expression,
        });
        newAttributes.push(t.jSXAttribute(t.jSXIdentifier('onKeyUp'), t.JSXExpressionContainer(ast.expression)));
      }

      if (addTabIndex) {
        newAttributes.push(t.jSXAttribute(t.jSXIdentifier('tabIndex'), t.stringLiteral('0')));
      }

      if (addRole) {
        newAttributes.push(t.jSXAttribute(t.jSXIdentifier('role'), t.stringLiteral('button')));
      }

      attributes.push(...newAttributes);
    },
  };

  return {
    visitor: Object.assign({}, jsxVisitor),
  };
};
