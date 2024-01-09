import TitleSection from "@/components/landing-page/title-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Banner from "../../../public/appBanner.png";
import Cal from "../../../public/cal.png";
import { CLIENTS, USERS } from "@/lib/constants";
import { randomUUID } from "crypto";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import React from "react";
import CustomCard from "@/components/landing-page/custom-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";

function HomePage(): React.ReactElement {
  return (
    <>
      <section
        className="overflow-hidden px-4 sm:px-6  mt-10 sm:flex 
            sm:flex-col gap-4 md:justify-center md:items-center"
      >
        <TitleSection
          pill="✨ Your Workspace, Perfected"
          title="All-In-One Collaboration and Productivity Platform"
        />
        <div
          className="bg-white p-[2px] mt-8 rounded-xl bg-gradient-to-r
            from-primary to-brand-primaryBlue sm:w-[300px]"
        >
          <Button
            variant="secondary"
            className="w-full rounded=[10px] p-3 text-lg  sm:p-6 
              sm:text-2xl bg-background"
          >
            Get InfinityNote Free
          </Button>
        </div>
        <div
          className="md:mt-[-90px] sm:w-full w-[750px] flex justify-center 
            items-center mt-[-40px] relative sm:ml-0 ml-[-50px]"
        >
          <Image src={Banner} alt="Application Banner" />
          <div
            className="bottom-0 absolute top-[50%] bg-gradient-to-t dark:from-background
              left-0 right-0 z-10"
          ></div>
        </div>
      </section>
      <section className="relative my-10 ">
        <div className="overflow-hidden flex items-center h-[40px] md:h-[150px] py-10">
          {[...Array(2)].map((arr) => (
            <div key={arr} className="flex flex-nowrap animate-slide">
              {CLIENTS.map((client) => (
                <div
                  key={client.alt}
                  className="relative w-[200px] m-20 shrink-0 flex items-center"
                >
                  <Image
                    src={client.logo}
                    alt={client.alt}
                    className=" object-contain max-w-none w-28 md:w-[200px]"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 sm:px-6 flex flex-col justify-center items-center relative ">
        <div
          className="w-full blur-[120px] rounded-full h-32 absolute bg-brand-primaryPurple/50
            -z-100 top-56"
        />
        <TitleSection
          title="Keep track of your meetings all in one place"
          subheading="Capture your ideas, thoughts, and meeting notes in a structured and organized manner."
          pill="Features"
        />
        <div
          className="mt-10 md:max-w-[650px] flex justify-center items-center relative
          sm:ml-0 rounded-2xl border-2 border-washed-purple-300 border-opacity-10
          dark:bg-gradient-to-r dark:from-brand-primaryBlue dark:to-brand-primaryPurple"
        >
          <Image src={Cal} alt="Banner" className="rounded-2xl" />
        </div>
      </section>
      <section className="my-16 relative">
        <div
          className="w-full blur-[120px] rounded-full h-32 absolute bg-brand-primaryPurple/50
            -z-100 top-56"
        />
        <div className="mt-20 px-4 sm:px-6 flex flex-col overflow-x-hidden overflow-visible">
          <TitleSection
            title="Trusted by all"
            subheading="Join thousands of satisfied users who rely on our platform for their 
            personal and professional productivity needs."
            pill="Testimonials"
          />
          {[...Array(2)].map((arr, index) => (
            <div
              key={randomUUID()}
              className={twMerge(
                clsx("mt-10 flex flex-nowrap gap-6 self-start", {
                  " flex-row-reverse": index === 1,
                  "animate-[slide_250s_linear_infinite]": true,
                  "animate-[slide_250s_linear_infinite_reverse]": index === 1,
                  "ml-[100vw]": index === 1,
                }),
                "hover:paused"
              )}
            >
              {USERS.map((testimonial, index) => (
                <CustomCard
                  key={testimonial.name}
                  className="w-[500px] shrink-0 rounded-xl dark:bg-gradient-to-t 
                    dark:from-border dark:to-background"
                  cardHeader={
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/avatars/${index + 1}.png`} />
                        <AvatarFallback>AV</AvatarFallback>
                      </Avatar>
                      <div className=" text-foreground">
                        <CardTitle className="">{testimonial.name}</CardTitle>
                        <CardDescription className="dark:text-washed-purple-800">
                          {testimonial.name.toLocaleLowerCase()}
                        </CardDescription>
                      </div>
                    </div>
                  }
                  cardContent={
                    <p className="dark:text-washed-purple-800">
                      {testimonial.message}
                    </p>
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
