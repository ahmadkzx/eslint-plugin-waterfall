const WaterfallImports = require('./rules/waterfall-imports')
const WaterfallRequires = require('./rules/waterfall-requires')
const WaterfallArguments = require('./rules/waterfall-arguments')

module.exports = {
  rules: {
    'waterfall-imports': WaterfallImports,
    'waterfall-requires': WaterfallRequires,
    'waterfall-arguments': WaterfallArguments,
  }
}