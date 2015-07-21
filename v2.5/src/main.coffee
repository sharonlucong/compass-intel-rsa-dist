require.config(
    baseUrl: "src"
    paths:
    #bower components 
        'jquery': '../bower_components/jquery/dist/jquery'
        'twitterBootstrap': '../bower_components/bootstrap/dist/js/bootstrap'
        'angular': '../bower_components/angular/angular'
        'uiRouter': '../bower_components/angular-ui-router/release/angular-ui-router'
        'angularMocks': '../bower_components/angular-mocks/angular-mocks'
        'angularTouch': '../bower_components/angular-touch/angular-touch'
        'uiBootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls'
        'angularTable': '../bower_components/ng-table/ng-table'
        'spin': '../bower_components/spin.js/spin'
        'ngSpinner': '../bower_components/angular-spinner/angular-spinner'
        'angularAnimate': '../bower_components/angular-animate/angular-animate'
        'd3': '../bower_components/d3/d3'
        'nvd3': '../bower_components/nvd3/build/nv.d3'
        'moment': '../bower_components/moment/moment'
        'daterangepicker': '../bower_components/bootstrap-daterangepicker/daterangepicker'
        'ngBsDaterangepicker': '../bower_components/ng-bs-daterangepicker-plus/src/ng-bs-daterangepicker'
    #vendor
        'angularDragDrop': '../vendor/angular-dragdrop/draganddrop'
        'nvd3ChartDirectives':'../vendor/nvd3ChartDirectives/angularjs-nvd3-directives'
    shim:
       "jquery":
            exports: "jquery"
        "twitterBootstrap":
            deps: ["jquery"]
            exports: "twitterBootstrap"
        "angular":
            deps: ['jquery']
            exports: "angular"
        "angularTable":
            deps: ["angular"],
            exports: "angularTable"
        "angularMocks":
            deps: ["angular"]
            exports: "angularMocks"
        "angularTouch":
            deps: ["angular"]
            exports: "angularTouch"
        "uiBootstrap":
            deps: ["angular"],
            exports: "uiBootstrap"
        "angularDragDrop":
            deps: ["angular"],
            exports: "angularDragDrop"
        "uiRouter":
            deps: ["angular"],
            exports: "uiRouter"
        "spin":
            # deps:["angular"],
            exports: "spin"
        "ngSpinner":
            deps: ["angular", "spin"]
            exports: "ngSpinner"
        "angularAnimate": 
            deps: ["angular"]
            exports: "angularAnimate"
        "d3":
            exports: "d3"
        "nvd3":
            deps: ["d3"]
            exports: "nvd3"
        "nvd3ChartDirectives":
            deps: ["nvd3"]
            exports:"nvd3ChartDirectives"
        "moment": 
            exports: "moment"
        "daterangepicker":
            deps: ["twitterBootstrap", "moment"],
            exports: "daterangepicker"
        "ngBsDaterangepicker":
            deps: ["moment","daterangepicker", "angular"],
            exports: "ngBsDaterangepicker"
    deps: ['./bootstrap']
)
