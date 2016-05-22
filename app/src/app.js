import 'babel-polyfill' // Adds the ES6 features that are missing in some browsers
import _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'

// import $ from 'jquery'
// import aws from 'aws-sdk'
// import handlebars from 'handlebars'
// import localforage from 'localforage'


function render() {
  ReactDOM.render(
    <h1>Hello, world</h1>,
    document.getElementById('example')
  )
}

function main(...args) {
  _.each(args, (arg) => {
    console.log(arg)
  })

  render()
}

main('hello world')
