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

    function isExportDefaultDeclaration(node) {
      return node.type === 'ExportDefaultDeclaration'
    }

    function WaterfallFunctionArgs(node) {
      if (!node.params) return
      
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
            message: 'Object properties should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      })
    }
    return {
      'ObjectExpression:exit': function(node) {
        if (isExportDefaultDeclaration(node.parent.type)) return

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
            message: 'Object properties should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      },

      'MethodDefinition:exit': WaterfallFunctionArgs,
      'FunctionDeclaration:exit': WaterfallFunctionArgs,
      'ArrowFunctionExpression:exit': WaterfallFunctionArgs,
    }
  }
}

module.exports = WaterfallObjects