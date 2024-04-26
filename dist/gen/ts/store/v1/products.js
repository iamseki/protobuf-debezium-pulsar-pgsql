"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.Action = void 0;
var runtime_1 = require("@protobuf-ts/runtime");
var runtime_2 = require("@protobuf-ts/runtime");
var runtime_3 = require("@protobuf-ts/runtime");
var runtime_4 = require("@protobuf-ts/runtime");
var runtime_5 = require("@protobuf-ts/runtime");
/**
 * @generated from protobuf enum store.products.v1.Action
 */
var Action;
(function (Action) {
    /**
     * @generated from protobuf enum value: ACTION_UNSPECIFIED = 0;
     */
    Action[Action["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    /**
     * @generated from protobuf enum value: ACTION_INSERT = 1;
     */
    Action[Action["INSERT"] = 1] = "INSERT";
    /**
     * @generated from protobuf enum value: ACTION_UPDATE = 2;
     */
    Action[Action["UPDATE"] = 2] = "UPDATE";
    /**
     * @generated from protobuf enum value: ACTION_DELETE = 3;
     */
    Action[Action["DELETE"] = 3] = "DELETE";
})(Action || (exports.Action = Action = {}));
// @generated message type with reflection information, may provide speed optimized methods
var Product$Type = /** @class */ (function (_super) {
    __extends(Product$Type, _super);
    function Product$Type() {
        return _super.call(this, "store.products.v1.Product", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "description", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "price", kind: "scalar", T: 2 /*ScalarType.FLOAT*/ },
            { no: 5, name: "action", kind: "enum", T: function () { return ["store.products.v1.Action", Action, "ACTION_"]; } }
        ]) || this;
    }
    Product$Type.prototype.create = function (value) {
        var message = { id: 0, name: "", description: "", price: 0, action: 0 };
        globalThis.Object.defineProperty(message, runtime_4.MESSAGE_TYPE, { enumerable: false, value: this });
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    };
    Product$Type.prototype.internalBinaryRead = function (reader, length, options, target) {
        var message = target !== null && target !== void 0 ? target : this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            var _a = reader.tag(), fieldNo = _a[0], wireType = _a[1];
            switch (fieldNo) {
                case /* int32 id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string name */ 2:
                    message.name = reader.string();
                    break;
                case /* string description */ 3:
                    message.description = reader.string();
                    break;
                case /* float price */ 4:
                    message.price = reader.float();
                    break;
                case /* store.products.v1.Action action */ 5:
                    message.action = reader.int32();
                    break;
                default:
                    var u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error("Unknown field ".concat(fieldNo, " (wire type ").concat(wireType, ") for ").concat(this.typeName));
                    var d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    };
    Product$Type.prototype.internalBinaryWrite = function (message, writer, options) {
        /* int32 id = 1; */
        if (message.id !== 0)
            writer.tag(1, runtime_1.WireType.Varint).int32(message.id);
        /* string name = 2; */
        if (message.name !== "")
            writer.tag(2, runtime_1.WireType.LengthDelimited).string(message.name);
        /* string description = 3; */
        if (message.description !== "")
            writer.tag(3, runtime_1.WireType.LengthDelimited).string(message.description);
        /* float price = 4; */
        if (message.price !== 0)
            writer.tag(4, runtime_1.WireType.Bit32).float(message.price);
        /* store.products.v1.Action action = 5; */
        if (message.action !== 0)
            writer.tag(5, runtime_1.WireType.Varint).int32(message.action);
        var u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    };
    return Product$Type;
}(runtime_5.MessageType));
/**
 * @generated MessageType for protobuf message store.products.v1.Product
 */
exports.Product = new Product$Type();
