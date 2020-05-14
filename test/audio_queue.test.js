var assert = require('chai').assert
var describe = require('mocha').describe
var it = require('mocha').it
var beforeEach = require('mocha').beforeEach

const AudioQueue = require('../src/audio_queue')

describe('AudioQueue', function () {
  var audioQueue

  beforeEach(function () {
    audioQueue = new AudioQueue()
  })

  describe('#add', function () {
    it('Should accept an address for an item, and add it to the queue', async function () {
      await audioQueue.add('https://www.youtube.com/watch?v=jNQXAC9IVRw', 'YOUTUBE')
      assert(audioQueue.items[0].url === 'https://youtube.com/watch?v=jNQXAC9IVRw', 'YOUTUBE')
    })

    it('Should reject an invalid URL', async function () {
      var videosQueued = await audioQueue.add('drewarewarewaeyrdsre', 'YOUTUBE')
      assert(videosQueued === null, 'method should return null')
    })

    it('Should reject an empty URL', async function () {
      var videosQueued = await audioQueue.add('', 'YOUTUBE')
      assert(videosQueued === null, 'method should return null')
    })

    it('Should store the source of an audio clip', async function () {
      await audioQueue.add('https://www.youtube.com/watch?v=jNQXAC9IVRw', 'YOUTUBE')

      assert(audioQueue.items[0].source === 'YOUTUBE')

      await audioQueue.add('somelocalpath', 'LOCAL')
      assert(audioQueue.items[1].source === 'LOCAL')
    })

    it('Should add the items in a youtube playlist to the queue', async function () {
      await audioQueue.add('https://www.youtube.com/watch?v=q6EoRBvdVPQ&list=PL4ih7gaviWT6wn33V8zJW_jfNXMvlzSxK', 'YOUTUBE')
      assert(audioQueue.items.length > 1, 'There should be more than one video queued')
    })

    it('Should add the items forward of the current item, in the playlist', async function () {
      await audioQueue.add('https://www.youtube.com/watch?v=32nkdvLq3oQ&list=PL4ih7gaviWT6wn33V8zJW_jfNXMvlzSxK&index=7', 'YOUTUBE')
      assert(audioQueue.items[0].url === 'https://youtube.com/watch?v=32nkdvLq3oQ', 'There should be more than one video queued')
    })
  })

  describe('#normalizeYoutubeURL', function () {
    it('should remove all but the video ID from a youtube URL', function () {
      var out = audioQueue.normalizeYoutubeURL('https://www.youtube.com/watch?v=AQN2M3ngZjc&feature=youtu.be&t=5')
      assert(out === 'https://youtube.com/watch?v=AQN2M3ngZjc', 'only the v= parameter should remain')
    })

    it('should leave a correct url unchanged', function () {
      var out = audioQueue.normalizeYoutubeURL('https://www.youtube.com/watch?v=AQN2M3ngZjc')
      assert(out === 'https://youtube.com/watch?v=AQN2M3ngZjc', 'the url should be unchanged')
    })

    it('should change a shortened URL to a full-length URL', function () {
      var out = audioQueue.normalizeYoutubeURL('https://youtu.be/AQN2M3ngZjc')
      assert(out === 'https://youtube.com/watch?v=AQN2M3ngZjc', 'the URL should be full-length')
    })

    it('should change shortened to full-length, and remove parameters', function () {
      var out = audioQueue.normalizeYoutubeURL('https://youtu.be/AQN2M3ngZjc?t=5')
      assert(out === 'https://youtube.com/watch?v=AQN2M3ngZjc', 'the url should be full length, with only the video ID')
    })
  })
})
