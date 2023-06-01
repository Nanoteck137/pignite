import PocketBase from "pocketbase";

export const pb = new PocketBase("http://10.28.28.6:8090");
pb.autoCancellation(false);
