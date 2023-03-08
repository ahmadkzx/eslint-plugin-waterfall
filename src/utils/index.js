function getLineLength(importDeclaration, src) {
  const loc = importDeclaration.loc.start
  const lineText = src.lines[loc.line - 1]
  return lineText.length
}

function sortByLength(nodeA, nodeB, src) {
  const lengthA = getLineLength(nodeA, src);
  const lengthB = getLineLength(nodeB, src);
  return lengthA - lengthB;
}

function joinNodesSource(nodes, src) {
  return nodes.map(node => src.getText(node)).join('')
}

module.exports = {
  sortByLength,
  getLineLength,
  joinNodesSource
}
