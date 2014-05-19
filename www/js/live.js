angular.module('vision')

.controller('LiveCtrl', function ($scope, SetTitle, CurrentlyAiring) {
  SetTitle("Live Channels");

  $scope.programmes = null;

  CurrentlyAiring.get().then(function(programmes) {
    $scope.programmes = programmes;
  }, function(reason) {
    console.log(reason);
  });
})

.service('CurrentlyAiring', function ($http, $q, DurationCalculator) {
  var _url = 'http://vision.lancs.ac.uk/JSON_CACHE/currently_airing.json';

  return {
    get: function() {
      var deferred = $q.defer();

      var success = function (data, status, headers, config) {
        DurationCalculator.set_for_array(data);
        deferred.resolve(data);
      };

      var failure = function (data, status, headers, config) {
        deferred.reject("Error getting currently airing JSON cache file");
      };

      $http.get(_url, { cache: false }).success(success).error(failure);

      return deferred.promise;
    }
  }
});