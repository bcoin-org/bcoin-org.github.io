# About Bcoin.io
This is the GitHub Pages hosted [website for Bcoin](http://bcoin.io).

Bcoin is the first fullnode Bitcoin implementation built specifically for production systems at scale. Originally created to be used as backend infrastructure for [Purse.io](https://purse.io), Bcoin enables companies to spin up consumer-grade bitcoin applications/wallet systems without the long-term concern of scalability, and security. Engineered from the ground-up in Nodejs to create scalable, flexible, and efficient production-ready systems. Bcoin can be integrated into almost any desktop or browser application to enable native payments, using bitcoin’s trusted and robust global network.

# Guide Contribution Guidelines
## Submitting Ideas and Claiming Bounties
Have an idea for a guide you'd like to contribute to [our collection of Bitcoin tutorials](http://bcoin.io/guides.html)? Want to collect a bounty for a submitted guide? First head on over to the [GitHub issues](https://github.com/bcoin-org/bcoin-org.github.io/issues) and see if your idea is already posted. Bounties will be placed on issues via [bountysource](https://bountysource.com) and tagged with the "guide" label.

## Adding a New Guide
To add a new guide, just a submit a Pull Request with a markdown file added to the `/guides-markdown` directory in this repo (take a look at [some of the other guides already there](https://github.com/bcoin-org/bcoin-org.github.io/tree/staging/guides-markdown)). Make sure to include a title using a top level header (with a single `#` hashtag in the markdown) and then a `post-author` and `post-description` at the top using code-snippet blocks labeled accordingly. If your PR is accepted, it will automatically be converted to html, added to the website and any bounty associated with the GitHub issue will be yours!

#### New guides should include the following:
- Working code examples
- Description of the design choices made
- If different approaches are possible, these should be elaborated on and if possible demonstrated (e.g. SPV vs. Full Node, WalletDB vs. manual key management)
- Section at the end for how the example could be expanded on, i.e. ready for production or additional functionality
- If possible, links to repo with full working code implementation

## Updating API Docs
Our [API Documentation](http://bcoin.io/api-docs/index.html) runs on the Open Source [Slate Framework](https://github.com/lord/slate). To make an update, fork the repo and make the changes to the appropriate Markdown in the file directory: bcoin-org.github.io/api-docs-slate/source/includes/. When your PR is merged in to staging, the new docs will be built and deployed to the live docs page http://bcoin.io/api-docs/index.html.
