import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default Layout;
