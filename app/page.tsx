import Signup from "./signup/page";
import Login from "./login/page";

export default function Home() {
  return (
    <main className="bg-rose-900">
    <div className="flex justify-center items-center">
      <Signup/>
      <Login/>
    </div>
    </main>
  );
}
