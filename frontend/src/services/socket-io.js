import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
    console.log("getBackendUrl()", getBackendUrl())
    return openSocket(getBackendUrl());
}

export default connectToSocket;