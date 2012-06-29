define([ 
    "use!backbone", 
    "use!handlebars",
    "app/App", 
    "text!app/app.handlebars", 
    "app/AppRouter",
    "activity/ActivityFeed",
    "activity/ActivityFeedView",
    "authentication/Authentication",
    "authentication/AuthenticationEditView",
    "corpus/Corpus", 
    "corpus/CorpusEditView",
    "corpus/CorpusReadView",
    "data_list/DataList",
    "data_list/DataListReadView",
    "data_list/DataListEditView",
    "datum/Datum",
    "datum/DatumContainerEditView",
    "datum/DatumFields", 
    "export/Export",
    "export/ExportReadView",
    "hotkey/HotKey",
    "hotkey/HotKeyEditView",
    "import/Import",
    "import/ImportEditView",
    "user/UserPreference",
    "user/UserPreferenceEditView",
    "search/Search",
    "search/SearchEditView",
    "datum/Session",
    "datum/SessionEditView",
    "datum/SessionReadView",
    "user/User",
    "user/UserEditView",
    "user/UserReadView",
    "user/UserWelcomeView",
    "libs/Utils"
], function(
    Backbone, 
    Handlebars,
    App, 
    appTemplate,
    AppRouter, 
    ActivityFeed,
    ActivityFeedView,
    Authentication,
    AuthenticationEditView,
    Corpus, 
    CorpusEditView,
    CorpusReadView,
    DataList,
    DataListReadView,
    DataListEditView,
    Datum,
    DatumContainerEditView,
    DatumFields,
    Export,
    ExportReadView,
    HotKey,
    HotKeyEditView,
    Import,
    ImportEditView,
    UserPreference,
    UserPreferenceEditView,
    Search,
    SearchEditView,
    Session,
    SessionEditView,
    SessionReadView,
    User,
    UserEditView,
    UserReadView,
    UserWelcomeView
) {
  var AppView = Backbone.View.extend(
  /** @lends AppView.prototype */
  {
    /**
     * @class The main layout of the program controls and loads the app. It
     *        allows the user to configure the dashboard by loading their
     *        handlebars. It contains the views of all the core models
     *        referenced in the app model and it will have partial handlebar of
     *        the navigation menu.
     * 
     * @description Starts the application and initializes all its children.
     * 
     * @extends Backbone.View
     * @constructs
     */
    initialize : function() {
      Utils.debug("APP init: " + this.el);
      
      // Create a CorpusReadView for the Corpus in the App's left well
      this.corpusReadView = new CorpusReadView({
        model : this.model.get("corpus")
      });
      this.corpusReadView.format = "leftSide";
      
      var sessionToBePassedAround = this.model.get("currentSession");
      sessionToBePassedAround.set("sessionFields", this.model.get("corpus").get("sessionFields").clone());
      
      // Create a SessionEditView
      this.sessionEditView = new SessionEditView({
        model : sessionToBePassedAround
      });
      
      // Create a SessionSummaryReadView
      this.sessionSummaryView = new SessionReadView({
        model : sessionToBePassedAround
      });
      this.sessionSummaryView.format = "leftSide";
      
      var userToBePassedAround = this.model.get("authentication").get("user");
      
      // Create an AuthenticationEditView
      this.authView = new AuthenticationEditView({
        model : this.model.get("authentication")
      });
      
      /* 
       * Set up the five user views
       */
      this.fullScreenEditUserView = new UserEditView({
        model : userToBePassedAround
      });
      this.fullScreenEditUserView.format = "fullscreen";
      
      this.fullScreenReadUserView = new UserReadView({
        model : userToBePassedAround
      });
      this.fullScreenReadUserView.format = "fullscreen";

      this.modalEditUserView = new UserEditView({
        model : userToBePassedAround
      });
      this.modalEditUserView.format = "modal";
      
      this.modalReadUserView = new UserReadView({
        model : userToBePassedAround
      });
      this.modalReadUserView.format = "modal";

      // Create a UserWelcomeView modal
      this.welcomeUserView = new UserWelcomeView({
        model : userToBePassedAround
      });
      
      // Create the embedded and fullscreen DatumContainerEditView
      this.datumsView = new DatumContainerEditView();
      
      /*
       * Set up the four data list views
       */
      var dataListToBePassedAround = new DataList({
        // TODO Remove this dummy data once we have real datalists working
        datumIds : [
          "A3F5E512-56D9-4437-B41D-684894020254",
          "2F4D4B26-E863-4D49-9F40-1431E737AECD",
          "9A465EF7-5001-4832-BABB-81ACD46EEE9D"
        ]
      });
      this.dataListEditLeftSideView = new DataListEditView({
        model : dataListToBePassedAround
      });  
      this.dataListEditLeftSideView.format = "leftSide";
   
      this.dataListEditFullscreenView = new DataListEditView({
        model : dataListToBePassedAround
      });  
      this.dataListEditFullscreenView.format = "fullscreen";

      this.dataListReadLeftSideView = new DataListReadView({
        model : dataListToBePassedAround
      });  
      this.dataListReadLeftSideView.format = "leftSide";
   
      this.dataListReadFullscreenView = new DataListReadView({
        model : dataListToBePassedAround
      });  
      this.dataListReadFullscreenView.format = "fullscreen";
      
      // Create a SearchEditView
      this.searchView = new SearchEditView({
        model : new Search()
      });
      this.searchView.format = "top";
      
      // Create an AdvancedSearchView
      this.advancedSearchView = new SearchEditView({
        model : new Search()
      });
      this.advancedSearchView.format = "fullscreen";
      
      // Create a UserPreferenceEditView
      this.userPreferenceView = new UserPreferenceEditView({
        model : userToBePassedAround.get("prefs")
      });
      
      // Create an ActivityFeedView
      this.activityFeedView = new ActivityFeedView({
        model : new ActivityFeed()
      }); 

      // Create a HotKeyEditView
      this.hotkeyEditView = new HotKeyEditView({
        model : new HotKey()
      });  
      
      // Create an ExportREadView
      this.exportView = new ExportReadView({
        model : new Export()
      });

      // Create a CorpusEditView
      this.corpusEditView = new CorpusEditView({
        model : this.model.get("corpus")
      });
      this.corpusEditView.format = "centreWell";
      
      // Create an ImportEditView
      this.importView = new ImportEditView({
        model : new Import()
      });

      // Create and initialize a Terminal
      this.term = new Terminal('terminal');
      this.term.initFS(false, 1024 * 1024);

      // Set up a timeout event every 10sec
      _.bindAll(this, "saveScreen");
      window.setInterval(this.saveScreen, 10000);     
    },
    
    /**
     * The underlying model of the AppView is an App.
     */
    model : App,

    /**
     * Events that the AppView is listening to and their handlers.
     */
    events : {
      "click .icon-refresh" : "replicateDatabases"
    },
    
    /**
     * The Handlebars template rendered as the AppView.
     */
    template : Handlebars.compile(appTemplate),
    
    /**
     * Renders the AppView and all of its child Views.
     */
    render : function() {
      Utils.debug("APP render: " + this.el);
      if (this.model != undefined) {
        // Display the AppView
        this.setElement($("#app_view"));
        $(this.el).html(this.template(this.model.toJSON()));
        
        // Display the CorpusReadView
        this.corpusReadView.render();
        
        // Display the ExportView
        this.exportView.render();
        
        // Display the User Views
        this.fullScreenEditUserView.render();
        this.fullScreenReadUserView.render();
        this.modalEditUserView.render();
        this.modalReadUserView.render();
        
        // Display the Datum Container Views
        this.datumsView.format = "centreWell";
        this.datumsView.render();
        
        // Display the UserWelcomeView
        this.welcomeUserView.render();
        
        // Display the Search Views
        this.searchView.render();
        this.advancedSearchView.render();
        
        // Display the AuthView
        this.authView.render();
        
        // Display the SessionEditView
        this.sessionEditView.render();
        
        // Display the SessionSummaryReadView
        this.sessionSummaryView.render();
        
        // Display the UserPreferenceEditView
        this.userPreferenceView.render();
        
        //Display ActivityFeedView
        this.activityFeedView.render();
        
        // Display HotKeysView
        this.hotkeyEditView.render();//.showModal();

        // Display Data List Views 
        this.dataListEditLeftSideView.render();
        this.dataListEditFullscreenView.render();
        this.dataListReadLeftSideView.render();
        this.dataListReadFullscreenView.render();
         
        // Display the ImportEditView
        this.importView.render();
        
        // Display the CorpusFullscreenView
        this.corpusEditView.render();
      } else {
        Utils.debug("\tApp model is not defined");
      }
      
      return this;
    },
    
    /**
     * This function triggers a sample app to load so that new users can play
     * around and get a feel for the app by seeing the data in context.
     */
    loadSample : function() {
      // Sample Corpus data
      this.model.get("corpus").set({
        "title" : "Quechua Corpus",
        "titleAsUrl": "Quechua_Corpus",
        "description" : "This is a corpus which will let you explore the app and see how it works. "
            + "\nIt contains some data from one of our trips to Cusco, Peru."
      });

      // Sample Session data
      this.model.get("currentSession").set("sessionFields", new DatumFields([
        {label: "user", value: ""},
        {label: "consultants", value: "John Doe and Mary Stewart"},
        {label: "language", value: ""},
        {label: "dialect", value: ""},
        {label: "dateElicited", value: new Date()},
        {label: "dateSEntered", value: new Date()},
        {label: "goal", value: "To Win!"}
      ]));
        
      this.authView.loadSample();
      
      this.searchView.loadSample();
    },
    
    /**
     * Synchronize the server and local databases.
     */
    replicateDatabases : function() {
      (new Datum()).pouch(function(err, db) {
        db.replicate.to(Utils.couchUrl, { continuous: false }, function(err, resp) {
          Utils.debug("Replicate to");
          Utils.debug(resp);
          Utils.debug(err);
        });
        db.replicate.from(Utils.couchUrl, { continuous: false }, function(err, resp) {
          Utils.debug("Replicate from");
          Utils.debug(resp);
          Utils.debug(err);
        });
      });
    },
    /**
     * Synchronize the activity feed server and local databases.
     * TODO change this line in case it is called on the wrong model
     *  this.activityFeedView.model.pouch(
     */
    replicateActivityFeedDatabase : function() {
      this.activityFeedView.model.pouch(function(err, db) {
        db.replicate.to(Utils.activityFeedCouchUrl, { continuous: false }, function(err, resp) {
          Utils.debug("Replicate to");
          Utils.debug(resp);
          Utils.debug(err);
        });
        db.replicate.from(Utils.activityFeedCouchUrl, { continuous: false }, function(err, resp) {
          Utils.debug("Replicate from");
          Utils.debug(resp);
          Utils.debug(err);
        });
      });
    },
    
    saveScreen : function() {
      // Save the Datum pages, if necessary
      this.datumsView.saveScreen();
    }
  });

  return AppView;
});
