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

    function getLineLength(importDeclaration) {
      const loc = importDeclaration.loc.start
      const lineText = src.lines[loc.line - 1]
      return lineText.length
    }
  
    function isImportDeclaration(node) {
      return node.type === 'ImportDeclaration'
    }
  
    function sortImportsByLength(nodeA, nodeB) {
      const lengthA = getLineLength(nodeA);
      const lengthB = getLineLength(nodeB);
      return lengthA - lengthB;
    }

    return {
      'Program:exit': function(node) {
        const importDeclarations = node.body.filter(isImportDeclaration)
        if (importDeclarations.length === 0) return
        const sortedImportDeclarations = [...importDeclarations].sort(sortImportsByLength)

        const importDeclarationsJoinedValue = importDeclarations.map(node => node.source.value).join('')
        const sortedImportDeclarationsJoinedValue = sortedImportDeclarations.map(node => node.source.value).join('')

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