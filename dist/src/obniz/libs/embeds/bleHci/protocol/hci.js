"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
// let debug = require('debug')('hci');
const debug = (...params) => {
    // console.log(...params);
};
const events = require("events");
var COMMANDS;
(function (COMMANDS) {
    COMMANDS.HCI_COMMAND_PKT = 0x01;
    COMMANDS.HCI_ACLDATA_PKT = 0x02;
    COMMANDS.HCI_EVENT_PKT = 0x04;
    COMMANDS.ACL_START_NO_FLUSH = 0x00;
    COMMANDS.ACL_CONT = 0x01;
    COMMANDS.ACL_START = 0x02;
    COMMANDS.EVT_DISCONN_COMPLETE = 0x05;
    COMMANDS.EVT_ENCRYPT_CHANGE = 0x08;
    COMMANDS.EVT_CMD_COMPLETE = 0x0e;
    COMMANDS.EVT_CMD_STATUS = 0x0f;
    COMMANDS.EVT_NUMBER_OF_COMPLETED_PACKETS = 0x13;
    COMMANDS.EVT_LE_META_EVENT = 0x3e;
    COMMANDS.EVT_LE_CONN_COMPLETE = 0x01;
    COMMANDS.EVT_LE_ADVERTISING_REPORT = 0x02;
    COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE = 0x03;
    COMMANDS.OGF_LINK_CTL = 0x01;
    COMMANDS.OCF_DISCONNECT = 0x0006;
    COMMANDS.OGF_HOST_CTL = 0x03;
    COMMANDS.OCF_SET_EVENT_MASK = 0x0001;
    COMMANDS.OCF_RESET = 0x0003;
    COMMANDS.OCF_READ_LE_HOST_SUPPORTED = 0x006c;
    COMMANDS.OCF_WRITE_LE_HOST_SUPPORTED = 0x006d;
    COMMANDS.OGF_INFO_PARAM = 0x04;
    COMMANDS.OCF_READ_LOCAL_VERSION = 0x0001;
    COMMANDS.OCF_READ_BUFFER_SIZE = 0x0005;
    COMMANDS.OCF_READ_BD_ADDR = 0x0009;
    COMMANDS.OGF_STATUS_PARAM = 0x05;
    COMMANDS.OCF_READ_RSSI = 0x0005;
    COMMANDS.OGF_LE_CTL = 0x08;
    COMMANDS.OCF_LE_SET_EVENT_MASK = 0x0001;
    COMMANDS.OCF_LE_READ_BUFFER_SIZE = 0x0002;
    COMMANDS.OCF_LE_SET_ADVERTISING_PARAMETERS = 0x0006;
    COMMANDS.OCF_LE_SET_ADVERTISING_DATA = 0x0008;
    COMMANDS.OCF_LE_SET_SCAN_RESPONSE_DATA = 0x0009;
    COMMANDS.OCF_LE_SET_ADVERTISE_ENABLE = 0x000a;
    COMMANDS.OCF_LE_SET_SCAN_PARAMETERS = 0x000b;
    COMMANDS.OCF_LE_SET_SCAN_ENABLE = 0x000c;
    COMMANDS.OCF_LE_CREATE_CONN = 0x000d;
    COMMANDS.OCF_LE_CONN_UPDATE = 0x0013;
    COMMANDS.OCF_LE_START_ENCRYPTION = 0x0019;
    COMMANDS.OCF_LE_LTK_NEG_REPLY = 0x001b;
    COMMANDS.DISCONNECT_CMD = COMMANDS.OCF_DISCONNECT | (COMMANDS.OGF_LINK_CTL << 10);
    COMMANDS.SET_EVENT_MASK_CMD = COMMANDS.OCF_SET_EVENT_MASK | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.RESET_CMD = COMMANDS.OCF_RESET | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.READ_LE_HOST_SUPPORTED_CMD = COMMANDS.OCF_READ_LE_HOST_SUPPORTED | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.WRITE_LE_HOST_SUPPORTED_CMD = COMMANDS.OCF_WRITE_LE_HOST_SUPPORTED | (COMMANDS.OGF_HOST_CTL << 10);
    COMMANDS.READ_LOCAL_VERSION_CMD = COMMANDS.OCF_READ_LOCAL_VERSION | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_BUFFER_SIZE_CMD = COMMANDS.OCF_READ_BUFFER_SIZE | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_BD_ADDR_CMD = COMMANDS.OCF_READ_BD_ADDR | (COMMANDS.OGF_INFO_PARAM << 10);
    COMMANDS.READ_RSSI_CMD = COMMANDS.OCF_READ_RSSI | (COMMANDS.OGF_STATUS_PARAM << 10);
    COMMANDS.LE_SET_EVENT_MASK_CMD = COMMANDS.OCF_LE_SET_EVENT_MASK | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_READ_BUFFER_SIZE_CMD = COMMANDS.OCF_LE_READ_BUFFER_SIZE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_SCAN_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_SCAN_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_SCAN_ENABLE_CMD = COMMANDS.OCF_LE_SET_SCAN_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CREATE_CONN_CMD = COMMANDS.OCF_LE_CREATE_CONN | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_CONN_UPDATE_CMD = COMMANDS.OCF_LE_CONN_UPDATE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_START_ENCRYPTION_CMD = COMMANDS.OCF_LE_START_ENCRYPTION | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD = COMMANDS.OCF_LE_SET_ADVERTISING_PARAMETERS | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_ADVERTISING_DATA_CMD = COMMANDS.OCF_LE_SET_ADVERTISING_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD = COMMANDS.OCF_LE_SET_SCAN_RESPONSE_DATA | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD = COMMANDS.OCF_LE_SET_ADVERTISE_ENABLE | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.LE_LTK_NEG_REPLY_CMD = COMMANDS.OCF_LE_LTK_NEG_REPLY | (COMMANDS.OGF_LE_CTL << 10);
    COMMANDS.HCI_OE_USER_ENDED_CONNECTION = 0x13;
})(COMMANDS || (COMMANDS = {}));
/**
 * @ignore
 */
