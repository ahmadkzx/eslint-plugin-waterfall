const WaterfallImports = require('./rules/waterfall-imports')
const WaterfallObjects = require('./rules/waterfall-objects')
const WaterfallRequires = require('./rules/waterfall-requires')
const WaterfallArguments = require('./rules/waterfall-arguments')

module.exports = {
  rules: {
    'waterfall-imports': WaterfallImports,
    'waterfall-objects': WaterfallObjects,
    'waterfall-requires': WaterfallRequires,
    'waterfall-arguments': WaterfallArguments,
  }
}