const { sortByLength, getNodesText } = require('../utils')

const WaterfallObjects = {
  meta: {
    type: 'suggestion',
    fixable: true,
    docs: {
      description: 'Sort all object properties by line length',
      category: 'Stylistic Issues',
      recommended: true,
    }
  },

  create(context) {
    const src = context.getSourceCode()

    function isObjectPattern(node) {
      return node.type === 'ObjectPattern'
    }

    function FunctionDeclarationHandler(node) {
      const objectParams = node.params.filter(isObjectPattern)

      objectParams.forEach(objParam => {
        const properties = objParam.properties
        if (!properties || properties.length === 0) return
        const sortedProperties = [...properties].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const propertiesText = getNodesText(properties, src)
        const sortedPropertiesText = getNodesText(sortedProperties, src)

        if (sortedPropertiesText !== propertiesText) {
          const text = sortedProperties.map(node => src.getText(node))
          const range = [properties[0].range[0], properties[properties.length - 1].range[1]]
          
          context.report({
            node,
            message: 'Arguments should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      })
    }
    return {
      'ObjectExpression:exit': function(node) {
        const objectDeclarations = node.properties
        if (objectDeclarations.length === 0) return
        const sortedObjectDeclarations = [...objectDeclarations].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const objectDeclarationsText = getNodesText(objectDeclarations, src)
        const sortedObjectDeclarationsText = getNodesText(sortedObjectDeclarations, src)

        if (sortedObjectDeclarationsText !== objectDeclarationsText) {
          const text = sortedObjectDeclarations.map(node => src.getText(node))
          const range = [objectDeclarations[0].range[0], objectDeclarations[objectDeclarations.length - 1].range[1]]
          
          context.report({
            node,
            message: 'Objects properties should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      },

      'FunctionDeclaration:exit': FunctionDeclarationHandler,

      'ArrowFunctionExpression:exit': FunctionDeclarationHandler,
    }
  }
}

module.exports = WaterfallObjects