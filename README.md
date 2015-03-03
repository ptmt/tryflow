# tryflow

[![Join the chat at https://gitter.im/unknownexception/tryflow](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/unknownexception/tryflow?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

[![Build Status](https://travis-ci.org/unknownexception/tryflow.svg)](https://travis-ci.org/unknownexception/tryflow)

Flow is a [static type checker for Javascript](http://flowtype.org/) written in [Ocaml by Facebook team](https://github.com/facebook/flow).

The idea behind Flow perfectly fits both server and client, the implementation is sort of alpha quality though: [Trying to heal Node.js app with Facebook Flow](http://potomushto.com/2015/01/26/facebook-flow-on-server-and-client.html)

`tryflow` transforms ES6 typed javascript into ready-to-use ES5.

Since 0.2.0 you could use live autocompletion to see type signatures:

![image](https://cloud.githubusercontent.com/assets/1004115/6182078/f999fd26-b35e-11e4-8a1a-e5e2376df316.png)

## Roadmap

- [x] ~~Add ACE editor or simular instead of Input React component~~;
- [ ] Add more examples;
- [x] ~~Cache result by hash~~;
- [x] ~~Obtain and display Flow checker version~~;
- [ ] Js_of_ocaml inside web worker?;
- [x] ~~Allow to share code~~;
- [ ] Show type signatures for functions and variables;
- [x] ~~Strip types and harmony converter~~.
- [ ] Get rid of Heroku (because of money), replace with Docker on DigitalOcean


2015, MIT License
