// Create application with dependency 'firebase'
var app = angular.module('myApp', ['firebase']);
var ctrl = app.controller('myCtrl', function($scope, $firebaseAuth, $firebaseArray, $firebaseObject) {
    var ref = new Firebase("https://twitter-demo-tr.firebaseio.com");
    
    var tweetsRef = ref.child('tweets');
    var usersRef = ref.child('users');
    $scope.tweets = $firebaseArray(tweetsRef);
    $scope.users = $firebaseObject(usersRef);

    // Create authorization object that referes to firebase
    $scope.authObj = $firebaseAuth(ref);

    // Test if already logged in
    var authData = $scope.authObj.$getAuth();
    if (authData) {
        $scope.userId = authData.uid;
    } 

    // SignUp function
    $scope.signUp = function() {
        // Create user
        $scope.authObj.$createUser({
            email: $scope.email,
            password: $scope.password,          
        })

        // Once the user is created, call the logIn function
        .then($scope.logIn)

        // Once logged in, set and save the user data
        .then(function(authData) {
            $scope.userId = authData.uid;
            $scope.users[authData.uid] ={
                handle:$scope.handle, 
                userImage:$scope.userImage,
            }
            $scope.users.$save()
        })

        // Catch any errors
        .catch(function(error) {
            console.error("Error: ", error);
        });
    }

    // SignIn function
    $scope.signIn = function() {
        $scope.logIn().then(function(authData){
            $scope.userId = authData.uid;
        })
    }

    // LogIn function
    $scope.logIn = function() {
        return $scope.authObj.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        })
    }

    // LogOut function
    $scope.logOut = function() {
        $scope.authObj.$unauth()
        $scope.userId = false
    }

        
        // Write an accesible tweet function to save a tweet
    $scope.saveTweet = function() {
        $scope.tweets.$add({ 
            text: $scope.newTweet,
            userId: $scope.userId,
            likes: 0, 
            time: Firebase.ServerValue.TIMESTAMP}).then(function () {
             $scope.newTweet = "";
                $scope.tweets.$save();
         });

    }

    $scope.like = function(tweet) {
        tweet.likes++;
        $scope.tweets.$save();
    }
});
