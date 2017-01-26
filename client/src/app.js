import angular from 'angular'
import 'angular-ui-router'
angular.module('awards', ["ui.router"])

.config(($stateProvider, $urlRouterProvider) => {
  $urlRouterProvider.otherwise('/awards')

  $stateProvider
    .state('awards', {
      url: '/awards',
      templateUrl: 'awards/awards-nav.html',
      resolve: {
        awardsService: function($http) {
          return $http.get('/awards');
        }
      },
      controller: function(awardsService, $location) {
        this.awards = awardsService.data;

        this.isActive = (award) => {
          let pathRegexp = /awards\/(\w+)/;
          let match = pathRegexp.exec($location.path());

          console.log('hi')
          if(match === null || match.length === 0) return false;
          let selectedAwardName = match[1];
          console.log('below', selectedAwardName, award)

          return award === selectedAwardName;

        };
      },
      controllerAs: 'awardsCtrl'
    })
    .state('awards.trophy', {
      url: '/:awardName',
      templateUrl: 'awards/awards-trophy.html',
      resolve: {
        awardService: function($http, $stateParams) {
          return $http.get(`/awards/${$stateParams.awardName}`);
        }
      },
      controller: function(awardService){
        this.award = awardService.data;
      },
      controllerAs: 'awardCtrl'
    })
    .state('awards.new', {
      url: '/:awardName/trophy/new',
      templateUrl: 'awards/new-trophy.html',
      controller: function($stateParams, $state, $http){
        this.awardName = $stateParams.awardName;

        this.saveTrophy = function(trophy){
          $http({method: 'POST', url: `/awards/${$stateParams.awardName}/trophy`, data: {trophy}}).then(function(){
            $state.go('awards.trophy', {awardName: $stateParams.awardName});
          });
        };
      },
      controllerAs: 'newTrophyCtrl'
    })
})
