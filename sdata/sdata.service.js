(function () {
    'use strict';

    angular.module('blocks.sdata')
        .provider('sdataService', SdataServiceProvider);

    // provider is used to be able to configure the sdata URI prior to constructing the service
    function SdataServiceProvider() {
        var sdataUri, username, password;

        this.configure = function (config) {
            sdataUri = config.sdataUri;
            username = config.username;
            password = config.password;
        }

        this.$get = ['$http', '$q', function ($http, $q) {
            if (!sdataUri)
                throw new Error('sdataUri must be configured prior to accessing sdata service');
            var service = sdataServiceFactory($http, $q, sdataUri);
            if(username){
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

                var url = sdataUri + resourceKind + '?format=json';
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

                return $http.get(url, getRequestConfig()).then(function (response) {
                    return response.data;
                }, handleSdataError);
            },

            create: function (resourceKind, data) {
                // summary:
                //  Create resource
                var url = sdataUri + resourceKind + '?format=json';
                return $http.post(url, data, getRequestConfig()).then(function (response) {
                    return response.data;
                }, handleSdataError)
            },

            update: function (resourceKind, data) {
                // summary:
                //  Update designated resource.  The id ($key) must be provided as part of the data.
                var url = sdataUri + resourceKind + '("' + data.$key + '")?format=json';
                return $http.put(url, data, getRequestConfig()).then(function (response) {
                    return response.data;
                }, handleSdataError)
            },

            destroy: function (resourceKind, key) {
                // summary:
                //  delete designated resource.
                var url = sdataUri + resourceKind + '("' + key + '")?format=json';
                return $http.delete(url, getRequestConfig()).catch(handleSdataError);
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
                var url = sdataUri + resourceKind + '/$service/' + operationName + '?format=json';
                return $http.post(url, payload, getRequestConfig()).then(function (response) {
                    console.log(response);
                    if (response.data.response && response.data.response.hasOwnProperty('Result'))
                        return response.data.response.Result;
                    return undefined;
                }, handleSdataError)
            },

            expandQueryFilter: function (filter) {
                return Object.keys(filter).map(function (key) {
                    var f = filter[key];
                    if (f && f.value) {
                        switch (f.type) {
                            case 'text':
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
