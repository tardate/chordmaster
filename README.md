# ChordMaster

A demonstration of how to use [jTab](http://jtab.tardate.com/) to build web applications for guitarists.

NB: this is a port to GitHub pages hosting of a very old example from 2009


## Hosting

I'm using GitHub Pages to host [chordmaster.tardate.com](http://chordmaster.tardate.com) directly from the GitHub repository.

How does that work? GitHub Pages basically serves whatever you commit to the repo.
For static HTML sites, that means simply adding an `index.html` to the root of the repo.

GitHub now allows you to select the branch from which GitHub Pages are built.
I've chosen to serve directly from the master branch.

To host on a custom URL, just two steps:

* in DNS, configure a CNAME to point to <username>.github.io
* add a CNAME file to the repo root with the matching CNAME in DNS (GitHub does this for you automatically if you add the custom url in the web interface)


## Contributing

1. Fork it ( https://github.com/tardate/fretboard_web/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
