import { defineAuth } from "@aws-amplify/backend";
import { postConfirmation } from "./post-confirmation/resource"

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: { required: true },
  },
  groups: ["admin", "editor", "viewer"],
  triggers: {
    postConfirmation,
  },
  // When a new user is created, add them to the admin group (editors will be upgraded viewers, and viewers won't need any signup, just a magic link)
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"])
  ]
});