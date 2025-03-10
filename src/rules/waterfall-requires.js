const { sortByLength, getReplaceRange, getNodesTexts } = require('../utils')

const WaterfallRequires = {
  meta: {
    fixable: true,
    type: 'suggestion',
    docs: {
      recommended: true,
      category: 'Stylistic Issues',
      description: 'Sort all requires by line length',
    }
  },

  create(context) {
    const src = context.getSourceCode()

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

    return {
      'Program:exit': function(node) {
        const requireDeclarations = node.body.filter(isRequireDeclaration)
        if (requireDeclarations.length === 0) return
        const sortedRequireDeclarations = [...requireDeclarations].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const requireDeclarationsText = getNodesTexts(requireDeclarations, src).join('')
        const sortedRequireDeclarationsText = getNodesTexts(sortedRequireDeclarations, src).join('')

        if (sortedRequireDeclarationsText !== requireDeclarationsText) {
          // Find requires that are out of order
          const outOfOrderRequires = requireDeclarations.filter((requireNode, index) => {
            return requireNode !== sortedRequireDeclarations[index];
          });
          
          // Report on the first out-of-order require
          if (outOfOrderRequires.length > 0) {
            // We still need a single fix that replaces all requires
            const text = getNodesTexts(sortedRequireDeclarations, src).join('\n')
            const range = getReplaceRange(requireDeclarations)
            
            context.report({
              node: outOfOrderRequires[0],
              message: 'Requires should be sorted by line length',
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

module.exports = WaterfallRequires