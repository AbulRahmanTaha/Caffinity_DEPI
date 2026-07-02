// Migration utility to add IDs to existing users in localStorage
export const migrateUsersToHaveIds = () => {
  try {
    const users = JSON.parse(localStorage.getItem("all_users") || "[]");
    let migrated = false;

    const updatedUsers = users.map((user: any) => {
      if (!user.id) {
        migrated = true;
        return {
          ...user,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
      }
      return user;
    });

    if (migrated) {
      localStorage.setItem("all_users", JSON.stringify(updatedUsers));
      
      // Also update current auth_user if exists
      const authUser = localStorage.getItem("auth_user");
      if (authUser) {
        const currentUser = JSON.parse(authUser);
        if (!currentUser.id) {
          const updatedAuthUser = updatedUsers.find((u: any) => u.email === currentUser.email);
          if (updatedAuthUser) {
            localStorage.setItem("auth_user", JSON.stringify(updatedAuthUser));
          }
        }
      }
      
      console.log("Users migrated successfully with IDs");
    }
  } catch (error) {
    console.error("Error migrating users:", error);
  }
};
