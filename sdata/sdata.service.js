(function () {
    'use strict';

    angular.module('blocks.sdata')
        .provider('sdataService', SdataServiceProvider);

    // provider is used to be able to configure the sdata URI prior to constructing the service
    function SdataServiceProvider() {
        var sdataUri, username, password;

        this.configure = function (config) {
            // root URI for sdata services: e.g. http://vmng-slx81.sssworld-local.com:3012/sdata/
            sdataUri = config.sdataUri;
            username = config.username;
            password = config.password;
        }

        this.$get = ['$http', '$q', function ($http, $q) {
            if (!sdataUri)
                throw new Error('sdataUri must be configured prior to accessing sdata service');
            if(!/\/$/.test(sdataUri))
                sdataUri += '/';
            if(/slx\/dynamic\/-/.test(sdataUri))
                throw new Error('sdataUri should be to root of sdata site (i.e. /sdata/, not /sdata/slx/dynamic/-/)');

            var service = sdataServiceFactory($http, $q, sdataUri);
            if (username) {
                service.setAuthenticationParameters(username, password);
            }
            return service;
        }];
    }

    function sdataServiceFactory($http, $q, sdataUri) {

        var _username, _password;

        return {
            // this is set when logging in and should be set before interacting with the other methods
            setAuthenticationParameters: function (username, password) {
                _username = username;
                _password = password;
            },

            read: function (resourceKind, where, queryArgs) {
                // summary:
                //  Retrieve SData resources matching the specified criteria
                //

                var url = 'slx/dynamic/-/' + resourceKind + '?format=json';
                if (where) {
                    // this must be encoded explicitly because Angular will encode a space to a + (conforming to RFC)
                    // which sdata cannot parse
                    url += '&where=' + encodeURIComponent(where);
                }
                if (queryArgs) {
                    for (var k in queryArgs) {
                        if (queryArgs.hasOwnProperty(k))
                            url += '&' + k + '=' + encodeURIComponent(queryArgs[k]);
                    }
                }

                return this.executeRequest(url);
                //url = sdataUri + url;
                //var req = getRequestConfig();
                //return $http.get(url, req).then(function(response) {
                //    console.log('GET returned', response);
                //    return response.data;
                //}, function(err) {
                //    console.warn('ERROR occured', err);
                //});
            },

            create: function (resourceKind, data) {
                // summary:
                //  Create resource
                var url = 'slx/dynamic/-/' + resourceKind + '?format=json';
                return this.executeRequest(url, 'POST', data);
            },

            update: function (resourceKind, data) {
                // summary:
                //  Update designated resource.  The id ($key) must be provided as part of the data.
                var url = 'slx/dynamic/-/' + resourceKind + '("' + data.$key + '")?format=json';
                return this.executeRequest(url, 'PUT', data);
            },

            'delete': function (resourceKind, key) {
                // summary:
                //  delete designated resource.
                var url = 'slx/dynamic/-/' + resourceKind + '("' + key + '")?format=json';
                return this.executeRequest(url, 'DELETE');
            },

            callBusinessRule: function (resourceKind, operationName, recordId, parameters) {
                var payload = {
                    $name: operationName,
                    request: {
                        entity: {$key: recordId}
                    }
                };
                if (parameters) {
                    angular.extend(payload.request, parameters);
                }
                var url = 'slx/dynamic/-/' + resourceKind + '/$service/' + operationName + '?format=json';
                return this.executeRequest(url, 'POST', payload).then(function (response) {
                    if (response.response && response.response.hasOwnProperty('Result'))
                        return response.response.Result;
                    return undefined;
                });
            },

            /**
             * Generic execute request method.  Used internally and by sub services.
             *
             * @param {string} url    Fragment of url to be added to the root sdata URI
             * @param {string} [method=GET]  HTTP Method to use
             * @param {object} [payload]   Data to be sent with the request
             */
            executeRequest: function executeRequest(url, method, payload) {
                var req = getRequestConfig({
                    url: sdataUri + url,
                    method: method || 'GET',
                    data: payload
                });
                return $http(req).then(function(response) {
                    return response.data;
                }, handleSdataError);
            },

            // TODO: this should be moved somewhere else... does not belong on the sdata service?
            expandQueryFilter: function (filter) {
                return Object.keys(filter).map(function (key) {
                    var f = filter[key];
                    if (f && f.value) {
                        switch(f.type){
                            default:
                                return key + ' like \'%' + f.value.replace(/'/g, '\\\'') + '%\'';
                        }
                    }
                    return null;
                }).filter(function (f) {
                    return !!f;
                });
            }
        };

        ///////////////

        function getRequestConfig(addlConfig) {
            var b = {
                withCredentials: false,
                headers: {
                    'Authorization': 'Basic ' + window.btoa(_username + ':' + _password),
                    'Cache-Control': 'no-cache'
                }
            };
            if (addlConfig)
                angular.extend(b, addlConfig);
            return b;
        }

        function handleSdataError(error) {
            if (error.data && error.data.length && error.data[0].message) {
                return $q.reject(error.data[0].message);
            }
            return $q.reject(error.statusText || error);
        }
    }
})();
