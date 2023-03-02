import './globals.css';

export const metadata = {
  title: 'Keimo - Empowering Curious Minds',
  description: 'Keimo is a personalized AI tutor for children.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-blue">{children}</body>
    </html>
  );
}
