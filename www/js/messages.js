angular.module('mm.messages', [])

.factory('mmMessages', function() {

    var contacts = [];
    var discussions = [
        {
            messages: [],
            from: {
                name: 'David Alarcon',
                thumb: 'img/fotos/img1.jpg',
            }
        },
        {
            messages: [],
            from: {
                name: 'Karen Montoya',
                thumb: 'img/fotos/karen.jpg',
            }
        },
        {
            messages: [],
            from: {
                name: 'Omar Rey Gonzales',
                thumb: 'img/fotos/omar.jpg',
            }
        },
        {
            messages: [],
            from: {
                name: 'Jovana Torres',
                thumb: 'img/fotos/Jazmin.jpg',
            }
        },
        {
            messages: [],
            from: {
                name: 'Adrian Ramos',
                thumb: 'img/fotos/adrian.jpg',
            }
        },
        {
            messages: [],
            from: {
                name: 'Mariana Madrid',
                thumb: 'img/fotos/mariana.jpg',
            }
        },
        {
            messages: [],
            from: {
                name: 'Alonso Salcido',
                thumb: 'img/fotos/alonso.jpg',
            }
        },
       
    ];

    messageBank = [
        'Hola',
        'Como estas?',
        'Que tal va el proyecto?',
        'Nose la neta estoy perdido',
        'Yo tengo hambre y sueno',
        'A que hora tenemos que exponer',
        'hay clases ',
        'nose la verdad',
        'ok estaremos a las 5',
        'seguro que estaras ah ok',
        'ok',
        'ok',
        
    ]


    function generateDiscussions() {
        var index = 0,
            count = 0,
            msgidx = 0,
            startDate = new Date();

        if (discussions[19]) {
            // A few discussions have already been generated.
            return;
        }

        for (var i = 0; i < 20; i++) {

            // Copy existing conversation here.
            if (!discussions[i]) {
                discussions[i] = discussions[index];
            }

            // Generate conversation.
            if (discussions[index].messages.length < 1) {
                count = Math.floor(Math.random() * 20) + 5;
                for (var j = 0; j < count; j++) {
                    msgidx = Math.floor(Math.random() * messageBank.length);
                    discussions[index].messages.push({
                        message: messageBank[msgidx],
                        mine: Math.round(Math.random()) > 0 ? true: false,
                        time: Math.round(startDate.getTime() / 1000 - Math.random() * 500000) * 1000
                    });
                };
            }

            index++;
            if (index >= discussions.length) {
                index = 0;
            }
        }
    }

    function addMessage(index, message) {
        discussions[index].messages.push({
            mine: true,
            time: new Date(),
            message: message
        });
    }

    function getContact(index) {
        generateDiscussions();
        return discussions[index].from;
    }

    function getContacts(index) {
        var tmp = {};
        if (contacts.length < 1) {
            generateDiscussions();
            angular.forEach(discussions, function(v, k) {
                if (tmp[v.from.name]) {
                    return;
                }
                tmp[v.from.name] = true;
                contacts[k] = v.from;
                contacts[k]['index'] = k;
            });
        }
        return contacts;
    }

    function getDiscussion(index) {
        generateDiscussions();
        return discussions[index];
    }

    function getDiscussions() {
        generateDiscussions();
        return discussions;
    }

    return {
        addMessage: addMessage,
        getContact: getContact,
        getContacts: getContacts,
        getDiscussion: getDiscussion,
        getDiscussions: getDiscussions
    };

})

.value('mmMessagesMessageTabConst', 0)
.value('mmMessagesContactTabConst', 1)

.controller('mmMessagesCtrl', function($scope, $state, $ionicPlatform, contacts, discussions) {
    var personIndex = null;

    $scope.contacts = contacts;
    $scope.discussions = discussions;

    $scope.showDiscussionLink = false;
    $scope.showInfoLink = false;

    $scope.goDiscussion = function() {
        $scope.showDiscussionLink = false;
        $scope.showInfoLink = true;
        $state.go('site.messages.tablet', {index: personIndex});
    };
    $scope.goInfo = function() {
        $scope.showDiscussionLink = true;
        $scope.showInfoLink = false;
        $state.go('site.messages.contacts-tablet', {index: personIndex});
    };

    // Implemented this way for faster DOM update.
    $scope.$watch(function() {
        return $state.is('site.messages.contacts-tablet');
    }, function(newv, oldv, $scope) {
        if (newv) {
            $scope.showDiscussionLink = true;
            $scope.showInfoLink = false;
        }
    });

    $scope.$watch(function() {
        return $state.is('site.messages.tablet');
    }, function(newv, oldv, $scope) {
        if (newv) {
            $scope.showDiscussionLink = false;
            $scope.showInfoLink = true;
        }
    });

    $scope.$on('mmMessagesContactSelected', function(e, index) {
        personIndex = contacts[index].index;
    });
    $scope.$on('mmMessagesDiscussionSelected', function(e, index) {
        personIndex = index;
    });
})

