import { Notifications } from "./stores";
import type { Notification, NotificationType } from "./types";

export default async function notify(title: string, body: string, type: NotificationType) {
    let added = false;
    let notifs: Notification[] = [];

    let unsub = Notifications.subscribe(val => {
        notifs = val;
        added = true;
    });

    while(!added) {}

    Notifications.set([{ type, title, body }, ...notifs]);
    unsub();
}