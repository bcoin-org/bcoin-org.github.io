#!/bin/sh
cd ./api-docs-slate
gem install bundler
bundle install
bundle exec middleman build --clean # build api docs
cp -RT ./build/ ../api-docs && rm -r ./build
