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

function getNodesTexts(nodes, src) {
  return nodes.map(node => src.getText(node))
}

function getReplaceRange(nodes) {
  return [nodes[0].range[0], nodes[nodes.length - 1].range[1]]
}

module.exports = {
  sortByLength,
  getLineLength,
  getNodesTexts,
  getReplaceRange,
}
