import "./globals.css";
import NavBar from "../components/navbar";

export const metadata = {
  title: "Flashcards",
  description: "Learn with flashcards & game modes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className="m-0 p-0 bg-gray-50 text-gray-900">
        <NavBar />
        {/* Offset for the fixed navbar */}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