.controller('mmMessagesContactsCtrl', function($rootScope, $state, $scope, $ionicTabsDelegate, $ionicPlatform, mmMessagesContactTabConst) {
    $scope.currentIndex = null;
    $scope.$on('mmMessagesContactSelected', function(e, index) {
        $scope.currentIndex = index;
    });
    $scope.$on('mmMessagesDiscussionSelected', function(e, index) {
        if (mmMessagesContactTabConst != $ionicTabsDelegate.$getByHandle('messages-tabs').selectedIndex()) {
            $scope.currentIndex = null;
        }
    });

    $scope.getURL = function(index) {
        if ($ionicPlatform.isTablet()) {
            return $state.href('site.messages.contacts-tablet', {index: index});
        }
        return $state.href('site.messages-contact', {index: index});
    };
})

.controller('mmMessagesContactCtrl', function($rootScope, $scope, $state, $ionicPlatform, index, contact) {
    $scope.contact = contact;
    $scope.index = index;
    $scope.sendMessage = function() {
        if ($ionicPlatform.isTablet()) {
            $state.go('site.messages.tablet', {index: index});
        } else {
            $state.go('site.messages-discussion', {index: index});
        }
    };
    $rootScope.$broadcast('mmMessagesContactSelected', index);
})

.controller('mmMessagesDiscussionsCtrl', function($rootScope, $scope, $stateParams, $state, $ionicPlatform, $ionicTabsDelegate, mmMessagesMessageTabConst) {

    // We can create a service for return device information.
    $scope.isTablet = document.body.clientWidth > 600;
    $scope.currentIndex = null;

    $scope.$on('mmMessagesContactSelected', function(e, index) {
        if (mmMessagesMessageTabConst != $ionicTabsDelegate.$getByHandle('messages-tabs').selectedIndex()) {
            $scope.currentIndex = null;
        }
    });
    $scope.$on('mmMessagesDiscussionSelected', function(e, index) {
        $scope.currentIndex = index;
    });

    // $scope.$on('$ionicView.enter', function() {
    //     console.log('$ionicView.enter');

    //     if ($scope.isTablet) {
    //         // Load the first discussion.
    //         // This does not allways works, seems to be cached states.
    //         console.log("state go...");
    //         $state.go('site.messages.tablet', {index: 0});
    //     }

    // });

    // Function for returning the correct URL for the state.
    $scope.getURL = function(index) {
        if ($ionicPlatform.isTablet()) {
            return $state.href('site.messages.tablet', {index: index});
        }
        return $state.href('site.messages-discussion', {index: index});
    };
})

.controller('mmMessageDiscussionCtrl', function($rootScope, $scope, $stateParams, $ionicScrollDelegate, $timeout, mmMessages, discussion) {
    var sv,
        lastDate = null;

    $scope.index = $stateParams.index;

    // We can create a service for return device information.
    $scope.isTablet = document.body.clientWidth > 600;

    // Scroll to the botton.
    $timeout(function() {
        sv = $ionicScrollDelegate.$getByHandle('messagesScroll');
        sv.scrollBottom();
    });

    $scope.addMessage = function(message) {
        if (!message) {
            return;
        }
        mmMessages.addMessage($stateParams.index, message);
        sv.scrollBottom();
    };

    $scope.showDate = function(message) {
        var d = new Date(message.time);
        d.setMilliseconds(0);
        d.setSeconds(0);
        d.setMinutes(0);
        d.setHours(1);

        if (!lastDate || d.getTime() != lastDate.getTime()) {
            lastDate = d;
            return true;
        }
    };

    $scope.discussion = discussion;
    $rootScope.$broadcast('mmMessagesDiscussionSelected', $stateParams.index);
});
