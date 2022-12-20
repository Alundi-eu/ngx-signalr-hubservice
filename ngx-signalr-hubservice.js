"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubService = exports.HubSubscription = exports.Hub = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/**
 * All the hubs/events we have to subscribe to when setting up the connection.
 * signalr requires you to connect to all the hubs before making the connection
 * so we store them in a global var.
 */
var allHubProperties = [];
/**
 * The decorators for methods/hubs are called out of order
 * so this will either return the existing hub properties or create new ones.
 * @param target The target class
 * @param hubProperties The properties to define for the class.
 */
function getOrCreateHubProperties(target, hubProperties) {
    var properties = Reflect.getMetadata("Hub", target);
    if (!properties) {
        properties = hubProperties;
        Reflect.defineMetadata("Hub", hubProperties, target);
    }
    properties.subscriptions = properties.subscriptions || [];
    properties.hubName = properties.hubName || hubProperties.hubName;
    properties.hubGroups = properties.hubGroups || hubProperties.hubGroups;
    return properties;
}
/**
 * Adds the hubName property to the list of hubs to subscribe to
 * We have to define hubs and subscriptions before connecting so we only need one connection for all our hubs.
 * If your service is referenced in an external module, you have to reference it somewhere in your main/core code.
 * @param hubProperties the properties for this class's subscription to the hub
 */
function Hub(hubProperties) {
    return function (target) {
        var _a;
        hubProperties = getOrCreateHubProperties(target.prototype, hubProperties);
        var existing = allHubProperties.find(function (props) { return props.hubName === hubProperties.hubName; });
        if (existing) {
            (_a = existing.subscriptions).push.apply(_a, hubProperties.subscriptions);
            return;
        }
        allHubProperties.push(hubProperties);
    };
}
exports.Hub = Hub;
/**
 * Subscribes to a hub event
 * @param the event to subscribe to. if null, it uses the method name
 */
function HubSubscription(eventName) {
    return function (target, // the prototype of the class
    propertyKey, // the name of the method
    descriptor) {
        eventName = eventName || propertyKey;
        var hubProperties = getOrCreateHubProperties(target, { hubName: null });
        hubProperties.subscriptions.push({
            eventName: eventName,
            functionName: propertyKey
        });
    };
}
exports.HubSubscription = HubSubscription;
/**
 * Manages a connection to a signalr service, and provides easy access to its hubs and their events
 * To start, call hubService.connect();
 * Classes that want to subscribe to a hub event must have the @Hub decorator and the name of the hub to subscribe to.
 * Example class:
 * ```
 *  @Hub({ hubName: 'searchHub' })
 *  export class SearchService {
 *      private hubWrapper: HubWrapper;
 *      constructor(private hubService: HubService) {
 *          this.hubWrapper = hubService.register(this);
 *      }
 *      public startSearch(data: any): Observable<boolean> {
 *          return this.hubWrapper.invoke<boolean>('startSearch', data);
 *      }
 *      @HubSubscription()
 *      private searchUpdated(data: any) {
 *      }
 *  }
 * ```
 */
