import $ from 'jquery'

const util = {
  addStylesheet (url) {
    $('head').append(`<link rel="stylesheet" type="text/css" href="${url}">`)
  },

  log () {
    const args = Array.prototype.slice.call(arguments)
    console.log.apply(console, args)
  }
}

export default util