const STATUS_MAPPER = require("./hci-status");
/**
 * @ignore
 */
class Hci extends events.EventEmitter {
    constructor(obnizHci) {
        super();
        this._obnizHci = obnizHci;
        this._state = null;
        this._handleBuffers = {};
        this.on("stateChange", this.onStateChange.bind(this));
        this._socket = {
            write: (data) => {
                const arr = Array.from(data);
                this._obnizHci.write(arr);
            },
        };
        this._obnizHci.onread = this.onSocketData.bind(this);
    }
    async initWait() {
        this.reset();
        // this.setEventMask();
        // this.setLeEventMask();
        // this.readLocalVersion();
        // this.writeLeHostSupported();
        // this.readLeHostSupported();
        // this.readBdAddr();
        return new Promise((resolve) => {
            this.once("stateChange", () => {
                // console.log('te');
                resolve();
            });
        });
    }
    setEventMask() {
        const cmd = Buffer.alloc(12);
        const eventMask = Buffer.from("fffffbff07f8bf3d", "hex");
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.SET_EVENT_MASK_CMD, 1);
        // length
        cmd.writeUInt8(eventMask.length, 3);
        eventMask.copy(cmd, 4);
        debug("set event mask - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    reset() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.OCF_RESET | (COMMANDS.OGF_HOST_CTL << 10), 1);
        // length
        cmd.writeUInt8(0x00, 3);
        debug("reset - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    resetBuffers() {
        this._handleAclsInProgress = {};
        this._handleBuffers = {};
        this._aclOutQueue = [];
    }
    readLocalVersion() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_LOCAL_VERSION_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("read local version - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readBdAddr() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_BD_ADDR_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("read bd addr - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setLeEventMask() {
        const cmd = Buffer.alloc(12);
        const leEventMask = Buffer.from("1f00000000000000", "hex");
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_EVENT_MASK_CMD, 1);
        // length
        cmd.writeUInt8(leEventMask.length, 3);
        leEventMask.copy(cmd, 4);
        debug("set le event mask - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readLeHostSupported() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_LE_HOST_SUPPORTED_CMD, 1);
        // length
        cmd.writeUInt8(0x00, 3);
        debug("read LE host supported - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    writeLeHostSupported() {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.WRITE_LE_HOST_SUPPORTED_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt8(0x01, 4); // le
        cmd.writeUInt8(0x00, 5); // simul
        debug("write LE host supported - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setScanParameters(isActiveScan) {
        const cmd = Buffer.alloc(11);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(0x07, 3);
        // data
        cmd.writeUInt8(isActiveScan ? 0x01 : 0x00, 4); // type: 0 -> passive, 1 -> active
        cmd.writeUInt16LE(0x0010, 5); // internal, ms * 1.6
        cmd.writeUInt16LE(0x0010, 7); // window, ms * 1.6
        cmd.writeUInt8(0x00, 9); // own address type: 0 -> public, 1 -> random
        cmd.writeUInt8(0x00, 10); // filter: 0 -> all event types
        debug("set scan parameters - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setScanEnabled(enabled, filterDuplicates) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        cmd.writeUInt8(filterDuplicates ? 0x01 : 0x00, 5); // duplicates: 0 -> duplicates, 0 -> duplicates
        debug("set scan enabled - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    createLeConn(address, addressType) {
        const cmd = Buffer.alloc(29);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_CREATE_CONN_CMD, 1);
        // length
        cmd.writeUInt8(0x19, 3);
        // data
        cmd.writeUInt16LE(0x0060, 4); // interval
        cmd.writeUInt16LE(0x0030, 6); // window
        cmd.writeUInt8(0x00, 8); // initiator filter
        cmd.writeUInt8(addressType === "random" ? 0x01 : 0x00, 9); // peer address type
        Buffer.from(address
            .split(":")
            .reverse()
            .join(""), "hex").copy(cmd, 10); // peer address
        cmd.writeUInt8(0x00, 16); // own address type
        cmd.writeUInt16LE(0x0006, 17); // min interval
        cmd.writeUInt16LE(0x000c, 19); // max interval
        cmd.writeUInt16LE(0x0000, 21); // latency
        cmd.writeUInt16LE(0x00c8, 23); // supervision timeout
        cmd.writeUInt16LE(0x0004, 25); // min ce length
        cmd.writeUInt16LE(0x0006, 27); // max ce length
        debug("create le conn - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    connUpdateLe(handle, minInterval, maxInterval, latency, supervisionTimeout) {
        const cmd = Buffer.alloc(18);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_CONN_UPDATE_CMD, 1);
        // length
        cmd.writeUInt8(0x0e, 3);
        // data
        cmd.writeUInt16LE(handle, 4);
        cmd.writeUInt16LE(Math.floor(minInterval / 1.25), 6); // min interval
        cmd.writeUInt16LE(Math.floor(maxInterval / 1.25), 8); // max interval
        cmd.writeUInt16LE(latency, 10); // latency
        cmd.writeUInt16LE(Math.floor(supervisionTimeout / 10), 12); // supervision timeout
        cmd.writeUInt16LE(0x0000, 14); // min ce length
        cmd.writeUInt16LE(0x0000, 16); // max ce length
        debug("conn update le - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    startLeEncryption(handle, random, diversifier, key) {
        const cmd = Buffer.alloc(32);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_START_ENCRYPTION_CMD, 1);
        // length
        cmd.writeUInt8(0x1c, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        random.copy(cmd, 6);
        diversifier.copy(cmd, 14);
        key.copy(cmd, 16);
        debug("start le encryption - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    disconnect(handle, reason) {
        const cmd = Buffer.alloc(7);
        reason = reason || COMMANDS.HCI_OE_USER_ENDED_CONNECTION;
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.DISCONNECT_CMD, 1);
        // length
        cmd.writeUInt8(0x03, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        cmd.writeUInt8(reason, 6); // reason
        debug("disconnect - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readRssi(handle) {
        const cmd = Buffer.alloc(6);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_RSSI_CMD, 1);
        // length
        cmd.writeUInt8(0x02, 3);
        // data
        cmd.writeUInt16LE(handle, 4); // handle
        debug("read rssi - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    writeAclDataPkt(handle, cid, data) {
        const pkt = Buffer.alloc(9 + data.length);
        // header
        pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
        pkt.writeUInt16LE(handle | (COMMANDS.ACL_START_NO_FLUSH << 12), 1);
        pkt.writeUInt16LE(data.length + 4, 3); // data length 1
        pkt.writeUInt16LE(data.length, 5); // data length 2
        pkt.writeUInt16LE(cid, 7);
        data.copy(pkt, 9);
        debug("write acl data pkt - writing: " + pkt.toString("hex"));
        this._socket.write(pkt);
    }
    setAdvertisingParameters() {
        const cmd = Buffer.alloc(19);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD, 1);
        // length
        cmd.writeUInt8(15, 3);
        const advertisementInterval = Math.floor((process.env.BLENO_ADVERTISING_INTERVAL ? parseFloat(process.env.BLENO_ADVERTISING_INTERVAL) : 100) * 1.6);
        // data
        cmd.writeUInt16LE(advertisementInterval, 4); // min interval
        cmd.writeUInt16LE(advertisementInterval, 6); // max interval
        cmd.writeUInt8(0x00, 8); // adv type
        cmd.writeUInt8(0x00, 9); // own addr typ
        cmd.writeUInt8(0x00, 10); // direct addr type
        Buffer.from("000000000000", "hex").copy(cmd, 11); // direct addr
        cmd.writeUInt8(0x07, 17);
        cmd.writeUInt8(0x00, 18);
        debug("set advertisement parameters - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setAdvertisingData(data) {
        const cmd = Buffer.alloc(36);
        cmd.fill(0x00);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISING_DATA_CMD, 1);
        // length
        cmd.writeUInt8(32, 3);
        // data
        cmd.writeUInt8(data.length, 4);
        data.copy(cmd, 5);
        debug("set advertisement data - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setScanResponseData(data) {
        const cmd = Buffer.alloc(36);
        cmd.fill(0x00);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD, 1);
        // length
        cmd.writeUInt8(32, 3);
        // data
        cmd.writeUInt8(data.length, 4);
        data.copy(cmd, 5);
        debug("set scan response data - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    setAdvertiseEnable(enabled) {
        const cmd = Buffer.alloc(5);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD, 1);
        // length
        cmd.writeUInt8(0x01, 3);
        // data
        cmd.writeUInt8(enabled ? 0x01 : 0x00, 4); // enable: 0 -> disabled, 1 -> enabled
        debug("set advertise enable - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    leReadBufferSize() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.LE_READ_BUFFER_SIZE_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("le read buffer size - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    readBufferSize() {
        const cmd = Buffer.alloc(4);
        // header
        cmd.writeUInt8(COMMANDS.HCI_COMMAND_PKT, 0);
        cmd.writeUInt16LE(COMMANDS.READ_BUFFER_SIZE_CMD, 1);
        // length
        cmd.writeUInt8(0x0, 3);
        debug("read buffer size - writing: " + cmd.toString("hex"));
        this._socket.write(cmd);
    }
    queueAclDataPkt(handle, cid, data) {
        let hf = handle | (COMMANDS.ACL_START_NO_FLUSH << 12);
        // l2cap pdu may be fragmented on hci level
        let l2capPdu = Buffer.alloc(4 + data.length);
        l2capPdu.writeUInt16LE(data.length, 0);
        l2capPdu.writeUInt16LE(cid, 2);
        data.copy(l2capPdu, 4);
        let fragId = 0;
        while (l2capPdu.length) {
            const frag = l2capPdu.slice(0, this._aclMtu);
            l2capPdu = l2capPdu.slice(frag.length);
            const pkt = Buffer.alloc(5 + frag.length);
            // hci header
            pkt.writeUInt8(COMMANDS.HCI_ACLDATA_PKT, 0);
            pkt.writeUInt16LE(hf, 1);
            hf |= COMMANDS.ACL_CONT << 12;
            pkt.writeUInt16LE(frag.length, 3); // hci pdu length
            frag.copy(pkt, 5);
            this._aclOutQueue.push({
                handle,
                pkt,
                fragId: fragId++,
            });
        }
        this.pushAclOutQueue();
    }
    pushAclOutQueue() {
        debug("pushAclOutQueue");
        let inProgress = 0;
        for (const handle in this._handleAclsInProgress) {
            inProgress += this._handleAclsInProgress[handle];
        }
        debug(inProgress, this._aclMaxInProgress, this._aclOutQueue.length);
        while (inProgress < this._aclMaxInProgress && this._aclOutQueue.length) {
            inProgress++;
            this.writeOneAclDataPkt();
        }
        if (inProgress >= this._aclMaxInProgress && this._aclOutQueue.length) {
            debug("acl out queue congested");
            debug("\tin progress = " + inProgress);
            debug("\twaiting = " + this._aclOutQueue.length);
        }
    }
    writeOneAclDataPkt() {
        debug("writeOneAclDataPkt");
        const pkt = this._aclOutQueue.shift();
        this._handleAclsInProgress[pkt.handle]++;
        debug("write acl data pkt frag " + pkt.fragId + " handle " + pkt.handle + " - writing: " + pkt.pkt.toString("hex"));
        this._socket.write(pkt.pkt);
    }
    onSocketData(array) {
        const data = Buffer.from(array);
        debug("onSocketData: " + data.toString("hex"));
        const eventType = data.readUInt8(0);
        debug("\tevent type = 0x" + eventType.toString(16));
        if (COMMANDS.HCI_EVENT_PKT === eventType) {
            const subEventType = data.readUInt8(1);
            debug("\tsub event type = 0x" + subEventType.toString(16));
            if (subEventType === COMMANDS.EVT_DISCONN_COMPLETE) {
                const handle = data.readUInt16LE(4);
                const reason = data.readUInt8(6);
                debug("\t\thandle = " + handle);
                debug("\t\treason = " + reason);
                delete this._handleAclsInProgress[handle];
                const aclOutQueue = [];
                let discarded = 0;
                for (const i in this._aclOutQueue) {
                    if (this._aclOutQueue[i].handle !== handle) {
                        aclOutQueue.push(this._aclOutQueue[i]);
                    }
                    else {
                        discarded++;
                    }
                }
                if (discarded) {
                    debug("\t\tacls discarded = " + discarded);
                }
                this._aclOutQueue = aclOutQueue;
                this.pushAclOutQueue();
                this.emit("disconnComplete", handle, reason);
            }
            else if (subEventType === COMMANDS.EVT_ENCRYPT_CHANGE) {
                const handle = data.readUInt16LE(4);
                const encrypt = data.readUInt8(6);
                debug("\t\thandle = " + handle);
                debug("\t\tencrypt = " + encrypt);
                this.emit("encryptChange", handle, encrypt);
            }
            else if (subEventType === COMMANDS.EVT_CMD_COMPLETE) {
                const ncmd = data.readUInt8(3);
                const cmd = data.readUInt16LE(4);
                const status = data.readUInt8(6);
                const result = data.slice(7);
                debug("\t\tncmd = 0x" + ncmd.toString(16));
                debug("\t\tcmd = 0x" + cmd.toString(16));
                debug("\t\tstatus = 0x" + status.toString(16));
                debug("\t\tresult = 0x" + result.toString("hex"));
                this.processCmdCompleteEvent(cmd, status, result);
            }
            else if (subEventType === COMMANDS.EVT_CMD_STATUS) {
                const status = data.readUInt8(3);
                const cmd = data.readUInt16LE(5);
                debug("\t\tstatus = " + status);
                debug("\t\tcmd = " + cmd);
                this.processCmdStatusEvent(cmd, status);
            }
            else if (subEventType === COMMANDS.EVT_LE_META_EVENT) {
                const leMetaEventType = data.readUInt8(3);
                const leMetaEventStatus = data.readUInt8(4);
                const leMetaEventData = data.slice(5);
                debug("\t\tLE meta event type = " + leMetaEventType);
                debug("\t\tLE meta event status = " + leMetaEventStatus);
                debug("\t\tLE meta event data = " + leMetaEventData.toString("hex"));
                this.processLeMetaEvent(leMetaEventType, leMetaEventStatus, leMetaEventData);
            }
            else if (subEventType === COMMANDS.EVT_NUMBER_OF_COMPLETED_PACKETS) {
                const handles = data.readUInt8(3);
                for (let i = 0; i < handles; i++) {
                    const handle = data.readUInt16LE(4 + i * 4);
                    const pkts = data.readUInt16LE(6 + i * 4);
                    debug("\thandle = " + handle);
                    debug("\t\tcompleted = " + pkts);
                    if (this._handleAclsInProgress[handle] === undefined) {
                        debug("\t\talready closed");
                        continue;
                    }
                    if (pkts > this._handleAclsInProgress[handle]) {
                        // Linux kernel may send acl packets by itself, so be ready for underflow
                        this._handleAclsInProgress[handle] = 0;
                    }
                    else {
                        this._handleAclsInProgress[handle] -= pkts;
                    }
                    debug("\t\tin progress = " + this._handleAclsInProgress[handle]);
                }
                this.pushAclOutQueue();
            }
        }
        else if (COMMANDS.HCI_ACLDATA_PKT === eventType) {
            const flags = data.readUInt16LE(1) >> 12;
            const handle = data.readUInt16LE(1) & 0x0fff;
            if (COMMANDS.ACL_START === flags) {
                const cid = data.readUInt16LE(7);
                const length = data.readUInt16LE(5);
                const pktData = data.slice(9);
                debug("\t\tcid = " + cid);
                if (length === pktData.length) {
                    debug("\t\thandle = " + handle);
                    debug("\t\tdata = " + pktData.toString("hex"));
                    this.emit("aclDataPkt", handle, cid, pktData);
                }
                else {
                    this._handleBuffers[handle] = {
                        length,
                        cid,
                        data: pktData,
                    };
                }
            }
            else if (COMMANDS.ACL_CONT === flags) {
                if (!this._handleBuffers[handle] || !this._handleBuffers[handle].data) {
                    return;
                }
                this._handleBuffers[handle].data = Buffer.concat([this._handleBuffers[handle].data, data.slice(5)]);
                if (this._handleBuffers[handle].data.length === this._handleBuffers[handle].length) {
                    this.emit("aclDataPkt", handle, this._handleBuffers[handle].cid, this._handleBuffers[handle].data);
                    delete this._handleBuffers[handle];
                }
            }
        }
        else if (COMMANDS.HCI_COMMAND_PKT === eventType) {
            const cmd = data.readUInt16LE(1);
            const len = data.readUInt8(3);
            debug("\t\tcmd = " + cmd);
            debug("\t\tdata len = " + len);
            if (cmd === COMMANDS.LE_SET_SCAN_ENABLE_CMD) {
                const enable = data.readUInt8(4) === 0x1;
                const filterDuplicates = data.readUInt8(5) === 0x1;
                debug("\t\t\tLE enable scan command");
                debug("\t\t\tenable scanning = " + enable);
                debug("\t\t\tfilter duplicates = " + filterDuplicates);
                this.emit("leScanEnableSetCmd", enable, filterDuplicates);
            }
        }
    }
    onSocketError(error) {
        debug("onSocketError: " + error.message);
        if (error.message === "Operation not permitted") {
            this.emit("stateChange", "unauthorized");
        }
        else if (error.message === "Network is down") {
            // no-op
        }
    }
    processCmdCompleteEvent(cmd, status, result) {
        if (cmd === COMMANDS.RESET_CMD) {
            this.resetBuffers();
            this.setEventMask();
            this.setLeEventMask();
            this.readLocalVersion();
            this.readBdAddr();
            this.writeLeHostSupported();
            this.readLeHostSupported();
            this.leReadBufferSize();
        }
        else if (cmd === COMMANDS.READ_LE_HOST_SUPPORTED_CMD) {
            if (status === 0) {
                const le = result.readUInt8(0);
                const simul = result.readUInt8(1);
                debug("\t\t\tle = " + le);
                debug("\t\t\tsimul = " + simul);
            }
        }
        else if (cmd === COMMANDS.READ_LOCAL_VERSION_CMD) {
            const hciVer = result.readUInt8(0);
            const hciRev = result.readUInt16LE(1);
            const lmpVer = result.readInt8(3);
            const manufacturer = result.readUInt16LE(4);
            const lmpSubVer = result.readUInt16LE(6);
            if (hciVer < 0x06) {
                this.emit("stateChange", "unsupported");
            }
            else if (this._state !== "poweredOn") {
                this.setScanEnabled(false, true);
                this.setScanParameters(false);
            }
            this.emit("readLocalVersion", hciVer, hciRev, lmpVer, manufacturer, lmpSubVer);
        }
        else if (cmd === COMMANDS.READ_BD_ADDR_CMD) {
            this.addressType = "public";
            this.address = result
                .toString("hex")
                .match(/.{1,2}/g)
                .reverse()
                .join(":");
            debug("address = " + this.address);
            this.emit("addressChange", this.address);
        }
        else if (cmd === COMMANDS.LE_SET_SCAN_PARAMETERS_CMD) {
            this.emit("stateChange", "poweredOn");
            this.emit("leScanParametersSet", status);
        }
        else if (cmd === COMMANDS.LE_SET_SCAN_ENABLE_CMD) {
            this.emit("leScanEnableSet", status);
        }
        else if (cmd === COMMANDS.LE_SET_ADVERTISING_PARAMETERS_CMD) {
            this.emit("stateChange", "poweredOn");
            this.emit("leAdvertisingParametersSet", status);
        }
        else if (cmd === COMMANDS.LE_SET_ADVERTISING_DATA_CMD) {
            this.emit("leAdvertisingDataSet", status);
        }
        else if (cmd === COMMANDS.LE_SET_SCAN_RESPONSE_DATA_CMD) {
            this.emit("leScanResponseDataSet", status);
        }
        else if (cmd === COMMANDS.LE_SET_ADVERTISE_ENABLE_CMD) {
            this.emit("leAdvertiseEnableSet", status);
        }
        else if (cmd === COMMANDS.READ_RSSI_CMD) {
            const handle = result.readUInt16LE(0);
            const rssi = result.readInt8(2);
            debug("\t\t\thandle = " + handle);
            debug("\t\t\trssi = " + rssi);
            this.emit("rssiRead", handle, rssi);
        }
        else if (cmd === COMMANDS.LE_LTK_NEG_REPLY_CMD) {
            const handle = result.readUInt16LE(0);
            debug("\t\t\thandle = " + handle);
            this.emit("leLtkNegReply", handle);
        }
        else if (cmd === COMMANDS.LE_READ_BUFFER_SIZE_CMD) {
            if (!status) {
                this.processLeReadBufferSize(result);
            }
        }
        else if (cmd === COMMANDS.READ_BUFFER_SIZE_CMD) {
            if (!status) {
                const aclMtu = result.readUInt16LE(0);
                const aclMaxInProgress = result.readUInt16LE(3);
                // sanity
                if (aclMtu && aclMaxInProgress) {
                    debug("br/edr acl mtu = " + aclMtu);
                    debug("br/edr acl max pkts = " + aclMaxInProgress);
                    this._aclMtu = aclMtu;
                    this._aclMaxInProgress = aclMaxInProgress;
                }
            }
        }
    }
    processLeMetaEvent(eventType, status, data) {
        if (eventType === COMMANDS.EVT_LE_CONN_COMPLETE) {
            this.processLeConnComplete(status, data);
        }
        else if (eventType === COMMANDS.EVT_LE_ADVERTISING_REPORT) {
            this.processLeAdvertisingReport(status, data);
        }
        else if (eventType === COMMANDS.EVT_LE_CONN_UPDATE_COMPLETE) {
            this.processLeConnUpdateComplete(status, data);
        }
    }
    processLeConnComplete(status, data) {
        const handle = data.readUInt16LE(0);
        const role = data.readUInt8(2);
        const addressType = data.readUInt8(3) === 0x01 ? "random" : "public";
        const address = data
            .slice(4, 10)
            .toString("hex")
            .match(/.{1,2}/g)
            .reverse()
            .join(":");
        const interval = data.readUInt16LE(10) * 1.25;
        const latency = data.readUInt16LE(12); // TODO: multiplier?
        const supervisionTimeout = data.readUInt16LE(14) * 10;
        const masterClockAccuracy = data.readUInt8(16); // TODO: multiplier?
        debug("\t\t\thandle = " + handle);
        debug("\t\t\trole = " + role);
        debug("\t\t\taddress type = " + addressType);
        debug("\t\t\taddress = " + address);
        debug("\t\t\tinterval = " + interval);
        debug("\t\t\tlatency = " + latency);
        debug("\t\t\tsupervision timeout = " + supervisionTimeout);
        debug("\t\t\tmaster clock accuracy = " + masterClockAccuracy);
        this._handleAclsInProgress[handle] = 0;
        this.emit("leConnComplete", status, handle, role, addressType, address, interval, latency, supervisionTimeout, masterClockAccuracy);
    }
    processLeAdvertisingReport(count, data) {
        for (let i = 0; i < count; i++) {
            const type = data.readUInt8(0);
            const addressType = data.readUInt8(1) === 0x01 ? "random" : "public";
            const address = data
                .slice(2, 8)
                .toString("hex")
                .match(/.{1,2}/g)
                .reverse()
                .join(":");
            const eirLength = data.readUInt8(8);
            const eir = data.slice(9, eirLength + 9);
            const rssi = data.readInt8(eirLength + 9);
            debug("\t\t\ttype = " + type);
            debug("\t\t\taddress = " + address);
            debug("\t\t\taddress type = " + addressType);
            debug("\t\t\teir = " + eir.toString("hex"));
            debug("\t\t\trssi = " + rssi);
            this.emit("leAdvertisingReport", 0, type, address, addressType, eir, rssi);
            data = data.slice(eirLength + 10);
        }
    }
    processLeConnUpdateComplete(status, data) {
        const handle = data.readUInt16LE(0);
        const interval = data.readUInt16LE(2) * 1.25;
        const latency = data.readUInt16LE(4); // TODO: multiplier?
        const supervisionTimeout = data.readUInt16LE(6) * 10;
        debug("\t\t\thandle = " + handle);
        debug("\t\t\tinterval = " + interval);
        debug("\t\t\tlatency = " + latency);
        debug("\t\t\tsupervision timeout = " + supervisionTimeout);
        this.emit("leConnUpdateComplete", status, handle, interval, latency, supervisionTimeout);
    }
    processCmdStatusEvent(cmd, status) {
        if (cmd === COMMANDS.LE_CREATE_CONN_CMD) {
            if (status !== 0) {
                this.emit("leConnComplete", status);
            }
        }
    }
    processLeReadBufferSize(result) {
        const aclMtu = result.readUInt16LE(0);
        const aclMaxInProgress = result.readUInt8(2);
        if (!aclMtu) {
            // as per Bluetooth specs
            debug("falling back to br/edr buffer size");
            this.readBufferSize();
        }
        else {
            debug("le acl mtu = " + aclMtu);
            debug("le acl max in progress = " + aclMaxInProgress);
            this._aclMtu = aclMtu;
            this._aclMaxInProgress = aclMaxInProgress;
        }
    }
    onStateChange(state) {
        this._state = state;
    }
}
Hci.STATUS_MAPPER = STATUS_MAPPER;
exports.default = Hci;

//# sourceMappingURL=hci.js.map
