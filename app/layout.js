import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Inventory Management",
};

export default function RootLayout({ children }) {
  return (
      <html lang="en">
        <body className={inter.className}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
        </body>
      </html>
  );
}
