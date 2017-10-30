#!/bin/sh
cd ./api-docs-slate

gem install bundler
bundle install
bundle exec middleman build --clean # build api docs

rm -r ../api-docs 2> /dev/null
cp -R ./build/ ../api-docs && rm -r ./build
