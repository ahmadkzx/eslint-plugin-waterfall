const { describe, it } = require('node:test')
const { RuleTester } = require('eslint')
const plugin = require('../src')

RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
})

const scriptTester = new RuleTester({
  languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs' },
})

ruleTester.run('waterfall-objects', plugin.rules['waterfall-objects'], {
  valid: [
    'const value = { b: 1, longerName: 2 }',
    'const value = {\n  b: 1,\n  longerName: 2,\n}',
    'const value = {\n  longPropertyName: 1,\n  ...extra,\n  b: 2,\n}',
    'const value = {\n  ...extra,\n  b: 2,\n  longerName: 1,\n}',
    'function f({\n  b,\n  longerName,\n  ...rest\n}) {}',
  ],
  invalid: [
    {
      code: 'const value = {\n  longerName: 1,\n  b: 2,\n}',
      output: 'const value = {\n  b: 2,\n  longerName: 1,\n}',
      errors: [{ message: 'Object properties should be sorted by line length' }],
    },
    {
      code: 'const value = {\n  longerName: 1,\n  b: 2,\n  ...extra,\n  longestPropertyName: 3,\n  cc: 4,\n}',
      output: 'const value = {\n  b: 2,\n  longerName: 1,\n  ...extra,\n  cc: 4,\n  longestPropertyName: 3,\n}',
      errors: [
        { message: 'Object properties should be sorted by line length' },
        { message: 'Object properties should be sorted by line length' },
      ],
    },
    {
      code: 'const value = {\n  longerName: 1,\n  ...(flag ? { flagged: true } : {}),\n  cc: 3,\n  b: 2,\n}',
      output: 'const value = {\n  longerName: 1,\n  ...(flag ? { flagged: true } : {}),\n  b: 2,\n  cc: 3,\n}',
      errors: [{ message: 'Object properties should be sorted by line length' }],
    },
    {
      code: 'const value = {\n  longerName: 1,\n  // keep this note\n  b: 2,\n}',
      output: null,
      errors: [{ message: 'Object properties should be sorted by line length' }],
    },
    {
      code: 'function f({\n  longerName,\n  b,\n  ...rest\n}) {}',
      output: 'function f({\n  b,\n  longerName,\n  ...rest\n}) {}',
      errors: [{ message: 'Object properties should be sorted by line length' }],
    },
  ],
})

ruleTester.run('waterfall-imports', plugin.rules['waterfall-imports'], {
  valid: [
    "import b from 'b'\nimport longer from 'longer'",
    "import longer from 'longer'\nconst value = 1\nimport b from 'b'",
  ],
  invalid: [
    {
      code: "import longer from 'longer'\nimport b from 'b'",
      output: "import b from 'b'\nimport longer from 'longer'",
      errors: [{ message: 'Imports should be sorted by line length' }],
    },
    {
      code: "import longer from 'longer'\n// eslint-disable-next-line no-restricted-imports\nimport b from 'b'",
      output: null,
      errors: [{ message: 'Imports should be sorted by line length' }],
    },
    {
      code: "import longer from 'longer'\nimport b from 'b'\nconst value = 1\nimport cc from 'cc'",
      output: "import b from 'b'\nimport longer from 'longer'\nconst value = 1\nimport cc from 'cc'",
      errors: [{ message: 'Imports should be sorted by line length' }],
    },
  ],
})

scriptTester.run('waterfall-requires', plugin.rules['waterfall-requires'], {
  valid: [
    "const b = require('b')\nconst longer = require('longer')",
    "const longer = require('longer')\nconst config = { port: 3000 }\nconst b = require('b')",
    "const longer = require('longer')\nrequire('dotenv').config()\nconst b = require('b')",
  ],
  invalid: [
    {
      code: "const longer = require('longer')\nconst b = require('b')",
      output: "const b = require('b')\nconst longer = require('longer')",
      errors: [{ message: 'Requires should be sorted by line length' }],
    },
    {
      code: "const longer = require('longer')\nconst b = require('b')\nconst config = { port: 3000 }\nconst c = require('c')",
      output: "const b = require('b')\nconst longer = require('longer')\nconst config = { port: 3000 }\nconst c = require('c')",
      errors: [{ message: 'Requires should be sorted by line length' }],
    },
    {
      code: "const longer = require('longer')\n// why b is required here\nconst b = require('b')",
      output: null,
      errors: [{ message: 'Requires should be sorted by line length' }],
    },
  ],
})
