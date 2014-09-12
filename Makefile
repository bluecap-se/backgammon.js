
#
# Makefile for building Backgammon
#

SOURCE_DIR ?= ./src
INSTALL_DIR ?= ./build

JS_TARGETS = $(SOURCE_DIR)/dependencies/excanvas/excanvas.js \
			 $(SOURCE_DIR)/dependencies/easeljs/lib/easeljs-0.7.1.min.js \
			 $(SOURCE_DIR)/dependencies/jrumble/jquery.jrumble.min.js \
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
	mkdir -p $(INSTALL_DIR)/js/
	mkdir -p $(INSTALL_DIR)/dependencies/jquery/
	mkdir -p $(INSTALL_DIR)/dependencies/modernizr/
	cat ${JS_TARGETS} > all.tmp.js
	uglifyjs all.tmp.js > $(INSTALL_DIR)/js/all.min.js
	rm all.tmp.js
	cp $(SOURCE_DIR)/dependencies/jquery/dist/jquery.min.js $(INSTALL_DIR)/dependencies/jquery/
	cp $(SOURCE_DIR)/dependencies/modernizr/modernizr.js $(INSTALL_DIR)/dependencies/modernizr/


# Minify static HTML
# pages and copy
tmpl:
	# cp $(SOURCE_DIR)/index.html $(INSTALL_DIR)/
	php -r "print preg_replace('#(?ix)(?>[^\S ]\s*|\s{2,})(?=(?:(?:[^<]++|<(?!/?(?:textarea|pre)\b))*+)(?:<(?>textarea|pre)\b|\z))#', '', join(' ', @file('$(SOURCE_DIR)/index.html')));" > $(INSTALL_DIR)/index.html


img:
	test -d $(INSTALL_DIR)/images/ || mkdir -p $(INSTALL_DIR)/images/
	cp $(SOURCE_DIR)/images/* $(INSTALL_DIR)/images/


# Clean up the mess
clean:
	rm -rf $(INSTALL_DIR)/*
