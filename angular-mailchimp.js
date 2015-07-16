/**
 * angular-mailchimp
 * http://github.com/keithio/angular-mailchimp
 * License: MIT
 */

angular.module("template/ng-mailchimp-form.html", []).run(["$templateCache", function($templateCache) {
  'use strict';
  $templateCache.put("template/ng-mailchimp-form.html",
    "<button type=\"button\" ng-bind=\"nmcConfig.title || 'Newsletter'\" ng-click=\"toggleForm()\" ng-if=\"!showForm\"></button>\n" +
    "<form ng-if=\"showForm\" name=\"mailchimpsubscriptionform\">\n" +
    "  <button type=\"button\" ng-click=\"toggleForm()\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span></button>\n" +
    "  <div ng-hide=\"mailchimp.result === 'success'\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.username\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.dc\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.u\">\n" +
    "    <input class=\"hidden\" type=\"hidden\" ng-model=\"mailchimp.id\">\n" +
    "    <input type=\"text\" name=\"fname\" ng-model=\"mailchimp.FNAME\" placeholder=\"{{::nmcConfig.fname || 'First Name'}}\">\n" +
    "    <input type=\"text\" name=\"lname\" ng-model=\"mailchimp.LNAME\" placeholder=\"{{::nmcConfig.lname || 'Last Name'}}\">\n" +
    "    <input type=\"email\" name=\"email\" ng-model=\"mailchimp.EMAIL\" placeholder=\"{{::nmcConfig.placeholder || 'Email'}}\" required>\n" +
    "    <button ng-disabled=\"MailchimpSubscriptionForm.$invalid\" ng-click=\"addSubscription(mailchimp)\" ng-bind=\"nmcConfig.subscribe || 'Subscribe'\"></button>\n" +
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
   * $log, $resource, $rootScope
   * Form directive for a new Mailchimp subscription.
   */
  .directive('ngMailchimp', ['$resource', '$log', '$rootScope', function ($resource, $log, $rootScope) {
    'use strict';
    return {
      templateUrl: 'template/ng-mailchimp-form.html',
      restrict: 'E',
      scope: {
        nmcConfig : '=',
      },
      link: function (scope, element, attrs) {
        var DIR_PREFIX = 'nmc';

        scope.showForm = false;
        scope.mailchimp = {};

        (function createMailchimpObject () {
          var mailchimp = {
            username: scope.nmcConfig.username,
            dc: scope.nmcConfig.dc,
            u: scope.nmcConfig.u,
            id: scope.nmcConfig.id
          };
          //    tmp  = '';

          //for (var c in attrs) {
          //  if (attrs.hasOwnProperty(c) && c.indexOf(DIR_PREFIX) > -1) {
          //    tmp = c.split(DIR_PREFIX).pop().toLowerCase();
          //    mailchimp[tmp] = attrs[c];
          //  }
          //}

          scope.mailchimp = mailchimp;
        })();

        scope.toggleForm = function () {
          scope.showForm = !scope.showForm;
        };

        // Handle clicks on the form submission.
        scope.addSubscription = function (mailchimp) {
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
                  mailchimp.errorMessage = scope.nmcConfig.err || 'Sorry! An unknown error occured.';
                }
              }
              // MailChimp returns a success.
              else if (response.result === 'success') {
                mailchimp.successMessage = scope.nmcConfig.ok || response.msg;
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
