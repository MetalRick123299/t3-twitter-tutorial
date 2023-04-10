import type { User } from "@clerk/nextjs/dist/api";
const filterUserForClient = (user: User) => {
  const emailAddress = user.emailAddresses[0]?.emailAddress ?? "";
  return {
    id: user.id,
    username:
      user.username ?? emailAddress.substring(0, emailAddress.indexOf("@")),
    profilePicture: user.profileImageUrl,
  };
};

export default filterUserForClient;
