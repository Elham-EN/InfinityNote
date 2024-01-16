"use client";

import Link from "next/link";
import Logo from "../../../public/brandLogo.png";
import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useState,
} from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

export default function Header(): React.ReactElement {
  return (
    <header className="p-4 flex justify-center items-center my-5">
      <Link href={"/"} className="w-full ">
        <Image src={Logo} alt="logo" width={225} height={55} />
      </Link>

      <ul
        className="hidden md:flex justify-center items-center gap-9 
        text-lg md:text-xl bg-gradient-to-r
        from-primary to-brand-primaryBlue  py-3 px-5 rounded-full"
      >
        <li>
          <Link href={"#features"}>Features</Link>
        </li>
        <li>
          <Link href={"#testimonials"}>Testimonials</Link>
        </li>
        <li>
          <Link href={"#pricing"}>Pricing</Link>
        </li>
      </ul>

      <aside className="flex w-full gap-2 justify-end">
        <Link href={"/login"}>
          <Button variant={"btn-secondary"} className=" p-1 hidden sm:block">
            Login
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="btn-primary" className="whitespace-nowrap">
            Sign Up
          </Button>
        </Link>
      </aside>
    </header>
  );
}

/**
 * This ListItem component can be used in a React application where you need a
 * customizable list item in a navigation menu, especially when you need a ref
 * to the underlying <a> element for direct DOM manipulation or access.
 */
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "group block select-none space-y-1 font-medium leading-none"
          )}
          {...props}
        >
          <div className="text-white text-sm font-medium leading-none">
            {title}
          </div>
          <p
            className="group-hover:text-white/70
            line-clamp-2
            text-sm
            leading-snug
            text-white/40
          "
          >
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
