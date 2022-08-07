#!/bin/bash

rm -rf dist
mkdir dist
cd dist
mkdir assets
cd assets
for i in ../../assets/*.png; do wfjs convertPngToTga -i "$i" -e png; done
mkdir tetrominos
cd tetrominos
for i in ../../../assets/tetrominos/*.png; do wfjs convertPngToTga -i "$i" -e png; done
cd ..
mkdir blocks 
cd blocks
for i in ../../../assets/blocks/*.png; do wfjs convertPngToTga -i "$i" -e png; done
cd ..
mkdir numbers
cd numbers
for i in ../../../assets/numbers/*.png; do wfjs convertPngToTga -i "$i" -e png; done

cd ../..

cp ../app.js .
cp ../app.json .
cp -r ../watchface .


zip -r tetriband_v0_1.zip .
