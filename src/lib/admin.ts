export const ADMIN_USER_ID = "user_3IPAy2DjseilH2eYRfeG6mUUOlW";

export function isAdmin(userId: string | null | undefined) {
  return userId === ADMIN_USER_ID;
}