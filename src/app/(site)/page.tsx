import TitleSection from "@/components/landing-page/title-section";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Banner from "../../../public/appBanner.png";
import Cal from "../../../public/cal.png";
import Diamond from "../../../public/icons/diamond.svg";
import CheckIcon from "../../../public/icons/check.svg";
import { CLIENTS, USERS, PRICING_CARDS, PRICING_PLANS } from "@/lib/constants";
import { randomUUID } from "crypto";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import React from "react";
import CustomCard from "@/components/landing-page/custom-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardDescription, CardTitle } from "@/components/ui/card";

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
            from-primary to-brand-primaryBlue sm:w-[300px] z-10"
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
      <section
        id="features"
        className="px-4 sm:px-6 flex flex-col justify-center items-center relative "
      >
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
      <section id="testimonials" className="my-16 relative">
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
                        {/* <CardDescription className="dark:text-washed-purple-800">
                          {testimonial.name.toLocaleLowerCase()}
                        </CardDescription> */}
                      </div>
                    </div>
                  }
                  cardContent={
                    <p className="dark:text-washed-purple-600">
                      {testimonial.message}
                    </p>
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </section>
      <section id="pricing" className="mt-20 px-4 sm:px-6">
        <TitleSection
          title="The Perfect Plan For You"
          subheading="Experience all the benefits of our platform. Select a plan that suits your needs and take your productivity to new heights."
          pill="Pricing"
        />
        <div
          className="flex flex-col-reverse sm:flex-row justify-center items-center gap-4 
          sm:items-stretch mt-10"
        >
          {PRICING_CARDS.map((card) => (
            <CustomCard
              id="pricing"
              key={card.planType}
              className={clsx(
                "w-[300px] rounded-2xl dark:bg-black/40 background-blur-3xl relative ",
                {
                  "border-brand-primaryPurple/70":
                    card.planType === PRICING_PLANS.proplan,
                }
              )}
              cardHeader={
                <CardTitle>
                  {card.planType === PRICING_PLANS.proplan && (
                    <>
                      <div
                        className="hidden dark:block w-full blur-[120px] rounded-full h-32
                        absolute
                        bg-brand-primaryPurple/80
                        -z-10
                        top-0
                      "
                      />
                      <Image
                        src={Diamond}
                        alt="Pro Plan Icon"
                        className="absolute top-6 right-6"
                      />
                    </>
                  )}
                  {card.planType}
                </CardTitle>
              }
              cardContent={
                <CardContent className="p-0">
                  <span className=" dark:text-washed-purple-600">
                    ${card.price}
                  </span>
                  {+card.price > 0 ? (
                    <span className="dark:text-washed-purple-800 ml-1">
                      /mo
                    </span>
                  ) : (
                    ""
                  )}
                  <p className="dark:text-washed-purple-800">
                    {card.description}
                  </p>
                  <Button
                    variant="default"
                    className="whitespace-nowrap w-full mt-4"
                  >
                    {card.planType === PRICING_PLANS.proplan
                      ? "Go Pro"
                      : "Get Started"}
                  </Button>
                </CardContent>
              }
              cardFooter={
                <ul
                  className="font-normal
                  flex
                  mb-2
                  flex-col
                  gap-4
                "
                >
                  <small>{card.highlightFeature}</small>
                  {card.freatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex
                      items-center
                      gap-2
                    "
                    >
                      <Image src={CheckIcon} alt="Check Icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
              }
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default HomePage;
