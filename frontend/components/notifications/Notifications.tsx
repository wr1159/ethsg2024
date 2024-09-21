import { useNotifications, useSubscription } from "@web3inbox/react";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

function Notifications() {
    const { data: subscription } = useSubscription();
    const { data: notifications } = useNotifications(5);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                    You have {subscription?.unreadNotificationCount} unread
                    notifications.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {!notifications?.length ? (
                    <p>No notifications yet.</p>
                ) : (
                    notifications.map(({ id, ...message }) => (
                        <div
                            key={id}
                            className="border rounded-lg p-4 min-h-32"
                        >
                            <p className="text-destructive">
                                {!message.isRead && "UNREAD"}
                            </p>
                            <h3 className="text-xl">{message.title}</h3>
                            <p className="text-muted-foreground font-extralight">
                                {message.body}
                            </p>
                            {!message.isRead && (
                                <Button
                                    onClick={message?.read}
                                    className="mt-2"
                                >
                                    Mark as read
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
}

export default Notifications;
