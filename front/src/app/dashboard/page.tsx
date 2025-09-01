import DashNav from "@/components/dashboard/DashNav"
import { getServerSession } from "next-auth"
import React from "react"
import { authOption, CustomSession } from "../api/auth/[...nextauth]/option"
import CreateChat from "@/components/groupChat/CreateChat";
import { fetchChatGroups } from "@/fetch/groupFetch";
import GroupChatCard from "@/components/groupChat/GroupChatCard";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOption);
  const groups: Array<ChatGroupType> | [] = await fetchChatGroups(session?.user?.token!);
  console.log(groups);

  return <div>
    <DashNav
      name={session?.user?.name!}
      image={session?.user?.image ?? undefined}
    />
    <div className="container">
      <div className="text-end m-6 ">
        <CreateChat user={session?.user!} />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {groups.length > 0 &&
        groups.map((item, index) => (
          <GroupChatCard group={item} key={index} user={session?.user!} />
        ))}
    </div>
  </div>
}




// import DashNav from "@/components/dashboard/DashNav"
// import { getServerSession } from "next-auth"
// import React from "react"
// import { authOption, CustomSession } from "../api/auth/[...nextauth]/option"

// export default async function dashboard() {
//   try {
//     const session: CustomSession | null = await getServerSession(authOption);

//     if (!session || !session.user) {
//       return (
//         <div className="p-8">
//           <h1>Please sign in</h1>
//         </div>
//       );
//     }

//     return (
//       <div>
//         <DashNav
//           name={session?.user?.name!}
//           image={session?.user?.image ?? undefined}
//         />
//         <div className="container p-8">
//           <h1>Dashboard</h1>
//           <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
//             <p>✅ Session working!</p>
//             <p>User: {session.user.name}</p>
//             <p>Email: {session.user.email}</p>
//             <p>Token: {session.user.token ? 'Present' : 'Missing'}</p>
//           </div>

//           <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
//             <p>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL}</p>
//             <p>If this loads, the issue is with the fetchChatGroups function.</p>
//           </div>
//         </div>
//       </div>
//     );
//   } catch (error: any) {
//     return (
//       <div className="p-8">
//         <h1>Dashboard Error</h1>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           <p><strong>Error:</strong> {error.message}</p>
//         </div>
//       </div>
//     );
//   }
// }