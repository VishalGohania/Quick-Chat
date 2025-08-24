import { CHAT_GROUP_URL, CHAT_GROUP_USER_URL } from "@/lib/apiEndPoints";
import axios from "axios";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../ui/input";
import { Button } from "../ui/button";


export default function ChatUserDialog({
  open,
  setOpen,
  group
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  group: ChatGroupType;
}) {
  const params = useParams();
  const [state, setState] = useState({
    name: "",
    passcode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(params["id"] as string);
    if (data) {
      const jsonData = JSON.parse(data);
      if (jsonData?.name && jsonData?.group_id) {
        setOpen(false);
      }
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (group.passcode !== state.passcode) {
      toast.error("Please enter correct passcode!");
      return;
    }

    const localData = localStorage.getItem(params["id"] as string);
    if (localData) {
      setOpen(false);
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await axios.post(CHAT_GROUP_USER_URL, {
        name: state.name,
        group_id: params["id"] as string,
      });
      localStorage.setItem(
        params["id"] as string,
        JSON.stringify(data?.data)
      );
      toast.success("Successfully joined the chat!");
      setOpen(false);
    } catch (error) {
      console.error("Error:", error);
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.message || "Something went wrong. Please try again!";
        toast.error(errorMsg);
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Name and Passcode</DialogTitle>
          <DialogDescription>
            Add your name and passcode to join the room
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="mt-2">
            <Input
              placeholder="Enter your name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mt-2">
            <Input
              placeholder="Enter your passcode"
              value={state.passcode}
              onChange={(e) => setState({ ...state, passcode: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mt-2">
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}