const {
  sortByLength,
  splitIntoRuns,
  getSourceCode,
  getNodesTexts,
  getReplaceRange,
  hasCommentsInRange,
  applyObjectPropertiesIndent,
} = require('../utils')

const WaterfallObjects = {
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      recommended: true,
      category: 'Stylistic Issues',
      description: 'Sort all object properties by line length',
    }
  },

  create(context) {
    const src = getSourceCode(context)

    function isObjectPattern(node) {
      return node.type === 'ObjectPattern'
    }

    function isExportDefaultDeclaration(node) {
      return node.type === 'ExportDefaultDeclaration'
    }

    function isProperty(node) {
      return node.type === 'Property'
    }

    function isMultiLine(node) {
      return src.getText(node).includes('\n')
    }

    function reportRun(properties, objectNode) {
      if (properties.length < 2) return

      const sortedProperties = [...properties].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))
      const outOfOrderProperties = properties.filter((propNode, index) => propNode !== sortedProperties[index])
      if (outOfOrderProperties.length === 0) return

      const range = getReplaceRange(properties)
      const text = applyObjectPropertiesIndent(getNodesTexts(sortedProperties, src), objectNode, src).join(',\n')

      context.report({
        node: outOfOrderProperties[0],
        message: 'Object properties should be sorted by line length',
        fix: hasCommentsInRange(src, range) ? null : fixer => fixer.replaceTextRange(range, text),
      })
    }

    function reportObject(objectNode) {
      splitIntoRuns(objectNode.properties, isProperty).forEach(run => reportRun(run, objectNode))
    }

    function WaterfallFunctionArgs(node) {
      if (!node.params) return

      node.params.filter(isObjectPattern).filter(isMultiLine).forEach(reportObject)
    }

    return {
      'ObjectExpression:exit': function(node) {
        if (!isMultiLine(node)) return
        if (isExportDefaultDeclaration(node.parent)) return

        reportObject(node)
      },

      'MethodDefinition:exit': WaterfallFunctionArgs,
      'FunctionDeclaration:exit': WaterfallFunctionArgs,
      'ArrowFunctionExpression:exit': WaterfallFunctionArgs,
    }
  }
}

module.exports = WaterfallObjects
