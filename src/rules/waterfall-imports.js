const { sortByLength, getReplaceRange, getNodesTexts } = require('../utils')

const WaterfallImports = {
  meta: {
    type: 'suggestion',
    fixable: true,
    docs: {
      description: 'Sort all imports by line length',
      category: 'Stylistic Issues',
      recommended: true,
    }
  },

  create(context) {
    const src = context.getSourceCode()

    function isImportDeclaration(node) {
      return node.type === 'ImportDeclaration'
    }

    return {
      'Program:exit': function(node) {
        const importDeclarations = node.body.filter(isImportDeclaration)
        if (importDeclarations.length === 0) return
        const sortedImportDeclarations = [...importDeclarations].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const importDeclarationsText = getNodesTexts(importDeclarations, src).join('')
        const sortedImportDeclarationsText = getNodesTexts(sortedImportDeclarations, src).join('')

        if (sortedImportDeclarationsText !== importDeclarationsText) {
          const text = getNodesTexts(sortedImportDeclarations, src).join('\n')
          const range = getReplaceRange(importDeclarations)
          
          context.report({
            node,
            message: 'Imports should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      }
    }
  }
}

module.exports = WaterfallImports