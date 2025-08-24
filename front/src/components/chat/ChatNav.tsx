import { MobileIcon } from "@radix-ui/react-icons";
import MobileChatSidebar from "./MobileChatSidebar";

export default function ChatNav({
  chatGroup,
  users,
  user
}: {
  chatGroup: ChatGroupType;
  users: Array<GroupChatUserType> | [];
  user?: GroupChatUserType;
}) {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-2 border-b">
      <div className="flex space-x-4 md:space-x-0 items-center">
        <div>
          <MobileChatSidebar users={users} />
        </div>
        <h1>
          {chatGroup.title}
        </h1>
      </div>
      <p>{user?.name}</p>
    </nav>
  )

}