const { sortByLength, getReplaceRange, getNodesTexts } = require('../utils')

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

        const propertiesText = getNodesTexts(properties, src).join('')
        const sortedPropertiesText = getNodesTexts(sortedProperties, src).join('')

        if (sortedPropertiesText !== propertiesText) {
          const text = getNodesTexts(sortedProperties, src)
          const range = getReplaceRange(properties)
          
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
        const properties = node.properties
        if (properties.length === 0) return
        const sortedProperties = [...properties].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const propertiesText = getNodesTexts(properties, src).join('')
        const sortedPropertiesText = getNodesTexts(sortedProperties, src).join('')

        if (sortedPropertiesText !== propertiesText) {
          const text = getNodesTexts(sortedProperties, src)
          const range = getReplaceRange(properties)
          
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