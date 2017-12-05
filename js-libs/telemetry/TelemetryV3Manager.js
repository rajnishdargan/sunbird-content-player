TelemetryV3Manager = Class.extend({
    _end: new Array(),
    _start: new Array(),
    _config: {},
     init: function() {
        console.info("TelemetryService Version 3 initialized..");
    },
    exitWithError: function(error) {
        var message = '';
        if (error) message += ' Error: ' + JSON.stringify(error);
        TelemetryServiceV3.exitApp();
    },
    getConfig: function(){
      var configData = TelemetryService._otherData;
      configData['env'] = configData.mode || "preview";
      configData['uid'] = TelemetryService._user.uid;
      configData["dispatcher"] = ("undefined" == typeof cordova) ? org.ekstep.contentrenderer.webDispatcher : org.ekstep.contentrenderer.deviceDispatcher;
      this._config = configData;
      return this._config;
    },
    start: function(id, ver, data) {
        if(id == undefined || ver == undefined || data == undefined) {
            console.error('Invalid start data');
            return;
        }
        // var deviceId = detectClient();

        this._end.push("END", {});
        this._start.push({id: id , ver : ver});
        var config = this.getConfig();
        
        data.mode = data.mode || this._config.mode;
        data.type = data.type || "player";

        EkTelemetry.start(config, TelemetryService._gameData.id, ver, data);
    },
    end: function(data) {
        if (data == undefined) {
            console.error('Invalid end data');
            return;
        }
        if (this.telemetryStartActive()) {
            this._start.pop();
            data.type = GlobalContext.config.type;
            data.mode = data.mode;
            data.summary = data.summary || [];
            data.pageid = EkstepRendererAPI.getCurrentStageId();
            this._end.pop();
            EkTelemetry.end(data);
        } else {
            console.warn("Telemetry service end is already logged Please log start telemetry again");
        }
    },
    interact: function(type, id, extype, eks, eid) {
        if(type == undefined || id == undefined) {
            console.error('Invalid interact data');
            return;
        }
        var eksData = {
            "type": type,
            "subtype": eks.subtype ? eks.subtype : "",
            "id": id,
            "pageid": eks.stageId ? eks.stageId.toString() : "",
        }
        if(eks.extra){
          var extraObj ={
            "pos": (eks.extra && eks.pos) ? eks.pos : [],
            "values": (eks.extra && eks.values) ? data.values : []
          }
          eksData["extra"] = extraObj;
        }
        if(eks.target) { 
          var targetObj = {
            "id": id,
            "ver": "1.0",
            "type": "Plugin"
          }
          eksData["target"] =  eks.target || targetObj; 
        }
        if(eks.plugin) { 
           var pluginObj = {
            "id": id,
            "ver": "1.0"
          }
          eksData["plugin"] =  eks.plugin || pluginObj;
        }
        EkTelemetry.interact(eksData);
    },
    assess: function(qid, subj, qlevel, data) {
        if (qid) {
            var edata = {
                qid: qid,
                maxscore: (data && data.maxscore) ? data.maxscore || 1,
                subj: subj || "",
                qlevel: qlevel || "MEDIUM",
                startTime: getCurrentTime()
            };
            return edata;
        } else {
            console.error("qid is required to create assess event.", qid);
            // TelemetryService.logError("OE_ASSESS", "qid is required to create assess event.")
            return new InActiveEvent();
        }

    },
    assessEnd: function(eventObj, data) {
        if (eventObj) {
            var questionItem = {
                id: eventObj.qid,
                maxscore: eventObj.maxscore,
                exlength: "0",
                params: data.params || [],
                uri: data.uri || "",
                desc: data.qdesc.substr(0,140) || data.desc.substr(0,140),
                title: data.qtitle || data.title,
                mmc: data.mmc || "",
                mc: data.mc || ""
            }
            var questionData = {
                item: questionItem,
                index: data.qindex || data.index || 0,
                pass: data.pass ? 'Yes' : 'No',
                score: data.score || (data.pass == 'Yes' ? 1 : 0),
                resvalues: data.res || data.resvalues || [],
                duration: Math.round((getCurrentTime() - eventObj.startTime ) / 1000)
            }
            EkTelemetry.assess(questionData);
        } else {
            console.error("question id is required to create assess event.");
            // TelemetryService.logError("OE_ASSESS", "qid is required to create assess event.")
            return new InActiveEvent();
        }

    },
    error: function(data) {
        /* if (!TelemetryV3Manager.hasRequiredData(data, ["err", "errtype"])) {
            console.error('Invalid error data');
            return;
        } */
        var object = {
            id: data.objectId,
            type: data.objectType || "",
            ver: data.objectVersion || "",
            rollup: data.rollup || {}
        }
        var plugin = {
            id: data.id || "",
            ver: data.ver || "",
            category: data.category || ""
        }
        var errorData = {
            err: data.err,
            errtype: data.type || data.errtype,
            stacktrace: data.stacktrace || "",
            pageid: data.stageId || EkstepRendererAPI.getCurrentStageId(),
            object: data.object || object,
            plugin: plugin
        }
        EkTelemetry.error(errorData);
    },
    interrupt: function(type, id, eid) {
        if(type == undefined || id == undefined || eid == undefined) {
            console.error('Invalid interrupt data');
            return;
        }
        var interruptData = {
            "type": type,
            "pageid": id || stageid  || '',
        };  
        EkTelemetry.interrupt(interruptData);
    },
    exitApp: function() {
        setTimeout(function() {
            navigator.app.exitApp();
        }, 5000);
    },
    navigate: function(stageid, stageto, data) {
        var data = {
          "type": (data && data.type) ? data.type : "workflow" ,
          "pageid": stageid,
          "uri": (data && data.uri) ? data.uri : ""
        }
        if (stageid != undefined) {
            EkTelemetry.impression(data);
        } else {
            console.error('Invalid impression data');
            return;
        }
    },
    itemResponse: function(data) {
        var type = data.optionTag == "MCQ" ? "CHOOSE" : "MATCH";
        var target = {
            id: data.itemId || "",
            ver: data.ver || "",
            type: data.type || "",
            state: data.state || "",
            parent: data.parent || {}
        }
        var responseData = {
            target: target,
            type: data.type,
            values: _.isEmpty(data.res) ? [] : data.res
        }
        EkTelemetry.response(data);
    },
    sendFeedback: function(data) {
        EkTelemetry.feedback(data);
    },
    telemetryStartActive: function() {
        return (!_.isEmpty(this._start));
    },
    xapi: function(data) {
        var data = {
            type: type,
            data: data
        }
        EkTelemetry.exdata(data);
    },
    hasRequiredData: function(data, mandatoryFields) {
        var isValid = true;
        mandatoryFields.forEach(function(key) {
            if (!data.hasOwnProperty(key)) isValid = false;
        });
        return isValid;
    }
})