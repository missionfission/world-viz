#!/bin/bash

# Create the data directory structure
mkdir -p public/wits_en_at-a-glance_allcountries_allyears

# Copy CSV files to the public directory
cp -r wits_en_at-a-glance_allcountries_allyears/*.csv public/wits_en_at-a-glance_allcountries_allyears/ 