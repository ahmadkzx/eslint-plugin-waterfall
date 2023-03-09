const { sortByLength, getNodesText } = require('../utils')

const WaterfallObjects = {
  meta: {
    type: 'suggestion',
    fixable: true,
    docs: {
      description: 'Sort all object properties by line length',
      category: 'Stylistic Issues',
      recommended: true,
    }
  },

  create(context) {
    const src = context.getSourceCode()

    return {
      'ObjectExpression:exit': function(node) {
        console.log(node)
        const objectDeclarations = node.properties
        if (objectDeclarations.length === 0) return
        const sortedObjectDeclarations = [...objectDeclarations].sort((nodeA, nodeB) => sortByLength(nodeA, nodeB, src))

        const objectDeclarationsText = getNodesText(objectDeclarations, src)
        const sortedObjectDeclarationsText = getNodesText(sortedObjectDeclarations, src)

        if (sortedObjectDeclarationsText !== objectDeclarationsText) {
          const text = sortedObjectDeclarations.map(node => src.getText(node))
          const range = [objectDeclarations[0].range[0], objectDeclarations[objectDeclarations.length - 1].range[1]]
          
          context.report({
            node,
            message: 'Objects properties should be sorted by line length',
            fix: function(fixer) {
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      }
    }
  }
}

module.exports = WaterfallObjects