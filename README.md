# Mainland

Simple message queue and distribution

Version 0.0.2

[![Build Status](https://travis-ci.org/simonswain/mainland.png)](https://travis-ci.org/simonswain/mainland)

Mainland in a message bus that lets you reliably distribute messages between different parts of your app.


## API

All methods take a callback that is called with err and result. The
signatures below use `done` to identify the callback.

* [`reset`](#reset)
* [`quit`](#quit)
* [`purge`](#purge)
* [`send`](#send)
* [`take`](#take)
* [`listener`](#listener)
* [`router`](#router)


<a name="reset" />
### reset(done)

Delete everything

<a name="quit" />
### quit(done)

Quit everything

<a name="purge" />
### purge(topic, done)

Delete all unprocessed messages from a topic

<a name="send" />
### send(topic, data, done)

Add a message to the topic queue

<a name="send" />
### take(topic, done)

Takes one (if any) message off the topic queue

<a name="listen" />
### listen(topic, handler)

Watches the end of the topic queue and calls `handler` with the next
available message.

If multiple listeners are on the same topic, they will compete for
messages. IF you want to distribute the same message to multiple handlers, use `#router`

<a name="router" />
### router(routes)

Fans out one topic to multiple topics

Router is like
```javascript
{'source-topic':['target-1','target-1'], ...}
```


## Release History

* 28/01/2014 0.0.1 Initial release
* 03/11/2014 0.0.2 Redux

## License
Copyright (c) 2014 Simon Swain
Licensed under the MIT license.
