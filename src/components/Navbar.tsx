import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black p-4 font-[family-name:var(--font-poppins)]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/home" className="text-white text-xl font-bold">
          My Portfolio
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link href="/home" className="text-white hover:opacity-80">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="text-white hover:opacity-80">
              About
            </Link>
          </li>
          <li>
            <Link href="/projects" className="text-white hover:opacity-80">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/contact" className="text-white hover:opacity-80">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
} 