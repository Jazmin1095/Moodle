angular.module('mm.forums', [])

.factory('mmForumDiscussions', function() {
    var store = {},
        self = {};

 

    var firstnames = [
        'Omar Rey González', 'Jovana Torres Baez', 'David Alarcón Olivas', 'Adrian Trejo Ramos', 'Mariana Madrid', 'Karen Montoya Gamez',' Alonso Salcido ' 
    ];

    var subjects = [
        '¿Porque Ionic no me actualiza a la ultima versión.?',
        '¿Donde descargo las librerias de Ionic?',
        '¿Qué es la funcion Scope?',
        '¿Para cuando es la tarea?',
        'Tengo una duda acerca de un código',
        '¿Que versión de Ionic esta actualmente ?',
        '¿Mas frameworks para hacer aplicaciones moviles?',
        '¿Algun experto que me ayude en sistemas de transaciones en web?',
        '¿Ayuda?',
        '¿Alguna página que recomienden para aprender lo básico de angular y Ionic?',
    ];

    var paragraphs = [
        'Necesitas descargarla desde la página oficial de ionic',
        'Concepto de scope en JavaScript. El scope (ámbito o alcance) de una variable es el contexto en el cual la variable existe, este nos indica en qué partes del programa podemos acceder a esa variable o si tenemos acceso a la misma',
        'W33 Schools es una buena página para solucionarte varios problemas',
        'Exactamente que quieres hacer',
        'Hola buenas tardes, mandame el codigo o toma una captura para ayudarte',
        'La 3.14 si mal no recuerdo',
        'Descargalas en la pagina oficial automaticamente al crear la aplicación te descarga esas librerias',
        'Quiero conseguir un aplicacion para basarme en ella'

    ];

    function generateAuthor() {
        return firstnames[Math.floor(Math.random() * firstnames.length)] +
            ' ' //+ lastnames[Math.floor(Math.random() * lastnames.length)];
    }

    function generateContent() {
        var para = Math.floor(Math.random() * 4) + 1,
            content = [];
        for (var i = 0; i < para; i++) {
            content.push(paragraphs[Math.floor(Math.random() * paragraphs.length)]);
        }
        return '<p>' + content.join('</p><p>') + '</p>';
    }

    function generateThumb() {
        var gender = Math.round(Math.random());
        var pictureNumber = Math.floor((Math.random() * 50) + 1);
        return 'http://randomuser.me/api/portraits/thumb/' +
            (gender ? 'men' : 'women') + '/' +pictureNumber + '.jpg';

    }

    function generateSubject() {
        return subjects[Math.floor(Math.random() * subjects.length)];
    }

    function generateDiscussion() {
        var time = new Date(new Date().getTime() - (3600 * 24 * 1000 + Math.round(Math.random() * 3600 * 24 * 15 * 1000))),
            topic = generatePost(null, time);
        topic.content = generatePosts(topic.subject, time);
        topic.intro = topic.post.substr(0, 100) + '...</p>';
        topic.replies = topic.content.length;
        topic.lastReplyTime = topic.content[topic.content.length - 1].time;
        return topic;
    }

    function generatePost(subject, time) {
        return {
            author: generateAuthor(),
            thumb: generateThumb(),
            subject: subject ? 'Re: ' + subject : generateSubject(),
            post: generateContent(),
            time: time
        };
    }

    function generatePosts(subject, fromtime) {
        var para = Math.floor(Math.random() * 25) + 1;
        posts = [];
        for (var i = 0; i < para; i++) {
            time = new Date(fromtime.getTime() + Math.random() * 3600 * 12 * 1000);
            if (time > new Date()) {
                // Skip posts in the future.
                break;
            }
            posts.push(generatePost(subject, time));
            fromtime = time;
        }
        return posts;
    }

    self.getDiscussions = function(courseid) {
        courseid = 0; // Hardcoded for now...
        if (!store[courseid]) {
            store[courseid] = [];
            var count = Math.random() * 80 + 20;
            for (var i = 0; i < count; i++) {
                store[courseid].push(generateDiscussion());
            }
        }
        return store[courseid];
    };

    self.getDiscussion = function(discid) {
        return self.getDiscussions(0)[discid];
    };

    return self;
})

.controller('mmForumDiscussionsCtrl', function($scope, $state, discussions) {
    $scope.isTablet = document.body.clientWidth > 600;
    $scope.getURL = function(discussion) {
        var index = discussions.indexOf(discussion);
        if ($scope.isTablet) {
            return $state.href('site.forum.tablet', {id: index});
        } else {
            return $state.href('site.forum-discussion', {id: index});
        }
    };

    $scope.post = function(t, crop) {
        return t;
    };
    $scope.discussions = discussions;
})

.controller('mmForumDiscussionPostsCtrl', function($scope, $state, discussion) {
    $scope.discussion = discussion;
    $scope.post = function(t) {
        return t.post;
    };
})
;