/**
 * angular-mailchimp
 * http://github.com/keithio/angular-mailchimp
 * License: MIT
 */

'use strict';

angular.module("template/ng-mailchimp-form.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/ng-mailchimp-form.html",
    "<form name=\"mailchimpsubscriptionform\">\n" +
    "  <div ng-hide=\"mailchimp.result === 'success'\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.username\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.dc\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.u\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.id\">\n" +
    "    <input type=\"text\" name=\"fname\" ng-model=\"mailchimp.FNAME\" placeholder=\"First name\">\n" +
    "    <input type=\"text\" name=\"lname\" ng-model=\"mailchimp.LNAME\" placeholder=\"Last name\">\n" +
    "    <input type=\"email\" name=\"email\" ng-model=\"mailchimp.EMAIL\" placeholder=\"Email address\" required>\n" +
    "    <button ng-disabled=\"MailchimpSubscriptionForm.$invalid\" ng-click=\"addSubscription(mailchimp)\">Join</button>\n" +
    "  </div>\n" +
    "  <!-- Show error message if MailChimp unsuccessfully added the email to the list. -->\n" +
    "  <div ng-show=\"mailchimp.result === 'error'\" ng-cloak>\n" +
    "    <span ng-bind-html=\"mailchimp.errorMessage\"></span>\n" +
    "  </div>\n" +
    "  <!-- Show success message if MailChimp returned successfully. -->\n" +
    "  <div ng-show=\"mailchimp.result === 'success'\" ng-cloak>\n" +
    "    <span ng-bind-html=\"mailchimp.successMessage\"></span>\n" +
    "  </div>\n" +
    "</form>\n" +
   "");
}]);


angular.module('mailchimp', ['template/ng-mailchimp-form.html', 'ng', 'ngResource', 'ngSanitize'])
  /**
   * Form directive for a new Mailchimp subscription.
   */
  .directive('ngMailchimp', [function () {
    return {
      templateUrl: 'template/ng-mailchimp-form.html',
      restrict: 'E',
      transclude: true,
      controller: function ($http, $log, $resource, $scope, $rootScope, $element) {
        console.log($scope);
        console.log($element);

        // Handle clicks on the form submission.
        $scope.addSubscription = function (mailchimp) {
          var actions,
              MailChimpSubscription,
              params = {},
              url;

          // Create a resource for interacting with the MailChimp API
          url = '//' + mailchimp.username + '.' + mailchimp.dc +
                '.list-manage.com/subscribe/post-json';

          var fields = Object.keys(mailchimp);

          for(var i = 0; i < fields.length; i++) {
            params[fields[i]] = mailchimp[fields[i]];
          }

          params.c = 'JSON_CALLBACK';

          actions = {
            'save': {
              method: 'jsonp'
            }
          };
          MailChimpSubscription = $resource(url, params, actions);

          // Send subscriber data to MailChimp
          MailChimpSubscription.save(
            // Successfully sent data to MailChimp.
            function (response) {
              // Define message containers.
              mailchimp.errorMessage = '';
              mailchimp.successMessage = '';

              // Store the result from MailChimp
              mailchimp.result = response.result;

              // Mailchimp returned an error.
              if (response.result === 'error') {
                if (response.msg) {
                  // Remove error numbers, if any.
                  var errorMessageParts = response.msg.split(' - ');
                  if (errorMessageParts.length > 1)
                    errorMessageParts.shift(); // Remove the error number
                  mailchimp.errorMessage = errorMessageParts.join(' ');
                } else {
                  mailchimp.errorMessage = 'Sorry! An unknown error occured.';
                }
              }
              // MailChimp returns a success.
              else if (response.result === 'success') {
                mailchimp.successMessage = response.msg;
              }

              //Broadcast the result for global msgs
              $rootScope.$broadcast('mailchimp-response', response.result, response.msg);
            },

            // Error sending data to MailChimp
            function (error) {
              $log.error('MailChimp Error: %o', error);
            }
          );
        };
      }
    };
  }]);
