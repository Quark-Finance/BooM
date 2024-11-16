import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import { SendTransaction } from "@/components/SendTransaction"
import { SignInWithEthereum } from "@/components/SignInWithEthereum";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <SignIn />
      <SignInWithEthereum />
      <VerifyBlock />
      <SendTransaction />
      <PayBlock />
    </main>
  );
}
