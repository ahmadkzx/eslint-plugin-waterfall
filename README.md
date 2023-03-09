## Eslint Plugin Waterfall
Write code like waterfall. more beautiful more readable.  

![Group 1](https://user-images.githubusercontent.com/69081259/224127299-f1ebdfbf-1bf7-4f63-9897-27879997e24a.svg)

### Installation

    npm i eslint-plugin-waterfall --save-dev
    // or
    yan add eslint-plugin-watefall --dev

### Usage
Add `waterfall` in plugins section of your eslint config:

    {
      "plugins": ["waterfall"]
    }

Then configure the rules you want to use under the rules section:

    {
      "rules": {
        "waterfall/waterfall-objects": "error,
        "waterfall/waterfall-imports": "error",
        "waterfall/waterfall-requires": "error"
      }
    }
