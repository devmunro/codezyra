"use client";
import { auth } from "../firebase";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

const Header = () => {
  const router = useRouter();

  const handleHome = () => {
    router.push(`/dashboard`);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        router.push("/login");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <button onClick={handleHome}>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </button>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Header;
