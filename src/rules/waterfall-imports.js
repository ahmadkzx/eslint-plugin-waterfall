const { sortByLength, getReplaceRange, getNodesTexts } = require('../utils')

const WaterfallImports = {
  meta: {
    fixable: true,
    type: 'suggestion',
    docs: {
      recommended: true,
      category: 'Stylistic Issues',
      description: 'Sort all imports by line length',
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
          // Find imports that are out of order
          const outOfOrderImports = importDeclarations.filter((importNode, index) => {
            return importNode !== sortedImportDeclarations[index];
          });
          
          // Report on each out-of-order import
          if (outOfOrderImports.length > 0) {
            // We still need a single fix that replaces all imports
            const text = getNodesTexts(sortedImportDeclarations, src).join('\n')
            const range = getReplaceRange(importDeclarations)
            
            // Report on the first out-of-order import
            context.report({
              node: outOfOrderImports[0],
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
}

module.exports = WaterfallImports