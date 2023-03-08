const { sortByLength, joinNodesSource } = require('../utils')

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

        const importDeclarationsJoinedValue = joinNodesSource(importDeclarations, src)
        const sortedImportDeclarationsJoinedValue = joinNodesSource(sortedImportDeclarations, src)

        if (sortedImportDeclarationsJoinedValue !== importDeclarationsJoinedValue) {
          const text = sortedImportDeclarations.map(node => src.getText(node)).join('\n')
          const range = [importDeclarations[0].range[0], importDeclarations[importDeclarations.length - 1].range[1]]
          
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