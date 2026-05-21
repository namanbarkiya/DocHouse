import { signOut } from "@/app/dashboard/actions";

export function SignOutForm() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="font-sans text-[13px] text-ink-muted hover:text-vermillion transition-colors duration-300"
      >
        Sign out
      </button>
    </form>
  );
}
