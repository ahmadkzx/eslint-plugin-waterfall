/**
 * @param node - ESTree AST node
 * @param src - Source context
 * @returns {number}
 */
function getNodeLength(node, src) {
  const text = src.getText(node)
  return text.length
}

/**
 * @param nodeA - ESTree AST node
 * @param nodeB - ESTree AST node
 * @param src - Source context
 * @returns {number}
 */
function sortByLength(nodeA, nodeB, src) {
  const lengthA = getNodeLength(nodeA, src);
  const lengthB = getNodeLength(nodeB, src);
  return lengthA - lengthB;
}

/**
 * Get each node text and fix its first line indent
 * @param nodes - Array of ESTree AST nodes
 * @param src - Source context
 * @returns {string[]}
 */
function getNodesTexts(nodes, src) {
  return nodes.map(node => fixIndent(src.getText(node)))
}

/**
 * Get first node start to last node end range
 * After sorting nodes base on length we need to replace them with sorted ones
 * So first should calculate entire node text range (text start and end)
 * @param nodes - Array of ESTree AST nodes
 * @returns {number[]}
 */
function getReplaceRange(nodes) {
  return [nodes[0].range[0], nodes[nodes.length - 1].range[1]]
}

/**
 * Src.getText(node) returns node string but there is one problem
 * First line does not have correct indent
 * So we need to get last line indent and apply it to first line to solve problem
 * @param {string} str - The string to be fixed
 * @returns {string}
 */
function fixIndent(str) {
  const lines = str.split('\n')
  if (lines.length < 2) return str
  const lastLineIndent = lines[lines.length - 1].match(/^\s*/)[0]
  lines[0] = lastLineIndent + lines[0].trim()
  return lines.join('\n')
}

/**
 * Get object properties indent by catch first property indent
 * @param {string[]} properties
 * @param objectNode - ESTree AST nodes
 * @param src - Source context
 * @returns {string}
 */
function applyObjectPropertiesIndent(properties, objectNode, src) {
  const text = src.getText(objectNode)
  /*
   {
    test: 1,
    ...
   }
  */
 const lines = text.split('\n') // => ['{', ' test: 1,', ...]
 const indentStr = lines[1].match(/^\s*/)[0]

 return properties.map((prop, i) => {
  if (i === 0 /*first prop always has indent*/) {
    return prop
  } else {
    return indentStr + prop
  }
 })
}



module.exports = {
  fixIndent,
  sortByLength,
  getNodeLength,
  getNodesTexts,
  getReplaceRange,
  applyObjectPropertiesIndent
}
