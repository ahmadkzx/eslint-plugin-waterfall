const {
  sortByLength,
  splitIntoRuns,
  getSourceCode,
  getNodesTexts,
  getReplaceRange,
  hasCommentsInRange,
} = require('../utils')

const WaterfallRequires = {
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      recommended: true,
      category: 'Stylistic Issues',
      description: 'Sort all requires by line length',
    }
  },

  create(context) {
    const src = getSourceCode(context)

    function isRequireDeclaration(node) {
      if (node.type === 'VariableDeclaration') {
        const text = src.getText(node)
        const textParts = text.split('=') // const test = require("test") => ['const test ', ' require("test")']
        
        return textParts[1] && textParts[1].trim().startsWith('require(')

      } else if (node.type === 'ExpressionStatement') {
        // for requires expressions that not storing in a variable like: require('./index.css')
        return node.expression && node.expression.callee && node.expression.callee.name === 'require'
      }

      return false
    }

    function reportRun(nodes) {
      if (nodes.length < 2) return

      const sortedNodes = [...nodes].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))
      const outOfOrderNodes = nodes.filter((item, index) => item !== sortedNodes[index])
      if (outOfOrderNodes.length === 0) return

      const range = getReplaceRange(nodes)
      const text = getNodesTexts(sortedNodes, src).join('\n')

      context.report({
        node: outOfOrderNodes[0],
        message: 'Requires should be sorted by line length',
        fix: hasCommentsInRange(src, range) ? null : fixer => fixer.replaceTextRange(range, text),
      })
    }

    return {
      'Program:exit': function(node) {
        splitIntoRuns(node.body, isRequireDeclaration).forEach(reportRun)
      }
    }
  }
}

module.exports = WaterfallRequires