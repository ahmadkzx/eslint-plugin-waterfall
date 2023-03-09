const WaterfallImports = require('./rules/waterfall-imports')
const WaterfallObjects = require('./rules/waterfall-objects')
const WaterfallRequires = require('./rules/waterfall-requires')

module.exports = {
  rules: {
    'waterfall-imports': WaterfallImports,
    'waterfall-objects': WaterfallObjects,
    'waterfall-requires': WaterfallRequires,
  }
}