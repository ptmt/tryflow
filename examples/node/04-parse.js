/* @flow */

async function fetchHtml() {
    return fetch('http://localhost:3000').then(res => res.text())
}

// click to see inferred
function parseHtmlOptimistic(html) {
    // let's use something like cheerio to
    // parse text into complicated structure
    return {
        body: {
            nav: {
                ul: [
                    {
                        li: {
                            span: 'text 1'
                        },
                    },
                    {
                        li: {
                            span: 'text 2'
                        },
                    },
                    {
                        li: {
                            span: 'text 3'
                        },
                    }
                ]
            }
        }
    }
}

// what if we need to describe that type
type SimpleHtmlElement = {
    ul?: Array<SimpleHtmlElement>;
    [key: string]: SimpleHtmlElement | string;
}
type Html = {
    body?: SimpleHtmlElement
}

function parseHtmlRealistic(html: string): Html {
    return {
        body: {
            nav: {
                ul: [
                    {
                        li: {
                            span: 'text 1'
                        },
                    },
                    {
                        li: {
                            span: 'text 2'
                        },
                    },
                    {
                        li: {
                            span: 'text 3'
                        },
                    }
                ]
            }
        }
    }
}

async function scrape() {
    const html = await fetchHtml()
    const wrongPathToSpan = parseHtmlOptimistic(html).body.nav.span;
    const rightPathToSpan = parseHtmlOptimistic(html).body.nav.ul[0].li.span;
    const withoutChecks = parseHtmlRealistic(html).body.nav.ul[0].li.span;
    const withChecks = parseHtmlRealistic(html)
    if (withChecks.body && withChecks.body.nav && withChecks.body.nav.ul) {
      withChecks.body.nav.ul.forEach(item => {
        if (item.li && item.li.span) {
          const span = item.li.span // safe according to our type
        }
      })

    }
}
