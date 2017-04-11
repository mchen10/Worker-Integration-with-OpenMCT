/**
 * Basic historical telemetry plugin.
 */

var currentYear = 1260;

function HistoricalTelemetryPlugin() {
    return function install (openmct) {
        var provider = {
            supportsRequest: function (domainObject) {
                return domainObject.type === 'worker.telemetry';
            },
            request: function (domainObject, options) {
                
                var url = 'http://datamarket.com/api/v1/list.json?ds=' + domainObject.telemetry.key + '!1=[' + currentYear + ']';
                
                currentYear += 1;

                return http.get(url)
                    .then(function (resp) {
                        console.log(resp.data);
                        return resp.data;
                    });
            }
        };

        openmct.telemetry.addProvider(provider);
    }
}
