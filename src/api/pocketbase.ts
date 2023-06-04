import PocketBase from "pocketbase";

export const pb = new PocketBase(import.meta.env.VITE_APP_API_URL);
pb.autoCancellation(false);
