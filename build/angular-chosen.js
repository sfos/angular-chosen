/**
 * angular-chosen 1.0.13
 * @author Eugene Serkin
 * @license MIT License http://opensource.org/licenses/MIT
 */
"use strict";

(function(angular) {
    angular.module("angular-chosen", []);
    function PropertyUtil() {
        var getProperties = function(obj) {
            var result = {};
            for (var property in obj) {
                if (obj.hasOwnProperty(property) && typeof obj[property] != "function") {
                    result[property] = obj[property];
                }
            }
            return result;
        };
        return {
            getProperties: function(obj) {
                return getProperties(obj);
            }
        };
    }
    angular.module("angular-chosen").service("ChosenService", function() {
        this.allow_single_deselect = false;
        this.disable_search = false;
        this.disable_search_threshold = 0;
        this.search_placeholder = null;
        this.enable_split_word_search = true;
        this.inherit_select_classes = false;
        this.max_selected_options = Infinity;
        this.no_results_text = "No results match";
        this.placeholder_text_multiple = "Select Some Options";
        this.placeholder_text_single = "Select an Option";
        this.search_contains = false;
        this.width = null;
        this.display_disabled_options = true;
        this.display_selected_options = true;
        this.include_group_label_in_selected = false;
        this.setAllowSingleDeselect = function(isSingleDeselect) {
            this.allow_single_deselect = isSingleDeselect;
            return this;
        };
        this.isAllowSingleDeselect = function() {
            return this.allow_single_deselect;
        };
        this.setDisableSearch = function(isDisableSearch) {
            this.disable_search = isDisableSearch;
            return this;
        };
        this.isDisableSearch = function() {
            return this.disable_search;
        };
        this.setDisableSearchThreshold = function(disableSearchThreshold) {
            this.disable_search_threshold = disableSearchThreshold;
            return this;
        };
        this.getDisableSearchThreshold = function() {
            return this.disable_search_threshold;
        };
        this.setSearchPlaceholder = function(searchPlaceholder) {
            this.search_placeholder = searchPlaceholder;
            return this;
        };
        this.getSearchPlaceholder = function() {
            return this.search_placeholder;
        };
        this.setEnableSplitWordSearch = function(enableSplitWordSearch) {
            this.enable_split_word_search = enableSplitWordSearch;
            return this;
        };
        this.isEnableSplitWordSearch = function() {
            return this.enable_split_word_search;
        };
        this.setInheritSelectClasses = function(inheritSelectClasses) {
            this.inherit_select_classes = inheritSelectClasses;
            return this;
        };
        this.isInheritSelectClasses = function() {
            return this.inherit_select_classes;
        };
        this.setMaxSelectedOptions = function(maxSelectedOptions) {
            this.max_selected_options = maxSelectedOptions;
            return this;
        };
        this.getMaxSelectedOptions = function() {
            return this.max_selected_options;
        };
        this.setNoResultsText = function(noResultsText) {
            this.no_results_text = noResultsText;
            return this;
        };
        this.getNoResultsText = function() {
            return this.no_results_text;
        };
        this.setPlaceholderTextMultiple = function(placeholderTextMultiple) {
            this.placeholder_text_multiple = placeholderTextMultiple;
            return this;
        };
        this.getPlaceholderTextMultiple = function() {
            return this.placeholder_text_multiple;
        };
        this.setPlaceholderTextSingle = function(placeholderTextSingle) {
            this.placeholder_text_single = placeholderTextSingle;
            return this;
        };
        this.getPlaceholderTextSingle = function() {
            return this.placeholder_text_single;
        };
        this.setSearchContains = function(searchContains) {
            this.search_contain = searchContains;
            return this;
        };
        this.isSearchContains = function() {
            return this.search_contains;
        };
        this.setWidth = function(width) {
            this.width = width;
            return this;
        };
        this.getWidth = function() {
            return this.width;
        };
        this.setDisplayDisabledOptions = function(displayDisabledOptions) {
            this.display_disabled_options = displayDisabledOptions;
            return this;
        };
        this.isDisplayDisabledOptions = function() {
            return this.display_disabled_options;
        };
        this.setDisplaySelectedOptions = function(displaySelectedOptions) {
            this.display_selected_options = displaySelectedOptions;
            return this;
        };
        this.isDisplaySelectedOptions = function() {
            return this.display_selected_options;
        };
        this.setIncludeGroupLabelInSelected = function(includeGroupLabelInSelected) {
            this.include_group_label_in_selected = includeGroupLabelInSelected;
            return this;
        };
        this.isIncludeGroupLabelInSelected = function() {
            return this.include_group_label_in_selected;
        };
        this.getList = function() {
            return PropertyUtil().getProperties(this);
        };
    });
    angular.module("angular-chosen").directive("chosen", function($parse, $timeout, ChosenService) {
        var NG_OPTIONS_REGEXP = /^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/, initialized = false, _init = function(element, options) {
            element.chosen(options).data("chosen");
            element.trigger("chosen:updated").addClass("angular-chosen");
            initialized = true;
        }, _update = function(element) {
            element.trigger("chosen:updated");
        }, _isEmpty = function(value) {
            if (angular.isArray(value)) {
                return value.length === 0;
            } else if (angular.isObject(value) && Object.keys(value).length > 0) {
                return false;
            }
            return true;
        }, _disableStateMonitoring = function(element, attrs) {
            attrs.$observe("disabled", function() {
                return element.trigger("chosen:updated");
            });
        }, _startLoading = function(element) {
            element.addClass("loading");
        }, _stopLoading = function(element) {
            element.removeClass("loading");
        }, _enable = function(element) {
            element.removeAttr("disabled").trigger("chosen:updated");
        }, _disable = function(element) {
            element.attr("disabled", "disabled").trigger("chosen:updated");
        }, _presetSearchPlaceholder = function(element, options) {
            var chosen = element.data("chosen");
            if (angular.isDefined(options.search_placeholder)) {
                angular.forEach(chosen.search_container.find("input"), function(input) {
                    angular.element(input).attr("placeholder", options.search_placeholder);
                });
            }
        };
        return {
            restrict: "A",
            require: "?ngModel",
            link: function(scope, iElement, iAttrs, ngModelCtrl) {
                var _el = angular.element(iElement), passedInOptions = $parse(iAttrs.chosen)() || {};
                scope.options = angular.extend({}, ChosenService.getList(), passedInOptions);
                var timer, _ngOptionsMonitoring = function(element) {
                    if (!iAttrs.ngOptions || !ngModelCtrl) {
                        return;
                    }
                    var match = iAttrs.ngOptions.match(NG_OPTIONS_REGEXP), valuesExpr = match[7];
                    scope.$watchCollection(valuesExpr, function(newVal) {
                        timer = $timeout(function() {
                            if (angular.isDefined(newVal)) {
                                if (_isEmpty(newVal)) {
                                    _disable(element);
                                } else {
                                    _enable(element);
                                }
                                _stopLoading(element);
                            } else {
                                _startLoading(element);
                            }
                        });
                    });
                };
                if (ngModelCtrl) {
                    var originalRenderer = ngModelCtrl.$render;
                    ngModelCtrl.$render = function() {
                        originalRenderer();
                        if (initialized) {
                            _update(_el);
                        }
                    };
                    ngModelCtrl.$formatters.push(function(modelValue) {
                        _init(_el, scope.options);
                        _presetSearchPlaceholder(_el, scope.options);
                        return modelValue;
                    });
                    ngModelCtrl.$parsers.push(function(viewValue) {
                        return viewValue;
                    });
                    ngModelCtrl.$isEmpty = function(value) {
                        return !value || value.length === 0;
                    };
                    ngModelCtrl.$validators.required = function(modelValue) {
                        if (angular.isUndefined(iAttrs.required) || iAttrs.required === false) {
                            return true;
                        }
                        return !ngModelCtrl.$isEmpty(modelValue);
                    };
                    _ngOptionsMonitoring(_el);
                }
                _disableStateMonitoring(_el, iAttrs);
                scope.$on("$destroy", function() {
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                });
            }
        };
    });
})(angular);