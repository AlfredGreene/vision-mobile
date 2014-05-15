angular.module('vision')

.controller('LibraryCtrl', function ($scope, SetTitle, WatchLaterService, AuthService) {
  SetTitle("My Library");

  WatchLaterService.get(AuthService.user_id()).then(function(watch_later) {
    $scope.watch_later = watch_later;
    console.log(watch_later);
  }, function(reason) {
    console.log(reason);
  });

})

.service('WatchLaterService', function ($http, $q, QueryStringBuilder, DurationCalculator) {
  var _url = 'http://10.42.32.127:9110/modules/library/get_paused_content';

  return {
    get: function(user_id) {
      var deferred = $q.defer();
      var params = {
        user_id: user_id,
        api: '53e659a15aff4a402de2d51b98703fa1ade5b8c5'
      }

      var success = function (data, status, headers, config) {
        var data = data['data'];
        DurationCalculator.set_for_array(data);
        deferred.resolve(data);
      };

      var failure = function (data, status, headers, config) {
        deferred.reject("Error getting currently airing JSON cache file");
      };

      var url = _url + '?' + QueryStringBuilder(params);
      $http.get(url, { cache: false }).success(success).error(failure);

      return deferred.promise;
    }
  }
});
