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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
