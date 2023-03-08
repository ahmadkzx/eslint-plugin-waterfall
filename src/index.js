const WaterfallImports = require('./rules/waterfall-imports')
const WaterfallRequires = require('./rules/waterfall-requires')

module.exports = {
  rules: {
    'waterfall-imports': WaterfallImports,
    'waterfall-requires': WaterfallRequires
  }
}