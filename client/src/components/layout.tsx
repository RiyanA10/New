import { Link, useLocation, useNavigate } from "wouter";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <nav>
        <NavigationMenuLink>
          <span onClick={() => navigate("/")} className="cursor-pointer">
            Home
          </span>
        </NavigationMenuLink>
        <NavigationMenuLink>
          <span onClick={() => navigate("/properties")} className="cursor-pointer">
            Properties
          </span>
        </NavigationMenuLink>
        {/* Add more navigation links as needed */}
      </nav>
      <main>{children}</main>
    </div>
  );
}

const NavigationMenuLink = ({ children }: { children: React.ReactNode }) => {
  return <li>{children}</li>;
};