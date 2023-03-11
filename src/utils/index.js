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
  return nodes.map(node => fixIndent(src.getText(node)))
}

function getReplaceRange(nodes) {
  return [nodes[0].range[0], nodes[nodes.length - 1].range[1]]
}

function fixIndent(str) {
  const lines = str.split('\n')
  if (lines.length < 2) return str
  const lastLineIndent = lines[lines.length - 1].match(/^\s*/)[0]
  lines[0] = lastLineIndent + lines[0].trim()
  return lines.join('\n')
}

module.exports = {
  fixIndent,
  sortByLength,
  getLineLength,
  getNodesTexts,
  getReplaceRange,
}
