import Image from "next/image";
// import styles from "./page.module.css";

export default function Home() {
  console.log("Home page");
  return (
    <div>Hello world
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        className="dark:invert"
        width={180}
        height={37}
        priority
      />
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        className="dark:invert"
        width={100}
        height={24}
        priority
      />
    </div>
  );
}
