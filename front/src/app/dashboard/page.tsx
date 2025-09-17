// import DashNav from "@/components/dashboard/DashNav"
// import { getServerSession } from "next-auth"
// import React from "react"
// import { authOption, CustomSession } from "../api/auth/[...nextauth]/option"
// import CreateChat from "@/components/groupChat/CreateChat";
// import { fetchChatGroups } from "@/fetch/groupFetch";
// import GroupChatCard from "@/components/groupChat/GroupChatCard";

// export default async function dashboard() {
//   const session: CustomSession | null = await getServerSession(authOption);
//   const groups: Array<ChatGroupType> | [] = await fetchChatGroups(session?.user?.token!);
//   console.log(groups);

//   return <div>
//     <DashNav
//       name={session?.user?.name!}
//       image={session?.user?.image ?? undefined}
//     />
//     <div className="container">
//       <div className="text-end m-6 ">
//         <CreateChat user={session?.user!} />
//       </div>
//     </div>

//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//       {groups.length > 0 &&
//         groups.map((item, index) => (
//           <GroupChatCard group={item} key={index} user={session?.user!} />
//         ))}
//     </div>
//   </div>
// }




import DashNav from "@/components/dashboard/DashNav"
import { getServerSession } from "next-auth"
import React from "react"
import { authOption, CustomSession } from "../api/auth/[...nextauth]/option"

export default async function dashboard() {
  try {
    console.log("Dashboard: Starting...");

    const session: CustomSession | null = await getServerSession(authOption);
    console.log("Dashboard: Session obtained", session?.user?.email);

    if (!session || !session.user) {
      return (
        <div className="p-8">
          <h1>Please sign in</h1>
          <p>Session not found. Please go back to home and login</p>
        </div>
      );
    }

    console.log("Dashboard: About to fetch chat groups");
    console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_URL);
    console.log("User token:", session.user.token ? "Present" : "Missing");

    // Temporarily comment out the fetchChatGroups to isolate the issue
    // const groups: Array<ChatGroupType> | [] = await fetchChatGroups(session?.user?.token!);
    const groups: Array<ChatGroupType> | [] = [];

    return (
      <div>
        <DashNav
          name={session?.user?.name!}
          image={session?.user?.image ?? undefined}
        />
        <div className="container p-8">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>✅ Dashboard loading successfully!</p>
            <p>User: {session.user.name}</p>
            <p>Email: {session.user.email}</p>
            <p>Token: {session.user.token ? 'Present' : 'Missing'}</p>
            <p>Backend URL: {process.env.NEXT_PUBLIC_BACKEND_URL}</p>
          </div>

          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>🔍 Chat groups fetch temporarily disabled for debugging</p>
            <p>Groups count: {groups.length}</p>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Dashboard error:", error);
    return (
      <div className="p-8">
        <h1>Dashboard Error</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p><strong>Error:</strong> {error.message}</p>
          <p><strong>Stack:</strong> {error.stack}</p>
        </div>
      </div>
    );
  }
}