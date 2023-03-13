## ESLint Plugin Waterfall
Write code like waterfall. more beautiful more readable.   
Sort Object Properties, Imports and Requires by line length.

![ESLint Plugin Waterfall](https://user-images.githubusercontent.com/69081259/224570172-e0cd45ce-a55f-49d7-aaa5-9a466c3e6740.svg)

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
        "waterfall/waterfall-objects": "error",
        "waterfall/waterfall-imports": "error",
        "waterfall/waterfall-requires": "error",
      }
    }

### Rules
waterfall-objects:

    // ℹ️ Before:
    const person = {
      username: 'test',
      name: 'jason',
      email: 'json@gmail.com',
      country: 'usa',
    }
    
    // ✅ After:
    const peson = {
      name: 'jason',
      country: 'usa',
      username: 'test',
      email: 'jason@gmail.com',
    }

waterfall-imports:

    // ℹ️ Before:
    import { useContext, useEffect, useState } from 'react'
    import Link from 'next/link'
    import { useRouter } from 'next/router'
    import axios from 'axios'
    import { getAccessToken, clearAuthCookies } from './auth'
    import Error from 'next/error'
    
    // ✅ After:
    import axios from 'axios'
    import Link from 'next/link'
    import Error from 'next/error'
    import { useRouter } from 'next/router'
    import { useContext, useEffect, useState } from 'react'
    import { getAccessToken, clearAuthCookies } from './auth'


waterfall-requires:

    // ℹ️ Before:
    const path = require('path')
    const fs = require('fs')
    const express = require('express')
    const auth = require('./auth')

    // ✅ After:
    const fs = require('fs')
    const path = require('path')
    const auth = require('./auth')
    const express = reqiure('express')
