import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <h1 className="inline-flex items-center font-bold text-lg rounded-full overflow-hidden">
        <span className="bg-muted text-foreground px-3 py-2">Coder</span>
        <span className="bg-foreground text-muted px-3 py-2">Pig</span>
      </h1>
    </Link>
  );
}
