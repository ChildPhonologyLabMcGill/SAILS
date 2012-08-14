define([ 
    "backbone",
    "user/UserMask" 
], function(
    Backbone, 
    UserMask
) {
  var Activity = Backbone.Model.extend(
  /** @lends Activity.prototype */
  {
    /**
     * @class The Activity is a record of the user's activity during one
     *        session, i.e. it might say "Edward Sapir added 30 datums in Na
     *        Dene Corpus" This is so that users can see their history and teams
     *        can view teammate's contributions.
     * 
     * @extends Backbone.Model
     * @constructs
     */
    initialize : function() {
      Utils.debug("ACTIVITY init: ");

      if(!this.get("user")) {
        this.set("user", window.app.get("authentication").get("userPublic"));
      }
      if(!this.get("timestamp")){
        this.set("timestamp",JSON.stringify(new Date()) );
      }
      
      if(this.isNew()){
        this.saveAndInterConnectInApp();
      }
    },
    
    defaults : {
//      verbs : [ "added", "modified", "commented", "checked", "tagged", "uploaded" ],
//      verb : "added",
//      directobject : "an entry",
//      indirectobject : "with Consultant-SJ",
//      context : "via Android/ Offline Chrome App" ,
//      link: "https:/ifield.fieldlinguist.com"
//      timestamp: timestamp
    },
    
    // Internal models: used by the parse function
    model : {
      user : UserMask
    },
    changeCorpus : function(corpusname, callback) {
      if(!corpusname){
        if(window.app.get("currentUserActivityFeed")){
          if(window.app.get("currentUserActivityFeed").get("couchConnection")){
            corpusname = window.app.get("currentUserActivityFeed").get("couchConnection").get("corpusname");
          }else{
            alert("Cant save an activity so early, must wait until the users' activityfeed gets a pouch.");
          }
        }else{
          alert("Can't save an activity so early, must wait until appviews have been done, they make sure the user's currentUserActivityFeed exists.");
        }
      }
      if(this.pouch == undefined){
        this.pouch = Backbone.sync.pouch(Utils.androidApp() ? Utils.touchUrl + corpusname : Utils.pouchUrl + corpusname);
      }
      if(typeof callback == "function"){
        callback();
      }
    },
    /**
     * Accepts two functions to call back when save is successful or
     * fails. If the fail callback is not overridden it will alert
     * failure to the user.
     * 
     * - Adds the Activity to the corpus if it is in the right corpus, and wasnt already there
     * - Adds the Activity to the user if it wasn't already there
     * - Adds an activity to the logged in user with diff in what the user changed. 
     * 
     * @param successcallback
     * @param failurecallback
     */
    saveAndInterConnectInApp : function(successcallback, failurecallback){
      Utils.debug("Saving the Activity");
      var self = this;
      if(window.app.get("currentCorpusTeamActivityFeed").get("corpusname") != this.get("corpusname")){
        if(typeof failurecallback == "function"){
          failurecallback();
        }else{
          alert('Activity save error. I cant save this Activity in this ActivityFeed, it belongs to another ActivityFeed. ' );
        }
        return;
      }
      this.changeCorpus(null, function(){
        self.save(null, {
          success : function(model, response) {
            Utils.debug('Activity save success');

            if(typeof successcallback == "function"){
              successcallback();
            }
          },
          error : function(e) {
            if(typeof failurecallback == "function"){
              failurecallback();
            }else{
              alert('Activity save error' + e);
            }
          }
        });
      });
    }
    
  });
   

  return Activity;
});
