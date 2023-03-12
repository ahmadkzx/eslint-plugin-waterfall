const { sortByLength, getReplaceRange, getNodesTexts, applyObjectPropertiesIndent } = require('../utils')

const WaterfallObjects = {
  meta: {
    fixable: true,
    type: 'suggestion',
    docs: {
      recommended: true,
      category: 'Stylistic Issues',
      description: 'Sort all object properties by line length',
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

    function isNotSpreadElement(node) {
      return node.type !== 'SpreadElement'
    }

    function isMultiLine(node) {
      return src.getText(node).includes('\n')
    }

    function isSingleLine(node) {
      return !isMultiLine(node)
    }

    function WaterfallFunctionArgs(node) {
      if (!node.params) return
      
      const objectParams = node.params.filter(isObjectPattern).filter(isMultiLine)

      objectParams.forEach(objParam => {
        const properties = objParam.properties
        if (!properties || properties.length === 0) return
        const sortedProperties = [...properties].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const propertiesText = getNodesTexts(properties, src).join('')
        const sortedPropertiesText = getNodesTexts(sortedProperties, src).join('')

        if (sortedPropertiesText !== propertiesText) {
          let text = getNodesTexts(sortedProperties, src)
          text = applyObjectPropertiesIndent(text, /*object node*/ node, src)
          text = text.join(',\n')
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
        if (isSingleLine(node)) return
        if (isExportDefaultDeclaration(node.parent)) return // only for ignoring vue options api

        const properties = node.properties.filter(isNotSpreadElement)
        if (properties.length === 0) return
        const sortedProperties = [...properties].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const propertiesText = getNodesTexts(properties, src).join('')
        const sortedPropertiesText = getNodesTexts(sortedProperties, src).join('')

        if (sortedPropertiesText !== propertiesText) {
          let text = getNodesTexts(sortedProperties, src)
          text = applyObjectPropertiesIndent(text, /*object node*/ node, src)
          text = text.join(',\n')
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