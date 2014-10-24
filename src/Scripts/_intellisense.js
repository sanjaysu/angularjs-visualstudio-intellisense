﻿(function (intellisense) {

    // If AngularJS is undefined, then bypass AngularJS Intellisense.
    if (!angular) {
        return;
    }

    // The following log levels are supported by AngularJS Intellisense.
    var LOG_LEVEL = {
        VERBOSE: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        OFF: 5
    };

    // Set the current log level to one of the log levels above in order to view log messages.
    var CURRENT_LOG_LEVEL = LOG_LEVEL.OFF;

    // Expose a way to set the log level from any file.
    window.AngularJS_VisualStudio_Intellisense = {
        setLogLevelVerbose: function () { CURRENT_LOG_LEVEL = LOG_LEVEL.VERBOSE; },
        setLogLevelInfo: function () { CURRENT_LOG_LEVEL = LOG_LEVEL.INFO; },
        setLogLevelWarn: function () { CURRENT_LOG_LEVEL = LOG_LEVEL.WARN; },
        setLogLevelError: function () { CURRENT_LOG_LEVEL = LOG_LEVEL.ERROR; },
        setLogLevelOff: function () { CURRENT_LOG_LEVEL = LOG_LEVEL.OFF; }
    };

    //#region Logging Functions

    function indent(level) {
        var pad = '  '; // Two-space pad.

        return Array(level + 1).join(pad);
    }

    function logMessage(logLevel, message) {
        if (CURRENT_LOG_LEVEL > logLevel) {
            return;
        } else {
            intellisense.logMessage(message);
        }
    }

    function logValue(logLevel, value, key, level) {
        if (CURRENT_LOG_LEVEL > logLevel) {
            return;
        }

        if (angular.isUndefined(value)) {
            value = 'undefined';
        }

        if (angular.isUndefined(key)) {
            key = '';
        }

        if (angular.isUndefined(level)) {
            level = 0;
        }

        var pad = indent(level);

        if (angular.isString(value)) {
            value = '"' + value + '"';
        } else if (angular.isFunction(value)) {
            value = '$FUNCTION';
        } else if (angular.isElement(value)) {
            value = '$ELEMENT';
        } else if (isWindow(value)) {
            value = '$WINDOW';
        } else if (value && document === value) {
            value = '$DOCUMENT';
        } else if (isScope(value)) {
            value = '$SCOPE';
        }

        if (angular.isArray(value)) {
            intellisense.logMessage(pad + (key ? key + ': ' : '') + ' [');

            forEach(value, function (item) {
                logValue(logLevel, item, '', level + 1);
            });

            intellisense.logMessage(pad + ']' + (level > 0 ? ',' : ''));
        } else if (angular.isObject(value)) {
            if (filter(value)) {
                intellisense.logMessage(pad + (key ? key + ': ' : '') + '{');

                forEach(value, function (propertyValue, key) {
                    logValue(logLevel, propertyValue, key, level + 1);
                });

                intellisense.logMessage(pad + '}' + (level > 0 ? ',' : ''));
            }
        } else {
            intellisense.logMessage(pad + (key ? key + ': ' : '') + value + (level > 0 ? ',' : ''));
        }
    }

    //#endregion

    //#region Utility Functions

    function forEach(obj, iterator, context) {
        var key;
        if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else if (angular.isArray(obj)) {
            for (key = 0; key < obj.length; key++) {
                iterator.call(context, obj[key], key);
            }
        } else {
            for (key in obj) {
                iterator.call(context, obj[key], key);
            }
        }

        return obj;
    }

    // Copy AngularJS functions for determining window or $scope objects.
    function isWindow(obj) {
        return obj && obj.document && obj.location && obj.alert && obj.setInterval;
    }

    function isScope(obj) {
        return obj && obj.$evalAsync && obj.$watch;
    }

    //#endregion

    //#region $compile.directive.Attributes

    // HACK: (JMB)  Since the directive attributes type is hidden and "difficult" to access during Intellisense generation,
    //              (i.e. I couldn't figure it out), create a copy of it here so that Intellisense treats it correctly.
    var Attributes = function (element, attr) {
        this.$$element = element;
        this.$attr = attr || {};
    };

    Attributes.prototype = {
        $normalize: function (name) {
            return '';
        },


        /**
         * @ngdoc method
         * @name $compile.directive.Attributes#$addClass
         * @kind function
         *
         * @description
         * Adds the CSS class value specified by the classVal parameter to the element. If animations
         * are enabled then an animation will be triggered for the class addition.
         *
         * @param {string} classVal The className value that will be added to the element
         */
        $addClass: function (classVal) {
        },

        /**
         * @ngdoc method
         * @name $compile.directive.Attributes#$removeClass
         * @kind function
         *
         * @description
         * Removes the CSS class value specified by the classVal parameter from the element. If
         * animations are enabled then an animation will be triggered for the class removal.
         *
         * @param {string} classVal The className value that will be removed from the element
         */
        $removeClass: function (classVal) {
        },

        /**
         * @ngdoc method
         * @name $compile.directive.Attributes#$updateClass
         * @kind function
         *
         * @description
         * Adds and removes the appropriate CSS class values to the element based on the difference
         * between the new and old CSS class values (specified as newClasses and oldClasses).
         *
         * @param {string} newClasses The current CSS className value
         * @param {string} oldClasses The former CSS className value
         */
        $updateClass: function (newClasses, oldClasses) {
        },

        /**
         * Set a normalized attribute on the element in a way such that all directives
         * can share the attribute. This function properly handles boolean attributes.
         * @param {string} key Normalized key. (ie ngAttribute)
         * @param {string|boolean} value The value to set. If `null` attribute will be deleted.
         * @param {boolean=} writeAttr If false, does not write the value to DOM element attribute.
         *     Defaults to true.
         * @param {string=} attrName Optional none normalized name. Defaults to key.
         */
        $set: function (key, value, writeAttr, attrName) {
        },


        /**
         * @ngdoc method
         * @name $compile.directive.Attributes#$observe
         * @kind function
         *
         * @description
         * Observes an interpolated attribute.
         *
         * The observer function will be invoked once during the next `$digest` following
         * compilation. The observer is then invoked whenever the interpolated value
         * changes.
         *
         * @param {string} key Normalized key. (ie ngAttribute) .
         * @param {function(interpolatedValue)} fn Function that will be called whenever
                  the interpolated value of the attribute changes.
         *        See the {@link guide/directive#Attributes Directives} guide for more info.
         * @returns {function()} the `fn` parameter.
         */
        $observe: function (key, fn) {
            return fn;
        }
    };

    //#endregion

    //#region Module Tracking

    // Keep track of module names.
    var moduleNames = [];
    var moduleProviderFunctions = ['provider', 'factory', 'service', 'animation', 'filter', 'controller', 'directive', 'config', 'run'];

    // Keep track of the provider injector in order to inject into providers.
    var providerInjector;

    angular.module('ng').config(['$injector', '$provide', function ($injector, $provide) {
        // Keep track of the the provider injector.
        providerInjector = $injector;

        // Decorate the $q service to resolve deferred objects at the end of the digest cycle.
        $provide.decorator('$q', ['$rootScope', '$delegate', function ($rootScope, $delegate) {
            var originalDefer = $delegate.defer;

            $delegate.defer = function () {
                // Create a deferred object.
                var deferred = originalDefer.apply($delegate, arguments);
                var promise = deferred.promise;

                // Override the promise methods to call handlers after the digest cycle.
                // This allows them to be called with parameters by user code, but if they
                // are never called on the first digest cycle they will still get Intellisense
                // on closure variables.
                function callArgsAfterDigest(originalFunc) {
                    return function () {
                        forEach(arguments, function (argument) {
                            if (angular.isFunction(argument)) {
                                $rootScope.$$postDigest(argument);
                            }
                        });

                        return originalFunc.apply(promise, arguments);
                    };
                }

                var originalThen = promise.then,
                    originalCatch = promise['catch'],
                    originalFinally = promise['finally'];

                promise.then = callArgsAfterDigest(originalThen);
                promise['catch'] = callArgsAfterDigest(originalCatch);
                promise['finally'] = callArgsAfterDigest(originalFinally);

                return deferred;
            };

            return $delegate;
        }]);

        // Decorate the $httpBackend service to execute the callback rather than using 
        // XHR, so that functions handling the response are called during Intellisense.
        $provide.decorator('$httpBackend', [function () {
            return function (method, url, post, callback) {
                callback(200, undefined, '', 'OK');
            };
        }]);

        // Decorate the $rootScope to always call event listeners registered 
        // with $on, so that listener functions are called during Intellisense.
        $provide.decorator('$rootScope', ['$delegate', function ($delegate) {
            var original$On = $delegate.$on;

            $delegate.$on = function (name) {
                $delegate.$$postDigest(function () {
                    $delegate.$emit(name);
                });

                return original$On.apply($delegate, arguments);
            };

            return $delegate;
        }]);
    }]);

    // Decorate angular.forEach to always call the callback once, even if it wouldn't 
    // normally be called, so that closure variables will be available via Intellisense.
    var originalForEach = angular.forEach;

    angular.forEach = function (obj, iterator, context) {
        var iteratorCalled = false;
        originalForEach.call(angular, obj, function () {
            iteratorCalled = true;
            iterator.apply(context, arguments);
        }, context);

        if (!iteratorCalled) {
            iterator.call(context, undefined, '');
        }

        return obj;
    };

    // Search the window object for globally-defined angular modules, and track them if they are found.
    if (window) {
        forEach(window, function (obj) {
            if (isAngularModule(obj)) {
                trackModule(obj);
            }
        });
    }

    function isAngularModule(obj) {
        // Angular modules all have names and invoke queues and core provider functions.
        return angular.isObject(obj) &&
            angular.isString(obj.name) &&
            angular.isArray(obj._invokeQueue) &&
            angular.isFunction(obj.provider) &&
            angular.isFunction(obj.constant) &&
            angular.isFunction(obj.value) &&
            angular.isFunction(obj.factory) &&
            angular.isFunction(obj.service);
    }

    // Decorate the angular.module function to record the name of each module as it is registered.
    var originalModuleFunction = angular.module;

    angular.module = function () {
        logMessage(LOG_LEVEL.VERBOSE, 'Calling "angular.module" with the following arguments:');
        logValue(LOG_LEVEL.VERBOSE, arguments);

        // Call the original module function.
        var returnValue = originalModuleFunction.apply(angular, arguments);

        // Ensure that the module and its dependencies are tracked, and all of its provider functions run.
        trackModule(arguments[0]);

        // Call the configuration function if one is specified.
        if (arguments[2]) {
            returnValue.config(arguments[2]);
        }

        return returnValue;
    };

    function trackModule(moduleOrName) {
        var moduleName, module;

        if (angular.isString(moduleOrName)) {
            // If the argument is a module name, retrieve the module from the angular.module function.
            moduleName = moduleOrName;
            module = originalModuleFunction(moduleName);
        } else {
            // Otherwise the argument is a module, so get the name from its name property.
            module = moduleOrName;
            moduleName = module.name;
        }

        if (moduleNames.indexOf(moduleName) == -1) {
            // Recursively process dependent modules.
            forEach(module.requires, trackModule);

            logMessage(LOG_LEVEL.INFO, 'Tracking module "' + moduleName + '".');

            // Store that the module has been processed to prevent duplicate processing.
            moduleNames.push(moduleName);

            // Decorate module provider functions.
            decorateModuleProviderFunctions(module);
        }
    }
    function decorateModuleProviderFunctions(module) {
        // Initialize each component with empty object dependencies. 
        forEach(moduleProviderFunctions, function (providerFunction) {

            // Decorate the component type function to call component functions with correct arguments.
            var originalProviderFunction = module[providerFunction];

            // Only decorate the provider function if the module has it (which it may not for animate).
            if (originalProviderFunction) {
                module[providerFunction] = function () {
                    logMessage(LOG_LEVEL.VERBOSE, 'Calling provider function "' + providerFunction + '" with the following arguments:');
                    logValue(LOG_LEVEL.VERBOSE, arguments);

                    // Call the original component type function.
                    var returnValue = originalProviderFunction.apply(module, arguments);

                    // Create an injector for the module.
                    // (This will execute all configuration and run blocks.)
                    var injector = angular.injector(moduleNames);

                    if (arguments.length === 2) {
                        var component;
                        var locals;

                        // Factories, services, providers, etc.
                        logMessage(LOG_LEVEL.INFO, 'Creating instance of ' + providerFunction + ' "' + arguments[0] + '".');

                        // Initialize the component based on the provider function.
                        switch (providerFunction) {
                            case 'factory':
                            case 'service':
                                component = injector.get(arguments[0]);

                                break;
                            case 'provider':
                                var component = arguments[1];

                                if (angular.isArray(component) || angular.isFunction(component)) {
                                    component = providerInjector.instantiate(component);
                                }

                                break;
                            case 'controller':
                                // Create locals to aid with injection.
                                locals = {
                                    '$scope': injector.get('$rootScope').$new()
                                };

                                component = injector.get('$controller')(arguments[0], locals);

                                break;
                            case 'filter':
                                component = injector.get('$filter')(arguments[0]);

                                break;
                            case 'directive':
                            case 'animation':
                                // Create an instance of the directive/animation definition object.
                                component = injector.invoke(arguments[1]);

                                break;
                        }

                        logMessage(LOG_LEVEL.VERBOSE, 'Creating instance of ' + providerFunction + ' "' + arguments[0] + '" returned the following:');
                        logValue(LOG_LEVEL.VERBOSE, component);

                        if (providerFunction === 'directive') {
                            // HACK: (JMB) Execute directive functions with AngularJS mocks.
                            var controller,
                                $scope = injector.get('$rootScope').$new(),
                                element = angular.element(),
                                attrs = new Attributes(),
                                transclude = function (scope, cloneLinkFn) { };

                            if (component.controller) {
                                logMessage(LOG_LEVEL.INFO, 'Calling function "controller" on directive definition object.');

                                controller = injector.instantiate(component.controller, {
                                    '$scope': $scope,
                                    '$element': element,
                                    '$attrs': attrs,
                                    '$transclude': transclude
                                });

                                logMessage(LOG_LEVEL.VERBOSE, 'Calling function "controller" on directive definition object returned the following:');
                                logValue(LOG_LEVEL.VERBOSE, controller);
                            }

                            if (component.compile) {
                                logMessage(LOG_LEVEL.INFO, 'Calling function "compile" on directive definition object.');

                                // Set the result of the compile function as the directive link function, so it is called as well.
                                component.link = component.compile(element, attrs, transclude);

                                logMessage(LOG_LEVEL.VERBOSE, 'Calling function "compile" on directive definition object returned the following:');
                                logValue(LOG_LEVEL.VERBOSE, component.link);
                            }

                            if (component.link) {
                                if (angular.isFunction(component.link)) {
                                    logMessage(LOG_LEVEL.INFO, 'Calling function "link" on directive definition object.');

                                    var returnValue = component.link($scope, element, attrs, controller, transclude);

                                    logMessage(LOG_LEVEL.VERBOSE, 'Calling function "link" on directive definition object returned the following:');
                                    logValue(LOG_LEVEL.VERBOSE, returnValue);
                                }
                                if (component.link.pre) {
                                    logMessage(LOG_LEVEL.INFO, 'Calling function "link.pre" on directive definition object.');

                                    var returnValue = component.link.pre($scope, element, attrs, controller, transclude);

                                    logMessage(LOG_LEVEL.VERBOSE, 'Calling function "link.pre" on directive definition object returned the following:');
                                    logValue(LOG_LEVEL.VERBOSE, returnValue);
                                }
                                if (component.link.post) {
                                    logMessage(LOG_LEVEL.INFO, 'Calling function "link.post" on directive definition object.');

                                    var returnValue = component.link.post($scope, element, attrs, controller, transclude);

                                    logMessage(LOG_LEVEL.VERBOSE, 'Calling function "link.post" on directive definition object returned the following:');
                                    logValue(LOG_LEVEL.VERBOSE, returnValue);
                                }
                            }
                        } else if (providerFunction === 'animation') {
                            // HACK: (JMB) Execute animate functions with AngularJS mocks.
                            var element = angular.element(),
                            doneCallback = function () { };

                            forEach(component, function (value, key) {
                                if (angular.isFunction(value)) {
                                    var returnValue;
                                    logMessage(LOG_LEVEL.INFO, 'Calling function "' + key + '" on animation definition object.');

                                    switch (key) {
                                        case 'enter':
                                        case 'leave':
                                        case 'move':
                                            returnValue = value.call(component, element, doneCallback);
                                            break;
                                        case 'addClass':
                                        case 'removeClass':
                                            returnValue = value.call(component, element, '', doneCallback);
                                            break;
                                        default:
                                            returnValue = value.call(component);
                                            break;
                                    }

                                    logMessage(LOG_LEVEL.VERBOSE, 'Calling function "' + key + '" on animation definition object returned the following:');
                                    logValue(LOG_LEVEL.VERBOSE, returnValue);
                                }
                            });
                        } else {
                            // Execute all functions on the initialized component.
                            callComponentFunctions(injector, component, locals);
                        }

                        // Digest the root scope to force promise resolution.
                        injector.get('$rootScope').$digest();

                        return returnValue;
                    }
                };
            }
        });
    }
    function callComponentFunctions(injector, component, locals) {
        if (component) {
            if (angular.isElement(component)) {
                // Bypass calling component functions on elements.
                return;
            } else if (angular.isArray(component) || angular.isFunction(component)) {
                // If the component itself is a function, then call it.
                logMessage(LOG_LEVEL.INFO, 'Calling component as function.');
                var returnValue = injector.invoke(component, null, locals);
                logMessage(LOG_LEVEL.VERBOSE, 'Calling component as function returned the following:');
                logValue(LOG_LEVEL.VERBOSE, returnValue);

                // Recursively call functions on the return value.
                callComponentFunctions(injector, returnValue, locals);
            } else {
                logMessage(LOG_LEVEL.VERBOSE, 'Calling all functions on the following component:');
                logValue(LOG_LEVEL.VERBOSE, component);

                // Call each function that is a property of the component.
                forEach(component, function (value, key) {
                    if (angular.isArray(value) || angular.isFunction(value)) {
                        logMessage(LOG_LEVEL.INFO, 'Calling function "' + key + '" on component.');
                        var returnValue = injector.invoke(value, component, locals);
                        logMessage(LOG_LEVEL.VERBOSE, 'Calling function "' + key + '" on component returned the following:');
                        logValue(LOG_LEVEL.VERBOSE, returnValue);

                        // Recursively call functions on the return value.
                        callComponentFunctions(injector, returnValue, locals);
                    }
                });
            }
        }
    }

    // Always add the AngularJS core module.
    trackModule('ng');

    //#endregion

    //#region Jasmine Intellisense

    if (jasmine) {
        // Create an array of functions to override.
        var overrides = [
            'describe', 'xdescribe',
            'beforeEach', 'afterEach',
            'it', 'xit',
            'expect',
            'module', 'inject',
            { source: angular.mock, method: 'module' },
            { source: angular.mock, method: 'inject' }
        ];

        var jasmineInjector;

        forEach(overrides, function (override) {
            // Extract source and method from the override.
            var source = override.source || window;
            var method = override.method || override;

            source[method] = function () {
                // Don't actually call the original method, since it interferes with Intellisense.

                if (method == 'module') {
                    // Track each named module, call each anonymous module.
                    forEach(arguments, function (argument) {
                        if (angular.isString(argument)) {
                            // Track the module.
                            trackModule(argument);

                            // (Re)create an injector for the module.
                            jasmineInjector = angular.injector(moduleNames);
                        } else if (angular.isFunction(argument) || angular.isArray(argument)) {
                            // Invoke the module configuration function.
                            providerInjector.invoke(argument);
                        }
                    });
                } else if (method == 'inject') {
                    // Perform injection on each argument of the method.
                    forEach(arguments, function (argument) {
                        jasmineInjector.invoke(argument);
                    });
                } else {
                    // Otherwise, call any function arguments to the method.
                    forEach(arguments.filter(angular.isFunction), function (argument) {
                        argument();
                    });

                    if (method === 'expect') {
                        // Return an expectation from calls to expect.
                        return jasmine.Expectation.Factory();
                    }
                }
            };
        });
    }

    //#endregion

    // Filter out private AngularJS properties (prefixed with $$) from statement completion.
    if (intellisense && intellisense.addEventListener) {
        intellisense.addEventListener('statementcompletion', function (event) {
            var filterRegex = /^\$\$.*/;

            event.items = event.items.filter(function (item) {
                return !filterRegex.test(item.name);
            });
        });
    }
})(window.intellisense);
