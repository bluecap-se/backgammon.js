
#
# Makefile for building Backgammon
#

SOURCE_DIR ?= ./src
INSTALL_DIR ?= ./build

JS_TARGETS = $(SOURCE_DIR)/js/excanvas.min.js \
			 $(SOURCE_DIR)/js/easel.min.js \
			 $(SOURCE_DIR)/js/jrumble.min.js \
			 $(SOURCE_DIR)/js/backgammon.js \
			 $(SOURCE_DIR)/js/dice.js \
			 $(SOURCE_DIR)/js/main.js \
			 $(SOURCE_DIR)/js/config.js

TMPL_FILES = $(subst ./src/tmpl/,, $(wildcard $(SOURCE_DIR)/tmpl/*.html))

all: tmpl css js


# Concat, parse, minify
# and copy CSS files
css:
	test -d $(INSTALL_DIR)/css/ || mkdir -p $(INSTALL_DIR)/css/
	lessc -x $(SOURCE_DIR)/css/main.less > $(INSTALL_DIR)/css/main.css
	#test -d $(INSTALL_DIR)/css/fonts/ || mkdir -p $(INSTALL_DIR)/css/fonts/
	#cp -R $(SOURCE_DIR)/css/fonts/* $(INSTALL_DIR)/css/fonts/


# Concat, minify and
# copy JavaScript files
js:
	cat ${JS_TARGETS} > all.tmp.js
	jsc all.tmp.js > $(INSTALL_DIR)/js/all.min.js
	rm all.tmp.js
	cp $(SOURCE_DIR)/js/jquery-latest.min.js $(INSTALL_DIR)/js/
	cp $(SOURCE_DIR)/js/modernizr.min.js $(INSTALL_DIR)/js/


# Minify static HTML
# pages and copy
tmpl:
	cp $(SOURCE_DIR)/humans.txt $(INSTALL_DIR)/
	# cp $(SOURCE_DIR)/index.html $(INSTALL_DIR)/
	php -r "print preg_replace('#(?ix)(?>[^\S ]\s*|\s{2,})(?=(?:(?:[^<]++|<(?!/?(?:textarea|pre)\b))*+)(?:<(?>textarea|pre)\b|\z))#', '', join(' ', @file('$(SOURCE_DIR)/index.html')));" > $(INSTALL_DIR)/index.html


img:
	test -d $(INSTALL_DIR)/images/ || mkdir -p $(INSTALL_DIR)/images/
	cp $(SOURCE_DIR)/images/* $(INSTALL_DIR)/images/


# Clean up the mess
clean:
	rm -rf $(INSTALL_DIR)/*
