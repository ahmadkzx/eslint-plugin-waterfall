const { sortByLength, joinNodesSource } = require('../utils')

const WaterfallArguments = {
  meta: {
    type: 'suggestion',
    fixable: true,
    docs: {
      description: 'Sort all arguments by line length',
      category: 'Stylistic Issues',
      recommended: true,
    }
  },

  create(context) {
    const src = context.getSourceCode()

    function isFunctionDeclaration(node) {
      return node.type === 'FunctionDeclaration'
    }

    return {
      'Program:exit': function(node) {
        const argumentDeclarations = node.body.filter(isFunctionDeclaration).map(node => node.params)[0]
        if (argumentDeclarations.length === 0) return
        const sortedArgumentDeclarations = [...argumentDeclarations].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const argumentDeclarationsText = joinNodesSource(argumentDeclarations, src)
        const sortedArgumentDeclarationsText = joinNodesSource(sortedArgumentDeclarations, src)

        if (sortedArgumentDeclarationsText !== argumentDeclarationsText) {
          const text = sortedArgumentDeclarations.map(node => src.getText(node))
          const range = [argumentDeclarations[0].range[0], argumentDeclarations[argumentDeclarations.length - 1].range[1]]
          
          context.report({
            node,
            message: 'Arguments should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      }
    }
  }
}

module.exports = WaterfallArguments