var HubService = /** @class */ (function () {
    function HubService() {
        var _this = this;
        /** jQuery connection. */
        this._connection = null;
        /** emitter for connected event */
        this.connectedEmitter = new rxjs_1.Subject();
        /** emitter for disconnected event */
        this.disconnectedEmitter = new rxjs_1.Subject();
        /** emitter for reconnecting event */
        this.reconnectingEmitter = new rxjs_1.Subject();
        /** emitter for reconnected event */
        this.reconnectedEmitter = new rxjs_1.Subject();
        /** if there was an error connecting */
        this._errorConnecting = false;
        /** currently trying to reconnect? */
        this.tryingReconnect = false;
        /** list of services to register after connect is called */
        this.deferredRegistrations = [];
        // this gets called from within the signalr instance so we have to make it a scoped method on the hubservice
        this.connectedCallback = function () {
            _this._errorConnecting = !_this.connected;
            _this.connectedEmitter.next(_this.connected);
        };
        // this gets called from within the signalr instance so we have to make it a scoped method on the hubservice
        this.connectionErrorCallback = function (err, caught) {
            _this._errorConnecting = true;
            _this.disconnectedEmitter.next(_this.connected);
            return rxjs_1.of(false);
        };
        // this gets called from within the signalr instance so we have to make it a scoped method on the hubservice
        this.reconnectedCallback = function () {
            _this.reconnectedEmitter.next(_this.connected);
            _this.connectedEmitter.next(_this.connected);
            _this.reconnectingObservable.next(_this.connected);
            _this.reconnectingObservable = null;
        };
        // this gets called from within the signalr instance so we have to make it a scoped method on the hubservice
        this.reconnectingCallback = function () {
            _this.reconnectingEmitter.next();
            _this.reconnectingObservable = new rxjs_1.Subject();
        };
        // this gets called from within the signalr instance so we have to make it a scoped method on the hubservice
        this.disconnectedCallback = function () {
            if (_this.tryingReconnect) {
                return;
            }
            _this.disconnectedEmitter.next(_this.connected);
            if (_this.options.attemptReconnects) {
                _this.tryReconnect();
            }
        };
    }
    HubService_1 = HubService;
    Object.defineProperty(HubService.prototype, "connection", {
        get: function () {
            return this._connection;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HubService.prototype, "connected", {
        /**
         * Is the client connected?
         */
        get: function () {
            return this._connection !== null && this._connection.state === $.signalR.connectionState.connected;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HubService.prototype, "errorConnecting", {
        /**
         * Was there an error connecting to the server?
         */
        get: function () {
            return this._errorConnecting;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Connects to the signalr server. Hubs are registered with the connection through
     * the @Hub decorator
     * @param options Options to use for the connection
     */
    HubService.prototype.connect = function (options) {
        if (options === void 0) { options = {}; }
        this.options = __assign({ url: "/signalr", attemptReconnects: false }, options);
        return this._connect(false);
    };
    HubService.prototype._connect = function (ignoreReconnecting) {
        var _this = this;
        // if user calls connect while we're trying to reconnect, just give them that observable
        if (!ignoreReconnecting && this.reconnectingObservable != null) {
            return this.reconnectingObservable.asObservable();
        }
        if (this._connection === null) {
            this.initConnection();
        }
        // this._connection.start just returns the connection object, so map it to this.connected when it completes
        return rxjs_1.from(this._connection.start()).pipe(operators_1.map(function (value) { return _this.connected; }), operators_1.tap(this.connectedCallback), operators_1.catchError(this.connectionErrorCallback));
    };
    HubService.prototype.initConnection = function () {
        // initialize signalr data structures
        this.hubProxies = {};
        this._connection = $.hubConnection(this.options.url, { useDefaultPath: false });
        this._connection.qs = this.options.qs;
        this._connection.logging = false;
        // we have to create the hub proxies and subscribe to events before connecting
        for (var _i = 0, allHubProperties_1 = allHubProperties; _i < allHubProperties_1.length; _i++) {
            var properties = allHubProperties_1[_i];
            // make sure we match this group
            if (!this.matchesGroup(properties.hubGroups)) {
                continue;
            }
            // we do, so create the proxy.
            this.hubProxies[properties.hubName] = this.createHubProxy(properties);
        }
        for (var _a = 0, _b = this.deferredRegistrations; _a < _b.length; _a++) {
            var deferredRegistration = _b[_a];
            this.register(deferredRegistration);
        }
        this._connection.disconnected(this.disconnectedCallback);
        this._connection.reconnected(this.reconnectedCallback);
        this._connection.reconnecting(this.reconnectingCallback);
        this._connection.stateChanged(function (change) {
            this.signalRState = change.newState;
        });
    };
    HubService.prototype.matchesGroup = function (hubGroups) {
        // if one is null and the other isn't assume we don't match.
        if (this.options.hubGroups == null && hubGroups != null) {
            return false;
        }
        if (hubGroups == null && this.options.hubGroups != null) {
            return false;
        }
        // if both null then assume match.
        if (hubGroups == null && this.options.hubGroups == null) {
            return true;
        }
        // just force arrays here to simplify the logic.
        if (!Array.isArray(hubGroups)) {
            hubGroups = [hubGroups];
        }
        if (!Array.isArray(this.options.hubGroups)) {
            this.options.hubGroups = [this.options.hubGroups];
        }
        // check for at least one match.
        var ourGroups = this.options.hubGroups;
        return hubGroups.some(function (group) { return ourGroups.some(function (ourGroup) { return group === ourGroup; }); });
    };
    /**
     * Disconnects from the signalr server, and pushes out the disconnected event
     */
    HubService.prototype.disconnect = function () {
        var _this = this;
        // connection.stop just returns the connection object, so map it to this.connected when it completes
        return rxjs_1.from(this._connection.stop()).pipe(operators_1.map(function (value) { return _this.connected; }));
    };
    /**
     * Subscribe to the reconnected event
     * @param generatorOrNext callback for when we get reconnected to signalr
     */
    HubService.prototype.onConnected = function (generatorOrNext) {
        return this.connectedEmitter.subscribe(generatorOrNext);
    };
    /**
     * Subscribe to the reconnected event
     * @param generatorOrNext callback for when we get reconnected to signalr
     */
    HubService.prototype.onReconnected = function (generatorOrNext) {
        return this.reconnectedEmitter.subscribe(generatorOrNext);
    };
    /**
     * Subscribe to the reconnecting event
     * @param generatorOrNext callback for when we get the reconnecting event from signalr
     */
    HubService.prototype.onReconnecting = function (generatorOrNext) {
        return this.reconnectingEmitter.subscribe(generatorOrNext);
    };
    /**
     * Subscribe to the disconnected event
     * @param generatorOrNext callback for when we get disconnected from signalr
     */
    HubService.prototype.onDisconnected = function (generatorOrNext) {
        return this.disconnectedEmitter.subscribe(generatorOrNext);
    };
    /**
     * Attemps to reconnect
     */
    HubService.prototype.tryReconnect = function () {
        var _this = this;
        this.tryingReconnect = true;
        this.reconnectingObservable = new rxjs_1.Subject();
        // try to reconnect forever.
        this._connect(this.options.attemptReconnects).subscribe(function (connected) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!connected) return [3 /*break*/, 2];
                        return [4 /*yield*/, HubService_1.delay(1000)];
                    case 1:
                        _a.sent();
                        this.tryReconnect();
                        return [3 /*break*/, 3];
                    case 2:
                        this.reconnectedCallback();
                        this.tryingReconnect = false;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    HubService.delay = function (ms) {
        return new Promise(function (resolve) {
            setTimeout(function () { return resolve(); }, ms);
        });
    };
    /**
     * Calls the method on the server with the provided arguments.
     * If the hub connection is disconnected, the message will queue up and send when it reconnects.
     * @param hubName The hub name
     * @param method The method name
     * @param args The arguments to send to the hub
     */
    HubService.prototype.invoke = function (hubName, method) {
        var _a;
        var _this = this;
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var hubContainer = this.hubProxies[hubName];
        if (hubContainer == null) {
            throw new Error("Invalid hub name " + hubName);
        }
        if (this.reconnectingObservable != null) {
            // we're reconnecting, so wait on that, then invoke our method
            return this.reconnectingObservable.pipe(operators_1.flatMap(function (connected) {
                var _a;
                if (!connected) {
                    return rxjs_1.throwError("SignalR disconnected");
                }
                else {
                    var invokePromise = (_a = hubContainer.hubProxy).invoke.apply(_a, __spreadArrays([method], args));
                    return rxjs_1.from(invokePromise);
                }
            }));
        }
        else {
            // we're not reconnecting, so try to invoke our method
            var invokePromise = (_a = hubContainer.hubProxy).invoke.apply(_a, __spreadArrays([method], args));
            return rxjs_1.from(invokePromise).pipe(operators_1.catchError(function (err) {
                // we lost connection in the middle of the call? wait for reconnecting and send again then.
                if (_this.reconnectingObservable != null) {
                    return _this.invoke(hubName, method, args);
                }
                else {
                    // let the caller handle it.
                    return rxjs_1.throwError(err);
                }
            }));
        }
    };
    /**
     * Register this class instance to the hubs. The class instance must have the @Hub decorator.
     * Any subscriptions defined in the @Hub decorator must have a matching method on the class to be called,
     * or have the @HubDecorator decorator on their event methods
     * @param instance The class to register with the hub service
     */
    HubService.prototype.register = function (instance) {
        var _this = this;
        var hubProperties = Reflect.getMetadata("Hub", instance);
        if (!hubProperties) {
            throw new Error("You must call register with an instance of a class with the @Hub decorator on it. Instance: " + instance);
        }
        var hubWrapper = {
            invoke: function (method) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return _this.invoke.apply(_this, __spreadArrays([hubProperties.hubName, method], args));
            },
            hub: null,
            unregister: function () { return _this.unregister(instance); }
        };
        if (hubProperties.subscriptions.length === 0) {
            // signalr ignores hubs with no events(I assume you'd just want to use a POST then). Worth erroring out here.
            throw new Error("Hub " + hubProperties.hubName + " must have at least one event subscription.");
        }
        // allows the caller to register to hubs before actually connecting.
        if (this.hubProxies === void 0) {
            this.deferredRegistrations.push(instance);
            // doesn't matter if were not registered yet we can still return this object
            // because the user shouldn't use it until they call connect()
            return hubWrapper;
        }
        // get the hub proxy and set its hub instance if it's not set.
        var hubProxy = this.hubProxies[hubProperties.hubName];
        if (hubProxy == null) {
            // only throw the invalid hub error if it matches this connections group.
            if (!this.matchesGroup(hubProperties.hubGroups)) {
                return;
            }
            throw new Error("Invalid hub name " + hubProperties.hubName);
        }
        if (hubWrapper.hub == null) {
            hubWrapper.hub = hubProxy.hubProxy;
        }
        // subscribe to all the events
        for (var _i = 0, _a = hubProperties.subscriptions; _i < _a.length; _i++) {
            var subscription = _a[_i];
            // if the method for this subscription isn't defined skip it
            if (!(subscription.functionName in instance)) {
                console.warn(instance + " is subscribing to event " + subscription + " but has no matching method. Skipping subscription.");
                continue;
            }
            // adds a ref to the method on the instance to the list of events for this hub+event pairing
            hubProxy.events[subscription.eventName].push({
                thisObj: instance,
                callback: instance[subscription.functionName]
            });
        }
        return hubWrapper;
    };
    /**
     * Unregisters the instance from events.
     * @param instance the class instance to unregister
     */
    HubService.prototype.unregister = function (instance) {
        var hubProperties = Reflect.getMetadata("Hub", instance);
        if (!hubProperties) {
            throw new Error("You must call unregister with an instance of a class with the @Hub decorator on it. Instance: " + instance);
        }
        var proxy = this.hubProxies[hubProperties.hubName];
        for (var _i = 0, _a = hubProperties.subscriptions; _i < _a.length; _i++) {
            var subscription = _a[_i];
            var events = proxy.events[subscription.eventName];
            if (events == null) {
                continue;
            }
            for (var i = events.length - 1; i >= 0; i--) {
                var event_1 = events[i];
                if (event_1.thisObj !== instance) {
                    continue;
                }
                events.splice(i, 1);
            }
        }
    };
    /**
     * Pushes out a message received by the hub to the subscribers registered through register
     * @param hub The hub name
     * @param subscription The subscription name(event name)
     * @param args The arguments from the hub
     */
    HubService.prototype.hubMessageReceived = function (hub, subscription, args) {
        if (!(hub in this.hubProxies)) {
            return;
        }
        var events = this.hubProxies[hub].events[subscription.eventName];
        for (var _i = 0, events_1 = events; _i < events_1.length; _i++) {
            var func = events_1[_i];
            // wrap all the callbacks in a try/catch so they don't break other callbacks if one fails.
            try {
                func.callback.apply(func.thisObj, args);
            }
            catch (err) {
                console.error("Hub callback error on hub " + hub + " subscription " + subscription.eventName + ". Error: " + err);
            }
        }
    };
    /**
     * Creates a hub proxy and registers the subscriptions on it
     * @param properties the properties for the hub
     */
    HubService.prototype.createHubProxy = function (properties) {
        var hubProxy = this._connection.createHubProxy(properties.hubName);
        var events = {};
        var _this_ = this;
        var _loop_1 = function (subscription) {
            // don't resubscribe to events.
            if (subscription.eventName in events) {
                return "continue";
            }
            events[subscription.eventName] = [];
            // this method actually subscribes to the hub function.
            // we only subscribe once then push out the message to all subscribers
            hubProxy.on(subscription.eventName, function () {
                // we lose the "this" context with the jquery promise, so we have to store it as _this_.
                _this_.hubMessageReceived(properties.hubName, subscription, arguments);
            });
        };
        for (var _i = 0, _a = properties.subscriptions; _i < _a.length; _i++) {
            var subscription = _a[_i];
            _loop_1(subscription);
        }
        return {
            hubProxy: hubProxy,
            events: events
        };
    };
    var HubService_1;
    HubService = HubService_1 = __decorate([
        core_1.Injectable()
    ], HubService);
    return HubService;
}());
exports.HubService = HubService;
//# sourceMappingURL=ngx-signalr-hubservice.js.map