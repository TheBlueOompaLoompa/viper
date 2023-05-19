import { Notifications } from "./stores";
import type { Notification, NotificationType } from "./types";

export default async function notify(title: string, body: string, time: number, type: NotificationType) {
    let added = false;
    let notifs: Notification[] = [];

    let unsub = Notifications.subscribe(val => {
        notifs = val;
        added = true;
    });

    while(!added) {}

    Notifications.set([{ type, title, start: time, timer: time, body }, ...notifs]);
    unsub();
}