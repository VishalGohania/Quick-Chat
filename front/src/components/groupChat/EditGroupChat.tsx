"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { zodResolver } from '@hookform/resolvers/zod';
import { createChatSchema, createChatSchemaType } from '@/validations/groupChatValidation';
import { useForm } from 'react-hook-form';
import { CustomUser } from '@/app/api/auth/[...nextauth]/option';
import axios, { AxiosError } from 'axios';
import { CHAT_GROUP_URL } from '@/lib/apiEndPoints';
import { toast } from 'sonner';
import { clearCache } from '@/actions/common';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

export default function EditGroupChat({ user, group, open, setOpen }: {
  user: CustomUser,
  group: ChatGroupType,
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<createChatSchemaType>({
    resolver: zodResolver(createChatSchema),
  })

  useEffect(() => {
    setValue("title", group.title);
    setValue("passcode", group.passcode);
  }, [group])

  const onSubmit = async (payload: createChatSchemaType) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`${CHAT_GROUP_URL}/${group.id}`, payload, {
        headers: {
          Authorization: user.token
        }
      });

      if (data?.message) {
        setOpen(false);
        toast.success(data?.message);
        clearCache("dashboard");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again!");
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Update group chat</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mt-4'>
            <Input placeholder='Enter chat title' {...register("title")} />
            <span className='text-red-400'>{errors.title?.message}</span>
          </div>
          <div className='mt-4'>
            <Input placeholder='Enter passcode' {...register("passcode")} />
            <span className='text-red-400'>{errors.passcode?.message}</span>
          </div>
          <div className='mt-4'>
            <Button className='w-full' disabled={loading}>
              {loading ? "Processing.." : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
