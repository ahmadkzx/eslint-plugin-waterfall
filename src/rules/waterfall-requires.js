const { sortByLength, getNodesText } = require('../utils')

const WaterfallRequires = {
  meta: {
    type: 'suggestion',
    fixable: true,
    docs: {
      description: 'Sort all requires by line length',
      category: 'Stylistic Issues',
      recommended: true,
    }
  },

  create(context) {
    const src = context.getSourceCode()

    function isRequireDeclaration(node) {
      if (node.type === 'VariableDeclaration') {
        const text = src.getText(node)
        const textParts = text.split('=')

        return textParts[1] && textParts[1].trim().startsWith('require(')
      }

      return false
    }

    return {
      'Program:exit': function(node) {
        const requireDeclarations = node.body.filter(isRequireDeclaration)
        if (requireDeclarations.length === 0) return
        const sortedRequireDeclarations = [...requireDeclarations].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const requireDeclarationsText = getNodesText(requireDeclarations, src)
        const sortedRequireDeclarationsText = getNodesText(sortedRequireDeclarations, src)

        if (sortedRequireDeclarationsText !== requireDeclarationsText) {
          const text = sortedRequireDeclarations.map(node => src.getText(node)).join('\n')
          const range = [requireDeclarations[0].range[0], requireDeclarations[requireDeclarations.length - 1].range[1]]
          
          context.report({
            node,
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

module.exports = WaterfallRequires