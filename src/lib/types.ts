export type PostData = {
    id: string;
    type: number;
    title: string;
    content: string;
    uid: string;
    group_id: string;
    timestamp: string;
};

export type UserData = {
    id: string;
    username: string;
};

export type Notification = {
    type: NotificationType,
    title: string,
    body: string
};

export enum NotificationType {
    Msg = 'msg',
    Err = 'err'
};