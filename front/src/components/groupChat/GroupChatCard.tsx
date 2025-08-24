import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GroupChatCardMenu from "./GroupChatCardMenu";
import { CustomUser } from "@/app/api/auth/[...nextauth]/option";
import { Button } from "../ui/button";
import Link from "next/link";

export default function GroupChatCard({
  group,
  user,
}: {
  group: ChatGroupType;
  user: CustomUser;
}) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center ">
        <CardTitle className="text-2xl">{group.title}</CardTitle>
        <GroupChatCardMenu user={user} group={group} />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p>
              Passcode :-<strong>{group.passcode}</strong>
            </p>
            <p>Created At :-{new Date(group.created_at).toDateString()}</p>
          </div>
          <Link href={`/chat/${group.id}`}>
            <Button>Enter Room</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}