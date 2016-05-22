import 'babel-polyfill' // Adds the ES6 features that are missing in some browsers
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import util from './lib/util'

const fs = require('fs')

// import $ from 'jquery'
// import aws from 'aws-sdk'
// import handlebars from 'handlebars'
// import localforage from 'localforage'


function render() {
  ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('application-placeholder')
  )
}

function main(...args) {
  _.each(args, (arg) => {
    console.log(arg)
  })

  // This template is inserted into the source at compile time
  // using brfs with `const fs = require('fs')` above
  const template = fs.readFileSync('app/templates/test.html', 'utf8')
  console.log(template)

  render()
}

main('hello world')
