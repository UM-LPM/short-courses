(function($) {
    $.fn.simpleJekyllSearch = function(options) {
        var settings = $.extend({
            jsonFile: '/search.json',
            jsonFormat: 'title,keywords,author,url',
            template: '<li>hello</li>',
            searchResults: '.search-results',
            limit: '10',
            noResults: '<p>We didn\'t find anything :(</p>'
        }, options);

        var properties = settings.jsonFormat.split(',');

        var jsonData = [],
            origThis = this,
            searchResults = $(settings.searchResults);

        if(settings.jsonFile.length && searchResults.length){
            $.ajax({
                type: "GET",
                url: settings.jsonFile,
                dataType: 'json',
                success: function(data) {
                    jsonData = data;
                    registerEvent();
                },
                error: function(x, y, z) {
                    console.log("***ERROR in simpleJekyllSearch.js***");
                    console.log(x);
                    console.log(y);
                    console.log(z);
                    // x.responseText should have what's wrong
                }
            });
        }

        function registerEvent() {
            origThis.keyup(function() {
                if($(this).val().length) {
                    writeMatches(performSearch($(this).val()));
                } else {
                    clearSearchResults();
                }
            });
        }

        function performSearch(str) {
            var matches = [];
            $.each(jsonData, function(i, entry) {
                var entryText = entry.title + ' ' + entry.author + ' ' + entry.keywords;
                if(entryText.toLowerCase().indexOf(str.toLowerCase()) !== -1) {
                    matches.push(entry);
                }
            });
            return matches;
        }

        function writeMatches(m) {
            clearSearchResults();
            if (m.length) {
                $.each(m, function(i, entry) {
                    if(i < settings.limit) {
                        var output = settings.template;
                        $.each(properties, function(index, property) {
                            output = output.replace(new RegExp("{" + property + "}", 'g'), entry[property]);
                        });
                        searchResults.append($(output));
                    }
                });
            } else {
                searchResults.append(settings.noResults);
            }
        }

        function clearSearchResults() {
            searchResults.children().remove();
        }
    }
}(jQuery || Zepto));
