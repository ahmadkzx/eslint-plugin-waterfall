const {
  sortByLength,
  splitIntoRuns,
  getSourceCode,
  getNodesTexts,
  getReplaceRange,
  hasCommentsInRange,
} = require('../utils')

const WaterfallImports = {
  meta: {
    fixable: 'code',
    type: 'suggestion',
    docs: {
      recommended: true,
      category: 'Stylistic Issues',
      description: 'Sort all imports by line length',
    }
  },

  create(context) {
    const src = getSourceCode(context)

    function isImportDeclaration(node) {
      return node.type === 'ImportDeclaration'
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
        message: 'Imports should be sorted by line length',
        fix: hasCommentsInRange(src, range) ? null : fixer => fixer.replaceTextRange(range, text),
      })
    }

    return {
      'Program:exit': function(node) {
        splitIntoRuns(node.body, isImportDeclaration).forEach(reportRun)
      }
    }
  }
}

module.exports = WaterfallImports